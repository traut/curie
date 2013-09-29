#! /usr/bin/env python
import sys
import os
import iso8601
import json
import solr
import logging
import uuid

import sqlite3

from utils import solr_escape

from jsonschema import validate

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

sql = sqlite3.connect('/home/curie/curie/users.db')

solrMessages = solr.SolrConnection('http://localhost:8983/solr/messages')
solrThreads = solr.SolrConnection('http://localhost:8983/solr/threads')


def get_schema():
    SCHEMA_PATH = "schemas/message-parsed.json"
    with open(SCHEMA_PATH, "r") as f:
        return json.loads(f.read())

SCHEMA = get_schema()


def read_blob(filename):
    json_filename = filename + ".parsed.json"
    if not os.path.exists(json_filename):
        raise Exception("File %s does not exists!" % json_filename)

    with open(json_filename, "r") as f:
        blob_str = f.read()
        blob = json.loads(blob_str)
        validate(blob, SCHEMA)
        return blob

def get_recepients(blob):
    return [a["email"] for a in blob["fields"]["to"]] + [a["email"] for a in blob["fields"]["cc"]] + [a["email"] for a in blob["fields"]["bcc"]]



def create_email_doc(account_hash, blob):

    mid = blob["id"]
    received = iso8601.parse_date(blob.get("received"))

    _from = blob["fields"]["from"][0]

    labels = ["inbox"]

    message_id = blob["fields"]["message_id"]

    if not message_id or message_id == "":
        raise Exception("no message id! mid=%s" % mid)

    document = {
        "id" : mid,
        "received" : received,
        "labels" : labels,

        "account" : account_hash,

        "message_id" : blob["fields"]["message_id"],

        "from.name" : _from.get("name"),
        "from.email" : _from["email"],
        "from.json" : json.dumps(_from),

        "cc.name" : filter(None, [a.get("name") for a in blob["fields"]["cc"]]),
        "cc.email" : [a["email"] for a in blob["fields"]["cc"]],
        "cc.json" : json.dumps(blob["fields"]["cc"]),

        "bcc.name" : filter(None, [a.get("name") for a in blob["fields"]["bcc"]]),
        "bcc.email" : [a["email"] for a in blob["fields"]["bcc"]],
        "bcc.json" : json.dumps(blob["fields"]["bcc"]),

        "attachment" : filter(None, [a.get("filename") for a in blob["fields"]["attachments"]]),

        "reference" : blob["fields"].get("references", []),

        "subject" : blob["fields"].get("subject"),
        "body" : [b.get("value") for b in blob["fields"].get("body")]
    }

    return document


def get_parent_message_ids(blob):
    fields = blob["fields"]
    references = fields.get("references", [])
    reply_to = fields.get("in-reply-to", None)

    return references + ([reply_to] if reply_to else [])


def get_relatives(account_hash, blob):

    parents = get_parent_message_ids(blob)
    if parents:
        parents_query = " OR ".join(["message_id:%s" % solr_escape(ref) for ref in parents])
    else:
        parents_query = None

    message_id = blob["fields"]["message_id"]
    relatives_query = ("+(reference:%s" % solr_escape(message_id)) + ((" OR (%s)" % parents_query) if parents_query else "") + ")";

    query = "+account:%s" % account_hash + " " + relatives_query;

    logger.info("Getting relatives: %s", query)

    response = solrMessages.query(query)

    logger.debug(response.results)

    return response.results



def get_threads(account_hash, blob):

    parents = get_parent_message_ids(blob)

    if not parents:
        logger.info("No parents for mid=%s" % blob["id"])
        return

    query = ("+(%s) " % " OR ".join(["child_mid:%s" % solr_escape(p) for p in parents])) + " +account:%s" % account_hash

    
    logger.info("Getting threads: %s", query)
    response = solrThreads.query(query)

    logger.debug(response.results)

    return response.results


def process(filename):


    message_blob = read_blob(filename)

    mid = message_blob["id"]

    hashes = []

    for email in get_recepients(message_blob):
        cur = sql.cursor()
        found = cur.execute("select hash from accounts, emails where emails.account_id = accounts.id and emails.email = '%s'" % email).fetchone()
        if found:
            hashes.append(found[0])

    if not hashes:
        logger.error("No hashes found for %s", filename)
        return

    for account in hashes:
        email_doc = create_email_doc(account, message_blob)

        threads = get_threads(account, message_blob)
        logger.info("%s threads found for mid=%s, account=%s", "No" if not threads else len(threads), mid, account)

        relatives = get_relatives(account, message_blob)
        logger.info("%s relatives found for mid=%s, account=%s", "No" if not relatives else len(relatives), mid, account)

        if relatives and not threads:
            thread = dict(
                id = str(uuid.uuid4()),
                account = account,
                child_id = [r['id'] for r in relatives] + [email_doc["id"]],
                child_mid = [r["message_id"] for r in relatives] + [email_doc["message_id"]],
            )
            logger.info("Thread created: %s" % thread)
            solrThreads.add(**thread)
        elif threads:
            for t in threads:
                t['child_id'].append(email_doc["id"])
                t['child_mid'].append(email_doc["message_id"])
                t['_version_'] = 1
                del t['score']
                solrThreads.add(**t)

        import pprint
        pprint.pprint(email_doc)

        #logger.warn("Email: %s...", str(email_doc)[:150])

        solrMessages.add(**email_doc)

    #solrMessages.commit()
    #solrThreads.commit()


if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    process(sys.argv[1])



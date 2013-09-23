#! /usr/bin/env python
import sys
import os
import iso8601
import json
import solr
import logging

import sqlite3

from utils import solr_escape

from jsonschema import validate

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

sql = sqlite3.connect('/home/curie/curie/users.db')

solrClient = solr.SolrConnection('http://localhost:8983/solr')


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

        "attachment" : [a["filename"] for a in blob["fields"]["attachments"]],

        "subject" : blob["fields"].get("subject"),
        "body" : [b.get("value") for b in blob["fields"].get("body")]
    }

    return document


def get_threads(account_hash, blob):

    mid = blob["id"]

    references = blob.get("references", [])
    reply_to = blob.get("in-reply-to", None)

    parents = references + ([reply_to] if reply_to else [])

    if not parents:
        logger.info("No parents for mid=%s" % mid)
        return

    query = ("+(%s) " % " OR ".join(["child:'%s'" % solr_escape(p) for p in parents])) + " +account:'%s'" % account_hash

    print query
    response = solrClient.query(query)

    print response

    for r in response.results:
        print r

    return response.results or None


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

    for h in hashes:
        email_doc = create_email_doc(h, message_blob)
        thread_docs = get_threads(h, message_blob)

        logger.warn("Email: %s...", str(email_doc)[:150])


        if not thread_docs:
            logger.info("No threads found for mid=%s, account=%s", mid, h)

    #solrClient.add(**document)
    #solrClient.commit()


if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    process(sys.argv[1])



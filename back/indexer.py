#! /usr/bin/env python
import sys
import os
import iso8601
import json
import solr
import uuid
import itertools

from utils import solr_escape, read_blob, get_accounts_for_blob


import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

solrMessages = solr.Solr('http://localhost:8983/solr/messages')

def create_email_doc(account_hash, blob):

    mid = blob["id"]
    _from = blob["fields"]["from"][0]
    message_id = blob["fields"]["message_id"]

    if not message_id or message_id == "":
        raise Exception("no message id! mid=%s" % mid)

    def extract(field, subfield):
        return filter(None, [a.get(subfield) for a in blob["fields"][field]])

    def as_json(field):
        return json.dumps(blob["fields"][field])

    document = {
        "id" : mid,

        "received" : iso8601.parse_date(blob.get("received")),

        "labels" : [],
        "account" : account_hash,
        "message_id" : blob["fields"]["message_id"],

        "from.name" : _from.get("name"),
        "from.email" : _from["email"],
        "from.json" : json.dumps(_from),

        "cc.name" : extract("cc", "name"),
        "cc.email" : extract("cc", "email"),
        "cc.json" : as_json("cc"),

        "bcc.name" : extract("bcc", "name"),
        "bcc.email" : extract("bcc", "email"),
        "bcc.json" : as_json("bcc"),

        "to.name" : extract("to", "name"),
        "to.email" : extract("to", "email"),
        "to.json" : as_json("to"),

        "attachment" : extract("attachments", "filename"),

        "reference" : blob["fields"].get("references", []),

        "subject" : blob["fields"].get("subject"),
        "body" : extract("body", "value")
    }

    return document


def get_related_ids(blob):
    fields = blob["fields"]
    references = fields.get("references", [])
    reply_to = fields.get("in-reply-to", None)

    return references + ([reply_to] if reply_to else [])


def get_relatives(account_hash, blob):

    message_id = blob["fields"]["message_id"]
    relatives_query = "reference:%s" % solr_escape(message_id)

    related_ids = get_related_ids(blob)
    if related_ids:
        related_ids_query = " OR ".join(["message_id:%s" % solr_escape(ref) for ref in related_ids])
        relatives_query = "+(%s OR %s)" % (relatives_query, related_ids_query)
    else:
        relatives_query = "+%s" % relatives_query


    query = "+account:%s" % account_hash + " " + relatives_query;

    logger.info("Searching for relatives: %s", query)

    response = solrMessages.select(query, fields="*", score=False)

    logger.debug("%d relatives found: %s", len(response.results), [r["id"] for r in response.results])

    return response.results


def process(filename):

    message_blob = read_blob(filename)

    accounts = get_accounts_for_blob(message_blob)

    if not accounts:
        logger.error("No accounts found for %s", filename)
        return

    for account in accounts:
        email_doc = create_email_doc(account, message_blob)

        relatives = get_relatives(account, message_blob)
        logger.info("%s relatives found for mid=%s, account=%s", "No" if not relatives else len(relatives), message_blob["id"], account)

        threads = set()
        updated_relatives = []

        for relative in relatives:
            if relative.has_key("threads"):
                threads.update(relative["threads"])
            else:
                new_thread = str(uuid.uuid4())

                threads.add(new_thread)

                relative["threads"] = [new_thread]
                relative["_version_"] = 1
                updated_relatives.append(relative)

        logger.info("%d threads found", len(threads))

        email_doc["threads"] = list(threads)

#        import pprint
#        pprint.pprint(updated_relatives)
        solrMessages.add_many(updated_relatives)

#        import pprint
#        pprint.pprint(email_doc)

        #logger.warn("Email: %s...", str(email_doc)[:150])

        solrMessages.add(email_doc)

    solrMessages.commit()


if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    process(sys.argv[1])



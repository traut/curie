#! /usr/bin/env python
import sys
import os
import iso8601
import json
import solr

from utils import solr_escape

from jsonschema import validate


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


def create_email_doc(blob):

    mid = blob["id"]
    received = iso8601.parse_date(blob.get("received"))

    _from = blob["fields"]["from"][0]

    document = {
        "id" : mid,
        "received" : received,
        "labels" : blob["labels"],

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

    print "Pushing to index: %s" % document
    return document


def get_thread(blob):

    mid = blob["id"]
    reply_to = blob["reply-to"]
    references = blob["references"] or []

    parents = [reply_to] + references

    if not parents:
        return

    query = " ".join(["+child:%s" % solr_escape(p) for p in parents])

    response = solrClient.query(query)

    print response

    for r in response.results:
        print r


def process(filename):

    message_blob = read_blob(filename)
    email_doc = create_email_doc(message_blob)

    get_thread(message_blob)


    #solrClient.add(**document)
    #solrClient.commit()


if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    process(sys.argv[1])



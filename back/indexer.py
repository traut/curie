#! /usr/bin/env python
import sys
import os
import iso8601
import json
import solr

from jsonschema import validate


solrClient = solr.SolrConnection('http://localhost:8983/solr')


def get_schema():
    SCHEMA_PATH = "schemas/message-parsed.json"
    with open(SCHEMA_PATH, "r") as f:
        return json.loads(f.read())

SCHEMA = get_schema()



def read_blob(filename):
    json_filename = filename + ".json"
    if not os.path.exists(json_filename):
        raise Exception("File %s does not exists!" % json_filename)

    with open(json_filename, "r") as f:
        blob_str = f.read()

        validate(blob_str, SCHEMA)

        return json.loads(blob_str)


def process(blob):

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

    solrClient.add(**document)
    #solrClient.commit()



if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    message_blob = read_blob(sys.argv[1])
    process(message_blob)



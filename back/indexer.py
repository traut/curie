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
    with open(SHEMA_PATH, "r") as f:
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


def process(message_blob):

    mid = message_blob["id"]
    received = iso8601.parse_date(message.get("received"))

    orig_date_str = message.get("header_orig_date", None)
    orig_date = iso8601.parse_date(orig_date_str[0]) if orig_date_str else None


    def get_or_none(key):
        return message.get(key, None)

    document = dict(
        id = mid,

        received = received,
        labels = ["inbox"],
        header_orig_date = orig_date,

        header_message_id = get_or_none("header_message_id"),
        header_in_reply_to = get_or_none("header_in_reply_to"),

        header_from_email = get_or_none("header_from_email"),
        header_from_name = get_or_none("header_from_name"),

        header_to_email = get_or_none("header_to_email"),
        header_to_name = get_or_none("header_to_name"),

        header_bcc_email = get_or_none("header_bcc_email"),
        header_bcc_name = get_or_none("header_bcc_name"),

        header_cc_email = get_or_none("header_cc_email"),
        header_cc_name = get_or_none("header_cc_name"),

        header_subject = get_or_none("header_subject"),

        body = get_or_none("body"),
    )

    print "Pushing to index: %s" % document

    solrClient.add(**document)
    #solrClient.commit()



if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    message_blob = read_blob(sys.argv[1])
    process(message_blob)



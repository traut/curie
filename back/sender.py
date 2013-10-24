#! /usr/bin/env python
import sys
import os
import iso8601
import json
import logging
import uuid
import itertools
import pyzmail

from settings import *

from jsonschema import validate

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def get_schema():
    SCHEMA_PATH = "schemas/message-parsed.json"
    with open(SCHEMA_PATH, "r") as f:
        return json.loads(f.read())

SCHEMA = get_schema()

CHARSET = 'UTF-8'




def get_path(hashed):
    return os.path.join(STORAGE_EMAILS, hashed[:2], hashed[2:4], hashed[4:6], hashed)


def read_blob(filepath):
    json_filepath = filepath + ".parsed.json"
    if not os.path.exists(json_filepath):
        raise Exception("File %s does not exists!" % json_filepath)

    with open(json_filepath, "r") as f:
        blob_str = f.read()
        blob = json.loads(blob_str)
        validate(blob, SCHEMA)
        return blob

def write_to_file(path, payload):
    with open(path, "w") as f:
        f.write(payload)


def assemble_email(blob):

    _from = blob['fields']['from'][0]

    def flat_addresses(field):
        return [(a['name'], a['email']) if a.get('name') else a['email'] for a in blob['fields'][field]]

    _texts = filter(lambda x: x['type'] == 'text', blob['fields']['body'])
    _htmls = filter(lambda x: x['type'] == 'html', blob['fields']['body'])
    
    mtext = (_texts[0]["value"].encode(CHARSET), CHARSET) if _texts else None
    mhtml = (_htmls[0]["value"].encode(CHARSET), CHARSET) if _htmls else None

    #sender, recipients, subject, default_charset, text, html=None, attachments=[], embeddeds=[], cc=[], bcc=[], message_id_string=None, date=None, headers=[])
    payload, mail_from, rcpt_to, msg_id = pyzmail.compose_mail(
        (_from.get('name'), _from.get('email')),
        flat_addresses('to'),
        blob['fields']['subject'],
        CHARSET,
        mtext,
        html = mhtml,
        attachments = [],
        embeddeds = [],

        cc = flat_addresses('cc'),
        bcc = flat_addresses('bcc'),

        headers = [
            ('User-Agent', 'curie'),
            ('Message-Id', blob["fields"]["message_id"]),
        ]
    )

    return payload, mail_from, rcpt_to, msg_id



def process(filename):

    path = get_path(filename)
    blob = read_blob(path)

    mid = blob["id"]
    
    print "Sending message", mid

    payload, mail_from, rcpt_to, msg_id = assemble_email(blob)

    print "Writing payload to", path
    write_to_file(path, payload)

    error = pyzmail.send_mail(payload, mail_from, rcpt_to, 'localhost', smtp_port=25)

    if error:
        if isinstance(error, str):
            print "Sending failed: '%s'" % error
        else:
            print "Can't send to some recepients: %s" % error
        sys.exit(1)

    print "Success"


if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    process(sys.argv[1])




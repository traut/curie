import os
import re
import json

from jsonschema import validate

import sqlite3

usersDb = sqlite3.connect('/home/curie/curie/users.db')
filtersDb = sqlite3.connect('/home/curie/curie/filters.db')


# Solr/Lucene special characters: + - ! ( ) { } [ ] ^ " ~ * ? : \
# There are also operators && and ||, but we're just going to escape
# the individual ampersand and pipe chars.
# Also, we're not going to escape backslashes!
# http://lucene.apache.org/java/2_9_1/queryparsersyntax.html#Escaping+Special+Characters
ESCAPE_CHARS_RE = re.compile(r'(?<!\\)(?P<char>[&|+\-!(){}[\]^"~*?:])')


def solr_escape(value):
    r"""Escape un-escaped special characters and return escaped value.

    >>> solr_escape(r'foo+') == r'foo\+'
    True
    >>> solr_escape(r'foo\+') == r'foo\+'
    True
    >>> solr_escape(r'foo\\+') == r'foo\\+'
    True
    """
    return ESCAPE_CHARS_RE.sub(r'\\\g<char>', value)

def strip_control_chars(value):
    # escaping control characters leaving spaces (ord==32) and tabs (ord==9) in place
    return ''.join([ch for ch in value if ord(ch) > 31 or ord(ch) == 9])


def get_accounts_for_email(email):

    if "@" not in email:
        return []

    cur = usersDb.cursor()
    exact_matches = (f[0] for f in cur.execute("select hash from accounts, emails where emails.account_id = accounts.id and emails.email = '%s'" % email).fetchall())

    domain = email.split('@')[1];
    domain_matches = (f[0] for f in cur.execute("select hash from accounts, emails where emails.account_id = accounts.id and emails.email = '*@%s'" % domain).fetchall())

    results = set()
    results.update(exact_matches)
    results.update(domain_matches)
    return list(results)

def get_filters(account_hash):
    cur = filtersDb.cursor()
    return cur.execute("select query, label, skip_inbox from filters where filters.hash = '%s'" % account_hash).fetchall()

def get_filter(filter_id):
    cur = filtersDb.cursor()
    return cur.execute("select query, label, skip_inbox, hash from filters where filters.id = '%s'" % filter_id).fetchone()


def get_schema():
    SCHEMA_PATH = "schemas/message-parsed.json"
    with open(SCHEMA_PATH, "r") as f:
        return json.loads(f.read())

def read_blob(filename):
    json_filename = filename + ".parsed.json"
    if not os.path.exists(json_filename):
        raise Exception("File %s does not exists!" % json_filename)

    with open(json_filename, "r") as f:
        blob_str = f.read()
        blob = json.loads(blob_str)
        validate(blob, get_schema())
        return blob


def get_recepients(blob):
    return \
        [a["email"] for a in blob["fields"]["to"]] + \
        [a["email"] for a in blob["fields"]["cc"]] + \
        [a["email"] for a in blob["fields"]["bcc"]]

def get_accounts_for_blob(blob):
    hashes = []
    print get_recepients(blob)
    for email in get_recepients(blob):
        hashes.extend(get_accounts_for_email(email))
    return hashes



#! /usr/bin/env python
import sys
import os
import iso8601
import json
import solr
import urllib
import urllib2


from utils import solr_escape, read_blob, get_accounts_for_blob, get_filters

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


solrMessages = solr.Solr('http://localhost:8983/solr/messages')

ROWS = 100

INBOX_LABEL = "inbox"


def run_filters(account_hash, message_id, query_label_pairs):

    updates = []

    skip_inbox = False
    added_labels = set()

    for query, label, _skip_inbox in query_label_pairs:

        caged_query = '+id:%s +(%s) +account:%s -labels:"%s"' % (message_id, query, account_hash, solr_escape(label))

        results = solrMessages.select(caged_query, fields="id", score=False, rows=ROWS).results

        for r in results:
            updates.append(dict(id=r["id"], labels=dict(add=label)))
            added_labels.add(label)

        if results:
            skip_inbox = skip_inbox or _skip_inbox

    if push_updates(updates):
        logger.info("%d documents updated with %d filters for account %s", len(updates), len(query_label_pairs), account_hash)
    else:
        sys.exit(1)

    if not skip_inbox:
        caged_query = "+id:%s +account:%s -labels:'%s'" % (message_id, account_hash, INBOX_LABEL)
        results = solrMessages.select(caged_query, fields="id", score=False, rows=ROWS).results

        if results:
            update = dict(
                id = message_id,
                labels = dict(add=INBOX_LABEL)
            )
            added_labels.add(INBOX_LABEL)
            if not push_updates([update]):
                sys.exit(1)

    logger.info("Labeling for %s is done. Labels %s added", message_id, added_labels)


def push_updates(updates):
    if not updates:
        return True

    data = json.dumps(updates)

    request = urllib2.Request('http://localhost:8983/solr/update/json?commit=true', data)
    request.add_header("Content-Type", "application/json")

    response = urllib2.urlopen(request)
    page = response.read()

    reply = json.loads(page)
    
    success = reply["responseHeader"]["status"] == 0

    if not success:
        logger.error("Can't update documents. Reply: %s", page)
    return success


def process(filename):
    message_blob = read_blob(filename)


    accounts = get_accounts_for_blob(message_blob)

    if not accounts:
        logger.error("No accounts found for " + filename)
        sys.exit(1)

    for account in accounts:
        run_filters(account, message_blob["id"], get_filters(account))

if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    process(sys.argv[1])


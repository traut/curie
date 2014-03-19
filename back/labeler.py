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

    labels = set()
    skip_inbox = False

    for query, label, _skip_inbox in query_label_pairs:

        caged_query = '+id:%s +(%s) +account:%s -labels:"%s"' % (message_id, query, account_hash, solr_escape(label))

        results = solrMessages.select(caged_query, fields="id", score=False, rows=ROWS).results

        for r in results:
            labels.add(label)

        if results:
            skip_inbox = skip_inbox or _skip_inbox

    prepared_updates = [dict(id=message_id, labels=dict(add=label)) for label in labels]

    if push_updates(prepared_updates):
        logger.info("Message %s updated with %d filters for account %s", message_id, len(query_label_pairs), account_hash)
    else:
        sys.exit(1)

    if not skip_inbox:
        caged_query = "+id:%s +account:%s -labels:'%s'" % (message_id, account_hash, INBOX_LABEL)

        if solrMessages.select(caged_query, fields="id", score=False, rows=ROWS).results:
            update = dict(
                id = message_id,
                labels = dict(add=INBOX_LABEL)
            )
            if not push_updates([update]):
                sys.exit(1)

    logger.info("Labeling for %s is done. Labels %s added", message_id, list(labels))


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


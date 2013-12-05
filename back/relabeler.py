#! /usr/bin/env python
import sys
import os
import iso8601
import json
import solr
import urllib
import urllib2


from utils import solr_escape, read_blob, get_accounts_for_blob, get_filter

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


solrMessages = solr.Solr('http://localhost:8983/solr/messages')

ROWS = 10000

INBOX_LABEL = "inbox"


def run_filter(fid, _filter):

    query, label, skip_inbox, account_hash = _filter

    caged_query = '+(%s) +account:%s -labels:"%s"' % (query, account_hash, solr_escape(label))

    updates = []
    added_labels = set()

    for r in solrMessages.select(caged_query, fields="id", score=False, rows=ROWS).results:
        updates.append(dict(id=r["id"], labels=dict(add=label)))
        #updates.append(dict(id=r["id"], labels=dict(set=[label])))
        added_labels.add(label)

    if push_updates(updates):
        logger.info("%d documents updated with filter id=%s for account %s", len(updates), fid, account_hash)
    else:
        sys.exit(1)

    logger.info("Relabeling with filter id=%s, account=%s is done. Labels %s added", fid, account_hash, added_labels)


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


def process(filter_id):
    f = get_filter(filter_id)
    print f
    if not f:
        logger.error("Can't find filter with id=%s", filter_id)
        sys.exit(1)
    run_filter(filter_id, f)

if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filter-id>" % __file__
        sys.exit(1)

    process(sys.argv[1])


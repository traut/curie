#! /usr/bin/env python
import sys
import os
import iso8601
import json
import solr
import time

from os.path import basename

import logging
logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)

solrClient = solr.SolrConnection('http://localhost:8983/solr')

def process(message_id):

    query = '+id:%s' % message_id
    response = solrClient.query(query)

    if len(response.results) != 1:
        log.error("%d docs found for query=%s", len(response.results), query)
        sys.exit(1)

    doc = response.results[0]
    print doc

    #{u'header_in_reply_to': u'<ED07A103FBEC1D458173C37516728F9408E3CA6D@dc1-exmb2.hosting.local>', u'received': datetime.datetime(2013, 4, 7, 2, 31, 14, 164000, tzinfo=<solr.core.UTC object at 0x1564ed0>), u'header_message_id': u'<CABjC=Otq-7Lamo_W78uKXEiTdE+hB30AW-xrgOCoiEOXmO2n0Q@mail.gmail.com>', u'header_to_email': [u'some@curie.heyheylabs.com'], u'label': u'inbox', u'header_orig_date': datetime.datetime(2013, 4, 7, 2, 27, 4, tzinfo=<solr.core.UTC object at 0x1564ed0>), u'score': 1.4054651, u'header_from_name': [u'Sergey Polzunov'], u'_version_': 1431615228354756608L, u'indexed': datetime.datetime(2013, 4, 7, 0, 31, 14, 254000, tzinfo=<solr.core.UTC object at 0x1564ed0>), u'header_subject': u'Fwd: Personal details', u'id': u'02da361022d17f30eaaeef75f53014f8a648597a22bf2ad704fd926b9b6f056f', u'header_from_email': [u'sergey@polzunov.com']}

    notice = dict(
        message = dict(
            id = doc['id'],

            from_name = doc.get('header_from_name', None),
            from_email = doc.get('header_from_email'), 

            to_name = doc.get('header_to_name', None),
            to_email = doc.get('header_to_email'), 

            subject = doc.get('header_subject'),
            received = time.mktime(doc.get('received').timetuple()),
            unread = doc.get('unread'),
            labels = doc.get('labels', [])
        )
    )

    print json.dumps(notice)



if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    filepath = sys.argv[1]
    
    process(basename(filepath))


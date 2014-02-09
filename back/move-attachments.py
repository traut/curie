#! /usr/bin/env python
import os
import sys
import shutil

from utils import read_blob, get_accounts_for_blob


import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def process(filename):

    try:
        message_blob = read_blob(filename)
    except:
        print "ERROR: blob doesn't exist"
        return

    attachments = message_blob["fields"].get("attachments", [])

    if not attachments:
        print "No attachments for " + message_blob["id"]
        return
    else:
        print "%d attachments for %s" % (len(attachments), message_blob["id"])

    email_path = os.path.dirname(filename)

    for a in attachments:
        name = a["file"]
        src = os.path.join("/home/curie/storage/attachments/", name[:2], name[2:4], name[4:6], name)
        dest = os.path.join(email_path, name)
        shutil.move(src, dest)
        print "%s -> %s" % (src, dest)


if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <filepath>" % __file__
        sys.exit(1)

    process(sys.argv[1])



# !/usr/bin/env python
# -*- coding: utf-8 -*-
#

import os
import stat
import sys
import time
import beanstalkc
import json
import shutil

from watchdog.observers import Observer
from watchdog.events import FileCreatedEvent, FileSystemEventHandler

import hashlib

import logging
logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)

from settings import *


def move_file(filename, destdir):

    #FIXME: bullshit. hash should be calculated out of message id probably
    hashed = hashlib.sha256(filename).hexdigest()
    subdir = os.path.join(destdir, hashed[:2], hashed[2:4], hashed[4:6])

    try:
        os.makedirs(subdir)
    except OSError:
        pass

    os.chmod(subdir, stat.S_IREAD | stat.S_IWRITE | stat.S_IEXEC | \
                     stat.S_IRGRP | stat.S_IWGRP | stat.S_IXGRP | \
                     stat.S_IROTH | stat.S_IXOTH)

    dest = os.path.join(subdir, hashed)
    shutil.move(filename, dest)

    fd = os.open(dest, os.O_RDONLY)
    os.fchmod(fd, stat.S_IREAD | stat.S_IWRITE | stat.S_IRGRP | stat.S_IROTH)
    os.close(fd)

    log.info(filename + " –> " + dest)

    return dest



class FileHandler(FileSystemEventHandler):

    def __init__(self, destination, tube):
        self.destination = destination
        self.tube = tube
        self.conn = beanstalkc.Connection(QUEUE_SERVER_NAME, QUEUE_SERVER_PORT)
        self.conn.use(tube)

    def push_into_tube(self, filename):
        self.conn.put(filename, ttr=QUEUE_TTR)
        log.debug("%s put into the queue '%s'", filename, self.tube)

    def on_created(self, event):
        if isinstance(event, FileCreatedEvent):
            filename = event.src_path
            storage_name = move_file(filename, self.destination)
            self.push_into_tube(storage_name)



def start_observer(mailDir, processingDir, queue):

    newDir = os.path.join(mailDir, 'new')

    log.info("watching=%s, storage=%s, queue=%s", newDir, processingDir, queue)

    handler = FileHandler(processingDir, queue)

    observer = Observer()
    observer.schedule(handler, path=newDir, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()


if __name__ == '__main__':

    if len(sys.argv) != 4:
        print "Usage: %s MAILDIR PROCESSINGDIR QUEUENAME" % __file__
        sys.exit(1)

    mailDir = sys.argv[1]
    processingDir = sys.argv[2]
    queue = sys.argv[3]

    start_observer(mailDir, processingDir, queue)




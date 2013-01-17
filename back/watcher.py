# -*- coding: utf-8 -*-

import os
import sys
import time
import beanstalkc
import json
import shutil

from watchdog.observers import Observer
from watchdog.events import FileCreatedEvent, FileSystemEventHandler

import logging
logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)

from settings import *


class FileHandler(FileSystemEventHandler):


    def __init__(self, destination, tube):
        self.destination = destination
        self.tube = tube

        self.conn = beanstalkc.Connection(QUEUE_SERVER_NAME, QUEUE_SERVER_PORT)
        self.conn.use(tube)

    def push_into_tube(self, filename):
        data = dict(filename=filename)
        self.conn.put(json.dumps(data), ttr=QUEUE_TTR)
        log.debug("File %s put into the queue %s", filename, self.tube)


    def on_created(self, event):
        if isinstance(event, FileCreatedEvent):
            filename = event.src_path
            self.push_into_tube(filename)
            shutil.move(filename, self.destination)




def start_observer(mailDir, processingDir, queue):

    newDir = os.path.join(mailDir, 'new')

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

    log.info("%s, %s, %s", mailDir, processingDir, queue)

    start_observer(mailDir, processingDir, queue)




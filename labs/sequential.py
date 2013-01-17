import sys

import logging
logging.basicConfig(level=logging.DEBUG)

WORKER_LOGGER_NAME = "processors.sequential.%s"

log = logging.getLogger(__file__)
log.setLevel(logging.DEBUG)

log = logging.getLogger("processors.sequential")


class BaseWorker(object):

    name = None

    def __init__(self):
        log = logging.getLogger(WORKER_LOGGER_NAME % self.name)


class Parser(BaseWorker):

    name = 'parser'

    def process(self, message):
        self.log.info("HEY")
        return message

class Indexer(BaseWorker):

    name = 'indexer'

    def process(self, message):
        self.log.info("HEY")
        return message


workers = dict(
    parser = parser,
    indexer = indexer
)


if __name__ == '__main__':

    if len(sys.argv) != 3:
        print "Usage: %s worker-name" % __file__
        sys.exit(1)

    worker_name = sys.argv[1]
    message = sys.argv[2]

    if worker_name not in workers:
        log.error("Unknown worker name. Available workers: %s", workers.keys())
        sys.exit(1)

    workers[worker_name](message)



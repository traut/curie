
import json

def process(message):
    filename = 

if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: %s <json-blob>" % __file__
        sys.exit(1)

    message = json.loads(sys.argv[1])

    process(message)

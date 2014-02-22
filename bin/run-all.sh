#! /bin/sh

set -e

DIR=`pwd`

MAILDIR=$DIR/Maildir
STORAGE=$DIR/storage
CURIE=$DIR/curie
SOLR=$DIR/solr


# start solr

cd $SOLR/example
java -Dsolr.solr.home=curie -jar start.jar > $DIR/curie-solr.log 2>&1 &
cd ../..



# start workers; pipeline described here - http://traut.github.io/curie/#incoming-email-processing

. $CURIE/.e/bin/activate

python $CURIE/back/watcher.py $MAILDIR/ $STORATE/emails inbox > $DIR/curie-worker-watcher.log 2>&1 &
q-wrapper inbox parsed $CURIE/back/parser.sh > $DIR/curie-worker-parser.log 2>&1 &
q-wrapper parsed indexed $CURIE/back/indexer.py > $DIR/curie-worker-indexer.log 2>&1 &
q-wrapper indexed labeled $CURIE/back/labeler.py > $DIR/curie-worker-labeler.log 2>&1 &

q-wrapper relabel relabeled $CURIE/back/relabeler.py > $DIR/curie-worker-relabeler.log 2>&1 &

# start webserver
cd $CURIE/front
node ./runner.js --log $DIR/curie-webserver.log &
cd ../..

echo "Server is listening on http://localhost:8080"

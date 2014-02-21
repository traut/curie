PWD=`pwd`

MAILDIR=$PWD/Maildir
STORAGE=$PWD/storage
CURIE=$PWD/curie
SOLR=$PWD/solr


# start solr
cd $SOLR/example
java -Dsolr.solr.home=curie -jar start.jar > $PWD/curie-solr.log 2>&1 &

. $CURIE/.e/bin/activate

# start workers; pipeline described here - http://traut.github.io/curie/#incoming-email-processing

python $CURIE/back/watcher.py $MAILDIR/ $STORATE/emails inbox > $PWD/curie-worker-watcher.log 2>&1 &
q-wrapper inbox parsed $CURIE/back/parser.sh > $PWD/curie-worker-parser.log 2>&1 &
q-wrapper parsed indexed $CURIE/back/indexer.py > $PWD/curie-worker-indexer.log 2>&1 &
q-wrapper indexed labeled $CURIE/back/labeler.py > $PWD/curie-worker-labeler.log 2>&1 &

q-wrapper relabel relabeled $CURIE/back/relabeler.py > $PWD/curie-worker-relabeler.log 2>&1 &

cd $CURIE
node ./runner.js &

echo "Server is listening on http://localhost:8080"

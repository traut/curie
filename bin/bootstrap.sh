#! /bin/sh

set -ex

DIR=$(pwd)

STORAGE=$DIR/storage
SOLR=$DIR/solr
CURIE=$DIR/curie


TMP=.

# create directories
mkdir $CURIE
mkdir $SOLR
mkdir -p $STORAGE/drafts
mkdir -p $STORAGE/emails


# get curie code

git clone https://github.com/traut/curie.git $CURIE


# get and unpack solr

SOLR_VERSION=4.7.0
SOLR_ARCHIVE=solr-$SOLR_VERSION.tgz

wget http://mirror.tcpdiag.net/apache/lucene/solr/$SOLR_VERSION/$SOLR_ARCHIVE -O $TMP/$SOLR_ARCHIVE
tar xzvf $TMP/$SOLR_ARCHIVE -C $SOLR --strip-components 1
rm $TMP/$SOLR_ARCHIVE


# configure Solr

CURIE_SOLR=$SOLR/example/curie
mkdir -p $CURIE_SOLR/messages/conf

cp -R $SOLR/example/solr/collection1/conf/* $CURIE_SOLR/messages/conf/

echo "name=messages" > $CURIE_SOLR/messages/core.properties

cp $CURIE/configs/solr/solr.xml $CURIE_SOLR/
cp $CURIE/configs/solr/messages/* $CURIE_SOLR/messages/conf/


# we're done with preparations. let's configure curie

RANDOM_STRING=$(cat /dev/urandom | env LC_CTYPE=C tr -cd 'a-zA-Z0-9' | head -c 128)

cp $CURIE/front/settings.js.example $CURIE/front/settings.js
cp $CURIE/back/settings.py.example $CURIE/back/settings.py

STORAGE_FULL=$(cd $STORAGE; pwd);
CURIE_FULL=$(cd $CURIE; pwd);

sed -i.bak "s@STORAGE-MESSAGES-PATH@$STORAGE_FULL/messages@" $CURIE/front/settings.js
sed -i.bak "s@STORAGE-DRAFTS-PATH@$STORAGE_FULL/drafts@" $CURIE/front/settings.js
sed -i.bak "s@REPLACE-WITH-A-SECRET-STRING@$RANDOM_STRING@" $CURIE/front/settings.js

sed -i.bak "s@USERS-DB@$CURIE_FULL/users.db@" $CURIE/front/settings.js
sed -i.bak "s@FILTERS-DB@$CURIE_FULL/filters.db@" $CURIE/front/settings.js

sed -i.bak "s@STORAGE-PATH@$STORAGE_FULL@" $CURIE/back/settings.py
sed -i.bak "s@USERS-DB@$CURIE_FULL/users.db@" $CURIE/back/settings.py
sed -i.bak "s@FILTERS-DB@$CURIE_FULL/filters.db@" $CURIE/back/settings.py

# configure python virtual environment

virtualenv $CURIE/.e
. $CURIE/.e/bin/activate

pip install -r $CURIE/configs/requirements.pip


# configure node.js environment

cd $CURIE/front
npm install
node ./recreate-db.js
cd $DIR

# FIXME: should be removed
# patch barista package. we want it to support PATCH messages

sed -i.bak "s/'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'/'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'/" $CURIE/front/node_modules/barista/lib/router.js

# Done

echo
echo "To start all the processes use run-all.sh"
echo

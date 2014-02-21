#! /usr/bin/env bash

STORAGE=./storage
SOLR=./solr
CURIE=./curie

TMP=.

# create directories
mkdir $CURIE
mkdir $SOLR
mkdir -p $STORAGE/drafts
mkdir -p $STORAGE/emails


# get curie code

git clone https://github.com/traut/curie.git $CURIE


# get and unpack solr

SOLR_VERSION=4.6.1
SOLR_ARCHIVE=solr-$SOLR_VERSION.tgz

wget http://mirror.tcpdiag.net/apache/lucene/solr/$SOLR_VERSION/$SOLR_ARCHIVE -O $TMP/$SOLR_ARCHIVE
tar xzvf $TMP/$SOLR_ARCHIVE -C $SOLR --strip-components 1
rm $TMP/$SOLR_ARCHIVE


# configure Solr

CURIE_SOLR=$SOLR/example/curie
mkdir -p $CURIE_SOLR/messages/conf

cp $CURIE/configs/solr/solr.xml $CURIE_SOLR/
cp $CURIE/configs/solr/messages/* $CURIE_SOLR/messages/conf/


# we're done with preparations. let's configure curie

RANDOM_STRING=$(cat /dev/urandom | env LC_CTYPE=C tr -cd 'a-zA-Z0-9' | head -c 128)

cp $CURIE/front/settings.js.example $CURIE/front/settings.js

CURIE_FULL=$(cd $CURIE; pwd);

sed -i.bak "s@STORAGE-MESSAGES-PATH@$CURIE_FULL/messages@" $CURIE/front/settings.js
sed -i.bak "s@STORAGE-DRAFTS-PATH@$CURIE_FULL/drafts@" $CURIE/front/settings.js
sed -i.bak "s@REPLACE-WITH-A-SECRET-STRING@$RANDOM_STRING@" $CURIE/front/settings.js

# configure python virtual environment

virtualenv $CURIE/.e
. $CURIE/.e/bin/activate

pip install -r $CURIE/configs/requirements.pip


# configure node.js environment

cd $CURIE/front
npm install
node ./recreate-db.js
cd ..


echo
echo "To start all the processes use run-all.sh"
echo

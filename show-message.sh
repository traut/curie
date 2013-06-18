#!/bin/bash

FORMAT=$1
ID=$2

if [[ ($# -eq 0) || (-z $FORMAT) || (-z $ID) ]]
    then
        echo "Usage: ./show-email.sh (json|plain) email-id"
        exit 1
fi

FILEPATH=~/storage/${ID:0:2}/${ID:2:2}/${ID:4:2}/$ID

echo $FILEPATH

if [ "$FORMAT" = "json" ]
then
    cat $FILEPATH.json | python -mjson.tool | more
elif [ "$FORMAT" = "plain" ] 
then
    more $FILEPATH
else
    echo "Format $FORMAT is not recognized. Options: json, plain"
fi


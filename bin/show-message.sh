#!/bin/bash

FORMAT=$1
ID=$2

if [[ ($# -eq 0) || (-z $FORMAT) || (-z $ID) ]]
    then
        echo "Usage: ./show-email.sh (json|plain) email-id[.parsed|.raw]"
        exit 1
fi

FILEPATH=~/storage/emails/${ID:0:2}/${ID:2:2}/${ID:4:2}/$ID

echo $FILEPATH

if [ "$FORMAT" = "json" ]
then
    jq '.' $FILEPATH.json
elif [ "$FORMAT" = "plain" ] 
then
    less $FILEPATH
else
    echo "Format $FORMAT is not recognized. Options: json, plain"
fi


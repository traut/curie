#!/bin/sh

DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"

echo java -cp curie-java/release/*.jar com.heyheylabs.curie.Runner $DIR/schemas $1
java -cp curie-java/release/*.jar com.heyheylabs.curie.Runner $DIR/schemas $1


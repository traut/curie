#!/bin/bash

DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"

java -cp curie-java/release/*.jar com.heyheylabs.curie.Runner $DIR/schemas $1


#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
usage (){
    echo "";
    echo "countly task <taskname>";
} 

if [ -z "$1" ]
then
    usage ;
else
    (cd "$DIR/../../.." ;
    "$DIR/../../../node_modules/grunt/bin/grunt" "$1";
    )
fi

#!/usr/bin/env bash

echo "Countly info :";
echo "    version : $(countly version)";
echo "    path    : $(countly dir)";
status=$(sudo countly status)
if (( $(grep -c . <<<"$status") > 1 )); then
    status=$(echo "${status}" | grep "Active: " | sed -e 's/^[[:space:]]*//')
    status=${status#"Active: "}
    if ! [ -z "${status}" ]; then
        echo "    status  : $status"
    else
        echo "    status  : $(sudo countly status)";
    fi
else
    echo "    status  : $status";
fi

#!/bin/bash
# This should run all the scripts, recording results in file 'results'

clear
echo "Testing All Matching functionality" > results

for filename in script*.sh; do
    ./"$filename"
done
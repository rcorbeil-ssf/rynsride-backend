#!/bin/bash

var=$HOSTNAME
#echo "$var"

#remove last substring, e.g. -2797254
str=${var%-*}
#echo "$str" 

id="$( cut -d '-' -f 1 <<< "$str" )"
#echo "$id"

str=${str#*-}
#echo "$str" 

str2=$str-$id
#echo "$str2"

URL="https://"$str2".c9users.io/api/"
echo "$URL"
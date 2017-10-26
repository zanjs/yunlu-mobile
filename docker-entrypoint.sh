#!/bin/sh

#clean the dist folder
rm -rf /build/test/
#copy files to nginx 
cp -rf /dist /build/test

echo "======================================================"
echo "=  Use mount local folder /build to get the file...  ="
echo "======================================================"

#!/bin/sh

#clean the dist folder
rm -rf /build/pro/
#building product backend
cp -rf /dist /build/pro
#building test backend
#rm -rf ./dist/*
#sed -i "s/api.yunlu6.com/test.yunlu6.com/g" ./src/constants/constant.js
#npm run build
#cp -rf ./dist /build/test
#building dev backend
#rm -rf ./dist/*
#sed -i "s/test.yunlu6.com/giant.dev.yunlu6.com/g" ./src/constants/constant.js
#npm run build
#cp -rf ./dist /build/dev
echo "======================================================"
echo "=  Use mount local folder /build to get the file...  ="
echo "======================================================"

#!/bin/sh

#get the latest code
cd /app
git fetch origin master
git reset --hard origin/master
npm config set registry https://registry.npm.taobao.org
npm install
rm -rf /build/*
#building product backend
rm -rf ./dist/*
npm run build
cp -rf ./dist /build/pro
#building test backend
rm -rf ./dist/*
sed -i "s/api.yunlu6.com/test.yunlu6.com/g" ./src/constants/constant.js
npm run build
cp -rf ./dist /build/test
#building dev backend
rm -rf ./dist/*
sed -i "s/test.yunlu6.com/giant.dev.yunlu6.com/g" ./src/constants/constant.js
npm run build
cp -rf ./dist /build/dev
echo "========================="
echo "Use mount local fold to /build to get the file..."
echo "========================="

#!/usr/bin/env sh

set -e

npm run build

cd dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'update blog'

git push -f git@github.com:jiawei-zhou/jiawei-zhou.github.io.git master

cd -
#!/usr/bin/env bash

if [ ! `which docker` ]; then
	echo 'Please install "docker"'
	exit 1
fi

npm i

npm run server:start

docker run --rm --network host -v $(pwd):/work/ -w /work/ -it mcr.microsoft.com/playwright:v1.21.0-focal /bin/bash -c "npm run test -- -u"

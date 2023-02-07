#!/usr/bin/env bash

npm i -g --no-package-lock --no-save @wordpress/env@5.7.0

npx wp-env start

npx wp-env run cli "bash elementor-config/setup.sh"

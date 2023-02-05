#!/usr/bin/env bash

npx wp-env start
npx wp-env run cli wp option update blogname "elementor"
npx wp-env run cli "bash -c bash elementor-config/setup.sh"

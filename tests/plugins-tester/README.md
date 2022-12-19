# Elementor Plugins Tester

Requirements:
- Docker

Run from Elementor root folder:
```shell
npm run test:plugins-tester:linux
```
It will run:
- npm install (plugin dependencies)
- npx grunt build
- cd tests/plugins-tester
- npm install (test dependencies)
- npm test

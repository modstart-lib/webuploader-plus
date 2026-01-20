
prepare:
	npm install

build_for_es5:
	npx tsc src/lib/browser-image-compression-es6.js --target ES5 --allowJs --outFile src/lib/browser-image-compression.js

build_all: build_for_es5
	rm -rfv ./dist
	rm -rfv ./dist-min
	npm run build


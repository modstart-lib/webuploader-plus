prepare:
	cnpm install

build:
	rm -rfv ./dist/; \
	rm -rfv ./dist-min/; \
	grunt dist --force; \
	uglifyjs -o dist-min/ueditor.all.js dist/ueditor.all.js;

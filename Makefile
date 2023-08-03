
#prepare:
#	cnpm install

build:
	rm -rfv ./dist/; \
	rm -rfv ./dist-min/; \
	grunt default --force;


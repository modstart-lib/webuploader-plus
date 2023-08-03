
prepare:
	cnpm install

build_for_modstart:
	rm -rfv ./dist/; \
	rm -rfv ./dist-min/; \
	grunt default; \
	rm -rfv ../../vendor/modstart/modstart/resources/asset/src/lib/webuploader; \
	cp -av dist ../../vendor/modstart/modstart/resources/asset/src/lib/webuploader; \
	cd ../../vendor/modstart/modstart/resources/asset; \
	gulp; \
	webpack; \
	echo "SUCCESS"


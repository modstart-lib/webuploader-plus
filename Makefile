
prepare:
	cnpm install

build_for_es5:
	npx tsc src/lib/browser-image-compression-es6.js --target ES5 --allowJs --outFile src/lib/browser-image-compression.js

build_for_modstart:
	rm -rfv ./dist/; \
	rm -rfv ./dist-min/; \
	grunt default; \
	rm -rfv ../ueditor-plus/third-party/webuploader; \
	cp -av dist-min ../ueditor-plus/third-party/webuploader; \
	rm -rfv ../../vendor/modstart/modstart/resources/asset/src/lib/webuploader; \
	cp -av dist-min ../../vendor/modstart/modstart/resources/asset/src/lib/webuploader; \
	rm -rfv ../../vendor/modstart/modstart/resources/asset/src/svue/components/webuploader; \
	cp -av dist-min ../../vendor/modstart/modstart/resources/asset/src/svue/components/webuploader; \
	cd ../../vendor/modstart/modstart/resources/asset; \
	gulp; \
	webpack; \
	echo "SUCCESS"


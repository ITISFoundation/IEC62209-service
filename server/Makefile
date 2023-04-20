CLIENT_DIR := $(abspath $(CURDIR)/../client)

.PHONY: help
help: ## help on rule's targets
	@awk --posix 'BEGIN {FS = ":.*?## "} /^[[:alpha:][:space:]_-]+:.*?## / {printf "%-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: info
info: ## package info
	 @pip show iec62209
	 @echo "---------"
	 @pip show iec62209-service


.PHONY: install-dev
install-dev: ## install development
	pip install -r requirements.txt
	pip install --editable .


.PHONY: install-prod
install-prod: ## install development
	pip --no-cache-dir install -r requirements.txt
	pip --no-cache-dir install .


.PHONY: run-dev
run-dev: ## runs app on a uvicorn server with watch+reload to aid development
	export CLIENT_OUTPUT_DIR="$(CLIENT_DIR)/compiled/source" && \
	uvicorn iec62209_service.main:the_app \
		--host 0.0.0.0 \
		--reload \
		--reload-dir ./src \
		--log-level debug
	echo "http://127.0.0.1:8000/docs"

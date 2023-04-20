CLIENT_DIR := $(abspath $(CURDIR)/../client)

.PHONY: help
help: ## help on rule's targets
	@awk --posix 'BEGIN {FS = ":.*?## "} /^[[:alpha:][:space:]_-]+:.*?## / {printf "%-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: info

info: ## info in main packages
	 @pip show iec62209
	 @echo
	 @pip show iec62209-service


.PHONY: install-dev
install-dev: ## install development
	pip install -r requirements.txt
	pip install --editable .


.PHONY: run-dev
run-dev: ## runs app on a uvicorn server with watch+reload to aid development
	export CLIENT_OUTPUT_DIR="$(CLIENT_DIR)/compiled/source" && \
	uvicorn iec62209_service.main:the_app \
		--reload \
		--reload-dir ./src \
		--log-level debug

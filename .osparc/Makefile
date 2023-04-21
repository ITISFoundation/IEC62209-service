
.DEFAULT_GOAL := help
SHELL := /bin/bash

REPO_DIR := $(abspath $(CURDIR)/..)


.PHONY: info
info:
	printenv | sort

.PHONY: compose
compose: ## creates docker-compose.yml
	cd $(REPO_DIR) \
	&& .osparc/bin/ooil.bash compose -f .osparc/docker-compose.yml


.PHONY: build
build: ## builds image
	docker compose build


.PHONY: help
help: ## help on rule's targets
	@awk --posix 'BEGIN {FS = ":.*?## "} /^[[:alpha:][:space:]_-]+:.*?## / {printf "%-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

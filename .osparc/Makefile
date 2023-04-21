
REPO_DIR := $(abspath $(CURDIR)/..)



.PHONY: compose
compose: ## creates .osparc/docker-compose.yml
	cd $(REPO_DIR) \
	&& .osparc/bin/ooil.bash compose -f .osparc/docker-compose.yml


.PHONY: build
build: ## builds image
	docker compose build

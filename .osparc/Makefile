
REPO_DIR := $(abspath $(CURDIR)/..)



.PHONY: compose
compose: ## creates compose specs .osparc/docker-compose.yml
	cd $(REPO_DIR) \
	&& .osparc/bin/ooil.bash compose -f .osparc/docker-compose.yml

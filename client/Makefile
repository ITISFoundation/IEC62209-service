include ../scripts/common.Makefile



info: ## info on tools
	 which node
	 node --version


.PHONY: install-dev
install-dev: ## installs for development
	npm install

.PHONY: compile-dev
serve-dev: ## compiles, watches and serves with nodejs
	npx qx serve

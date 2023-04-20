APP_NAME := iec62209-service


.PHONY: help
help: ## help on rule's targets
	@awk --posix 'BEGIN {FS = ":.*?## "} /^[[:alpha:][:space:]_-]+:.*?## / {printf "%-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)


.venv:
	@python3 --version
	python3 -m venv $@
	## upgrading tools to latest version in $(shell python3 --version)
	$@/bin/pip3 --quiet install --upgrade \
		pip~=23.0 \
		wheel \
		setuptools
	@$@/bin/pip3 list --verbose


.PHONY: devenv
devenv: .venv ## create a python virtual environment with dev tools (e.g. linters, etc)
	$</bin/pip3 --quiet install -r requirements-dev.txt
	# Installing pre-commit hooks in current .git repo
	@$</bin/pre-commit install
	@echo "To activate the venv, execute 'source .venv/bin/activate'"


.PHONY: build
build:
	docker build \
		--tag local/${APP_NAME}:latest \
		--progress plain \
		$(CURDIR)

.PHONY: shell
shell:
	docker run \
		--interactive \
		--tty \
		--user scu \
		--publish 8000:8000 \
		local/${APP_NAME}:latest \
		bash

.PHONY: run
run:
	docker run \
		--interactive \
		--tty \
		--publish 8000:8000 \
		local/${APP_NAME}:latest



REPODIR:=$(CURDIR)

.PHONY: run-devel
run-devel:
	docker run \
		--tty \
		--interactive \
		--workdir="/home/$(USER)" \
		--volume="/etc/group:/etc/group:ro" \
		--volume="/etc/passwd:/etc/passwd:ro" \
		--volume=$(REPODIR):/home/$(USER) \
		--user=$(shell id -u):$(shell id -g) \
		--publish 8000:8000 \
		local/${APP_NAME}:latest



.PHONY: clean clean-images clean-venv clean-all clean-more

_git_clean_args := -dx --force --exclude=.vscode --exclude=TODO.md --exclude=.venv --exclude=.python-version --exclude="*keep*"

.check-clean:
	@git clean -n $(_git_clean_args)
	@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]
	@echo -n "$(shell whoami), are you REALLY sure? [y/N] " && read ans && [ $${ans:-N} = y ]

clean-venv: devenv ## Purges .venv into original configuration
	# Cleaning your venv
	.venv/bin/pip-sync --quiet $(CURDIR)/requirements/devenv.txt
	@pip list

clean-hooks: ## Uninstalls git pre-commit hooks
	@-pre-commit uninstall 2> /dev/null || rm .git/hooks/pre-commit

clean: .check-clean ## cleans all unversioned files in project and temp files create by this makefile
	# Cleaning unversioned
	@git clean $(_git_clean_args)

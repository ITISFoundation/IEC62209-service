# syntax=docker/dockerfile:1
FROM python:3.10-slim-buster as base

LABEL maintainer=pcrespov

# Install git and nodejs
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        nodejs \
    ; \
    rm -rf /var/lib/apt/lists/* && \
    git --version \
    node --version

# simcore-user uid=8004(scu) gid=8004(scu) groups=8004(scu)
ENV SC_USER_ID=8004 \
    SC_USER_NAME=scu

RUN adduser \
    --uid ${SC_USER_ID} \
    --disabled-password \
    --gecos "" \
    --shell /bin/sh \
    --home /home/${SC_USER_NAME} \
    ${SC_USER_NAME}

# Sets utf-8 encoding for Python et al
ENV LANG=C.UTF-8

# Turns off writing .pyc files; superfluous on an ephemeral container.
ENV PYTHONDONTWRITEBYTECODE=1 \
    VIRTUAL_ENV=/home/scu/.venv

# Ensures that the python and pip executables used in the image will be those from our virtualenv
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

EXPOSE 8000

# -------------------------- Build stage -------------------
# Installs build/package management tools and third party dependencies

FROM base as build

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    git --version; \
    node --version ; \
    python --version

RUN python -m venv "${VIRTUAL_ENV}"

RUN pip --no-cache-dir install --upgrade \
    pip~=23.0 \
    wheel \
    setuptools

WORKDIR /build

COPY --chown=scu:scu client client
COPY --chown=scu:scu server server
RUN cd server && \
    pip --no-cache-dir install -r requirements.txt && \
    pip --no-cache-dir install .


# --------------------------Production stage -------------------
FROM base as production

ENV PYTHONOPTIMIZE=TRUE

WORKDIR /home/scu

COPY --chown=scu:scu --from=build ${VIRTUAL_ENV} ${VIRTUAL_ENV}

ENV CLIENT_INDEX_PATH=/home/scu/client/index.html
COPY --chown=scu:scu --from=build /build/client/source-output client


CMD ["uvicorn", "iec62209_service.main:the_app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "warning"]

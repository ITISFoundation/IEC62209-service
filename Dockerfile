FROM python:3.10-slim-buster as base

LABEL maintainer=pcrespov

RUN apt-get update && apt-get install -y --no-install-recommends \
        nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && node --version

ENV SC_USER_ID=8004 \
    SC_USER_NAME=scu \
    LANG=C.UTF-8 \
    PYTHONDONTWRITEBYTECODE=1 \
    VIRTUAL_ENV=/home/scu/.venv \
    PATH="${VIRTUAL_ENV}/bin:$PATH"

RUN adduser \
    --uid ${SC_USER_ID} \
    --disabled-password \
    --gecos "" \
    --shell /bin/sh \
    --home /home/${SC_USER_NAME} \
    ${SC_USER_NAME}


EXPOSE 8000

# -------------------------- Build stage -------------------
FROM base as build

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        git\
    && rm -rf /var/lib/apt/lists/* \
    && git --version \
    && node --version \
    && python --version


RUN python -m venv "${VIRTUAL_ENV}"
RUN which pip \
    && pip --no-cache-dir install --upgrade \
        pip~=23.0 \
        wheel \
        setuptools


WORKDIR /build

COPY --chown=scu:scu client client
COPY --chown=scu:scu server server

RUN cd server \
    && pip --no-cache-dir install -r requirements.txt \
    && pip --no-cache-dir install .


# --------------------------Production stage -------------------
FROM base as production

ENV PYTHONOPTIMIZE=TRUE
ENV CLIENT_INDEX_PATH=/home/scu/client/index.html

WORKDIR /home/scu

COPY --chown=scu:scu --from=build ${VIRTUAL_ENV} ${VIRTUAL_ENV}
COPY --chown=scu:scu --from=build /build/client/source-output client


CMD ["uvicorn", "iec62209_service.main:the_app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "warning"]

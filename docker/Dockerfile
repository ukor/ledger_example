
FROM node:alpine3.20 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /srv

COPY package*.json ./

COPY . .

FROM base AS dev-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=dev-deps /srv/node_modules /srv/node_modules
COPY --from=build /srv/dist /srv/dist

COPY Makefile Makefile

# RUN pnpm install

EXPOSE 3012

CMD pnpm run start:dev

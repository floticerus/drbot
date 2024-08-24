# drbot

[![Sponsor][sponsor-badge]][sponsor]
[![TypeScript version][ts-badge]][typescript-5-4]
[![Node.js version][nodejs-badge]][nodejs]
[![GPLv3+][license-badge]][license]
[![Build Status - GitHub Actions][gha-ci-badge]][gha-ci]
[![Docker Hub Status - GitHub Actions][gha-dockerhub-badge]][gha-dockerhub]

A pretty ok music bot.

## Getting Started

### With docker

I use `docker compose` to make life easy, but you don't have to.

Configure a `.env` file in the project root directory. You can copy `example.env` and fill it out.

#### Official images

Official images are hosted on Docker Hub under [kmvf/drbot](https://hub.docker.com/r/kmvf/drbot). Currently images are built for `linux/amd64` and `linux/arm64`.

To run the bot:
```shell
sudo docker compose up
```

To auto-restart in daemon mode:
```shell
sudo docker compose up -d
```

#### Building your own

In case you're running on different architecture, or just want to build it, a `build.yaml` file is here for convenience.

Just run:
```shell
sudo docker compose --file build.yaml up --build
```

#### Redis

A Redis container with Redisearch is included in the default `compose.yaml` and `build.yaml`. If you prefer to use your own, remove it and provide your own `REDIS_URL` environment variable.

-----

### Without docker

You can run the bot without docker, it lives in the `/bot` folder.

#### Installation

```shell
npm ci
```

#### Building

To build for the current environment:
```shell
npm run build
```

To watch for changes:
```shell
npm run build:watch
```

A release specific build, without js map files, etc:
```shell
npm run build:release
```

#### Configuring

Environment variables are used to configure the bot.

Copy `bot/example.env` to `bot/.env`, and fill in your own values.

Note that `bot/.env` gets a `REDIS_URL` variable, while the docker specific `.env` file does not. This is because the docker compose setup creates its own Redis instance.

#### Starting

To start the bot:
```shell
npm run start
```

#### Redis

If you're not using docker, you'll have to provide your own Redis server with Redisearch installed. Pass the url with the `REDIS_URL` environment variable.

### Environment variables

There is an `example.env` file to use with the default `compose.yaml` and `build.yaml` docker compose files.

Create a file called `.env` in the root directory of the project, copy `example.env` and replace with your own values.

```dotenv
# user id of the bot owner (you probably! look up how to get your id)
DISCORD_OWNER=123456789098765432
# bot application id
DISCORD_APPLICATION_ID=1234567890987654321
# bot token
DISCORD_TOKEN=MfeGhjewwejqwGwqf72Ghfe1gF.mA7g0q.f8FuHFgwkjfeu436Hwgq1Fh8A9FE_a08fg3gH1

# path to audio files
MEDIA_PATH=/path/to/audio/files

# maybe turn this off on big libraries that don't change?
SCAN_MEDIA_ON_START=true

# should we watch MEDIA_PATH for updates?
WATCH_MEDIA=true

# how many files can we access at once - helps prevent crashes on large libraries and not-great hardware
DISK_ACCESS_CONCURRENCY=50

# FOR NON-DOCKER/DIRECT NODEJS - url pointing to a redis server
REDIS_URL=redis://some.redis.server:6379
```

## Backers & Sponsors

Support this project by becoming a [sponsor][sponsor].

## License

Licensed under the GNU GENERAL PUBLIC LICENSE. See the [LICENSE](https://github.com/floticerus/drbot/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-5.4-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2020.9-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v20.x/docs/api/
[gha-ci-badge]: https://github.com/floticerus/drbot/actions/workflows/nodejs.yaml/badge.svg
[gha-ci]: https://github.com/floticerus/drbot/actions/workflows/nodejs.yaml
[gha-dockerhub-badge]: https://github.com/floticerus/drbot/actions/workflows/dockerhub.yaml/badge.svg
[gha-dockerhub]: https://github.com/floticerus/drbot/actions/workflows/dockerhub.yaml
[typescript]: https://www.typescriptlang.org/
[typescript-5-4]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-4/
[license-badge]: https://img.shields.io/badge/license-GPLv3+-blue.svg
[license]: https://github.com/floticerus/drbot/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/floticerus
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[gh-actions]: https://github.com/features/actions
[repo-template-action]: https://github.com/floticerus/drbot/generate
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[sindresorhus-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[nodejs-esm]: https://nodejs.org/docs/latest-v16.x/api/esm.html
[ts47-esm]: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#esm-nodejs
[editorconfig]: https://editorconfig.org

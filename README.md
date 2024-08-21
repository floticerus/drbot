# drbot

[![Sponsor][sponsor-badge]][sponsor]
[![TypeScript version][ts-badge]][typescript-5-4]
[![Node.js version][nodejs-badge]][nodejs]
[![GPLv3+][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

A pretty ok music bot.

## Getting Started

### To docker or not to docker?

#### To docker

I use `docker compose` to make life easy, but you don't have to.

1. Configure a `.env` file in the project root directory. You can copy `example.env` and fill it out.
2. Run `docker compose up --build` (add a `-d` if you want it to auto-restart with daemon mode)

#### To not docker

You can run the bot without docker, it lives in the `/bot` folder.

### Download latest release

Release? There is no release! 😤

## Additional Information

## Backers & Sponsors

Support this project by becoming a [sponsor][sponsor].

## License

Licensed under the GNU GENERAL PUBLIC LICENSE. See the [LICENSE](https://github.com/floticerus/drbot/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-5.4-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2020.9-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v20.x/docs/api/
[gha-badge]: https://github.com/floticerus/drbot/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/floticerus/drbot/actions/workflows/nodejs.yml
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

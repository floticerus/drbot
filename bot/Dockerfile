# build container
# FROM node:20-alpine AS build
FROM oven/bun:alpine AS build
WORKDIR /src

# install build deps on alpine - build base and python3 are needed to compile libsodium (via sodium-native)
RUN apk add --no-cache build-base python3 nodejs

# copy both package.json and bun.lock
COPY ./package.json ./bun.lock ./

# build the app in production mode
# ENV NODE_ENV="production"

# install npm modules with `npm ci`. package-lock.json is required for this.
# RUN npm ci --omit=dev --no-audit

RUN bun i --omit=dev --frozen-lockfile --verbose

# copy the entire app
COPY ./ .

# build the release version of the bot
RUN bun run build:release

# runtime container
# note we could make this smaller by using `FROM alpine` and generating a single executable app above.
# i'm not sure how feasible a `FROM scratch` container would be here, because of ffmpeg.
# FROM node:20-alpine
FROM oven/bun:alpine
WORKDIR /drbot

# install runtime deps on alpine - ffmpeg is used to convert files into opus format
RUN apk add --no-cache ffmpeg

# copy the working dir from `build` stage, because it contains everything we need (including compiled libsodium)
COPY --from=build /src ./

# start the app in production mode
# ENV NODE_ENV="production"

USER bun
ENTRYPOINT ["bun", "run", "build/src/main.js"]
# start the app!
# CMD ["bun", "run", "start"]

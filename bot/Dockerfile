# build container
FROM node:20-alpine AS build
WORKDIR /src

# install build deps on alpine - build base and python3 are needed to compile libsodium (via sodium-native)
RUN apk add --no-cache build-base python3

# copy both package.json and package-lock.json
COPY ./package*.json ./

# build the app in production mode
ENV NODE_ENV="production"

# install npm modules with `npm ci`. package-lock.json is required for this.
RUN npm ci --omit=dev

# copy the entire app
COPY ./ .

# build the release version of the bot
RUN npm run build:release

# runtime container
FROM node:20-alpine
WORKDIR /drbot

# install runtime deps on alpine - ffmpeg is used to convert files into opus format
RUN apk add --no-cache ffmpeg

# copy the working dir from `build` stage, because it contains everything we need (including compiled libsodium)
COPY --from=build /src ./

# start the app in production mode
ENV NODE_ENV="production"

# start the app!
CMD ["npm", "run", "start"]

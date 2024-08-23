FROM node:20-alpine AS build
WORKDIR /src

# install build deps on alpine
RUN apk add --no-cache build-base python3

# copy both package.json and package-lock.json
COPY ./package*.json ./

# install npm modules with `npm ci`. package-lock.json is required for this.
# always run this in development mode so it installs devDependencies
RUN NODE_ENV=development npm ci

# copy the entire app
COPY ./ .

# build the app in production mode
RUN NODE_ENV=production npm run build:release

FROM node:20-alpine
WORKDIR /drbot

# install runtime deps on alpine
RUN apk add --no-cache ffmpeg

# copy the working dir from `build` stage, because it contains everything we need (including compiled libsodium)
COPY --from=build /src ./

# start the app in production mode
ENV NODE_ENV=production

# start the app!
CMD ["npm", "run", "start"]

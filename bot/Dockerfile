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
RUN npm ci --omit=dev --no-audit

# copy the entire app
COPY ./ .

# build the release version of the bot
RUN npm run build:release
# build single executable application
RUN npm rebuild esbuild
RUN npm run esbuild
RUN node --experimental-sea-config sea-config.json
RUN cp $(command -v node) drbot
# RUN codesign --remove-signature drbot
RUN npx postject drbot NODE_SEA_BLOB ./build/sea-prep.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
# RUN codesign --sign - drbot

# runtime container
# note we could make this smaller by using `FROM alpine` and generating a single executable app above.
# i'm not sure how feasible a `FROM scratch` container would be here, because of ffmpeg.
FROM alpine
WORKDIR /drbot

# install runtime deps on alpine - ffmpeg is used to convert files into opus format
RUN apk add --no-cache ffmpeg

# copy the working dir from `build` stage, because it contains everything we need (including compiled libsodium)
COPY --from=build /src/drbot ./

# start the app in production mode
ENV NODE_ENV="production"

# start the app!
ENTRYPOINT ["./drbot"]
#CMD ["npm", "run", "start"]

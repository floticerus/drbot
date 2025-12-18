# build container
FROM oven/bun:alpine AS build
WORKDIR /src

# install build deps on alpine - build base and python3 are needed to compile libsodium (via sodium-native)
# we need nodejs for node-gyp stuff apparently. maybe there's a way to install a smaller package.
RUN apk add --no-cache build-base python3 nodejs

# copy both package.json and bun.lock
COPY ./package.json ./bun.lock ./

# build the app in production mode
ENV NODE_ENV="production"

# install modules. use verbose so we can see what's happening.
RUN bun i --omit=dev --frozen-lockfile --verbose

# copy the entire app
COPY ./ .

# build the bun version of the bot. this creates a single file at build/output.
# @snazzah/davey can't be found when we do this. :(
# RUN bun run build

# runtime container
# distroless would be nice. currently distroless is failing with @snazzah/davey.
FROM oven/bun:alpine
# since we're using the default bun user, use home folder as working dir
WORKDIR /home/bun/drbot

# install runtime deps on alpine - ffmpeg is used to convert files into opus format.
# we could use ffmpeg-static module instead, but we're stuck with alpine atm anyway.
RUN apk --no-cache add ffmpeg

# copy the working dir from `build` stage, because it contains everything we need (including compiled libsodium)
COPY --from=build /src ./
# COPY --from=build /src/node_modules /src/src .
# COPY --from=build /src/build/output .

# start the app in production mode
ENV NODE_ENV="production"

# use the bun user i guess
USER bun

# start the app!
ENTRYPOINT ["bun", "run", "./src/main.ts"]

# what we would use with single file output
# ENTRYPOINT ["./output"]

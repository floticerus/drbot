# build container
FROM oven/bun:alpine AS build
WORKDIR /bot

# install build deps on alpine. we need nodejs for node-gyp stuff apparently.
RUN apk add --no-cache nodejs

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
# scratch or distroless would be nice. currently distroless is failing with @snazzah/davey.
FROM oven/bun:alpine
# scratch is failing with a not found error after attempting to execute the built file
# FROM scratch
# since we're using the default bun user, use home folder as working dir
WORKDIR /home/bun/drbot

# install runtime deps on alpine - ffmpeg is used to convert files into opus format.
# we're opting to use ffmpeg-static module instead, but this is how to add ffmpeg here.
# RUN apk --no-cache add ffmpeg

# copy the working dir from `build` stage, because it contains everything we need
COPY --from=build /bot ./
# COPY --from=build /bot/build/drbot .

# start the app in production mode
ENV NODE_ENV="production"

# use the bun user i guess
USER bun

# run the ts files directly with bun
ENTRYPOINT ["bun", "run", "./src/main.ts"]

# what we would use with single file output.
# on scratch this is failing with not found, even though it's 100% there.
# ENTRYPOINT ["./drbot"]

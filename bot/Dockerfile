FROM node:22-alpine

# install deps on alpine
RUN apk update && apk add \
#    for compiling. only used for sodium-native at the moment.
#    this makes the image quite large but native sodium sounds better than js sodium :'(
    build-base python3 \
#    install ffmpeg for ffmpeg
    ffmpeg

# copy both package.json and package-lock.json
COPY ./package*.json ./

# install npm modules with `npm ci`. package-lock.json is required for this.
# always run this in development mode so it installs devDependencies
RUN NODE_ENV=development npm ci

# copy the entire app
COPY ./ .

# build and start the app in production mode
ENV NODE_ENV=production

# build the app
RUN npm run build:release

# start the app!
CMD ["npm", "run", "start"]

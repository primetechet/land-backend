# Base image
FROM node:22.18.0

# Create app directory
WORKDIR /usr/src/app
RUN yarn -v 
# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install

COPY prisma ./prisma/

RUN yarn prisma generate

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN yarn run build

ENV APP_PORT=3000

EXPOSE ${APP_PORT}

# Start the server using the production build
CMD [ "yarn", "start" ]
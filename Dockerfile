# Server dockerfile
FROM node:16-alpine
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY ./server ./server
# RUN mkdir -p ./thirteam-ui/src/utilities
COPY ../thirteam-ui/src/utilities ./thirteam-ui/src/utilities

WORKDIR /app/server

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci

ENV NODE_ENV production
ENV PORT=9898

EXPOSE $PORT

CMD [ "node", "index.js" ]

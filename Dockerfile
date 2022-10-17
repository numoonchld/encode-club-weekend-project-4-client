FROM node:16.15.1-bullseye-slim as build-step

RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
# COPY --chown=node:node . .
COPY --chown=node:node ./package.json /home/app/

USER node

RUN npm run install

# EXPOSE 4200

# CMD ["ng", "serve"]

RUN npm run build --prod

FROM nginx:1.20.1

COPY --from=build-step /home/app/dist/encode-club-weekend-project-4-client /usr/share/nginx/html

EXPOSE 4200:80

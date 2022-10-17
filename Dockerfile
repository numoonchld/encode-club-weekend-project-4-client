FROM node:16.15.1-bullseye-slim

RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
COPY --chown=node:node . .

USER node

RUN npm ci

EXPOSE 4200

CMD ["ng", "serve"]

FROM node:22.16-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run tsc

EXPOSE 4000

CMD ["node", "build/index.js"]

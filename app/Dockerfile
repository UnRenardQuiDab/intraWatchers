FROM node:23 AS build

WORKDIR /app

COPY . .

RUN npm install

ARG REACT_APP_BACKEND_URL
ARG REACT_APP_NEWBIE_COUNT
ARG REACT_APP_LIFEGUARD_COUNT

RUN npm run build

FROM node:23

WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 3000

RUN npm install -g serve

CMD [ "serve", "-s", "build" ]

FROM node:lts-stretch-slim
WORKDIR /usr/src/app
COPY . .
RUN ls -a
RUN npm install --location=global
RUN npm install --location=global typescript
RUN npm install -g ts-node
CMD ["node", "build"]


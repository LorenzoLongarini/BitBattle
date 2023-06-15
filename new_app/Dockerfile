FROM node:lts-stretch-slim
WORKDIR /usr/src/app
COPY . .
RUN npm install --location=global
RUN npm install --location=global typescript
RUN npm install -g ts-node
CMD ["ts-node", "index.ts"]

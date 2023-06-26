FROM node:lts-stretch-slim
WORKDIR /usr/src/app
RUN mkdir pdf
COPY . .
RUN npm install --location=global
RUN npm install --location=global typescript
RUN npm install --location=global ts-node
CMD ["ts-node", "index.ts"]
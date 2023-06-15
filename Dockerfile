FROM node:lts-stretch-slim
WORKDIR /usr/src/app
COPY . .
RUN ls -a
RUN npm install --location=global npm
RUN npm install --location=global typescript
RUN tsc
# RUN npm run build
CMD ["node", "main.js"]


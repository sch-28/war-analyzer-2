FROM node:16.14.2-alpine 
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
USER node
CMD ["node", "build"]

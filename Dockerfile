FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install -g @babel/cli @babel/core@7.25.7 @babel/preset-env@7.25.7
COPY . .
RUN chown -R node /usr/src/app
USER node
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "production"]

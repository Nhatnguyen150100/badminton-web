FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mv node_modules ../
RUN npm install -g @babel/cli @babel/core @babel/preset-env @babel/node
COPY . .
RUN chown -R node /usr/src/app
USER node
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "production"]

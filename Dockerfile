FROM node:6.11

# setup server directory
RUN mkdir /srv/crn-server
WORKDIR /srv/crn-server

# install server app
ADD . /srv/crn-server
RUN npm install

# start server
CMD ["node", "/srv/crn-server/index.js"]

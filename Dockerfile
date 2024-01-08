FROM node:20.10
WORKDIR /opt/app
COPY . .
RUN npm install
EXPOSE 8000
CMD [ "npm", "start", "--host", "0.0.0.0" ]

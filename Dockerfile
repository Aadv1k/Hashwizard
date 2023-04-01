FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

ENV PORT=3000
EXPOSE 3000 

CMD ["npm", "start", "--", "--no-dump"]

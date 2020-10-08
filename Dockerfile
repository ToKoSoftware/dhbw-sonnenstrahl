FROM node:10 AS ui-build
WORKDIR /usr/src/frontend
COPY frontend/ ./frontend/
RUN cd frontend && npm install @angular/cli && npm install && npm run build

FROM node:10 AS server-build
WORKDIR /usr/src/server/
COPY --from=ui-build /usr/src/frontend/frontend/dist ./frontend/dist
COPY server/package*.json ./

RUN npm install -g tsc
RUN npm install
COPY server/ .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]

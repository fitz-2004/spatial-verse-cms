FROM node:22-bookworm-slim AS backend

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/ ./
# Some Apostrophe import tasks read the original frontend media by this path.
COPY frontend/public/ /app/frontend/public/

RUN mkdir -p data public/uploads

ENV NODE_ENV=development \
  APOS_EXTERNAL_FRONT_KEY=dev \
  APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite \
  PORT=3000

EXPOSE 3000

CMD [ "npm", "run", "dev" ]


FROM node:22-bookworm-slim AS frontend

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ENV NODE_ENV=development \
  APOS_EXTERNAL_FRONT_KEY=dev \
  APOS_HOST=http://backend:3000 \
  PORT=4321

EXPOSE 4321

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]

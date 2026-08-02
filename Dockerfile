FROM node:18-alpine AS builder
WORKDIR /build

COPY modules/proto/ ./proto/
COPY modules/shared/ ./shared/

COPY modules/incidents/package*.json ./incidents/
RUN cd incidents && npm install --ignore-scripts

COPY modules/incidents/ ./incidents/
RUN cd incidents && npm run build

FROM node:18-alpine
WORKDIR /app

COPY modules/incidents/package*.json ./incidents/
RUN cd incidents && npm install --omit=dev --ignore-scripts

COPY --from=builder /build/incidents/dist ./incidents/dist
COPY --from=builder /build/proto ./incidents/dist/proto

WORKDIR /app/incidents
EXPOSE 4004
CMD ["node", "dist/incidents/src/main.js"]

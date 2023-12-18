FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npx prisma generate
ENV NEXT_PUBLIC_BLOG_TOKEN=${NEXT_PUBLIC_BLOG_TOKEN}
ENV NEXT_PUBLIC_BLOG_API=${NEXT_PUBLIC_BLOG_API}
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]
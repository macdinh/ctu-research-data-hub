FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY server.mjs ./
COPY public ./public
COPY data ./data
COPY sample_data ./sample_data
COPY supabase ./supabase

EXPOSE 3000

CMD ["node", "server.mjs"]

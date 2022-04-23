FROM denoland/deno:1.20.6

RUN apt update && apt install -y curl

WORKDIR /app
USER deno
COPY src/deps.ts .
RUN deno cache deps.ts
COPY src .
RUN deno cache main.ts

CMD ["run", "-A", "main.ts"]
# done run -A main.ts

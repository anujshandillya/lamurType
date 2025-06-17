FROM golang:1.24-alpine

WORKDIR /app-b

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod downloadAdd commentMore actions

COPY . .

EXPOSE 3000

CMD ["air", "-c", ".air.toml"]
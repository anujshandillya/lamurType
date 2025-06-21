FROM golang:1.24-alpine

WORKDIR /app

RUN go install github.com/air-verse/air@latest

# Copy go.mod first
COPY go.mod ./
# Initialize the go.sum file if it doesn't exist
RUN touch go.sum
# Download dependencies
RUN go mod download

COPY . .

EXPOSE 3000

CMD ["air", "-c", ".air.toml"]
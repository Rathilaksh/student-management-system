.PHONY: install dev dev-client dev-server build start docker-up docker-down deploy clean reset refresh

install:
	npm install

dev:
	npm run dev

dev-client:
	npm run dev:client

dev-server:
	npm run dev:server

build:
	npm run build

start:
	npm start

docker-up:
	docker compose up --build

docker-down:
	docker compose down

deploy: build start

clean:
	rm -rf client/dist node_modules client/node_modules server/node_modules

reset: clean install

refresh: reset

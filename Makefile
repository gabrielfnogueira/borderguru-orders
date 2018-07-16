up:
	docker-compose up -d

db-restore:
	docker-compose exec mongo mongorestore -d borderguru /data/files/borderguru

tests: up
	docker-compose exec borderguru-order-api npm run test

stop:
	docker-compose stop

destruct: stop
	docker-compose rm -f

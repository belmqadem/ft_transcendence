up:
	@docker compose up --build -d

down:
	@docker compose down -v
	@rm -fv server/auth-service/auth.db.sqlite
	@rm -fv server/relationships-service/relationships.db.sqlite 
	@rm -fv server/profile-service/profile.db.sqlite
	@rm -fv server/notifications-service/notifications.db.sqlite
	@rm -fv server/chat-service/messages.db.sqlite
	@rm -fv server/game-service/db/game.db.sqlite

re : down up

logs:
	@docker compose logs -f

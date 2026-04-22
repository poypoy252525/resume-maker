
docker compose -f docker-compose.dev.yml up --build -d

cd server

venv/scripts/activate

python manage.py runserver

# docker compose -f docker-compose.dev.yml exec server clear
# docker compose -f docker-compose.dev.yml exec -it server sh


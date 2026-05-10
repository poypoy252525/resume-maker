git fetch origin
git reset --hard origin/main

sudo docker compose -f docker-compose.yml down
sudo docker compose -f docker-compose.yml up --build -d
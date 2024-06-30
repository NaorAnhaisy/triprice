cd /triprice/ && git pull && docker system prune --all --force && docker build . -t my-base-image:nx-base && docker-compose up --build -d

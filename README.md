As we have separate repositories but we want to use docker on both of them we need to follow some steps

Create a network between two separate repository in order to permit communication between them :
docker network create <name>
After that you need to have in each docker-compose.yml the following lines of code à the end of the file

networks:
  <name>:
    external: true

And 
networks:
  - <name>
As last lines of each services

You can check if the network exist with:
docker network ls

And inspect more closely with:
docker inspect network <name>
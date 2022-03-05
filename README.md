# IDEATION_BACKEND
## Run locally

    1. git clone https://github.com/SARQUIS-BOUTROS/IDEATION_BACKEND.git

    2. cd IDEATION_BACKEND
    3. npm install
    4. npm run dev

You can test endpoints through Postman for example. Some endpoints requiere login.
Mongo Database don't require instalation because is cloud at moment

### Endpoints documentation
You can see endpoints documentation in *localhost:3000/docs* 
swagger.json is building through instruction *npm run generate*

### Testing

If you want to run testing, review *Makefile* . There you can see all the test runners. 
Execution example: 

    make challenge
## Docker
run  *docker-compose up* or *docker-compose up --build*
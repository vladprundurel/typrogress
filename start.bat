cd client
start "" http://localhost:4200
start cmd.exe /k "ng serve"

cd ../server
start cmd.exe /k "nodemon index"

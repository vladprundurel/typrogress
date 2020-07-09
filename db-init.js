db.createUser({
    user: "user",
    pwd: "secretPassword",
    roles: [ { role: "dbOwner", db: "test" } ]
})

db.users.insert({
    name: "user"
})
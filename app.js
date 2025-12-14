const express = require("express")
const app = express()

app.use(express.json())

const { createUser, getUsers } = require("./userController")

app.post("/user", createUser)
app.get("/users", getUsers)

app.listen(3000, () => {
  console.log("Server running")
})

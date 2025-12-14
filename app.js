const express = require("express")
const app = express()

app.use(express.json())

let users = []

app.post("/user", (req, res) => {
  const user = req.body
  user.id = Math.random()        // ❌ bad id
  users.push(user)               // ❌ no validation
  res.send(user)                 // ❌ no status code
})

app.get("/users", (req, res) => {
  res.send(users)                // ❌ no error handling
})

app.listen(3000, () => {
  console.log("Server started")
})

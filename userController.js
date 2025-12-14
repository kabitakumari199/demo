let users = []

exports.createUser = (req, res) => {
  const user = req.body

  user.id = Math.random()   // ❌ bad id
  users.push(user)          // ❌ no validation

  res.send(user)            // ❌ no status code
}

exports.getUsers = (req, res) => {
  res.send(users)           // ❌ no error handling
}

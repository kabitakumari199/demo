const user = {
  id: Date.now().toString(),
  name,
  email
}

users.push(user)
res.status(201).json(user)


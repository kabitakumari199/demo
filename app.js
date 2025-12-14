const { v4: uuidv4 } = require('uuid');

// Add this to your route handler (e.g., app.post('/users', ...))
app.post('/users', (req, res) => {
  const user = req.body;
  
  // Check if user object exists
  if (!user || typeof user !== 'object') {
    return res.status(400).json({ error: 'Invalid user object' });
  }
  
  // Validate required fields
  if (!user.name || typeof user.name !== 'string' || user.name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }
  
  if (!user.email || typeof user.email !== 'string') {
    return res.status(400).json({ error: 'Email is required and must be a string' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Check if users array exists
  if (!Array.isArray(users)) {
    return res.status(500).json({ error: 'Internal server error: users collection not initialized' });
  }
  
  // Check for duplicate email
  if (users.some(u => u.email === user.email)) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }
  
  // Generate unique ID using UUID
  user.id = uuidv4();
  
  // Add user to collection
  users.push(user);
  
  // Return created user with 201 status
  return res.status(201).json(user);
});
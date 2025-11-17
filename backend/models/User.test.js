// Jest test for backend User model
const User = require('../models/User');

describe('User Model', () => {
  it('should create a user with required fields', () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
    });
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('hashedpassword');
  });

  it('should default isActive to true', () => {
    const user = new User({
      username: 'activeuser',
      email: 'active@example.com',
      password: 'hashedpassword',
    });
    expect(user.isActive).toBe(true);
  });
});

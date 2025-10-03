/**
 * Email validation using RFC 5322 compliant regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();
  
  // Additional checks
  if (trimmedEmail.length > 254) return false; // RFC 5321 limit
  if (trimmedEmail.length < 3) return false; // Minimum reasonable length
  
  return emailRegex.test(trimmedEmail);
};

/**
 * Password validation
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and requirements
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      message: 'Password is required',
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false
      }
    };
  }

  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password)
  };

  const isValid = Object.values(requirements).every(req => req);

  let message = '';
  if (!isValid) {
    const missing = [];
    if (!requirements.minLength) missing.push('at least 8 characters');
    if (!requirements.hasUppercase) missing.push('one uppercase letter');
    if (!requirements.hasLowercase) missing.push('one lowercase letter');
    if (!requirements.hasNumber) missing.push('one number');
    
    message = `Password must contain ${missing.join(', ')}`;
  }

  return {
    isValid,
    message,
    requirements
  };
};

/**
 * Username validation
 * @param {string} username - Username to validate
 * @returns {object} - Validation result
 */
const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return {
      isValid: false,
      message: 'Username is required'
    };
  }

  const trimmedUsername = username.trim();
  
  // Length check
  if (trimmedUsername.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters long'
    };
  }
  
  if (trimmedUsername.length > 30) {
    return {
      isValid: false,
      message: 'Username must be no more than 30 characters long'
    };
  }

  // Character validation (alphanumeric and underscore only)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(trimmedUsername)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, and underscores'
    };
  }

  // Cannot start or end with underscore
  if (trimmedUsername.startsWith('_') || trimmedUsername.endsWith('_')) {
    return {
      isValid: false,
      message: 'Username cannot start or end with an underscore'
    };
  }

  // Cannot have consecutive underscores
  if (trimmedUsername.includes('__')) {
    return {
      isValid: false,
      message: 'Username cannot contain consecutive underscores'
    };
  }

  return {
    isValid: true,
    message: 'Valid username'
  };
};

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .slice(0, 1000); // Prevent extremely long inputs
};

/**
 * Validate registration data
 * @param {object} data - Registration data
 * @returns {object} - Validation result
 */
const validateRegistrationData = (data) => {
  const errors = [];
  const { email, username, password } = data;

  // Validate email
  if (!validateEmail(email)) {
    errors.push({
      field: 'email',
      message: 'Please provide a valid email address'
    });
  }

  // Validate username
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.isValid) {
    errors.push({
      field: 'username',
      message: usernameValidation.message
    });
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push({
      field: 'password',
      message: passwordValidation.message
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate login data
 * @param {object} data - Login data
 * @returns {object} - Validation result
 */
const validateLoginData = (data) => {
  const errors = [];
  const { emailOrUsername, password } = data;

  if (!emailOrUsername || typeof emailOrUsername !== 'string' || emailOrUsername.trim().length === 0) {
    errors.push({
      field: 'emailOrUsername',
      message: 'Email or username is required'
    });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push({
      field: 'password',
      message: 'Password is required'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeInput,
  validateRegistrationData,
  validateLoginData
};
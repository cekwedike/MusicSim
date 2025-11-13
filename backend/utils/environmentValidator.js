/**
 * Environment Configuration Validator
 * Validates that all required environment variables are set and properly formatted
 */

const crypto = require('crypto');

// Required environment variables for the application
const REQUIRED_ENV_VARS = {
  // Database Configuration
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL database connection URL',
    validator: (value) => value.startsWith('postgres://') || value.startsWith('postgresql://'),
    errorMessage: 'DATABASE_URL must be a valid PostgreSQL connection string'
  },

  // Supabase Configuration  
  SUPABASE_URL: {
    required: true,
    description: 'Supabase project URL',
    validator: (value) => value.startsWith('https://') && value.includes('supabase.co'),
    errorMessage: 'SUPABASE_URL must be a valid Supabase URL'
  },

  SUPABASE_SERVICE_KEY: {
    required: true,
    description: 'Supabase service role key for backend operations',
    validator: (value) => value.length > 100, // Service keys are long
    errorMessage: 'SUPABASE_SERVICE_KEY must be a valid service role key'
  },

  // Webhook Security (Optional in development)
  SUPABASE_WEBHOOK_SECRET: {
    required: process.env.NODE_ENV === 'production',
    description: 'Secret for verifying Supabase webhook signatures',
    validator: (value) => !value || value.length >= 32, // Should be strong if provided
    errorMessage: 'SUPABASE_WEBHOOK_SECRET should be at least 32 characters for security'
  },

  // Server Configuration
  PORT: {
    required: false,
    description: 'Server port (defaults to 3001)',
    validator: (value) => !value || (!isNaN(value) && parseInt(value) > 0 && parseInt(value) <= 65535),
    errorMessage: 'PORT must be a valid port number (1-65535)'
  },

  // Environment Type
  NODE_ENV: {
    required: false,
    description: 'Application environment',
    validator: (value) => !value || ['development', 'production', 'test'].includes(value),
    errorMessage: 'NODE_ENV must be one of: development, production, test'
  }
};

/**
 * Validate all required environment variables
 * @returns {object} Validation result with errors and warnings
 */
function validateEnvironment() {
  const errors = [];
  const warnings = [];
  const info = [];

  console.log('🔍 Validating environment configuration...');

  // Check each required environment variable
  for (const [varName, config] of Object.entries(REQUIRED_ENV_VARS)) {
    const value = process.env[varName];

    // Check if required variable is missing
    if (config.required && !value) {
      errors.push({
        variable: varName,
        message: `Missing required environment variable: ${varName}`,
        description: config.description,
        severity: 'error'
      });
      continue;
    }

    // Check if optional variable is missing (warning only)
    if (!config.required && !value) {
      if (varName === 'SUPABASE_WEBHOOK_SECRET' && process.env.NODE_ENV === 'development') {
        warnings.push({
          variable: varName,
          message: `${varName} not set - webhook verification disabled in development`,
          description: config.description,
          severity: 'warning'
        });
      }
      continue;
    }

    // Validate format if value is provided
    if (value && config.validator && !config.validator(value)) {
      errors.push({
        variable: varName,
        message: config.errorMessage || `Invalid format for ${varName}`,
        description: config.description,
        severity: 'error'
      });
      continue;
    }

    // Variable is valid
    info.push({
      variable: varName,
      message: `✓ ${varName} configured correctly`,
      description: config.description,
      severity: 'info'
    });
  }

  // Additional security checks
  performSecurityChecks(warnings, errors);

  // Display results
  displayValidationResults(errors, warnings, info);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    info
  };
}

/**
 * Perform additional security checks
 */
function performSecurityChecks(warnings, errors) {
  // Check if webhook secret is strong enough in production
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (process.env.NODE_ENV === 'production' && webhookSecret) {
    if (webhookSecret.length < 64) {
      warnings.push({
        variable: 'SUPABASE_WEBHOOK_SECRET',
        message: 'Webhook secret should be at least 64 characters in production',
        description: 'Longer secrets provide better security',
        severity: 'warning'
      });
    }

    // Check for weak patterns
    if (/^(password|secret|key|123|abc)/i.test(webhookSecret)) {
      errors.push({
        variable: 'SUPABASE_WEBHOOK_SECRET',
        message: 'Webhook secret appears to use a weak pattern',
        description: 'Use a cryptographically strong random string',
        severity: 'error'
      });
    }
  }

  // Check database URL for security
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.includes('password') && !dbUrl.includes('localhost')) {
    if (process.env.NODE_ENV === 'production' && dbUrl.includes('@localhost')) {
      warnings.push({
        variable: 'DATABASE_URL',
        message: 'Using localhost database in production',
        description: 'Consider using a managed database service',
        severity: 'warning'
      });
    }
  }
}

/**
 * Display validation results in a formatted way
 */
function displayValidationResults(errors, warnings, info) {
  console.log('\\n' + '='.repeat(60));
  console.log('📋 ENVIRONMENT VALIDATION RESULTS');
  console.log('='.repeat(60));

  // Show errors
  if (errors.length > 0) {
    console.log('\\n❌ ERRORS:');
    errors.forEach(error => {
      console.log(`   • ${error.message}`);
      console.log(`     ${error.description}`);
    });
  }

  // Show warnings  
  if (warnings.length > 0) {
    console.log('\\n⚠️  WARNINGS:');
    warnings.forEach(warning => {
      console.log(`   • ${warning.message}`);
      console.log(`     ${warning.description}`);
    });
  }

  // Show successful configs (only in development)
  if (process.env.NODE_ENV === 'development' && info.length > 0) {
    console.log('\\n✅ CONFIGURED:');
    info.forEach(item => {
      console.log(`   • ${item.message}`);
    });
  }

  console.log('\\n' + '='.repeat(60));

  if (errors.length === 0) {
    console.log('✅ Environment validation passed!');
  } else {
    console.log(`❌ Environment validation failed with ${errors.length} error(s)`);
  }

  console.log('='.repeat(60) + '\\n');
}

/**
 * Generate a secure webhook secret
 */
function generateWebhookSecret() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate environment and exit if critical errors found
 */
function validateEnvironmentOrExit() {
  const result = validateEnvironment();

  if (!result.isValid) {
    console.error('\\n💥 STARTUP ABORTED: Critical environment configuration errors found.');
    console.error('\\nTo fix these issues:');
    console.error('1. Create/update your .env file with the missing variables');
    console.error('2. Ensure all values are properly formatted');
    console.error('3. Restart the server after fixing the configuration');
    
    if (process.env.NODE_ENV === 'production') {
      console.error('\\n🚨 PRODUCTION DEPLOYMENT BLOCKED');
      console.error('Environment validation must pass before deploying to production.');
    }

    if (result.errors.some(e => e.variable === 'SUPABASE_WEBHOOK_SECRET')) {
      console.error('\\n💡 To generate a secure webhook secret, run:');
      console.error('   node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    }

    process.exit(1);
  }

  // Show summary for successful validation
  if (result.warnings.length > 0) {
    console.log(`⚠️  ${result.warnings.length} warning(s) found - review recommended`);
  } else {
    console.log('🎉 All environment checks passed!');
  }

  return result;
}

module.exports = {
  validateEnvironment,
  validateEnvironmentOrExit,
  generateWebhookSecret,
  REQUIRED_ENV_VARS
};
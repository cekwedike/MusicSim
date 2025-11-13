#!/usr/bin/env node
/**
 * MusicSim API Endpoint Validation Script
 * 
 * This script validates that all defined endpoints are properly documented
 * in Swagger and accessible in both development and production environments.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const DEV_BASE_URL = 'http://localhost:3001';
const PROD_BASE_URL = 'https://musicsim-backend.onrender.com';

// Expected endpoints by category
const EXPECTED_ENDPOINTS = {
  auth: [
    'GET /api/auth/me',
    'PATCH /api/auth/profile', 
    'DELETE /api/auth/account',
    'POST /api/auth/sync-profile',
    'POST /api/auth/sync-guest-data',
    'POST /api/auth/update-username'
  ],
  game: [
    'POST /api/game/save',
    'GET /api/game/load/:slotName',
    'GET /api/game/load/id/:saveId',
    'GET /api/game/saves',
    'DELETE /api/game/save/:saveId',
    'DELETE /api/game/saves/all',
    'GET /api/game/autosave',
    'POST /api/game/save/rename',
    'GET /api/game/saves/count'
  ],
  career: [
    'POST /api/career/complete',
    'GET /api/career/history',
    'GET /api/career/stats',
    'GET /api/career/leaderboard',
    'GET /api/career/:careerHistoryId',
    'DELETE /api/career/:careerHistoryId',
    'GET /api/career/achievements/summary'
  ],
  learning: [
    'POST /api/learning/module/start',
    'POST /api/learning/module/complete',
    'POST /api/learning/quiz/attempt',
    'GET /api/learning/progress',
    'GET /api/learning/progress/:moduleId',
    'GET /api/learning/stats',
    'GET /api/learning/recommendations',
    'DELETE /api/learning/progress/:moduleId',
    'GET /api/learning/leaderboard'
  ],
  lessons: [
    'POST /api/lessons/view',
    'POST /api/lessons/concept/master',
    'POST /api/lessons/engagement',
    'GET /api/lessons/stats',
    'GET /api/lessons/concepts',
    'GET /api/lessons/engagement/:lessonId'
  ],
  analytics: [
    'GET /api/analytics/overview',
    'GET /api/analytics/learning-journey',
    'GET /api/analytics/performance-trends',
    'GET /api/analytics/educational-effectiveness',
    'GET /api/analytics/progress-dashboard'
  ],
  migration: [
    'POST /api/migrate/run',
    'GET /api/migrate/status'
  ],
  health: [
    'GET /api/health'
  ]
};

// Color codes for console output
const colors = {
  reset: '\\x1b[0m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[34m',
  cyan: '\\x1b[36m'
};

async function checkSwaggerSpec(baseUrl) {
  try {
    console.log(`${colors.blue}Checking Swagger specification at ${baseUrl}/api-docs.json${colors.reset}`);
    const response = await axios.get(`${baseUrl}/api-docs.json`, { timeout: 10000 });
    
    if (response.status === 200 && response.data) {
      const spec = response.data;
      const paths = Object.keys(spec.paths || {});
      
      console.log(`${colors.green}✅ Swagger spec loaded successfully${colors.reset}`);
      console.log(`   - OpenAPI Version: ${spec.openapi}`);
      console.log(`   - API Title: ${spec.info.title}`);
      console.log(`   - API Version: ${spec.info.version}`);
      console.log(`   - Documented Paths: ${paths.length}`);
      
      return { success: true, paths, spec };
    }
  } catch (error) {
    console.log(`${colors.red}❌ Failed to load Swagger spec: ${error.message}${colors.reset}`);
    return { success: false, error: error.message };
  }
}

async function checkHealthEndpoint(baseUrl) {
  try {
    console.log(`${colors.blue}Checking health endpoint at ${baseUrl}/api/health${colors.reset}`);
    const response = await axios.get(`${baseUrl}/api/health`, { timeout: 5000 });
    
    if (response.status === 200) {
      console.log(`${colors.green}✅ Health endpoint is accessible${colors.reset}`);
      console.log(`   - Status: ${response.data.status}`);
      console.log(`   - Database: ${response.data.database?.status || 'Unknown'}`);
      return true;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Health endpoint failed: ${error.message}${colors.reset}`);
    return false;
  }
}

function validateEndpointCoverage(swaggerPaths) {
  console.log(`${colors.cyan}\\n📊 Endpoint Coverage Analysis${colors.reset}`);
  
  let totalExpected = 0;
  let totalDocumented = 0;
  let missingEndpoints = [];
  
  for (const [category, endpoints] of Object.entries(EXPECTED_ENDPOINTS)) {
    console.log(`\\n${colors.blue}${category.toUpperCase()} Endpoints:${colors.reset}`);
    
    totalExpected += endpoints.length;
    let categoryDocumented = 0;
    
    for (const endpoint of endpoints) {
      const [method, path] = endpoint.split(' ');
      const swaggerPath = path.replace(/:([^/]+)/g, '{$1}'); // Convert :param to {param}
      
      const isDocumented = swaggerPaths.includes(swaggerPath);
      
      if (isDocumented) {
        console.log(`   ${colors.green}✅${colors.reset} ${endpoint}`);
        categoryDocumented++;
        totalDocumented++;
      } else {
        console.log(`   ${colors.red}❌${colors.reset} ${endpoint} - NOT DOCUMENTED`);
        missingEndpoints.push(endpoint);
      }
    }
    
    const percentage = Math.round((categoryDocumented / endpoints.length) * 100);
    console.log(`   Coverage: ${categoryDocumented}/${endpoints.length} (${percentage}%)`);
  }
  
  const overallPercentage = Math.round((totalDocumented / totalExpected) * 100);
  console.log(`\\n${colors.cyan}Overall Coverage: ${totalDocumented}/${totalExpected} (${overallPercentage}%)${colors.reset}`);
  
  if (missingEndpoints.length > 0) {
    console.log(`\\n${colors.yellow}⚠️  Missing Documentation:${colors.reset}`);
    missingEndpoints.forEach(endpoint => {
      console.log(`   - ${endpoint}`);
    });
  } else {
    console.log(`\\n${colors.green}🎉 All endpoints are properly documented!${colors.reset}`);
  }
  
  return {
    totalExpected,
    totalDocumented,
    missingEndpoints,
    percentage: overallPercentage
  };
}

async function validateEnvironment(envName, baseUrl) {
  console.log(`\\n${colors.cyan}🔍 Validating ${envName} Environment${colors.reset}`);
  console.log(`Base URL: ${baseUrl}`);
  
  const results = {
    environment: envName,
    baseUrl,
    health: false,
    swagger: false,
    coverage: null
  };
  
  // Check health endpoint
  results.health = await checkHealthEndpoint(baseUrl);
  
  // Check Swagger documentation
  const swaggerResult = await checkSwaggerSpec(baseUrl);
  results.swagger = swaggerResult.success;
  
  if (swaggerResult.success) {
    // Validate endpoint coverage
    results.coverage = validateEndpointCoverage(swaggerResult.paths);
  }
  
  return results;
}

async function main() {
  console.log(`${colors.cyan}🚀 MusicSim API Validation Tool${colors.reset}`);
  console.log('=====================================');
  
  const results = [];
  
  // Validate Development Environment
  try {
    const devResults = await validateEnvironment('Development', DEV_BASE_URL);
    results.push(devResults);
  } catch (error) {
    console.log(`${colors.red}❌ Development validation failed: ${error.message}${colors.reset}`);
    results.push({
      environment: 'Development',
      baseUrl: DEV_BASE_URL,
      health: false,
      swagger: false,
      coverage: null,
      error: error.message
    });
  }
  
  // Validate Production Environment
  try {
    const prodResults = await validateEnvironment('Production', PROD_BASE_URL);
    results.push(prodResults);
  } catch (error) {
    console.log(`${colors.red}❌ Production validation failed: ${error.message}${colors.reset}`);
    results.push({
      environment: 'Production',
      baseUrl: PROD_BASE_URL,
      health: false,
      swagger: false,
      coverage: null,
      error: error.message
    });
  }
  
  // Summary Report
  console.log(`\\n${colors.cyan}📋 Final Report${colors.reset}`);
  console.log('==================');
  
  for (const result of results) {
    console.log(`\\n${colors.blue}${result.environment} Environment:${colors.reset}`);
    console.log(`URL: ${result.baseUrl}`);
    console.log(`Health: ${result.health ? colors.green + '✅ Working' : colors.red + '❌ Failed'}${colors.reset}`);
    console.log(`Swagger: ${result.swagger ? colors.green + '✅ Working' : colors.red + '❌ Failed'}${colors.reset}`);
    
    if (result.coverage) {
      const coverageColor = result.coverage.percentage >= 100 ? colors.green : 
                           result.coverage.percentage >= 80 ? colors.yellow : colors.red;
      console.log(`Documentation: ${coverageColor}${result.coverage.percentage}% (${result.coverage.totalDocumented}/${result.coverage.totalExpected})${colors.reset}`);
    } else {
      console.log(`Documentation: ${colors.red}❌ Unable to validate${colors.reset}`);
    }
    
    if (result.error) {
      console.log(`Error: ${colors.red}${result.error}${colors.reset}`);
    }
  }
  
  // Success/failure determination
  const allHealthy = results.every(r => r.health && r.swagger);
  const allFullyCovered = results.every(r => r.coverage && r.coverage.percentage === 100);
  
  if (allHealthy && allFullyCovered) {
    console.log(`\\n${colors.green}🎉 All environments are fully functional and documented!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\\n${colors.yellow}⚠️  Some issues were found. Please review the report above.${colors.reset}`);
    process.exit(1);
  }
}

// Run the validation
if (require.main === module) {
  main().catch(error => {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = {
  checkSwaggerSpec,
  checkHealthEndpoint,
  validateEndpointCoverage,
  validateEnvironment,
  EXPECTED_ENDPOINTS
};
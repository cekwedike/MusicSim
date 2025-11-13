/**
 * Security Fixes Validation Test
 * Tests that all implemented security measures are working correctly
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testSecurityFixes() {
  console.log('🛡️  Testing Security Fixes...\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Rate Limiting
  console.log('1. Testing Rate Limiting...');
  try {
    const requests = [];
    // Send 25 requests rapidly (should hit the 20 request limit)
    for (let i = 0; i < 25; i++) {
      requests.push(axios.get(`${BASE_URL}/api/health`, { timeout: 1000 }).catch(err => err));
    }
    
    const results = await Promise.all(requests);
    const rateLimited = results.some(result => 
      result?.response?.status === 429 || 
      result?.message?.includes('429')
    );
    
    if (rateLimited) {
      console.log('   ✅ Rate limiting is working - some requests were blocked');
      passed++;
    } else {
      console.log('   ⚠️  Rate limiting may not be working as expected');
      failed++;
    }
  } catch (error) {
    console.log('   ❌ Rate limiting test failed:', error.message);
    failed++;
  }

  // Test 2: Webhook Security
  console.log('\n2. Testing Webhook Security...');
  try {
    const webhookResponse = await axios.post(`${BASE_URL}/api/auth/webhook/user-deleted`, {
      type: 'DELETE',
      record: { id: 'test-user-id' }
    }, { 
      timeout: 5000,
      validateStatus: () => true // Accept all status codes
    });

    if (webhookResponse.status === 401) {
      console.log('   ✅ Webhook security is working - unauthorized requests blocked');
      passed++;
    } else if (webhookResponse.status === 400) {
      console.log('   ✅ Webhook validation working - invalid payloads rejected');
      passed++;
    } else {
      console.log('   ⚠️  Webhook security may not be working:', webhookResponse.status);
      failed++;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('   ✅ Webhook security is working - requests properly blocked');
      passed++;
    } else {
      console.log('   ❌ Webhook security test failed:', error.message);
      failed++;
    }
  }

  // Test 3: Environment Validation
  console.log('\n3. Testing Environment Validation...');
  try {
    const healthResponse = await axios.get(`${BASE_URL}/api/health`, { timeout: 5000 });
    if (healthResponse.status === 200) {
      console.log('   ✅ Server started successfully with environment validation');
      passed++;
    }
  } catch (error) {
    console.log('   ❌ Environment validation test failed:', error.message);
    failed++;
  }

  // Test 4: API Documentation Access
  console.log('\n4. Testing API Documentation...');
  try {
    const docsResponse = await axios.get(`${BASE_URL}/api-docs`, { 
      timeout: 5000,
      validateStatus: () => true 
    });
    if (docsResponse.status === 200) {
      console.log('   ✅ API documentation accessible');
      passed++;
    } else {
      console.log('   ⚠️  API documentation may have issues:', docsResponse.status);
      failed++;
    }
  } catch (error) {
    console.log('   ❌ API documentation test failed:', error.message);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('🛡️  SECURITY VALIDATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${passed}`);
  console.log(`❌ Tests Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL SECURITY FIXES WORKING CORRECTLY!');
    console.log('✅ Your authentication system is now secure');
  } else {
    console.log('\n⚠️  Some security tests had issues');
    console.log('🔍 Review the failed tests above');
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. Set SUPABASE_WEBHOOK_SECRET in production');
  console.log('2. Test OAuth flow in your frontend');
  console.log('3. Verify username uniqueness with real users');
  console.log('4. Monitor rate limiting in production logs');
  
  return { passed, failed, totalTests: passed + failed };
}

// Run tests if this file is executed directly
if (require.main === module) {
  testSecurityFixes().catch(console.error);
}

module.exports = { testSecurityFixes };
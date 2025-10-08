// Test script to verify autosave expiration functionality
// You can run this in browser console to test

// For testing purposes, temporarily change the expiration time to 30 seconds
// In storageService.ts, change AUTOSAVE_EXPIRATION_MS to 30 * 1000

const testAutosaveExpiration = () => {
  console.log('🧪 Testing Autosave Expiration System');
  
  // Test 1: Check if we can create an autosave
  console.log('Test 1: Creating mock autosave...');
  const mockSave = {
    state: { artistName: 'Test Artist', artistGenre: 'Rock' },
    timestamp: Date.now() - (11 * 60 * 1000) // 11 minutes ago (expired)
  };
  
  localStorage.setItem('musicsim_saves', JSON.stringify({ auto: mockSave }));
  console.log('✅ Mock expired autosave created');
  
  // Test 2: Check if expired autosave is detected
  const isExpired = Date.now() - mockSave.timestamp > (10 * 60 * 1000);
  console.log(`Test 2: Autosave expired check: ${isExpired ? '✅ EXPIRED' : '❌ NOT EXPIRED'}`);
  
  // Test 3: Check age calculation
  const ageInMinutes = Math.round((Date.now() - mockSave.timestamp) / 60000);
  console.log(`Test 3: Autosave age: ${ageInMinutes} minutes`);
  
  // Test 4: Create fresh autosave
  const freshSave = {
    state: { artistName: 'Fresh Artist', artistGenre: 'Pop' },
    timestamp: Date.now() // Just created
  };
  
  localStorage.setItem('musicsim_saves', JSON.stringify({ auto: freshSave }));
  console.log('✅ Fresh autosave created');
  
  const freshAge = Math.round((Date.now() - freshSave.timestamp) / 60000);
  console.log(`Test 4: Fresh autosave age: ${freshAge} minutes`);
  
  console.log('🎉 Autosave expiration tests complete!');
  console.log('Check the app\'s start screen to see if Continue button appears for fresh save');
};

// Run the test
testAutosaveExpiration();
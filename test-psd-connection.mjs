#!/usr/bin/env node

/**
 * PSD Hub Connection Test
 * 
 * Tests real connection to the remote PSD Hub
 * Validates credentials and makes test API calls
 */

const PSD_HUB_URL = 'https://api.hub-psd.com';
const APIS_HUB_KEY = 'psd_live_p72AzwURfP7rjt51GRDwbg9LaZj0TiR6';

console.log('🚀 PSD Hub Connection Test\n');
console.log('═'.repeat(60));
console.log(`Hub URL: ${PSD_HUB_URL}`);
console.log(`API Key: ${APIS_HUB_KEY.substring(0, 20)}...`);
console.log('═'.repeat(60));

// Test 1: Health Check
console.log('\n📋 Test 1: Health Check');
console.log('─'.repeat(60));
console.log(`URL: ${PSD_HUB_URL}/health`);

try {
  const healthResponse = await fetch(`${PSD_HUB_URL}/health`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${APIS_HUB_KEY}`,
      'X-Client': 'celebra',
      'X-Timestamp': new Date().toISOString(),
    },
    signal: AbortSignal.timeout(10000),
  });

  console.log(`\n✅ Response Status: ${healthResponse.status}`);
  
  if (healthResponse.ok) {
    const data = await healthResponse.json();
    console.log('✅ Response Data:', JSON.stringify(data, null, 2));
  } else {
    console.log('⚠️  Response Status:', healthResponse.statusText);
    const text = await healthResponse.text();
    if (text) console.log('Response:', text.substring(0, 200));
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Test 2: Hub Status
console.log('\n\n📋 Test 2: Hub Status');
console.log('─'.repeat(60));
console.log(`URL: ${PSD_HUB_URL}/status`);

try {
  const statusResponse = await fetch(`${PSD_HUB_URL}/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${APIS_HUB_KEY}`,
      'X-Client': 'celebra',
      'X-Timestamp': new Date().toISOString(),
    },
    signal: AbortSignal.timeout(10000),
  });

  console.log(`\n✅ Response Status: ${statusResponse.status}`);
  
  if (statusResponse.ok) {
    const data = await statusResponse.json();
    console.log('✅ Response Data:', JSON.stringify(data, null, 2));
  } else {
    console.log('⚠️  Response Status:', statusResponse.statusText);
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Test 3: Spotify Search (via Hub)
console.log('\n\n📋 Test 3: Spotify Search via Hub');
console.log('─'.repeat(60));
console.log(`URL: ${PSD_HUB_URL}/spotify/search?q=Ave+Maria&type=track&limit=5`);

try {
  const spotifyResponse = await fetch(
    `${PSD_HUB_URL}/spotify/search?q=Ave+Maria&type=track&limit=5`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIS_HUB_KEY}`,
        'X-Client': 'celebra',
        'X-Timestamp': new Date().toISOString(),
      },
      signal: AbortSignal.timeout(10000),
    }
  );

  console.log(`\n✅ Response Status: ${spotifyResponse.status}`);
  
  if (spotifyResponse.ok) {
    const data = await spotifyResponse.json();
    console.log('✅ Response Data:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
  } else {
    console.log('⚠️  Response Status:', spotifyResponse.statusText);
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Test 4: YouTube Search (via Hub)
console.log('\n\n📋 Test 4: YouTube Search via Hub');
console.log('─'.repeat(60));
console.log(`URL: ${PSD_HUB_URL}/youtube/search?q=liturgical+music&type=video&maxResults=5`);

try {
  const youtubeResponse = await fetch(
    `${PSD_HUB_URL}/youtube/search?q=liturgical+music&type=video&maxResults=5`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIS_HUB_KEY}`,
        'X-Client': 'celebra',
        'X-Timestamp': new Date().toISOString(),
      },
      signal: AbortSignal.timeout(10000),
    }
  );

  console.log(`\n✅ Response Status: ${youtubeResponse.status}`);
  
  if (youtubeResponse.ok) {
    const data = await youtubeResponse.json();
    console.log('✅ Response Data:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
  } else {
    console.log('⚠️  Response Status:', youtubeResponse.statusText);
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Test 5: Stripe Status (via Hub)
console.log('\n\n📋 Test 5: Stripe API Status via Hub');
console.log('─'.repeat(60));
console.log(`URL: ${PSD_HUB_URL}/stripe/status`);

try {
  const stripeStatusResponse = await fetch(
    `${PSD_HUB_URL}/stripe/status`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIS_HUB_KEY}`,
        'X-Client': 'celebra',
        'X-Timestamp': new Date().toISOString(),
      },
      signal: AbortSignal.timeout(10000),
    }
  );

  console.log(`\n✅ Response Status: ${stripeStatusResponse.status}`);
  
  if (stripeStatusResponse.ok) {
    const data = await stripeStatusResponse.json();
    console.log('✅ Response Data:', JSON.stringify(data, null, 2));
  } else {
    console.log('⚠️  Response Status:', stripeStatusResponse.statusText);
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Test 6: PSD2 Status (via Hub)
console.log('\n\n📋 Test 6: PSD2 API Status via Hub');
console.log('─'.repeat(60));
console.log(`URL: ${PSD_HUB_URL}/psd2/status`);

try {
  const psd2StatusResponse = await fetch(
    `${PSD_HUB_URL}/psd2/status`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIS_HUB_KEY}`,
        'X-Client': 'celebra',
        'X-Timestamp': new Date().toISOString(),
      },
      signal: AbortSignal.timeout(10000),
    }
  );

  console.log(`\n✅ Response Status: ${psd2StatusResponse.status}`);
  
  if (psd2StatusResponse.ok) {
    const data = await psd2StatusResponse.json();
    console.log('✅ Response Data:', JSON.stringify(data, null, 2));
  } else {
    console.log('⚠️  Response Status:', psd2StatusResponse.statusText);
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}

console.log('\n\n' + '═'.repeat(60));
console.log('✅ PSD Hub Connection Test Complete\n');

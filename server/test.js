const http = require('http');

function testEndpoint(name, endpoint, method, body) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Testing ${name}...`);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: method,
      headers: body ? {
        'Content-Type': 'application/json',
      } : {},
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ ${name} response:`, JSON.stringify(json, null, 2).substring(0, 300));
          resolve({ success: true, data: json });
        } catch (e) {
          console.log(`⚠️ ${name} raw:`, data.substring(0, 200));
          resolve({ success: false, error: 'Parse error' });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ ${name} failed:`, error.message);
      resolve({ success: false, error: error.message });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing ElectionEdu AI API...\n');

  // Test health
  await testEndpoint('Health Check', '/api/health', 'GET');

  // Test overview
  const overviewData = await testEndpoint('Overview', '/api/overview', 'POST', {
    country: 'United States',
    electionType: 'General Election',
  });

  // Test timeline
  await testEndpoint('Timeline', '/api/timeline/United%20States?electionType=General%20Election', 'GET');

  // Test chat
  await testEndpoint('Chat', '/api/chat', 'POST', {
    sessionId: 'test-session-123',
    country: 'United States',
    electionType: 'General Election',
    message: 'What is voter registration?',
  });

  // Test quiz generation
  const quizData = await testEndpoint('Quiz Generate', '/api/quiz/generate', 'POST', {
    country: 'United States',
    electionType: 'General Election',
  });

  // Test glossary
  await testEndpoint('Glossary', '/api/glossary/Ballot?country=United%20States', 'GET');

  console.log('\n✅ All tests completed!');
  
  // Verify mock data includes the "AI has failed" message
  console.log('\n--- Verifying fallback message ---');
  if (overviewData.success && overviewData.data.fromMock) {
    const msg = overviewData.data.data[0].description;
    console.log('✅ Overview mock data present:', msg.includes('This is mock data'));
  }
}

runTests().catch(console.error);

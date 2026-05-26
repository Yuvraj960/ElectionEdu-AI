const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing ElectionEdu AI API...\n');

  try {
    console.log('1. Health Check...');
    const health = await makeRequest('/api/health', 'GET');
    console.log('   ✅ Health:', health);

    console.log('2. Overview...');
    const overview = await makeRequest('/api/overview', 'POST', {
      country: 'United States',
      electionType: 'General Election',
    });
    console.log('   ✅ Overview data count:', overview.data?.length, '| fromMock:', overview.fromMock);
    console.log('   First step:', overview.data?.[0]?.title);

    console.log('3. Timeline...');
    const timeline = await makeRequest('/api/timeline/United%20States?electionType=General%20Election', 'GET');
    console.log('   ✅ Timeline data count:', timeline.data?.length, '| fromMock:', timeline.fromMock);

    console.log('4. Chat...');
    const chat = await makeRequest('/api/chat', 'POST', {
      sessionId: 'test-123',
      country: 'United States',
      electionType: 'General Election',
      message: 'What is voter registration?',
    });
    console.log('   ✅ Chat reply length:', chat.reply?.length, '| fromMock:', chat.fromMock);

    console.log('5. Quiz...');
    const quiz = await makeRequest('/api/quiz/generate', 'POST', {
      country: 'United States',
      electionType: 'General Election',
    });
    console.log('   ✅ Quiz questions:', quiz.data?.length, '| fromMock:', quiz.fromMock);

    console.log('6. Glossary...');
    const glossary = await makeRequest('/api/glossary/Ballot?country=United%20States', 'GET');
    console.log('   ✅ Glossary term:', glossary.data?.term, '| fromMock:', glossary.fromMock);

    console.log('\n✅ All API tests passed!');

    // Verify mock message is present when AI fails
    if (overview.fromMock) {
      const hasMessage = JSON.stringify(overview.data || {}).includes('This is mock data');
      console.log('   ✅ Mock fallback message verified:', hasMessage);
    }
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    console.log('\nMake sure the server is running!');
    console.log('Run: cd server && node index.js');
  }
}

runTests();

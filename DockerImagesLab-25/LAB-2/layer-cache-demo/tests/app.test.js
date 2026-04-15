const http = require('http');

const BASE_URL = '<http://localhost:3000>';

async function makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const req = http.request(url, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: JSON.parse(data || '{}')
                });
            });
        });
        req.on('error', reject);
        if (options.body) req.write(JSON.stringify(options.body));
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Running API Tests...\\n');
    let passed = 0;
    let failed = 0;

    // Test 1: Root endpoint
    try {
        const res = await makeRequest('/');
        console.assert(res.status === 200, 'Root should return 200');
        console.assert(res.body.message.includes('Layer Cache'), 'Should contain app name');
        console.log('✅ Test 1: Root endpoint');
        passed++;
    } catch (e) {
        console.log('❌ Test 1: Root endpoint -', e.message);
        failed++;
    }

    // Test 2: Health check
    try {
        const res = await makeRequest('/health');
        console.assert(res.status === 200, 'Health should return 200');
        console.assert(res.body.status === 'healthy', 'Should be healthy');
        console.log('✅ Test 2: Health check');
        passed++;
    } catch (e) {
        console.log('❌ Test 2: Health check -', e.message);
        failed++;
    }

    // Test 3: Get users
    try {
        const res = await makeRequest('/api/users');
        console.assert(res.status === 200, 'Users should return 200');
        console.assert(res.body.count >= 2, 'Should have seed users');
        console.log('✅ Test 3: Get users');
        passed++;
    } catch (e) {
        console.log('❌ Test 3: Get users -', e.message);
        failed++;
    }

    // Test 4: Create user
    try {
        const res = await makeRequest('/api/users', {
            method: 'POST',
            body: { name: 'Test User', email: 'test@example.com', role: 'user' }
        });
        console.assert(res.status === 201, 'Create should return 201');
        console.assert(res.body.name === 'Test User', 'Name should match');
        console.log('✅ Test 4: Create user');
        passed++;
    } catch (e) {
        console.log('❌ Test 4: Create user -', e.message);
        failed++;
    }

    // Test 5: 404 handling
    try {
        const res = await makeRequest('/nonexistent');
        console.assert(res.status === 404, 'Should return 404');
        console.log('✅ Test 5: 404 handling');
        passed++;
    } catch (e) {
        console.log('❌ Test 5: 404 handling -', e.message);
        failed++;
    }

    console.log(`\\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
    process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);
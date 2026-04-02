const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const EVENT_ID = 1; // Assuming the seeded Tech Conference 2026 has ID 1

async function simulateConcurrentBookings(count) {
    console.log(`Starting concurrency test: Attempting ${count} simultaneous bookings...`);
    
    const bookings = [];
    for (let i = 1; i <= count; i++) {
        bookings.push(
            axios.post(`${BASE_URL}/bookings`, {
                user_id: i,
                event_id: EVENT_ID
            }).then(res => ({ status: 'Success', user: i }))
              .catch(err => ({ status: 'Failed', user: i, message: err.response?.data?.error || err.message }))
        );
    }

    const results = await Promise.all(bookings);
    
    const successes = results.filter(r => r.status === 'Success').length;
    const failures = results.filter(r => r.status === 'Failed').length;

    console.log('\n--- Test Results ---');
    console.log(`Total Attempts: ${count}`);
    console.log(`Successes: ${successes}`);
    console.log(`Failures: ${failures}`);
    
    if (failures > 0) {
        console.log('Sample Failure:', results.find(r => r.status === 'Failed').message);
    }
}

// Ensure the server is running before executing this
simulateConcurrentBookings(105); // Attempt 105 bookings for a 100-capacity event

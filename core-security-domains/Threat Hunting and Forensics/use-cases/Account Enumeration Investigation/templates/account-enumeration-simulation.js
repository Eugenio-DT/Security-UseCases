const endpointBase = 'http://<easytrade-domain>/login/api/Accounts/GetAccountByUsername/'; // Base URL of the endpoint
const usernames = [
    'john_doe', 'mary.jane', 'susan_smith', 'michael.brown', 'james_norton',
    'david.jones', 'lisa.wilson', 'robert_miller', 'karen_davis', 'jason.taylor',
    'patricia_moore', 'matthew_jackson', 'jennifer.white', 'daniel.harris', 'linda_clark',
    'thomas.evans', 'elizabeth_edwards', 'josh_wilson', 'olivia_collins', 'mark.stewart',
    'amber_sanders', 'paul.hughes', 'rachel.price', 'sean.morgan', 'eric_reed',
    'anna.cox', 'george_ward', 'michelle_richardson', 'kyle_bennett', 'emma_wood'
]; // List of realistic usernames

const delayBetweenRequests = 100; // Delay in milliseconds between each request

// Function to simulate a single request for account existence check
async function checkAccountExistence(username) {
    try {
    const response = await fetch(endpointBase + encodeURIComponent(username), {
        method: 'GET'
    });

    } catch (error) {
    console.error('Error during request:', error);
    }
}

// Function to simulate account enumeration
async function simulateAccountEnumeration() {
    for (let i = 0; i < usernames.length; i++) {
    // console.log(`Attempt ${i + 1} of ${usernames.length} for username: ${usernames[i]}`);
    console.log("Running...");
    await checkAccountExistence(usernames[i]);
    
    // Wait for a short delay between requests
    await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }
}

// Start the account enumeration simulation
console.log('Account enumeration simulation start!');
await simulateAccountEnumeration();
console.log('Account enumeration simulation complete.');
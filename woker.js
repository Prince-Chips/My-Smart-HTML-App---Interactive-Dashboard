// This script runs in a separate thread from the main JavaScript

// Listen for messages from the main thread
self.onmessage = function(e) {
    console.log('Worker: Message received from main script');
    const number = e.data;
    
    // Simulate a heavy calculation
    let result = 0;
    for (let i = 0; i < number; i++) {
        for (let j = 0; j < number; j++) {
            result = number * number; // This is just to simulate work
        }
    }
    
    console.log('Worker: Posting message back to main script');
    
    // Send the result back to the main thread
    self.postMessage(result);
};

// Handle errors
self.onerror = function(error) {
    console.error('Worker error:', error);
    self.postMessage('Calculation failed');
};
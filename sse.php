<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('Access-Control-Allow-Origin: *'); // Allow from any origin

// Function to send an SSE message
function sendMessage($id, $message) {
    echo "id: $id\n";
    echo "data: $message\n\n";
    ob_flush();
    flush();
}

// Sample messages to send
$messages = [
    "Welcome to the live updates!",
    "Current server time is " . date('H:i:s'),
    "This is a demonstration of Server-Sent Events",
    "You're receiving these messages in real-time",
    "The connection will stay open for updates",
    "This is message number 6",
    "Almost done with the demo",
    "This is the final message in this sequence"
];

// Send messages one by one with a delay
$counter = 0;
while ($counter < count($messages)) {
    $message = $messages[$counter];
    sendMessage($counter + 1, $message);
    $counter++;
    
    // Break the loop if the client has disconnected
    if (connection_aborted()) break;
    
    sleep(2); // 2-second delay between messages
}

// Close the connection after sending all messages
sendMessage('close', 'Connection closed');
?>
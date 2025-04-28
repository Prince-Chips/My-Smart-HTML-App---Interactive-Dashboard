document.addEventListener('DOMContentLoaded', function() {
    // Theme switcher
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Live clock
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        document.getElementById('liveClock').textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Geolocation API
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationResult = document.getElementById('locationResult');
    
    getLocationBtn.addEventListener('click', function() {
        if (!navigator.geolocation) {
            locationResult.textContent = "Geolocation is not supported by your browser";
            return;
        }
        
        locationResult.textContent = "Locating...";
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                locationResult.innerHTML = `
                    <p>Latitude: ${position.coords.latitude.toFixed(4)}</p>
                    <p>Longitude: ${position.coords.longitude.toFixed(4)}</p>
                    <p>Accuracy: ${position.coords.accuracy} meters</p>
                `;
            },
            function(error) {
                let message = "Error getting location: ";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        message += "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message += "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        message += "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        message += "An unknown error occurred.";
                        break;
                }
                locationResult.textContent = message;
            }
        );
    });

    // Drag and Drop API
    const draggables = document.querySelectorAll('.draggable');
    const dropZone = document.getElementById('dropZone');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.id);
            setTimeout(() => this.style.opacity = '0.4', 0);
        });
        
        draggable.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
    });
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('highlight');
    });
    
    dropZone.addEventListener('dragleave', function() {
        this.classList.remove('highlight');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('highlight');
        
        const id = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(id);
        
        if (draggedElement) {
            const clone = draggedElement.cloneNode(true);
            clone.style.opacity = '1';
            clone.style.width = '100px';
            clone.style.height = '100px';
            clone.style.margin = '5px';
            this.appendChild(clone);
        }
    });

    // Web Storage API
    const userNameInput = document.getElementById('userName');
    const saveNameBtn = document.getElementById('saveNameBtn');
    const savedNameDiv = document.getElementById('savedName');
    
    // Load saved name if exists
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        userNameInput.value = savedName;
        savedNameDiv.textContent = `Hello, ${savedName}! Your name is saved.`;
    }
    
    saveNameBtn.addEventListener('click', function() {
        const name = userNameInput.value.trim();
        if (name) {
            localStorage.setItem('userName', name);
            savedNameDiv.textContent = `Hello, ${name}! Your name is saved.`;
        } else {
            savedNameDiv.textContent = "Please enter a name to save.";
        }
    });

    // Web Workers API
    const workerInput = document.getElementById('workerInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const workerResult = document.getElementById('workerResult');
    
    calculateBtn.addEventListener('click', function() {
        const number = parseInt(workerInput.value);
        
        if (isNaN(number)) {
            workerResult.textContent = "Please enter a valid number";
            return;
        }
        
        workerResult.textContent = "Calculating... (check console for worker messages)";
        
        // Create a new web worker
        const worker = new Worker('worker.js');
        
        // Send data to worker
        worker.postMessage(number);
        
        // Receive message from worker
        worker.onmessage = function(e) {
            workerResult.textContent = `The square of ${number} is ${e.data}`;
            worker.terminate(); // Clean up the worker
        };
        
        worker.onerror = function(error) {
            workerResult.textContent = `Error: ${error.message}`;
            worker.terminate();
        };
    });

    // Server-Sent Events (SSE)
    const startSSEBtn = document.getElementById('startSSEBtn');
    const stopSSEBtn = document.getElementById('stopSSEBtn');
    const sseMessages = document.getElementById('sseMessages');
    let eventSource;
    
    startSSEBtn.addEventListener('click', function() {
        if (typeof(EventSource) !== "undefined") {
            eventSource = new EventSource('sse.php');
            
            eventSource.onmessage = function(e) {
                const message = document.createElement('div');
                message.textContent = `Update: ${e.data}`;
                sseMessages.appendChild(message);
                sseMessages.scrollTop = sseMessages.scrollHeight;
            };
            
            eventSource.onerror = function() {
                sseMessages.textContent += "\nEventSource failed. Connection might be closed.";
            };
            
            startSSEBtn.disabled = true;
            stopSSEBtn.disabled = false;
            sseMessages.textContent = "Connected to live updates...\n";
        } else {
            sseMessages.textContent = "Sorry, your browser doesn't support server-sent events.";
        }
    });
    
    stopSSEBtn.addEventListener('click', function() {
        if (eventSource) {
            eventSource.close();
            sseMessages.textContent += "\nDisconnected from live updates.";
            startSSEBtn.disabled = false;
            stopSSEBtn.disabled = true;
        }
    });
});
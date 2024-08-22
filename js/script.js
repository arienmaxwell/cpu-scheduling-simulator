// Function to call when the "Simulate" button is clicked
function simulate() {
    const algorithm = document.getElementById("algorithm").value;

    fetch('http://localhost:5000/simulate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ algorithm: algorithm }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            document.getElementById("results").innerHTML = `<p>${data.error}</p>`;
        } else {
            displayAlgorithmDescription(getAlgorithmDescription(algorithm));
            displayResults(data.output);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to get a description of the selected algorithm
function getAlgorithmDescription(algorithm) {
    switch (algorithm) {
        case "fcfs":
            return `
                <h2>First-Come-First-Serve (FCFS)</h2>
                <p>FCFS is the simplest CPU scheduling algorithm where processes are scheduled in the order of their arrival.</p>
            `;
        case "sjf":
            return `
                <h2>Shortest Job First (SJF)</h2>
                <p>SJF selects the process with the smallest burst time first. It can be preemptive or non-preemptive.</p>
            `;
        case "priority":
            return `
                <h2>Priority Scheduling</h2>
                <p>Priority Scheduling selects the process with the highest priority. It can be preemptive or non-preemptive.</p>
            `;
        case "rr":
            return `
                <h2>Round Robin (RR)</h2>
                <p>Round Robin is a preemptive scheduling algorithm where each process is given a fixed time slice in a cyclic order.</p>
            `;
        default:
            return '';
    }
}

// Function to display the algorithm description
function displayAlgorithmDescription(description) {
    document.getElementById("algorithmDescription").innerHTML = description;
}

// Function to display the results from the Flask server
function displayResults(results) {
    document.getElementById("results").innerHTML = `<pre>${results}</pre>`; // Adjust formatting as needed
}

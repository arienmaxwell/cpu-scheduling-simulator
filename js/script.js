function simulate() {
    const algorithm = document.getElementById("algorithm").value;

    // Example process data (can be dynamic or fetched from user input)
    const processes = [
        { pid: 1, burst_time: 18, arrival_time: 1, priority: 2 },
        { pid: 2, burst_time: 24, arrival_time: 5, priority: 3 },
        { pid: 3, burst_time: 12, arrival_time: 0, priority: 1 },
        { pid: 4, burst_time: 16, arrival_time: 2, priority: 4 },
        { pid: 5, burst_time: 20, arrival_time: 3, priority: 0 }
    ];

    let results;
    switch (algorithm) {
        case "fcfs":
            results = fcfs(processes);
            break;
        case "sjf":
            results = sjf(processes);
            break;
        case "priority":
            results = priorityScheduling(processes);
            break;
        case "rr":
            results = roundRobin(processes, 2);
            break;
    }

    displayResults(results);
}

function displayResults(results) {
    let output = `
        <table>
            <tr>
                <th>Process</th>
                <th>Burst Time</th>
                <th>Arrival Time</th>
                <th>Priority</th>
                <th>Completion Time</th>
                <th>Waiting Time</th>
                <th>Turnaround Time</th>
                <th>Response Time</th>
            </tr>`;

    results.forEach(process => {
        output += `
            <tr>
                <td>P${process.pid}</td>
                <td>${process.burst_time}</td>
                <td>${process.arrival_time}</td>
                <td>${process.priority}</td>
                <td>${process.completion_time}</td>
                <td>${process.waiting_time}</td>
                <td>${process.turnaround_time}</td>
                <td>${process.response_time}</td>
            </tr>`;
    });

    output += `</table>`;
    document.getElementById("results").innerHTML = output;
}

// FCFS Algorithm
function fcfs(processes) {
    processes.sort((a, b) => a.arrival_time - b.arrival_time);
    let time = 0;

    return processes.map(p => {
        if (time < p.arrival_time) time = p.arrival_time;
        p.completion_time = time + p.burst_time;
        p.turnaround_time = p.completion_time - p.arrival_time;
        p.waiting_time = p.turnaround_time - p.burst_time;
        p.response_time = p.waiting_time;
        time += p.burst_time;
        return p;
    });
}

// SJF Algorithm
function sjf(processes) {
    processes.sort((a, b) => a.burst_time - b.burst_time || a.arrival_time - b.arrival_time);
    let time = 0;
    let completed = [];

    while (completed.length < processes.length) {
        let index = processes.findIndex(p => p.arrival_time <= time && !p.completed);
        if (index !== -1) {
            let p = processes[index];
            p.completion_time = time + p.burst_time;
            p.turnaround_time = p.completion_time - p.arrival_time;
            p.waiting_time = p.turnaround_time - p.burst_time;
            p.response_time = p.waiting_time;
            time += p.burst_time;
            p.completed = true;
            completed.push(p);
        } else {
            time++;
        }
    }
    return completed;
}

// Priority Scheduling Algorithm
function priorityScheduling(processes) {
    processes.sort((a, b) => a.priority - b.priority || a.arrival_time - b.arrival_time);
    let time = 0;
    let completed = [];

    while (completed.length < processes.length) {
        let index = processes.findIndex(p => p.arrival_time <= time && !p.completed);
        if (index !== -1) {
            let p = processes[index];
            p.completion_time = time + p.burst_time;
            p.turnaround_time = p.completion_time - p.arrival_time;
            p.waiting_time = p.turnaround_time - p.burst_time;
            p.response_time = p.waiting_time;
            time += p.burst_time;
            p.completed = true;
            completed.push(p);
        } else {
            time++;
        }
    }
    return completed;
}

// Round Robin Algorithm
function roundRobin(processes, quantum) {
    let time = 0;
    let queue = [...processes];
    let completed = [];

    while (queue.length > 0) {
        let p = queue.shift();
        if (p.arrival_time <= time) {
            if (p.remaining_time === undefined) {
                p.remaining_time = p.burst_time;
                p.response_time = time - p.arrival_time;
            }
            if (p.remaining_time > quantum) {
                time += quantum;
                p.remaining_time -= quantum;
                queue.push(p);
            } else {
                time += p.remaining_time;
                p.completion_time = time;
                p.turnaround_time = p.completion_time - p.arrival_time;
                p.waiting_time = p.turnaround_time - p.burst_time;
                completed.push(p);
            }
        } else {
            queue.push(p);
            time++;
        }
    }
    return completed;
}

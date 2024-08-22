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
    let description = '';

    switch (algorithm) {
        case "fcfs":
            results = fcfs(processes);
            description = `
                <h2>First-Come-First-Serve (FCFS)</h2>
                <p>FCFS is the simplest CPU scheduling algorithm. Processes are attended to in the order they arrive in the ready queue. There is no preemption; once a process starts execution, it runs to completion before the next process starts.</p>
            `;
            break;
        case "sjf":
            results = sjf(processes);
            description = `
                <h2>Shortest Job First (SJF)</h2>
                <p>SJF selects the process with the smallest burst time for execution next. This algorithm can be preemptive or non-preemptive. In non-preemptive SJF, once a process starts execution, it runs to completion. In preemptive SJF, the process can be preempted if a new process with a shorter burst time arrives.</p>
            `;
            break;
        case "priority":
            results = priorityScheduling(processes);
            description = `
                <h2>Priority Scheduling</h2>
                <p>Priority Scheduling selects the process with the highest priority for execution next. If two processes have the same priority, FCFS is used to break ties. This algorithm can be preemptive or non-preemptive. In non-preemptive priority scheduling, once a process starts, it runs to completion. In preemptive priority scheduling, a new process with a higher priority can preempt the currently running process.</p>
            `;
            break;
        case "rr":
            results = roundRobin(processes, 2);
            description = `
                <h2>Round Robin (RR)</h2>
                <p>Round Robin is a preemptive scheduling algorithm where each process is assigned a fixed time slice or quantum. Processes are executed in a circular order, and if a process does not finish within its time slice, it is placed back in the ready queue and the next process is selected. This continues until all processes are complete.</p>
            `;
            break;
    }

    displayAlgorithmDescription(description);
    displayResults(results);
}

function displayAlgorithmDescription(description) {
    document.getElementById("algorithmDescription").innerHTML = description;
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

#include <iostream>
#include <vector>
#include <algorithm>

struct Process {
    int pid;
    int burst_time;
    int arrival_time;
    int priority;
    int completion_time;
    int waiting_time;
    int turnaround_time;
    int response_time;
};

std::vector<Process> fcfs(std::vector<Process> processes) {
    // Sort processes by arrival time
    std::sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.arrival_time < b.arrival_time;
    });

    int time = 0;
    for (auto& p : processes) {
        if (time < p.arrival_time) time = p.arrival_time;
        p.completion_time = time + p.burst_time;
        p.turnaround_time = p.completion_time - p.arrival_time;
        p.waiting_time = p.turnaround_time - p.burst_time;
        p.response_time = p.waiting_time;
        time += p.burst_time;
    }
    return processes;
}

int main() {
    std::vector<Process> processes = {
        {1, 18, 1, 2},
        {2, 24, 5, 3},
        {3, 12, 0, 1},
        {4, 16, 2, 4},
        {5, 20, 3, 0}
    };

    std::vector<Process> result = fcfs(processes);

    for (const auto& p : result) {
        std::cout << "P" << p.pid << " Completion Time: " << p.completion_time << std::endl;
    }

    return 0;
}

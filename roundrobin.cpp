#include <iostream>
#include <vector>
#include <queue>

struct Process {
    int pid;
    int burst_time;
    int arrival_time;
    int priority;
    int completion_time;
    int waiting_time;
    int turnaround_time;
    int response_time;
    int remaining_time;
    bool completed = false;
};

std::vector<Process> roundRobin(std::vector<Process> processes, int quantum) {
    int time = 0;
    std::queue<Process*> queue;
    std::vector<Process> completed;

    for (auto& p : processes) {
        p.remaining_time = p.burst_time;
    }

    while (completed.size() < processes.size()) {
        for (auto& p : processes) {
            if (p.arrival_time <= time && !p.completed) {
                queue.push(&p);
            }
        }

        if (!queue.empty()) {
            Process* p = queue.front();
            queue.pop();
            if (p->remaining_time > quantum) {
                time += quantum;
                p->remaining_time -= quantum;
                queue.push(p);
            } else {
                time += p->remaining_time;
                p->completion_time = time;
                p->turnaround_time = p->completion_time - p->arrival_time;
                p->waiting_time = p->turnaround_time - p->burst_time;
                p->response_time = p->waiting_time;
                p->remaining_time = 0;
                p->completed = true;
                completed.push_back(*p);
            }
        } else {
            time++;
        }
    }
    return completed;
}

int main() {
    std::vector<Process> processes = {
        {1, 18, 1, 2},
        {2, 24, 5, 3},
        {3, 12, 0, 1},
        {4, 16, 2, 4},
        {5, 20, 3, 0}
    };

    int quantum = 2;
    std::vector<Process> result = roundRobin(processes, quantum);

    for (const auto& p : result) {
        std::cout << "P" << p.pid << " Completion Time: " << p.completion_time << std::endl;
    }

    return 0;
}

import { Task } from '../store/slices/taskSlice';

export const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
        // 1. Completion status (uncompleted first)
        if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
        }

        // 2. Priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (a.priority !== b.priority) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        // 3. Deadline (closer first)
        const deadlineA = new Date(a.deadline).getTime();
        const deadlineB = new Date(b.deadline).getTime();
        if (deadlineA !== deadlineB) {
            return deadlineA - deadlineB;
        }

        // 4. Creation time (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

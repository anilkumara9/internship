import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
    _id: string;
    title: string;
    description: string;
    dateTime: string;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        fetchTasksStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchTasksSuccess: (state, action: PayloadAction<Task[]>) => {
            state.loading = false;
            state.tasks = action.payload;
        },
        fetchTasksFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.tasks.findIndex((t) => t._id === action.payload._id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        },
    },
});

export const {
    fetchTasksStart,
    fetchTasksSuccess,
    fetchTasksFailure,
    addTask,
    updateTask,
    deleteTask,
} = taskSlice.actions;

export default taskSlice.reducer;

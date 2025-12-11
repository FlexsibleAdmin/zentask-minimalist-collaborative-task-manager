import { create } from 'zustand';
import type { Task, CreateTaskDTO, ApiResponse } from '@shared/types';
import { toast } from 'sonner';
interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    listId: string | null;
    setListId: (id: string) => void;
    fetchTasks: () => Promise<void>;
    addTask: (dto: CreateTaskDTO) => Promise<void>;
    toggleTask: (taskId: string, completed: boolean) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    reorderTasks: (newOrder: Task[]) => Promise<void>;
}
export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    listId: null,
    setListId: (id) => set({ listId: id }),
    fetchTasks: async () => {
        const { listId } = get();
        if (!listId) return;
        set({ isLoading: true });
        try {
            const res = await fetch(`/api/tasks?listId=${listId}`);
            const data: ApiResponse<Task[]> = await res.json();
            if (data.success && data.data) {
                set({ tasks: data.data });
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch tasks');
        } finally {
            set({ isLoading: false });
        }
    },
    addTask: async (dto) => {
        const { listId, tasks } = get();
        if (!listId) return;
        // Optimistic update
        const tempId = crypto.randomUUID();
        const optimisticTask: Task = {
            id: tempId,
            title: dto.title,
            completed: false,
            createdAt: Date.now(),
            priority: dto.priority || 'medium'
        };
        // Add to top
        set({ tasks: [optimisticTask, ...tasks] });
        try {
            const res = await fetch(`/api/tasks?listId=${listId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto)
            });
            const data: ApiResponse<Task[]> = await res.json();
            if (data.success && data.data) {
                set({ tasks: data.data });
            } else {
                // Revert on failure
                set({ tasks });
                toast.error('Failed to add task');
            }
        } catch (error) {
            set({ tasks });
            toast.error('Failed to add task');
        }
    },
    toggleTask: async (taskId, completed) => {
        const { listId, tasks } = get();
        if (!listId) return;
        const previousTasks = tasks;
        set({
            tasks: tasks.map(t => t.id === taskId ? { ...t, completed } : t)
        });
        try {
            const res = await fetch(`/api/tasks/${taskId}?listId=${listId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed })
            });
            const data: ApiResponse<Task[]> = await res.json();
            if (!data.success) throw new Error(data.error);
        } catch (error) {
            set({ tasks: previousTasks });
            toast.error('Failed to update task');
        }
    },
    deleteTask: async (taskId) => {
        const { listId, tasks } = get();
        if (!listId) return;
        const previousTasks = tasks;
        set({ tasks: tasks.filter(t => t.id !== taskId) });
        try {
            const res = await fetch(`/api/tasks/${taskId}?listId=${listId}`, {
                method: 'DELETE'
            });
            const data: ApiResponse<Task[]> = await res.json();
            if (!data.success) throw new Error(data.error);
        } catch (error) {
            set({ tasks: previousTasks });
            toast.error('Failed to delete task');
        }
    },
    reorderTasks: async (newOrder) => {
        const { listId, tasks } = get();
        if (!listId) return;
        const previousTasks = tasks;
        set({ tasks: newOrder });
        try {
            const res = await fetch(`/api/tasks/reorder?listId=${listId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });
            const data: ApiResponse<Task[]> = await res.json();
            if (!data.success) throw new Error(data.error);
        } catch (error) {
            set({ tasks: previousTasks });
            toast.error('Failed to reorder tasks');
        }
    }
}));
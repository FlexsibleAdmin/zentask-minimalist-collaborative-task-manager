import { DurableObject } from "cloudflare:workers";
import type { Task, UpdateTaskDTO } from '@shared/types';
// **DO NOT MODIFY THE CLASS NAME**
export class GlobalDurableObject extends DurableObject {
    // Helper to get key for a list
    private getListKey(listId: string): string {
        return `tasks_${listId}`;
    }
    async getTasks(listId: string): Promise<Task[]> {
        const tasks = await this.ctx.storage.get<Task[]>(this.getListKey(listId));
        return tasks || [];
    }
    async addTask(listId: string, task: Task): Promise<Task[]> {
        const tasks = await this.getTasks(listId);
        // Add to beginning of list for "newest first" feel, or end? 
        // Usually todos are added to the bottom or top. Let's add to top (beginning) for visibility.
        const updatedTasks = [task, ...tasks];
        await this.ctx.storage.put(this.getListKey(listId), updatedTasks);
        return updatedTasks;
    }
    async updateTask(listId: string, taskId: string, updates: UpdateTaskDTO): Promise<Task[]> {
        const tasks = await this.getTasks(listId);
        const updatedTasks = tasks.map(t =>
            t.id === taskId ? { ...t, ...updates } : t
        );
        await this.ctx.storage.put(this.getListKey(listId), updatedTasks);
        return updatedTasks;
    }
    async deleteTask(listId: string, taskId: string): Promise<Task[]> {
        const tasks = await this.getTasks(listId);
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        await this.ctx.storage.put(this.getListKey(listId), updatedTasks);
        return updatedTasks;
    }
    async reorderTasks(listId: string, newOrderTasks: Task[]): Promise<Task[]> {
        // We overwrite the list with the new order provided by the client
        await this.ctx.storage.put(this.getListKey(listId), newOrderTasks);
        return newOrderTasks;
    }
}
import { Hono } from "hono";
import { Env } from './core-utils';
import type { Task, ApiResponse, CreateTaskDTO, UpdateTaskDTO } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // GET /api/tasks?listId=...
    app.get('/api/tasks', async (c) => {
        const listId = c.req.query('listId');
        if (!listId) return c.json({ success: false, error: 'Missing listId' }, 400);
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getTasks(listId);
        return c.json({ success: true, data } satisfies ApiResponse<Task[]>);
    });
    // POST /api/tasks?listId=...
    app.post('/api/tasks', async (c) => {
        const listId = c.req.query('listId');
        if (!listId) return c.json({ success: false, error: 'Missing listId' }, 400);
        try {
            const body = await c.req.json() as CreateTaskDTO;
            if (!body.title) return c.json({ success: false, error: 'Title is required' }, 400);
            const newTask: Task = {
                id: crypto.randomUUID(),
                title: body.title,
                completed: false,
                createdAt: Date.now(),
                priority: body.priority || 'medium'
            };
            const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            const data = await stub.addTask(listId, newTask);
            return c.json({ success: true, data } satisfies ApiResponse<Task[]>);
        } catch (e) {
            return c.json({ success: false, error: 'Invalid request body' }, 400);
        }
    });
    // PUT /api/tasks/reorder?listId=...
    app.put('/api/tasks/reorder', async (c) => {
        const listId = c.req.query('listId');
        if (!listId) return c.json({ success: false, error: 'Missing listId' }, 400);
        try {
            const tasks = await c.req.json() as Task[];
            const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            const data = await stub.reorderTasks(listId, tasks);
            return c.json({ success: true, data } satisfies ApiResponse<Task[]>);
        } catch (e) {
            return c.json({ success: false, error: 'Invalid request body' }, 400);
        }
    });
    // PUT /api/tasks/:id?listId=...
    app.put('/api/tasks/:id', async (c) => {
        const listId = c.req.query('listId');
        const taskId = c.req.param('id');
        if (!listId) return c.json({ success: false, error: 'Missing listId' }, 400);
        try {
            const updates = await c.req.json() as UpdateTaskDTO;
            const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            const data = await stub.updateTask(listId, taskId, updates);
            return c.json({ success: true, data } satisfies ApiResponse<Task[]>);
        } catch (e) {
            return c.json({ success: false, error: 'Invalid request body' }, 400);
        }
    });
    // DELETE /api/tasks/:id?listId=...
    app.delete('/api/tasks/:id', async (c) => {
        const listId = c.req.query('listId');
        const taskId = c.req.param('id');
        if (!listId) return c.json({ success: false, error: 'Missing listId' }, 400);
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.deleteTask(listId, taskId);
        return c.json({ success: true, data } satisfies ApiResponse<Task[]>);
    });
}
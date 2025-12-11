import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Task } from "@shared/types";
import { TaskCheckbox } from "@/components/ui/task-checkbox";
import { useTaskStore } from "@/store/useTaskStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
interface TaskItemProps {
  task: Task;
}
export function TaskItem({ task }: TaskItemProps) {
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md",
        isDragging && "opacity-50 shadow-xl ring-2 ring-indigo-500/20",
        task.completed && "bg-muted/30"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground/30 hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      {/* Checkbox */}
      <TaskCheckbox
        checked={task.completed}
        onCheckedChange={(checked) => toggleTask(task.id, checked)}
      />
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "truncate text-base font-medium transition-all",
            task.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
          )}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
            <span className={cn(
                "text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded",
                task.priority === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                task.priority === 'medium' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            )}>
                {task.priority}
            </span>
            <span className="text-xs text-muted-foreground">
                {new Date(task.createdAt).toLocaleDateString()}
            </span>
        </div>
      </div>
      {/* Actions */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTask(task.id)}
        className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
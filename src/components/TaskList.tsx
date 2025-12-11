import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTaskStore } from "@/store/useTaskStore";
import { TaskItem } from "@/components/TaskItem";
import { motion, AnimatePresence } from "framer-motion";
export function TaskList() {
  const tasks = useTaskStore((s) => s.tasks);
  const reorderTasks = useTaskStore((s) => s.reorderTasks);
  const isLoading = useTaskStore((s) => s.isLoading);
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8, // Prevent accidental drags
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      const newOrder = arrayMove(tasks, oldIndex, newIndex);
      reorderTasks(newOrder);
    }
  };
  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted/50" />
        ))}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted/30 p-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground">No tasks yet</h3>
        <p className="text-sm text-muted-foreground">
          Create your first task to get started.
        </p>
      </div>
    );
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layoutId={task.id}
              >
                <TaskItem task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
import { useState, KeyboardEvent } from "react";
import { Plus, CornerDownLeft } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function CreateTaskInput() {
  const [title, setTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const addTask = useTaskStore((s) => s.addTask);
  const handleSubmit = async () => {
    if (!title.trim()) return;
    const taskTitle = title;
    setTitle(""); // Optimistic clear
    await addTask({
      title: taskTitle,
      priority: 'medium'
    });
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div
      className={cn(
        "relative flex items-center gap-2 rounded-2xl border bg-background p-2 shadow-sm transition-all duration-200",
        isFocused ? "border-indigo-500 ring-4 ring-indigo-500/10" : "border-input"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
        <Plus className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Add a new task..."
        className="flex-1 bg-transparent text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none"
      />
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={!title.trim()}
        className={cn(
          "h-9 transition-all",
          title.trim() 
            ? "bg-indigo-600 hover:bg-indigo-700 text-white px-4" 
            : "bg-transparent text-muted-foreground hover:bg-muted px-2"
        )}
      >
        {title.trim() ? (
          <span className="flex items-center gap-2">
            Add <CornerDownLeft className="h-3.5 w-3.5 opacity-70" />
          </span>
        ) : (
          <span className="text-xs font-medium">Enter</span>
        )}
      </Button>
    </div>
  );
}
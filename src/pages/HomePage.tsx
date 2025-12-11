import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Toaster } from 'sonner';
import { Share2, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TaskList } from '@/components/TaskList';
import { CreateTaskInput } from '@/components/CreateTaskInput';
import { useTaskStore } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const listIdParam = searchParams.get('listId');
  const setListId = useTaskStore(s => s.setListId);
  const fetchTasks = useTaskStore(s => s.fetchTasks);
  const tasks = useTaskStore(s => s.tasks);
  useEffect(() => {
    let id = listIdParam;
    if (!id) {
      id = uuidv4();
      setSearchParams({ listId: id }, { replace: true });
    }
    if (id) {
      setListId(id);
      fetchTasks();
    }
  }, [listIdParam, setListId, fetchTasks, setSearchParams]);
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard', {
      description: 'Share this URL to collaborate on this list.',
    });
  };
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  return (
    <AppLayout container>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle className="relative top-0 right-0" />
      </div>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              My Tasks
            </h1>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <p className="text-lg">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>{completedCount}/{totalCount} completed</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {/* Input Section */}
        <div className="sticky top-4 z-40">
          <CreateTaskInput />
        </div>
        {/* List Section */}
        <div className="min-h-[300px]">
          <TaskList />
        </div>
      </div>
      <Toaster richColors position="bottom-center" />
    </AppLayout>
  );
}
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
interface TaskCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}
export function TaskCheckbox({ checked, onCheckedChange, className }: TaskCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onCheckedChange(!checked);
      }}
      className={cn(
        "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked
          ? "border-indigo-600 bg-indigo-600"
          : "border-muted-foreground/30 hover:border-indigo-600/50",
        className
      )}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 text-white"
        initial={false}
        animate={checked ? "checked" : "unchecked"}
      >
        <motion.path
          d="M20 6L9 17l-5-5"
          variants={{
            checked: { pathLength: 1, opacity: 1, transition: { duration: 0.2 } },
            unchecked: { pathLength: 0, opacity: 0, transition: { duration: 0.1 } },
          }}
        />
      </motion.svg>
    </button>
  );
}
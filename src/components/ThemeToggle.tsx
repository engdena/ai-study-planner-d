import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, MoonStar } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme, dim, toggleDim } = useTheme();
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggleTheme}
        className="btn-ghost-icon"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" strokeWidth={1.5} />
        ) : (
          <Moon className="w-4 h-4" strokeWidth={1.5} />
        )}
      </button>
      {theme === "dark" && (
        <button
          onClick={toggleDim}
          className={`btn-ghost-icon ${dim ? "text-foreground border-border bg-muted/40" : ""}`}
          aria-label="Toggle dim mode"
          title="Dim mode for late-night sessions"
        >
          <MoonStar className="w-4 h-4" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};

export default ThemeToggle;

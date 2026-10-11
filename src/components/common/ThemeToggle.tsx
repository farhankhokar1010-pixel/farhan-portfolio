"use client";
import { usePreferences } from "./PreferencesProvider";
import { Button } from "./Button";

export function ThemeToggle() {
  const { theme, toggleTheme } = usePreferences();
  return (
    <Button variant="secondary" onClick={toggleTheme} aria-pressed={theme === "dark"}>
      {theme === "dark" ? "Dark" : "Light"} mode
    </Button>
  );
}

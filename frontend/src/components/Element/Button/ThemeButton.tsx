import clsx from "clsx";
import { useTheme } from "next-themes";
import * as React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

type ThemeButtonProps = React.ComponentPropsWithoutRef<"button">;

export default function ThemeButton({ className, ...rest }: ThemeButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  return (
    <button
      className={clsx(
        "rounded-md p-1 focus:outline-none md:p-1.5",
        "border dark:border-gray-600",
        "hover:border-emerald-300 hover:text-emerald-300 dark:hover:border-emerald-300 dark:hover:text-emerald-300",
        "focus-visible:border-emerald-300 focus-visible:text-emerald-300 dark:focus-visible:border-emerald-300 dark:focus-visible:text-emerald-300",
        "text-lg md:text-xl",
        className
      )}
      {...rest}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {mounted ? (
        <>
          {theme === "light" ? (
            <FiMoon className="size-4" />
          ) : (
            <FiSun className="size-4" />
          )}
        </>
      ) : (
        <FiSun />
      )}
    </button>
  );
}

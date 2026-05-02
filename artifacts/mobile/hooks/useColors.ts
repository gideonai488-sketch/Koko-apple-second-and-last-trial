import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

/**
 * Returns the design tokens for the current color scheme.
 * Respects the user's manual theme override from ThemeContext,
 * falling back to the system preference when set to "system".
 */
export function useColors() {
  const systemScheme = useColorScheme();
  const { theme } = useTheme();

  let scheme: "light" | "dark";
  if (theme === "light") {
    scheme = "light";
  } else if (theme === "dark") {
    scheme = "dark";
  } else {
    scheme = systemScheme === "dark" ? "dark" : "light";
  }

  const palette =
    scheme === "dark" && "dark" in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;

  return { ...palette, radius: colors.radius };
}

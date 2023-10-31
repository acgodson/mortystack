import { extendTheme } from "@chakra-ui/react";

const customTheme = {
  colors: {
    light: {
      background: "#FFFFFF",
      text: "#333333",
      primary: "#007BFF",
    },
    dark: {
      background: "#333333",
      text: "#FFFFFF",
      primary: "#61dafb",
    },
  },
};

const Theme = extendTheme({
  ...customTheme,
});

export { Theme };

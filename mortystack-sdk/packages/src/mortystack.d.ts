import { Theme } from "./themes/index";
import { MortyStackProviderProps } from "./components/MortyStackProvider/";
import { PayButtonProps } from "./components/PayButton/PayButton";

declare module "morty-stack" {
  export type { PayButtonProps, Theme, MortyStackProviderProps };
}

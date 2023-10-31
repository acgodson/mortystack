import type * as I18nTypes from "i18n-js";
import { I18n } from "i18n-js/dist/require/index.js";

import en_US from "./en_US.json";

export type Locale = "en";

// biome-ignore format: locale keys

export const i18n = new I18n({
  en: en_US,
  "en-US": en_US,
});

i18n.defaultLocale = "en-US";
i18n.locale = "en-US";
i18n.enableFallback = true;

// I18nTypes.I18n
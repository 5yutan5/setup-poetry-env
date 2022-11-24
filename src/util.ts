export enum State {
  CACHE_SEARCH_KEY = "poetry-cache-search-key",
  CACHE_MATCHED_KEY = "poetry-cache-matched-key",
  CACHE_PATHS = "poetry-cache-paths",
}

export const IS_WINDOWS = process.platform === "win32";
export const IS_LINUX = process.platform === "linux";
export const IS_MAC = process.platform === "darwin";

// https://github.com/actions/toolkit/blob/819157bf872a49cfcc085190da73894e7091c83c/packages/core/src/core.ts#L126
export function setInput(name: string, value: string) {
  process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] = value;
}

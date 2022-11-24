import * as core from "@actions/core";
import * as cache from "@actions/cache";

import { setInput, State } from "./util";

function hackSetupPython(): void {
  const cache = core.getInput("cache-dependencies") == "true" ? "poetry" : "";
  setInput("cache", cache);
}

async function cachePoetryInstallation(): Promise<void> {
  const cachePaths = JSON.parse(core.getState(State.CACHE_PATHS)) as string[];
  const searchKey = core.getState(State.CACHE_SEARCH_KEY);
  const matchedKey = core.getState(State.CACHE_MATCHED_KEY);
  if (searchKey === matchedKey) {
    core.info(`Cache hit occurred on the key ${searchKey}, not saving cache.`);
    return;
  }

  const cacheId = await cache.saveCache(cachePaths, searchKey);
  if (cacheId == -1) core.warning("Failed to cache Poetry installation.");
  else core.info(`Poetry installation saved with the key: ${searchKey}`);
}

export async function run() {
  try {
    await cachePoetryInstallation();

    hackSetupPython();
    await import("setup-python/src/cache-save");
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();

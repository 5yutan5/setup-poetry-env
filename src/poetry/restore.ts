import { EOL } from "node:os";
import * as fs from "node:fs";
import * as exec from "@actions/exec";
import * as cache from "@actions/cache";
import * as core from "@actions/core";

import { IS_WINDOWS, State } from "../util";

async function getPythonVersion(): Promise<string> {
  const { stdout, stderr, exitCode } = await exec.getExecOutput("python3", [
    "--version",
  ]);
  if (exitCode && stderr) throw new Error("Could not get python version");
  return stdout.replace("Python ", "").replace(EOL, "");
}

async function getPipxVersion(): Promise<string> {
  const { stdout, stderr, exitCode } = await exec.getExecOutput("pipx", [
    "--version",
  ]);
  if (exitCode && stderr) throw new Error("Could not get pipx version");
  return stdout.replace(EOL, "");
}

async function createCacheSearchKey(poetryVersion: string): Promise<string> {
  const pythonVersion = await getPythonVersion();
  const pipxVersion = await getPipxVersion();
  return (
    "setup-poetry-env" +
    `-${process.env["RUNNER_OS"]}` +
    `-system-python-${pythonVersion}` +
    `-pipx-${pipxVersion}` +
    `-poetry-${poetryVersion}`
  );
}

async function getPipxVariables() {
  const { stdout, stderr, exitCode } = await exec.getExecOutput("pipx", [
    "environment",
  ]);

  if (exitCode && stderr)
    throw new Error(
      "Could not get a list of variables used in pipx.constants."
    );

  const lines = stdout.trim().split(EOL);
  lines.splice(-2, 2);
  const variables: any = {};

  for (const line of lines) {
    const [key, value] = line.split("=");
    variables[key] = value;
  }

  return variables as {
    PIPX_LOCAL_VENVS: string;
    PIPX_BIN_DIR: string;
  };
}

async function getCacheDirectories() {
  const pipxVariables = await getPipxVariables();
  const poetryBinFile = IS_WINDOWS
    ? `${pipxVariables["PIPX_BIN_DIR"]}\\poetry.exe`
    : `${pipxVariables["PIPX_BIN_DIR"]}/poetry`;
  const poetryVenvDir = `${pipxVariables["PIPX_LOCAL_VENVS"]}/poetry`;
  return {
    POETRY_BIN_FILE: core.toPlatformPath(poetryBinFile),
    POETRY_VENV_DIR: core.toPlatformPath(poetryVenvDir),
  };
}

// On Windows, symlink broken when restoring from cache.
function recreatePoetrySymlink(poetryBinFile: string, poetryVenvDir: string) {
  fs.unlinkSync(poetryBinFile);
  const poetryExe = core.toPlatformPath(`${poetryVenvDir}/Scripts/poetry.exe`);
  fs.symlinkSync(poetryExe, poetryBinFile);
}

function handleMatchResult(matchedKey: string | undefined, searchKey: string) {
  if (matchedKey) {
    core.saveState(State.CACHE_MATCHED_KEY, matchedKey);
    core.info(`Poetry installation restored from key: ${matchedKey}`);
  } else {
    core.info("Poetry installation cache is not found.");
  }
  core.setOutput("poetry-cache-hit", matchedKey === searchKey);
}

export async function tryRestoringCache(
  poetryVersion: string
): Promise<boolean> {
  core.info("Skip to restore Poetry install on Windows.");
  const searchKey = await createCacheSearchKey(poetryVersion);
  const { POETRY_BIN_FILE, POETRY_VENV_DIR } = await getCacheDirectories();
  const cachePath = [POETRY_BIN_FILE, POETRY_VENV_DIR];
  core.saveState(State.CACHE_PATHS, cachePath);
  core.saveState(State.CACHE_SEARCH_KEY, searchKey);

  const matchedKey = await cache.restoreCache(cachePath, searchKey);
  if (matchedKey && IS_WINDOWS)
    recreatePoetrySymlink(POETRY_BIN_FILE, POETRY_VENV_DIR);

  handleMatchResult(matchedKey, searchKey);
  return matchedKey ? true : false;
}

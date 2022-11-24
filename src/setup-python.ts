import fs from "node:fs";
import path from "node:path";
import * as io from "@actions/io";
import * as core from "@actions/core";
import { run } from "setup-python/src/setup-python";

import { InstallOption } from "./poetry/install";
import { setInput } from "./util";

interface Inputs {
  readonly architecture: string;
  readonly cache: string;
  readonly cacheDependencyPath: string;
  readonly checkLatest: string;
  readonly token: string;
  readonly updateEnvironment: string;
  readonly version: string;
  readonly versionFile: string;
}

async function createHackDependencyFile(
  option: InstallOption
): Promise<string> {
  let key = "";
  if (option.allExtras == "true") key += option.allExtras;
  if (option.extras && option.allExtras != "true") key += option.extras;
  if (option.noRoot == "true") key += option.noRoot;
  if (option.only) key += option.only;
  if (option.with && !option.only) key += option.with;
  if (option.without && !option.only) key += option.without;

  if (option.onlyRoot == "true") key = option.onlyRoot;

  if (key) {
    const githubWorkspace = process.env["GITHUB_WORKSPACE"] ?? process.cwd();
    const tempDir = core.toPlatformPath(`${githubWorkspace}/.setup-poetry-env`);
    await await io.mkdirP(tempDir);
    const keyPath = core.toPlatformPath(`${tempDir}/temp-key.txt`);
    fs.writeFileSync(keyPath, key);
    return keyPath;
  } else {
    return "";
  }
}

function overrideInput(inputs: Inputs, hackPath: string): void {
  let cacheDependencyPath = "**/poetry.lock";
  if (inputs.cacheDependencyPath)
    cacheDependencyPath = inputs.cacheDependencyPath;
  if (hackPath) cacheDependencyPath += "\n" + hackPath;

  setInput("architecture", inputs.architecture);
  setInput("cache", inputs.cache);
  setInput("cache-dependency-path", cacheDependencyPath);
  setInput("check-latest", inputs.checkLatest);
  setInput("update-environment", inputs.updateEnvironment);
  setInput("version", inputs.version);
  setInput("version-file", inputs.versionFile);
}

async function hackActionSetupPython(
  option: InstallOption,
  inputs: Inputs
): Promise<string> {
  const hackDependencyPath = await createHackDependencyFile(option);
  overrideInput(inputs, hackDependencyPath);
  return hackDependencyPath;
}

export async function setupPython(
  poetryInstallOption: InstallOption,
  inputs: Inputs
): Promise<void> {
  const hackFile = await hackActionSetupPython(poetryInstallOption, inputs);
  // Run `actions/setup-python`.
  await run();
  // Remove resources generated for hack.
  if (hackFile) {
    fs.unlinkSync(hackFile);
    fs.rmdirSync(path.dirname(hackFile));
  }
}

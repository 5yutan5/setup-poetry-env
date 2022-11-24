import * as core from "@actions/core";

import { installDependencies } from "./poetry/install";
import { setupPoetry } from "./poetry/setup";
import { setupPython } from "./setup-python";

async function run(): Promise<void> {
  try {
    core.info("----Setup Poetry----");
    await setupPoetry(core.getInput("poetry-version"), {
      cacheDir: core.getInput("poetry-cash-dir"),
      installerMaxWorkers: core.getInput("poetry-installer-max-workers"),
      installerParallel: core.getInput("poetry-installer-parallel"),
      pypiToken: core.getInput("poetry-pypi-token"),
      virtualenvsCreate: core.getInput("poetry-virtualenvs-create"),
      virtualenvsInProject: core.getInput("poetry-virtualenvs-in-project"),
      virtualenvsPath: core.getInput("poetry-virtualenvs-path"),
    });

    const poetryInstallOption = {
      additionalArgs: core.getInput("poetry-install-additional-args"),
      allExtras: core.getInput("poetry-install--all-extras"),
      extras: core.getInput("poetry-install--extras"),
      noRoot: core.getInput("poetry-install--no-root"),
      only: core.getInput("poetry-install--only"),
      onlyRoot: core.getInput("poetry-install--only-root"),
      with: core.getInput("poetry-install--with"),
      without: core.getInput("poetry-install--without"),
    };

    core.info("----Run actions/setup-python----");
    await setupPython(poetryInstallOption, {
      architecture: core.getInput("python-architecture"),
      cache: core.getInput("cache-dependencies") == "true" ? "poetry" : "",
      cacheDependencyPath: core.getInput("python-cache-dependency-path"),
      checkLatest: core.getInput("python-check-latest"),
      token: core.getInput("token"),
      updateEnvironment: core.getInput("python-update-environment"),
      version: core.getInput("python-version"),
      versionFile: core.getInput("python-version-file"),
    });

    if (core.getInput("poetry-install-dependencies") == "true") {
      core.info("----Installing dependencies----");
      await installDependencies(poetryInstallOption);
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();

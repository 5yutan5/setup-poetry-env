import * as exec from "@actions/exec";

export interface Configuration {
  readonly cacheDir: string;
  readonly installerMaxWorkers: string;
  readonly installerParallel: string;
  readonly pypiToken: string;
  readonly virtualenvsCreate: string;
  readonly virtualenvsInProject: string;
  readonly virtualenvsPath: string;
}

async function setSetting(setting: string, value: string): Promise<void> {
  const exitCode = await exec.exec("poetry", ["config", setting, value]);
  if (exitCode)
    throw new Error(`Could not run "poetry config ${setting}" ${value}.`);
}

export async function configurePoetry(config: Configuration): Promise<void> {
  if (config["cacheDir"]) await setSetting("cache-dir", config["cacheDir"]);

  if (config.installerMaxWorkers)
    await setSetting("installer.max-workers", config.installerMaxWorkers);

  if (config.installerParallel == "false")
    await setSetting("installer.parallel", "false");

  if (config.pypiToken == "false") setSetting("pypi-token", config.pypiToken);

  if (config.virtualenvsCreate == "false")
    await setSetting("virtualenvs.in-project", "false");

  if (config.virtualenvsInProject == "true")
    await setSetting("virtualenvs.in-project", "true");

  if (config.virtualenvsPath)
    await setSetting("virtualenvs.path", config.virtualenvsPath);
}

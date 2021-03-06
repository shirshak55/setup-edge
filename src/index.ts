import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as installer from "./installer";
import { getPlatform } from "./platform";
import { valueOfVersion } from "./params";

async function run(): Promise<void> {
  try {
    const version = valueOfVersion(core.getInput("edge-version") || "stable");
    const platform = getPlatform();

    core.info(`Setup Edge ${version}`);

    const installDir = await installer.install(platform, version);
    core.info(`Successfully setup Edge ${version}`);

    core.addPath(installDir);

    const msedgeBin = await io.which("msedge", true);
    await exec.exec("wmic", [
      "datafile",
      "where",
      `name="${msedgeBin.replace(/\\/g, "\\\\")}"`,
      "get",
      "version",
    ]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

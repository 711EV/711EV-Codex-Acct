import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [assetDirectory, repository, releaseTag] = process.argv.slice(2);
if (!assetDirectory || !repository || !/^v\d+\.\d+\.\d+$/.test(releaseTag ?? "")) {
  throw new Error("Usage: create-update-manifest.mjs <asset-directory> <owner/repo> <vX.Y.Z>");
}

const version = releaseTag.slice(1);
const windowsName = `ChatGPT-711EV-${version}-Windows.exe`;
const windowsSignatureName = `ChatGPT-711EV-${version}-Windows.exe.sig`;
const macUpdaterName = `ChatGPT-711EV-${version}-macOS.app.tar.gz`;
const macSignatureName = `${macUpdaterName}.sig`;
const windowsSignature = await signature(windowsSignatureName);
const macSignature = await signature(macSignatureName);
const releaseBase = `https://github.com/${repository}/releases/download/${releaseTag}`;

const manifest = {
  version,
  notes: `ChatGPT账号工具-711EV ${version} 正式版本`,
  pub_date: new Date().toISOString(),
  platforms: {
    "windows-x86_64": {
      signature: windowsSignature,
      url: `${releaseBase}/${encodeURIComponent(windowsName)}`,
    },
    "darwin-x86_64": {
      signature: macSignature,
      url: `${releaseBase}/${encodeURIComponent(macUpdaterName)}`,
    },
    "darwin-aarch64": {
      signature: macSignature,
      url: `${releaseBase}/${encodeURIComponent(macUpdaterName)}`,
    },
  },
};

await writeFile(
  path.join(assetDirectory, "latest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

async function signature(fileName) {
  const value = (await readFile(path.join(assetDirectory, fileName), "utf8")).trim();
  if (!value) throw new Error(`Signature is empty: ${fileName}`);
  return value;
}

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [assetDirectory, repository, releaseTag] = process.argv.slice(2);
const token = process.env.GH_TOKEN;
if (!assetDirectory || !repository || !/^v\d+\.\d+\.\d+$/.test(releaseTag ?? "") || !token) {
  throw new Error("Usage: GH_TOKEN=<token> node upload-release-assets.mjs <asset-directory> <owner/repo> <vX.Y.Z>");
}

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "711EV-Codex-release-uploader",
};
const apiBase = `https://api.github.com/repos/${repository}`;
const release = await githubRequest(`${apiBase}/releases/tags/${encodeURIComponent(releaseTag)}`);
const assets = await githubRequest(`${apiBase}/releases/${release.id}/assets?per_page=100`);

const version = releaseTag.slice(1);
const labels = new Map([
  [`ChatGPT-711EV-${version}-Windows.exe`, `ChatGPT账号工具-711EV-${version}-Windows端安装包.exe`],
  [`ChatGPT-711EV-${version}-macOS.dmg`, `ChatGPT账号工具-711EV-${version}-macOS端安装包.dmg`],
]);

for (const asset of assets) {
  await githubRequest(`${apiBase}/releases/assets/${asset.id}`, { method: "DELETE" });
}

const localAssets = (await readFileList(assetDirectory)).sort();
for (const fileName of localAssets) {
  const content = await readFile(path.join(assetDirectory, fileName));
  const label = labels.get(fileName);
  const query = new URLSearchParams({ name: fileName });
  if (label) query.set("label", label);
  const uploadUrl = `https://uploads.github.com/repos/${repository}/releases/${release.id}/assets?${query}`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/octet-stream" },
    body: content,
  });
  if (!response.ok) {
    throw new Error(`上传 Release 附件失败（${response.status}）：${fileName} ${await response.text()}`);
  }
  const uploaded = await response.json();
  if (uploaded.name !== fileName) {
    throw new Error(`GitHub 保存的附件名与预期不一致：预期 ${fileName}，实际 ${uploaded.name}`);
  }
  if (label && uploaded.label !== label) {
    throw new Error(`GitHub 保存的显示标签与预期不一致：预期 ${label}，实际 ${uploaded.label ?? "无"}`);
  }
  console.log(`已上传：${fileName}`);
}

async function readFileList(directory) {
  return readdir(directory, { withFileTypes: true }).then((entries) =>
    entries.filter((entry) => entry.isFile()).map((entry) => entry.name),
  );
}

async function githubRequest(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { ...headers, ...(options.headers ?? {}) } });
  if (!response.ok) {
    throw new Error(`GitHub API 请求失败（${response.status}）：${url} ${await response.text()}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

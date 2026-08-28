# ChatGPT账号工具-711EV

ChatGPT账号工具-711EV 是面向 Windows 和 macOS 的桌面客户端。

## 下载

请前往 [Releases](https://github.com/711EV/711EV-Codex-Acct/releases) 下载最新安装包：

- Windows端：下载带有“Windows端安装包”标识的 `.exe` 文件。
- macOS端：下载带有“macOS端安装包”标识的 `.dmg` 文件，这是支持 Intel 和 Apple Silicon 的通用版 DMG。

Release 中的 `.sig`、带有“macOS端更新包”标识的 `.app.tar.gz` 和 `latest.json` 用于应用内更新，普通安装不需要单独下载或打开。

## Windows 安装

1. 在 Release 附件中选择带有“Windows端安装包”标识的 `.exe` 文件并双击运行安装。
2. 如果出现 Microsoft Defender SmartScreen 蓝色提示，点击 **“更多信息” → “仍要运行”**。当前安装包未配置 Windows Authenticode 商业签名，出现此提示属于正常情况。
3. 安装完成后，从开始菜单打开 **ChatGPT账号工具-711EV**。

## macOS 安装

1. 在 Release 附件中选择带有“macOS端安装包”标识的通用版 DMG，双击打开后，将 **ChatGPT账号工具-711EV** 拖入“应用程序”文件夹。
2. 首次打开时，如果提示 **“Apple 无法验证‘ChatGPT账号工具-711EV’是否包含可能危害 Mac 的恶意软件”** 或 **“来自身份不明的开发者”**，这是因为当前发布包未进行 Apple Developer ID 签名和公证。请按以下步骤放行一次：
   - 打开 **系统设置 → 隐私与安全性**。
   - 滚动到“安全性”部分，在被阻止的应用提示旁点击 **“仍要打开”**。
   - 使用 Touch ID 或管理员密码确认，再点击 **“打开”**。
3. 完成一次放行后，之后从“应用程序”中双击即可正常运行。

本仓库用于产品发布、更新日志和问题反馈，不公开客户端源代码。

从 1.1.0 起，发布流水线从私有源码仓库构建安装包，并为应用内更新生成签名文件和 `latest.json`。维护者需要在本仓库配置 `SOURCE_REPO_URL`、`SOURCE_REPO_AUTH` 和 `TAURI_SIGNING_PRIVATE_KEY` GitHub Actions Secrets。

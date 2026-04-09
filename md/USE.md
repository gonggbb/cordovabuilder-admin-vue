https://help.aliyun.com/zh/lingma/support/faq-mcp

 games@DESKTOP-EH2GAQ2  C:\worksapce\cusworksapce\cordovabuilder-admin\cordovabuilder-admin-vue  main  where uv
 games@DESKTOP-EH2GAQ2  C:\worksapce\cusworksapce\cordovabuilder-admin\cordovabuilder-admin-vue  main  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
downloading uv 0.11.5 (x86_64-pc-windows-msvc)  
installing to C:\Users\games\.local\bin  
 uv.exe  
 uvx.exe  
 uvw.exe  
everything's installed!

To add C:\Users\games\.local\bin to your PATH, either restart your shell or run:

    set Path=C:\Users\games\.local\bin;%Path%   (cmd)
    $env:Path = "C:\Users\games\.local\bin;$env:Path"   (powershell)

 games@DESKTOP-EH2GAQ2  C:\worksapce\cusworksapce\cordovabuilder-admin\cordovabuilder-admin-vue  main  $env:Path = "C:\Users\games\.local\bin;$env:Path"; where uvx
 games@DESKTOP-EH2GAQ2  C:\worksapce\cusworksapce\cordovabuilder-admin\cordovabuilder-admin-vue  main  $env:Path = "C:\Users\games\.local\bin;$env:Path"; uvx --version
uvx 0.11.5 (95eaa68c8 2026-04-08 x86_64-pc-windows-msvc)
 games@DESKTOP-EH2GAQ2  C:\worksapce\cusworksapce\cordovabuilder-admin\cordovabuilder-admin-vue  main  $env:Path = "C:\Users\games\.local\bin;$env:Path"; uvx mcp-server-fetch
Installed 46 packages in 410ms

Received exception from stream: 1 validation error for JSONRPCMessage
Invalid JSON: EOF while parsing a value at line 2 column 0 [type=json_invalid, input_value='\n', input_type=str]
For further information visit https://errors.pydantic.dev/2.12/v/json_invalid

 games@DESKTOP-EH2GAQ2  C:\worksapce\cusworksapce\cordovabuilder-admin\cordovabuilder-admin-vue  main  [Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Users\games\.local\bin", "User")
 games@DESKTOP-EH2GAQ2  C:\worksapce\cusworksapce\cordovabuilder-admin\cordovabuilder-admin-vue  main  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine"); where.exe uvx
C:\Users\games\.local\bin\uvx.exe
 games@DESKTOP-EH2GAQ2  C:\worksapce\cusworksapce\cordovabuilder-admin\cordovabuilder-admin-vue  main 

我来帮你分析并解决这个 MCP Server fetch 启动错误。

## 问题分析

从错误信息来看：

```
exec: "uvx": executable file not found in %PATH%
```

这表明系统找不到 `uvx` 命令，原因是 **uvx 没有安装或者没有添加到系统的 PATH 环境变量中**。

`uvx` 是 Python 包管理工具 [uv](https://github.com/astral-sh/uv) 提供的一个命令，用于快速运行 Python 工具而无需全局安装。

## 解决方案

让我先检查一下你的系统中是否已经安装了 uv：

```toolCall::run_in_terminal::call_c1f41457c3cc42bc88a4f7c7::INIT

```

系统中没有安装 uv。让我为你安装它：

```toolCall::run_in_terminal::call_93926c860246494dab52b80a::INIT

```

太好了！uv 已经成功安装。现在需要将 `C:\Users\games\.local\bin` 添加到系统的 PATH 环境变量中。

让我先验证一下 uvx 是否可用：

```toolCall::run_in_terminal::call_6cb321892d394a5fb5bfec47::INIT

```

验证 uvx 版本信息

```toolCall::run_in_terminal::call_d31b366315fe4aa39a765119::INIT

```

完美！现在让我测试一下 MCP Server fetch 是否能正常运行：

```toolCall::run_in_terminal::call_39f09ae9347f419db96bab89::INIT

```

太好了！MCP Server fetch 已经成功启动并运行了。虽然最后出现了一个 JSON 解析的异常信息，但这是因为我们直接运行命令而没有通过正确的 MCP 协议进行通信，这是正常的。重要的是它已经能够：

1. ✅ 找到 `uvx` 命令
2. ✅ 下载并安装所有依赖包
3. ✅ 成功启动服务

现在让我帮你将 `C:\Users\games\.local\bin` 永久添加到系统 PATH 环境变量中，这样以后就不需要每次手动设置了：

```toolCall::run_in_terminal::call_abbbad9b209a42a796907ab6::INIT

```

完美！现在让我验证一下环境变量是否设置成功：

```toolCall::run_in_terminal::call_d36fd5741ac9447cbfc6a802::INIT

```

## ✅ 问题已解决！

我已经成功解决了你的 MCP Server fetch 启动错误问题。以下是完成的操作：

### 📋 问题原因

系统找不到 `uvx` 命令，因为 Python 工具 [uv](https://github.com/astral-sh/uv) 没有安装。

### 🔧 解决方案

1. **安装了 uv 工具** - 使用 PowerShell 脚本从官方源安装了最新版本的 uv (v0.11.5)
2. **配置了环境变量** - 将 `C:\Users\games\.local\bin` 永久添加到用户 PATH 环境变量中
3. **验证了安装** - 确认 `uvx` 命令可以正常运行，MCP Server fetch 能够成功启动

### 📝 后续步骤

为了让环境变量在当前终端会话中生效，你需要：

- **重启 VSCode** 或
- **重新打开终端窗口**

重启后，你的 MCP Server fetch 应该能够正常启动，不再报 `executable file not found in %PATH%` 的错误。

### 💡 提示

如果以后需要使用其他基于 uv 的 MCP 服务器（如 `uvx mcp-server-*`），现在都可以直接运行了，无需额外配置。

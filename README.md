# Cordova Builder Admin Vue

基于 Vue 3 + Vite + TypeScript 的 Cordova 构建管理后台。

## 技术栈

- **前端框架**: Vue 3.5+
- **构建工具**: Vite 8+
- **语言**: TypeScript 6+
- **状态管理**: Pinia 3+
- **路由**: Vue Router 5+
- **样式**: Tailwind CSS 4+ + DaisyUI 5+
- **测试**: Vitest 4+

## 开发环境要求

- Node.js: ^20.19.0 或 >=22.12.0
- pnpm: 最新版本

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173 查看应用。

# 镜像下载软件说明

**平台兼容性说明：**

- **Linux x64** - 使用 info 样式的徽章，带有一个芯片图标，标明这是 Linux 64位平台的软件包
- **Ubuntu 22.04** - 使用 outline 样式的徽章，明确标注目标容器系统版本

**跨平台运行支持：**

虽然软件包是针对 Linux x64 平台的，但通过 Docker 技术，可以在以下环境中运行：

- ✅ **macOS (Intel)** - 通过 Docker Desktop for Mac 完美支持
- ✅ **macOS (Apple Silicon M1/M2/M3)** - 通过 Docker Desktop + Rosetta 2/QEMU 转译支持
- ✅ **Windows 10/11** - 通过 Docker Desktop + WSL2 或 Hyper-V 支持
- ✅ **Linux** - 原生支持，性能最佳

**工作原理：**

Docker Desktop 在 macOS 和 Windows 上会创建一个轻量级的 Linux 虚拟机，所有基于 Linux 的容器都在这个虚拟机中运行。因此，无论您的开发环境是什么操作系统，都可以使用这些 Linux x64 的环境变量软件包进行 Cordova 项目构建。

# Cordova Builder Admin Vue

基于 Vue 3 + Vite + TypeScript 的 Cordova 构建管理后台。

## 功能特性

- 🎨 现代化的 UI 界面（Tailwind CSS + DaisyUI）
- 📦 多版本 Cordova 环境配置管理
- 🔄 实时从后端 API 获取配置预设
- 🌙 支持多种主题切换
- ⚡ 快速开发和热更新
- 💻 **内置 SSH 终端** - 直接在 Web 界面中连接远程服务器并执行命令

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

### 3. 后端 API 服务

确保后端 API 服务运行在 `http://localhost:3001`，并提供以下接口：

#### GET /env/cordova-presets

获取 Cordova 环境预设配置列表。

**响应示例：**

```json
[
  {
    "id": "cordova-10-ca9",
    "name": "Cordova 10 CA:9",
    "cordovaAndroid": "^9.1.0",
    "sdk": "30.0.3",
    "gradle": "6.5-all",
    "java": "1.8",
    "node": "10.15.3",
    "cmdlineTools": "2.1",
    "cmdlineToolsHash": "14742923_latest"
  },
  {
    "id": "cordova-12-ca10",
    "name": "Cordova 12 CA:10",
    "cordovaAndroid": "^10.1.2",
    "sdk": "30.0.3",
    "gradle": "7.1.1",
    "java": "11",
    "node": "18.20.8",
    "cmdlineTools": "7.0",
    "cmdlineToolsHash": "8512546_latest"
  }
]
```

## API 接口对接

### 配置说明

项目直接通过跨域请求访问后端 API，无需代理配置。

### 环境变量

创建 `.env.development` 或 `.env.production` 文件：

```bash
# 开发环境
VITE_API_BASE_URL=http://localhost:3001

# 生产环境
VITE_API_BASE_URL=http://your-api-server.com
```

### API 模块

所有 API 请求封装在 `src/api/` 目录下：

```typescript
// src/api/cordova.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export async function fetchCordovaPresets() {
  const response = await fetch(`${API_BASE_URL}/env/cordova-presets`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
```

### Store 集成

在 Pinia Store 中调用 API：

```typescript
// src/stores/cordova.ts
async function loadConfigs() {
  loading.value = true
  error.value = null

  try {
    const data = await fetchCordovaPresets()
    configs.value = data.map((item) => ({
      // ... 数据转换
    }))
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

## 项目结构

```
src/
├── api/              # API 请求模块
│   └── cordova.ts    # Cordova 相关 API
├── assets/           # 静态资源
├── components/       # 通用组件
├── features/         # 功能模块
│   └── home/         # 首页功能
│       ├── Container.vue    # 配置列表容器
│       ├── Fab.vue          # 浮动操作按钮
│       ├── HomeView.vue     # 首页视图
│       └── NavHeader.vue    # 导航栏
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
│   ├── cordova.ts    # Cordova 配置状态
│   ├── counter.ts    # 计数器示例
│   └── theme.ts      # 主题管理
├── views/            # 页面视图
├── App.vue           # 根组件
└── main.ts           # 应用入口
```

## 常用命令

```bash
# 开发模式
pnpm dev

# 类型检查
pnpm type-check

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 运行单元测试
pnpm test:unit

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 注意事项

1. **后端服务**: 确保后端 API 服务正在运行，并正确配置 CORS 允许前端域名访问
2. **跨域配置**: 后端需要设置 `Access-Control-Allow-Origin` 头，允许前端域名
3. **环境变量**: 修改 `.env` 文件后需要重启开发服务器
4. **TypeScript 类型**: 所有 API 响应数据都应定义明确的 TypeScript 类型

## 故障排除

### 无法加载配置

1. 检查后端服务是否运行在配置的地址（默认 `http://localhost:3001`）
2. 打开浏览器开发者工具，查看 Network 标签中的请求状态
3. 检查控制台是否有 CORS 错误信息
4. 确认后端已正确配置跨域支持

### CORS 错误

如果遇到跨域错误，请确保后端服务配置了正确的 CORS 头：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## License

MIT

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

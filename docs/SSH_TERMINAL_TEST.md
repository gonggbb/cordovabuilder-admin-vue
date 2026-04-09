# 快速开始 - SSH 终端测试

## 前提条件

1. 确保后端服务正在运行（支持 WebSocket SSH 连接）
2. 准备一个可访问的 SSH 服务器（可以是本地虚拟机或远程服务器）

## 测试步骤

### 1. 启动开发服务器

```bash
pnpm dev
```

### 2. 访问应用

打开浏览器访问 `http://localhost:5173`

### 3. 激活 Cordova 配置

- 在首页选择一个 Cordova 预设配置
- 点击"下载配置"（模拟下载）
- 下载完成后点击"激活此配置"

### 4. 使用 SSH 终端

系统会弹出对话框，显示两个选项卡：

#### 选项卡 1: 查看命令
- 显示完整的环境变量设置命令
- 可以点击"复制"按钮复制所有命令
- 适合手动在服务器上执行

#### 选项卡 2: SSH 终端
- 切换到"SSH 终端"选项卡
- 填写 SSH 连接信息：
  ```
  服务器地址: your-server-ip
  端口: 22
  用户名: root (或您的用户名)
  密码: your-password
  ```
- 点击"连接"按钮

### 5. 自动执行命令

连接成功后：
- 终端会自动输入环境变量设置命令
- 您可以看到命令执行过程
- 可以手动输入其他命令进行测试

### 6. 断开连接

- 点击终端右上角的红色 × 按钮
- 或者关闭整个对话框

## 简单测试（无后端）

如果您暂时没有后端支持，可以创建一个简单的测试页面：

### 创建测试组件

```vue
<!-- src/components/TestTerminal.vue -->
<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">SSH 终端测试</h2>
    <SshTerminal @connected="onConnected" @disconnected="onDisconnected" />
  </div>
</template>

<script setup lang="ts">
import SshTerminal from '@/components/SshTerminal.vue'

function onConnected() {
  console.log('SSH 连接成功')
}

function onDisconnected() {
  console.log('SSH 连接已断开')
}
</script>
```

### 添加到路由

在 `src/router/index.ts` 中添加测试路由：

```typescript
{
  path: '/test-terminal',
  name: 'TestTerminal',
  component: () => import('@/components/TestTerminal.vue'),
}
```

然后访问 `http://localhost:5173/test-terminal` 进行测试。

## 模拟后端响应（用于前端开发）

如果后端还未就绪，可以在 `SshTerminal.vue` 中临时添加模拟逻辑：

```typescript
// 在 connect() 函数中，替换 WebSocket 部分为：

// 模拟连接成功（仅用于测试）
setTimeout(() => {
  connected.value = true
  connecting.value = false
  emit('connected')
  initTerminal()
  
  // 模拟一些输出
  setTimeout(() => {
    terminal?.writeln('\x1b[32m✓ SSH 连接成功（模拟）\x1b[0m')
    terminal?.writeln('这是一个模拟的 SSH 终端')
    terminal?.writeln('实际使用时需要后端 WebSocket 支持')
    terminal?.write('\r\n$ ')
  }, 500)
}, 1000)
```

## 常见问题

### Q: 为什么连接失败？
A: 检查以下几点：
- 后端 WebSocket 服务是否运行
- 服务器地址和端口是否正确
- 防火墙是否允许连接
- 用户名和密码是否正确

### Q: 终端字体太小/太大？
A: 在 `SshTerminal.vue` 中调整 `fontSize` 参数：
```typescript
terminal = new Terminal({
  fontSize: 16, // 调整这个值
  // ... 其他配置
})
```

### Q: 如何支持 SSH 密钥认证？
A: 需要修改后端实现，添加私钥文件支持。前端可以添加文件上传功能来选择私钥文件。

### Q: 能否保存多个 SSH 连接配置？
A: 当前版本不支持。可以使用浏览器的 localStorage 来实现配置保存功能（注意加密敏感信息）。

## 下一步优化建议

1. **添加连接历史** - 保存常用的 SSH 连接配置
2. **支持 SSH 密钥** - 允许上传和使用私钥文件
3. **会话管理** - 支持同时管理多个 SSH 会话
4. **文件传输** - 集成 SFTP 功能
5. **命令历史记录** - 记录并可以快速重用之前执行的命令
6. **主题切换** - 支持亮色/暗色主题
7. **字体大小调整** - 允许用户自定义终端字体大小

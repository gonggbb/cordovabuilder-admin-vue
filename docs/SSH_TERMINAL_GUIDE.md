# SSH 终端功能使用说明

## 功能概述

项目已集成 SSH 终端功能，允许用户直接在 Web 界面中连接到远程服务器并执行命令。这对于在 Docker 容器中设置 Cordova 环境变量非常有用。

## 使用方式

1. **激活 Cordova 配置**
   - 在首页选择一个 Cordova 配置并点击"激活此配置"
   - 系统会弹出环境变量设置命令对话框

2. **切换到 SSH 终端模式**
   - 在对话框顶部有两个选项卡：
     - "查看命令"：显示完整的命令列表，可以复制
     - "SSH 终端"：打开 SSH 终端直接执行命令

3. **连接 SSH**
   - 在 SSH 终端模式下，输入以下信息：
     - 服务器地址（例如：192.168.1.100）
     - 端口（默认：22）
     - 用户名（例如：root）
     - 密码
   - 点击"连接"按钮

4. **自动执行命令**
   - 连接成功后，系统会自动将环境变量设置命令输入到终端
   - 您可以查看执行结果或手动执行其他命令

5. **断开连接**
   - 点击终端右上角的红色断开按钮即可关闭连接

## 技术实现

### 前端组件

- **SshTerminal.vue**: SSH 终端组件
  - 使用 `@xterm/xterm` 实现终端界面
  - 使用 `@xterm/addon-fit` 实现自适应大小
  - 通过 WebSocket 与后端通信

### 后端要求

后端需要实现 WebSocket 接口来处理 SSH 连接：

**WebSocket 端点**: `ws://localhost:3001/ws/ssh`

**消息格式**:

1. **前端发送 SSH 连接配置**:
```json
{
  "type": "ssh-connect",
  "data": {
    "host": "192.168.1.100",
    "port": 22,
    "username": "root",
    "password": "your_password"
  }
}
```

2. **前端发送命令输入**:
```json
{
  "type": "ssh-input",
  "data": "ls -la\n"
}
```

3. **后端返回连接成功**:
```json
{
  "type": "ssh-connected",
  "data": null
}
```

4. **后端返回错误**:
```json
{
  "type": "ssh-error",
  "data": "认证失败"
}
```

5. **后端返回命令输出**:
```json
{
  "type": "ssh-output",
  "data": "total 0\ndrwxr-xr-x 2 root root 40 Apr 9 16:00 ."
}
```

### 后端实现建议（Node.js + NestJS）

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Client as SSHClient } from 'ssh2';

@WebSocketGateway({ path: '/ws/ssh' })
export class SshGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket) {
    console.log('Client connected');
  }

  handleDisconnect(client: WebSocket) {
    // 清理 SSH 连接
    if ((client as any).sshClient) {
      (client as any).sshClient.end();
    }
    console.log('Client disconnected');
  }

  handleMessage(client: WebSocket, message: string) {
    const data = JSON.parse(message);

    if (data.type === 'ssh-connect') {
      this.handleSshConnect(client, data.data);
    } else if (data.type === 'ssh-input') {
      this.handleSshInput(client, data.data);
    }
  }

  private handleSshConnect(client: WebSocket, config: any) {
    const sshClient = new SSHClient();

    sshClient
      .on('ready', () => {
        client.send(
          JSON.stringify({
            type: 'ssh-connected',
            data: null,
          }),
        );

        sshClient.shell((err, stream) => {
          if (err) {
            client.send(
              JSON.stringify({
                type: 'ssh-error',
                data: err.message,
              }),
            );
            return;
          }

          stream
            .on('close', () => {
              client.close();
            })
            .on('data', (data: Buffer) => {
              client.send(
                JSON.stringify({
                  type: 'ssh-output',
                  data: data.toString(),
                }),
              );
            });

          (client as any).sshStream = stream;
        });
      })
      .on('error', (err) => {
        client.send(
          JSON.stringify({
            type: 'ssh-error',
            data: err.message,
          }),
        );
      })
      .connect({
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
      });

    (client as any).sshClient = sshClient;
  }

  private handleSshInput(client: WebSocket, input: string) {
    if ((client as any).sshStream) {
      (client as any).sshStream.write(input);
    }
  }
}
```

## 环境变量配置

在 `.env` 文件中配置 WebSocket 地址：

```env
VITE_WS_URL=ws://localhost:3001
```

## 安全注意事项

⚠️ **重要提示**:

1. **不要在客户端存储 SSH 凭据** - 当前实现中，密码仅在内存中临时使用，不会持久化
2. **使用 HTTPS/WSS** - 在生产环境中，务必使用 WSS（WebSocket Secure）而不是 WS
3. **添加身份验证** - 建议在建立 WebSocket 连接前进行用户身份验证
4. **限制访问权限** - 确保只有授权用户可以使用 SSH 终端功能
5. **审计日志** - 记录所有 SSH 会话以便审计

## 依赖包

- `@xterm/xterm`: ^6.0.0 - 终端模拟器核心
- `@xterm/addon-fit`: ^0.11.0 - 自适应大小插件
- `@xterm/addon-attach`: ^0.12.0 - WebSocket 附加组件（可选）

## 故障排除

### 问题：无法连接到 SSH

**可能原因**:
- 服务器地址或端口错误
- 防火墙阻止连接
- SSH 服务未运行

**解决方案**:
- 检查服务器地址和端口是否正确
- 确认防火墙允许 SSH 连接（默认端口 22）
- 验证服务器上 SSH 服务正在运行

### 问题：认证失败

**可能原因**:
- 用户名或密码错误
- SSH 密钥认证要求

**解决方案**:
- 仔细检查用户名和密码
- 如果服务器要求密钥认证，需要修改后端实现支持密钥文件

### 问题：终端显示异常

**可能原因**:
- 窗口大小变化未正确处理
- 字体加载问题

**解决方案**:
- 刷新页面重新初始化终端
- 检查浏览器控制台是否有错误信息

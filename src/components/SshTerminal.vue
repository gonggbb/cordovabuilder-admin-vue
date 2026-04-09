<template>
  <div class="ssh-terminal-container">
    <!-- SSH 连接配置 -->
    <div v-if="!connected" class="ssh-config-panel">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            SSH 连接配置
          </h2>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">服务器地址</span>
            </label>
            <input
              v-model="sshConfig.host"
              type="text"
              placeholder="例如: 192.168.1.100"
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">端口</span>
            </label>
            <input
              v-model="sshConfig.port"
              type="number"
              placeholder="22"
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">用户名</span>
            </label>
            <input
              v-model="sshConfig.username"
              type="text"
              placeholder="root"
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">密码</span>
            </label>
            <input
              v-model="sshConfig.password"
              type="password"
              placeholder="输入密码"
              class="input input-bordered w-full"
            />
          </div>

          <div class="alert alert-info mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-current shrink-0 w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>连接信息仅在当前会话中使用，不会被保存</span>
          </div>

          <div class="card-actions justify-end mt-4">
            <button class="btn btn-ghost" @click="$emit('close')">取消</button>
            <button
              class="btn btn-primary"
              @click="connect"
              :disabled="connecting || !isConfigValid"
            >
              <span v-if="connecting" class="loading loading-spinner"></span>
              {{ connecting ? '连接中...' : '连接' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 终端显示区域 -->
    <div v-else class="terminal-wrapper">
      <div class="terminal-header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="badge badge-success badge-sm">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              已连接
            </span>
            <span class="text-sm opacity-70">{{ sshConfig.username }}@{{ sshConfig.host }}</span>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-xs btn-outline" @click="clearTerminal" title="清屏">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button class="btn btn-xs btn-error" @click="disconnect" title="断开连接">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div ref="terminalRef" class="terminal-container"></div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="toast toast-top toast-center">
      <div class="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

interface SSHConfig {
  host: string
  port: number
  username: string
  password: string
}

const props = defineProps<{
  initialCommands?: string
}>()

const emit = defineEmits<{
  close: []
  connected: []
  disconnected: []
}>()

const sshConfig = ref<SSHConfig>({
  host: '',
  port: 22,
  username: 'root',
  password: '',
})

const connected = ref(false)
const connecting = ref(false)
const error = ref<string | null>(null)
const terminalRef = ref<HTMLElement | null>(null)

let terminal: Terminal | null = null
let fitAddon: FitAddon | null = null
let ws: WebSocket | null = null

const isConfigValid = computed(() => {
  return sshConfig.value.host && sshConfig.value.username && sshConfig.value.password
})

// 连接到 SSH
async function connect() {
  if (!isConfigValid.value) return

  connecting.value = true
  error.value = null

  try {
    // 创建 WebSocket 连接到后端
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/ws/ssh`
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      // 发送 SSH 连接配置
      ws?.send(
        JSON.stringify({
          type: 'ssh-connect',
          data: sshConfig.value,
        }),
      )
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message.type === 'ssh-connected') {
        connected.value = true
        connecting.value = false
        emit('connected')
        initTerminal()

        // 如果有初始命令，自动执行
        if (props.initialCommands) {
          setTimeout(() => {
            sendCommand(props.initialCommands!)
          }, 500)
        }
      } else if (message.type === 'ssh-error') {
        error.value = message.data
        connecting.value = false
      } else if (message.type === 'ssh-output') {
        // 接收来自后端的输出并写入终端
        terminal?.write(message.data)
      }
    }

    ws.onerror = () => {
      error.value = 'WebSocket 连接失败'
      connecting.value = false
    }

    ws.onclose = () => {
      if (connected.value) {
        disconnect()
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '连接失败'
    connecting.value = false
  }
}

// 初始化终端
function initTerminal() {
  if (!terminalRef.value) return

  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      cursor: '#d4d4d4',
    },
  })

  fitAddon = new FitAddon()
  terminal.loadAddon(fitAddon)

  terminal.open(terminalRef.value)
  fitAddon.fit()

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)

  // 监听用户输入并发送到后端
  terminal.onData((data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'ssh-input',
          data: data,
        }),
      )
    }
  })
}

// 处理窗口大小变化
function handleResize() {
  if (fitAddon && terminal) {
    fitAddon.fit()
  }
}

// 发送命令到后端
function sendCommand(command: string) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: 'ssh-input',
        data: command + '\n',
      }),
    )
  }
}

// 清屏
function clearTerminal() {
  terminal?.clear()
}

// 断开连接
function disconnect() {
  if (ws) {
    ws.close()
    ws = null
  }

  if (terminal) {
    terminal.dispose()
    terminal = null
  }

  connected.value = false
  connecting.value = false
  emit('disconnected')

  window.removeEventListener('resize', handleResize)
}

onMounted(() => {
  // 可以在这里添加一些初始化逻辑
})

onBeforeUnmount(() => {
  disconnect()
})
</script>

<style scoped>
.ssh-terminal-container {
  width: 100%;
  height: 100%;
}

.ssh-config-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.terminal-wrapper {
  display: flex;
  flex-direction: column;
  height: 600px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #1e1e1e;
}

.terminal-header {
  padding: 0.75rem 1rem;
  background: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.terminal-container {
  flex: 1;
  padding: 0.5rem;
  overflow: hidden;
}

:deep(.xterm) {
  height: 100%;
}

:deep(.xterm-viewport) {
  overflow-y: auto;
}
</style>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- 环境变量命令对话框 -->
    <div
      v-if="cordovaStore.showEnvCommands"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-base-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">环境变量设置命令</h3>
            <button class="btn btn-sm btn-circle" @click="cordovaStore.hideEnvCommands()">✕</button>
          </div>

          <div class="alert alert-info mb-4">
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
            <span>在 Docker 容器中执行以下命令来设置环境变量</span>
          </div>

          <!-- 选项卡切换 -->
          <div class="tabs tabs-boxed mb-4">
            <a
              class="tab"
              :class="{ 'tab-active': activeTab === 'commands' }"
              @click="activeTab = 'commands'"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              查看命令
            </a>
            <a
              class="tab"
              :class="{ 'tab-active': activeTab === 'terminal' }"
              @click="activeTab = 'terminal'"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              SSH 终端
            </a>
          </div>

          <!-- 命令查看模式 -->
          <div v-if="activeTab === 'commands'">
            <div class="mockup-code bg-base-300 mb-4 overflow-x-auto language-bash hljs">
              <pre><code>{{ cordovaStore.envCommands }}</code></pre>
            </div>

            <div class="flex gap-2 justify-end">
              <button class="btn btn-sm btn-outline" @click="copyToClipboard()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
                复制
              </button>
              <button class="btn btn-primary btn-sm" @click="cordovaStore.hideEnvCommands()">
                关闭
              </button>
            </div>
          </div>

          <!-- SSH 终端模式 -->
          <div v-else>
            <SshTerminal
              :initial-commands="cordovaStore.envCommands"
              @close="activeTab = 'commands'"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="cordovaStore.loading" class="col-span-full flex justify-center items-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <span class="ml-4 text-lg">加载中...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="cordovaStore.error" class="col-span-full">
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
        <span>{{ cordovaStore.error }}</span>
        <button class="btn btn-sm btn-outline" @click="cordovaStore.loadConfigs()">重试</button>
      </div>
    </div>

    <!-- 配置列表 -->
    <div
      v-else
      v-for="config in cordovaStore.configs"
      :key="config.name"
      class="card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      :class="{
        'bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary shadow-md':
          config.isActive,
        'bg-base-100 shadow-sm': !config.isActive,
        'opacity-60': config.isDownloading,
      }"
    >
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-3">
          <h2
            class="text-lg font-bold flex items-center"
            :class="config.isActive ? 'text-primary' : 'text-base-content'"
          >
            <svg
              v-if="config.isActive"
              class="w-5 h-5 mr-2 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {{ config.name }}
          </h2>
          <span v-if="config.isActive" class="badge badge-primary badge-sm animate-pulse">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            已激活
          </span>
        </div>

        <div class="space-y-2 text-sm">
          <div v-if="config.description" class="text-xs opacity-70 mb-3 italic">
            {{ config.description }}
          </div>

          <div class="flex gap-2 mb-3">
            <span class="badge badge-info badge-sm">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
              Linux x64
            </span>
            <span class="badge badge-outline badge-sm">Ubuntu 22.04</span>
          </div>

          <div class="flex justify-between items-center py-1 border-b border-base-200">
            <span class="opacity-60">Cordova:</span>
            <span class="font-mono font-medium">{{ config.cordovaVersion }}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-base-200">
            <span class="opacity-60">cordova-android:</span>
            <span class="font-mono font-medium">{{ config.cordovaAndroid }}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-base-200">
            <span class="opacity-60">Build Tools:</span>
            <span class="font-mono font-medium">{{ config.buildTools }}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-base-200">
            <span class="opacity-60">SDK:</span>
            <span class="font-mono font-medium">{{ config.profile.sdk }}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-base-200">
            <span class="opacity-60">Gradle:</span>
            <span class="font-mono font-medium">{{ config.profile.gradle }}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-base-200">
            <span class="opacity-60">Java:</span>
            <span class="font-mono font-medium">{{ config.profile.java }}</span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="opacity-60">Node.js:</span>
            <span class="font-mono font-medium">{{ config.profile.node }}</span>
          </div>
        </div>

        <!-- 下载进度 -->
        <div v-if="config.isDownloading" class="mt-4">
          <div class="flex justify-between text-xs mb-1">
            <span>下载进度</span>
            <span class="font-semibold">{{ config.downloadProgress }}%</span>
          </div>
          <progress
            class="progress progress-primary w-full"
            :value="config.downloadProgress"
            max="100"
          ></progress>
        </div>

        <div class="card-actions justify-center mt-6">
          <!-- 未下载状态 -->
          <button
            v-if="!config.isDownloaded && !config.isDownloading"
            class="btn btn-primary btn-sm w-full normal-case"
            @click="cordovaStore.startDownload(config.name)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span class="ml-2">下载配置</span>
          </button>

          <!-- 下载中状态 -->
          <button
            v-if="config.isDownloading"
            class="btn btn-ghost btn-sm w-full normal-case"
            disabled
          >
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span class="ml-2">下载中...</span>
          </button>

          <!-- 已下载但未激活 -->
          <button
            v-if="config.isDownloaded && !config.isActive"
            class="btn btn-success btn-sm w-full normal-case"
            @click="cordovaStore.activateConfig(config.name)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span class="ml-2">激活此配置</span>
          </button>

          <!-- 已激活状态 -->
          <button v-if="config.isActive" class="btn btn-primary btn-sm w-full normal-case" disabled>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span class="ml-2">当前激活配置</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch, ref } from 'vue'
import { useCordovaStore } from '@/stores/cordova.ts'
import SshTerminal from '@/components/SshTerminal.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const cordovaStore = useCordovaStore()
const activeTab = ref<'commands' | 'terminal'>('commands')

// 组件挂载时加载配置
onMounted(() => {
  cordovaStore.loadConfigs()
})

// 监听环境变量命令显示状态，当显示时进行代码高亮
watch(
  () => cordovaStore.showEnvCommands,
  (newValue) => {
    if (newValue) {
      activeTab.value = 'commands' // 重置为命令查看模式
      nextTick(() => {
        const codeElement = document.querySelector('pre code')
        if (codeElement) {
          hljs.highlightElement(codeElement as HTMLElement)
        }
      })
    }
  },
)

function copyToClipboard() {
  navigator.clipboard.writeText(cordovaStore.envCommands).then(() => {
    const btn = document.querySelector('.btn-outline') as HTMLElement | null
    if (btn) {
      const originalHTML = btn.innerHTML
      btn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        已复制
      `
      setTimeout(() => {
        btn.innerHTML = originalHTML
      }, 2000)
    }
  })
}
</script>

<style scoped></style>

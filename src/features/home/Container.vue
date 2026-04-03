<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      v-for="config in cordovaStore.configs"
      :key="config.id"
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
          <div class="flex justify-between items-center py-1 border-b border-base-200">
            <span class="opacity-60">cordova-android:</span>
            <span class="font-mono font-medium">{{ config.cordovaAndroid }}</span>
          </div>
          <div
            v-if="config.cmdlineTools"
            class="flex justify-between items-center py-1 border-b border-base-200"
          >
            <span class="opacity-60">Command-line Tools:</span>
            <span class="font-mono font-medium">{{ config.cmdlineTools }}</span>
          </div>
          <div
            v-if="config.sdk"
            class="flex justify-between items-center py-1 border-b border-base-200"
          >
            <span class="opacity-60">SDK:</span>
            <span class="font-mono font-medium">{{ config.sdk }}</span>
          </div>
          <div
            v-if="config.buildTools"
            class="flex justify-between items-center py-1 border-b border-base-200"
          >
            <span class="opacity-60">Build Tools:</span>
            <span class="font-mono font-medium">{{ config.buildTools }}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-base-200">
            <span class="opacity-60">Gradle:</span>
            <span class="font-mono font-medium">{{ config.gradle }}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-base-200">
            <span class="opacity-60">Java:</span>
            <span class="font-mono font-medium">{{ config.java }}</span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="opacity-60">Node.js:</span>
            <span class="font-mono font-medium">{{ config.node }}</span>
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
            @click="cordovaStore.startDownload(config.id)"
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
            @click="cordovaStore.activateConfig(config.id)"
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
import { useCordovaStore } from '@/stores/cordova'

const cordovaStore = useCordovaStore()
</script>

<style scoped></style>

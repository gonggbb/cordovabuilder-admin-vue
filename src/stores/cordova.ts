import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface CordovaConfig {
  id: string
  name: string
  cordovaAndroid: string
  sdk?: string
  buildTools?: string
  gradle: string
  java: string
  node: string
  cmdlineTools?: string // Android SDK Command-line Tools 版本
  cmdlineToolsHash?: string // Android SDK Command-line Tools 哈希值
  isDownloaded?: boolean
  isActive?: boolean
  downloadProgress?: number
  isDownloading?: boolean
}

export const useCordovaStore = defineStore('cordova', () => {
  const configs = ref<CordovaConfig[]>([
    {
      id: 'cordova-10-ca9',
      name: 'Cordova 10 CA:9',
      cordovaAndroid: '^9.1.0',
      sdk: '30.0.3',
      gradle: '6.5-all',
      java: '1.8',
      node: '10.15.3',
      cmdlineTools: '2.1', // 对应 SDK 30
      // 14742923_latest	10406996_latest	10406996_latest	10406996_latest	10406996_latest	8512546_latest	6609375_latest
      cmdlineToolsHash: '14742923_latest',
      isDownloaded: false,
      isActive: false,
      downloadProgress: 0,
    },
    {
      id: 'cordova-12-ca10',
      name: 'Cordova 12 CA:10',
      cordovaAndroid: '^10.1.2',
      sdk: '30.0.3',
      gradle: '7.1.1',
      java: '11',
      node: '18.20.8',
      cmdlineTools: '7.0',
      cmdlineToolsHash: '8512546_latest',
      isDownloaded: false,
      isActive: false,
      downloadProgress: 0,
    },
    {
      id: 'cordova-12-ca11',
      name: 'Cordova 12 CA:11',
      cordovaAndroid: '11.0.x',
      buildTools: '^32.0.0',
      gradle: '7.4.2',
      java: '11',
      node: '18.20.8',
      cmdlineTools: '11.0', // 对应 SDK 32
      cmdlineToolsHash: '10406996_latest',
      isDownloaded: false,
      isActive: false,
      downloadProgress: 0,
    },
    {
      id: 'cordova-12-ca12',
      name: 'Cordova 12 CA:12',
      cordovaAndroid: '12.0.x',
      buildTools: '^33.0.2',
      gradle: '7.6',
      java: '17.0.10',
      node: '18.20.8',
      cmdlineTools: '11.0', // 对应 SDK 33
      cmdlineToolsHash: '10406996_latest',
      isDownloaded: false,
      isActive: false,
      downloadProgress: 0,
    },
    {
      id: 'cordova-13-ca13',
      name: 'Cordova 13 CA:13',
      cordovaAndroid: '13.0.x',
      buildTools: '^34.0.0',
      gradle: '8.7',
      java: '17.0.10',
      node: '20.19.5',
      cmdlineTools: '11.0', // 对应 SDK 34
      cmdlineToolsHash: '10406996_latest',
      isDownloaded: false,
      isActive: false,
      downloadProgress: 0,
    },
    {
      id: 'cordova-13-ca14',
      name: 'Cordova 13 CA:14',
      cordovaAndroid: '14.0.x',
      buildTools: '^35.0.0',
      gradle: '8.13',
      java: '17.0.10',
      node: '20.19.5',
      cmdlineTools: '11.0', // 对应 SDK 35
      cmdlineToolsHash: '10406996_latest',

      isDownloaded: false,
      isActive: false,
      downloadProgress: 0,
    },
    {
      id: 'cordova-13-ca15',
      name: 'Cordova 13 CA:15',
      cordovaAndroid: '15.0.x',
      buildTools: '^36.0.0',
      gradle: '8.14.2',
      java: '17.0.10',
      node: '20.19.5',
      cmdlineTools: '20.0', // 对应 SDK 36 (Dockerfile 中的版本)
      cmdlineToolsHash: '14706923_latest',
      isDownloaded: false,
      isActive: false,
      downloadProgress: 0,
    },
  ])

  const activeConfig = ref<CordovaConfig | null>(null)

  // 开始下载配置
  function startDownload(configId: string) {
    const config = configs.value.find((c) => c.id === configId)
    if (config) {
      config.isDownloading = true
      config.downloadProgress = 0

      // 模拟下载进度
      const interval = setInterval(() => {
        if (config.downloadProgress! < 100) {
          config.downloadProgress! += 10
        } else {
          clearInterval(interval)
          config.isDownloading = false
          config.isDownloaded = true
        }
      }, 500)
    }
  }

  // 激活配置
  function activateConfig(configId: string) {
    // 取消之前的激活状态
    configs.value.forEach((c) => {
      c.isActive = false
    })

    const config = configs.value.find((c) => c.id === configId)
    if (config && config.isDownloaded) {
      config.isActive = true
      activeConfig.value = config
    }
  }

  // 取消激活
  function deactivateConfig() {
    if (activeConfig.value) {
      activeConfig.value.isActive = false
      activeConfig.value = null
    }
  }

  // 获取已激活的配置
  function getActiveConfig() {
    return activeConfig.value
  }

  // 获取所有配置
  function getAllConfigs() {
    return configs.value
  }

  return {
    configs,
    activeConfig,
    startDownload,
    activateConfig,
    deactivateConfig,
    getActiveConfig,
    getAllConfigs,
  }
})

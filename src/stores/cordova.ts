import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCordovaPresets } from '@/api/cordova'
import type { CordovaConfig, CordovaPresetsApiResponse } from '@/type'

export const useCordovaStore = defineStore('cordova', () => {
  const configs = ref<CordovaConfig[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const activeConfig = ref<CordovaConfig | null>(null)
  const showEnvCommands = ref(false)
  const envCommands = ref('')

  // 从 API 加载配置
  async function loadConfigs() {
    loading.value = true
    error.value = null

    try {
      const data: CordovaPresetsApiResponse = await fetchCordovaPresets()
      console.log('🚀 ~ loadConfigs ~ data:', data)

      // 转换 API 返回的对象格式数据为数组
      configs.value = Object.entries(data.presets).map(([key, item]) => ({
        name: item.name || key,
        description: item.description,
        cordovaVersion: item.cordovaVersion,
        cordovaAndroid: item.cordovaAndroid,
        buildTools: item.buildTools,
        profile: item.profile,
        isDownloaded: false,
        isDownloading: false,
        isActive: false,
        downloadProgress: 0,
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载配置失败'
      console.error('Failed to load cordova presets:', err)
    } finally {
      loading.value = false
    }
  }

  // 开始下载配置
  function startDownload(configName: string) {
    const config = configs.value.find((c) => c.name === configName)
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
  function activateConfig(configName: string) {
    configs.value.forEach((c) => {
      c.isActive = false
    })

    const config = configs.value.find((c) => c.name === configName)
    if (config && config.isDownloaded) {
      config.isActive = true
      activeConfig.value = config

      envCommands.value = generateEnvCommands(config)
      showEnvCommands.value = true
    }
  }

  // 生成环境变量命令
  function generateEnvCommands(config: CordovaConfig): string {
    const javaPath = `/opt/java/java`
    const nodePath = `/opt/nodejs/node`
    const gradlePath = `/opt/gradle/gradle`

    const commands = [
      `# Cordova 预设: ${config.name}`,
      `# Java ${config.profile.java} | Node.js ${config.profile.node} | Gradle ${config.profile.gradle}`,
      '',
      '# ⚠️  重要提示：',
      '# 如果 NestJS 服务正在运行，请先停止服务再执行以下命令',
      '# 否则可能导致服务崩溃或不可预期的行为',
      '',
      '# 0. 停止 NestJS 服务（如果正在运行）',
      `# pm2 stop all  # 如果使用 PM2`,
      `# 或者找到进程并停止: ps aux | grep nest`,
      '',
      '# 1. 删除旧的软连接',
      `sudo rm -f /usr/local/bin/java`,
      `sudo rm -f /usr/local/bin/javac`,
      `sudo rm -f /usr/local/bin/node`,
      `sudo rm -f /usr/local/bin/npm`,
      `sudo rm -f /usr/local/bin/npx`,
      `sudo rm -f /usr/local/bin/gradle`,
      '',
      '# 2. 创建新的软连接',
      `sudo ln -sf ${javaPath}/bin/java /usr/local/bin/java`,
      `sudo ln -sf ${javaPath}/bin/javac /usr/local/bin/javac`,
      `sudo ln -sf ${nodePath}/bin/node /usr/local/bin/node`,
      `sudo ln -sf ${nodePath}/bin/npm /usr/local/bin/npm`,
      `sudo ln -sf ${nodePath}/bin/npx /usr/local/bin/npx`,
      `sudo ln -sf ${gradlePath}/bin/gradle /usr/local/bin/gradle`,
      '',
      '# 3. 设置环境变量',
      `export JAVA_HOME=${javaPath}`,
      `export ANDROID_HOME=/opt/android-sdk`,
      `export ANDROID_SDK_ROOT=/opt/android-sdk`,
      `export GRADLE_HOME=${gradlePath}`,
      `export NODE_HOME=${nodePath}`,
      `export PATH=$JAVA_HOME/bin:$NODE_HOME/bin:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$GRADLE_HOME/bin:$PATH`,
      '',
      '# 4. 验证环境',
      `echo "Java: $(java -version 2>&1 | head -n 1)"`,
      `echo "Node.js: $(node -v)"`,
      `echo "npm: $(npm -v)"`,
      `echo "Gradle: $(gradle -v | head -n 2 | tail -n 1)"`,
      `echo "Cordova: $(cordova --version)"`,
      '',
      '# 5. 重启 NestJS 服务',
      `# pm2 restart all  # 如果使用 PM2`,
      `# 或者重新启动你的服务`,
    ]
    return commands.join('\n')
  }

  // 隐藏环境变量命令
  function hideEnvCommands() {
    showEnvCommands.value = false
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
    loading,
    error,
    activeConfig,
    showEnvCommands,
    envCommands,
    loadConfigs,
    startDownload,
    activateConfig,
    deactivateConfig,
    hideEnvCommands,
    getActiveConfig,
    getAllConfigs,
    generateEnvCommands,
  }
})

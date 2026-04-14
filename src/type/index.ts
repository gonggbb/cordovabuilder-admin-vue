// {
//     "name": "cordova-12-ca11",
//     "description": "Cordova 12 + cordova-android 11.0.x",
//     "cordovaVersion": "12.x",
//     "cordovaAndroid": "11.0.x",
//     "buildTools": "^32.0.0",
//     "profile": {
//         "platform_sdk": "32.0.0",
//         "gradle": "7.4.2",
//         "java": "11",
//         "node": "18.20.8",
//         "cmdline_version": "20",
//         "cmdline_serial": "14742923"
//     }
// }
export interface CordovaPresetProfile {
  platform_sdk: string
  gradle: string
  java: string
  node: string
  cmdline_version: string
  cmdline_serial: string
}

export interface CordovaPresetResponse {
  name: string
  description: string
  cordovaVersion: string
  cordovaAndroid: string
  buildTools: string
  profile: CordovaPresetProfile
}

// 新的 API 响应结构
export interface CordovaPresetsApiResponse {
  presets: Record<string, CordovaPresetResponse>
  default: string
  count: number
}

export interface CordovaConfig {
  name: string
  description: string
  cordovaVersion: string
  cordovaAndroid: string
  buildTools: string
  profile: CordovaPresetProfile
  isDownloaded?: boolean
  isActive?: boolean
  downloadProgress?: number
  isDownloading?: boolean
}

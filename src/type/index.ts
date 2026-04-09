// {
//     "name": "cordova-12-ca11",
//     "description": "Cordova 12 + cordova-android 11.0.x",
//     "cordovaVersion": "12.x",
//     "cordovaAndroid": "11.0.x",
//     "buildTools": "^32.0.0",
//     "profile": {
//         "sdk": "32.0.0",
//         "gradle": "7.4.2",
//         "java": "11",
//         "node": "18.20.8"
//     }
// }
export interface CordovaPresetProfile {
  sdk: string
  gradle: string
  java: string
  node: string
}

export interface CordovaPresetResponse {
  name: string
  description: string
  cordovaVersion: string
  cordovaAndroid: string
  buildTools: string
  profile: CordovaPresetProfile
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

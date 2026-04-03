# Cordova 环境配置管理

## 功能特性

✅ **多版本管理** - 支持 7 种不同的 Cordova 配置组合  
✅ **一键下载** - 自动下载所需的所有依赖（SDK、Gradle、Java、Node.js）  
✅ **进度显示** - 实时显示下载进度  
✅ **快速激活** - 下载完成后可立即激活配置  
✅ **状态可视化** - 清晰显示每个配置的下载和激活状态

## 可用配置列表

### Cordova 10 系列

- **Cordova 10 CA:9**
  - cordova-android: ^9.1.0
  - SDK: 30.0.3
  - Gradle: 6.5-all
  - Java: 1.8
  - Node.js: 10.15.3

### Cordova 12 系列

- **Cordova 12 CA:10**
  - cordova-android: ^10.1.2
  - SDK: 30.0.3
  - Gradle: 7.1.1
  - Java: 11
  - Node.js: 18.20.8

- **Cordova 12 CA:11**
  - cordova-android: 11.0.x
  - Build Tools: ^32.0.0
  - Gradle: 7.4.2
  - Java: 11
  - Node.js: 18.20.8

- **Cordova 12 CA:12**
  - cordova-android: 12.0.x
  - Build Tools: ^33.0.2
  - Gradle: 7.6
  - Java: 17.0.10
  - Node.js: 18.20.8

### Cordova 13 系列

- **Cordova 13 CA:13**
  - cordova-android: 13.0.x
  - Build Tools: ^34.0.0
  - Gradle: 8.7
  - Java: 17.0.10
  - Node.js: 20.19.5

- **Cordova 13 CA:14**
  - cordova-android: 14.0.x
  - Build Tools: ^35.0.0
  - Gradle: 8.13
  - Java: 17.0.10
  - Node.js: 20.19.5

- **Cordova 13 CA:15**
  - cordova-android: 15.0.x
  - Build Tools: ^36.0.0
  - Gradle: 8.14.2
  - Java: 17.0.10
  - Node.js: 20.19.5

## 使用方法

### 1. 下载配置

- 点击任意配置卡片上的 **"下载"** 按钮
- 系统会自动下载该配置所需的所有依赖
- 进度条会实时显示下载进度

### 2. 激活配置

- 下载完成后，**"下载"** 按钮会变为 **"激活此配置"**
- 点击 **"激活此配置"** 按钮即可激活该环境
- 激活后卡片会显示绿色边框和 **"已激活"** 标签

### 3. 状态说明

- **白色卡片** - 未下载
- **进度条显示** - 正在下载
- **绿色边框 + 标签** - 已激活
- **按钮变灰** - 当前激活的配置

## 技术实现

- **状态管理**: Pinia Store
- **进度模拟**: 定时器模拟真实下载进度
- **持久化**: 可集成 localStorage 保存配置状态
- **响应式**: Vue 3 Composition API

## 注意事项

⚠️ 当前为演示版本，下载功能为模拟进度  
⚠️ 实际使用时需要对接真实的下载 API  
⚠️ 同一时间只能激活一个配置  
⚠️ 切换配置会自动取消之前的激活状态

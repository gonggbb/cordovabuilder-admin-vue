# 主题切换功能说明

## 功能特性

✅ **30+ 种主题**：支持 light、dark、cupcake、synthwave、cyberpunk 等 30 多种主题  
✅ **持久化存储**：主题选择自动保存到 localStorage  
✅ **响应式设计**：在所有设备上都能正常工作  
✅ **平滑过渡**：主题切换时有流畅的动画效果  

## 可用主题列表

### 常用主题
- **light** - 浅色主题（默认）
- **dark** - 深色主题
- **cupcake** - 纸杯蛋糕（柔和配色）
- **bumblebee** - 蜜蜂（黄黑配色）
- **emerald** - 翡翠（绿色系）
- **corporate** - 商务（专业配色）

### 特色主题
- **synthwave** - 合成波（霓虹风格）
- **retro** - 复古（怀旧风格）
- **cyberpunk** - 赛博朋克（未来科技）
- **valentine** - 情人（粉色浪漫）
- **halloween** - 万圣（恐怖氛围）
- **dracula** - 吸血鬼（暗黑哥特）

### 其他主题
- aqua, lofi, pastel, fantasy, wireframe, black, luxury, autumn, business, acid, lemonade, night, coffee, winter, dim, nord, sunset, cmyk

## 使用方法

1. 点击右上角的太阳/月亮图标
2. 在下拉菜单中选择喜欢的主题
3. 主题会立即应用并自动保存

## 技术实现

- **状态管理**: Pinia Store
- **持久化**: localStorage
- **UI 框架**: DaisyUI + Tailwind CSS
- **响应式**: Vue 3 Composition API

## 自定义主题

如需自定义主题，可以在 `src/stores/theme.ts` 中修改主题列表。

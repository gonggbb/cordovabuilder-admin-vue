import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const themes = [
    { value: 'light', label: '浅色', icon: 'sun' },
    { value: 'dark', label: '深色', icon: 'moon' },
    { value: 'cupcake', label: '纸杯蛋糕', icon: 'cake' },
    { value: 'bumblebee', label: '蜜蜂', icon: 'flower' },
    { value: 'emerald', label: '翡翠', icon: 'leaf' },
    { value: 'corporate', label: '商务', icon: 'briefcase' },
    { value: 'synthwave', label: '合成波', icon: 'sparkles' },
    { value: 'retro', label: '复古', icon: 'clock' },
    { value: 'cyberpunk', label: '赛博朋克', icon: 'cpu' },
    { value: 'valentine', label: '情人', icon: 'heart' },
    { value: 'halloween', label: '万圣', icon: 'ghost' },
    { value: 'aqua', label: '水蓝', icon: 'droplet' },
    { value: 'lofi', label: '低保真', icon: 'music' },
    { value: 'pastel', label: '粉彩', icon: 'palette' },
    { value: 'fantasy', label: '奇幻', icon: 'wand' },
    { value: 'wireframe', label: '线框', icon: 'layout' },
    { value: 'black', label: '黑色', icon: 'circle' },
    { value: 'luxury', label: '奢华', icon: 'gem' },
    { value: 'dracula', label: '吸血鬼', icon: 'bat' },
    { value: 'autumn', label: '秋天', icon: 'cloud' },
    { value: 'business', label: '企业', icon: 'chart' },
    { value: 'acid', label: '酸性', icon: 'flask' },
    { value: 'lemonade', label: '柠檬水', icon: 'lemon' },
    { value: 'night', label: '夜晚', icon: 'star' },
    { value: 'coffee', label: '咖啡', icon: 'coffee' },
    { value: 'winter', label: '冬天', icon: 'snowflake' },
    { value: 'dim', label: '微光', icon: 'dim' },
    { value: 'nord', label: '北欧', icon: 'mountain' },
    { value: 'sunset', label: '日落', icon: 'sunset' },
    { value: 'cmyk', label: 'CMYK', icon: 'print' },
  ]

  const currentTheme = ref<string>('light')

  function setTheme(theme: string) {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
  }

  return {
    themes,
    currentTheme,
    setTheme,
    initTheme,
  }
})

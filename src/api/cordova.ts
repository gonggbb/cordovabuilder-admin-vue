import type { CordovaPresetResponse } from '@/type'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export async function fetchCordovaPresets(): Promise<CordovaPresetResponse[]> {
  const response = await fetch(`${API_BASE_URL}/env/cordova-presets`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

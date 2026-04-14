import type { CordovaPresetsApiResponse } from '@/type'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export async function fetchCordovaPresets(): Promise<CordovaPresetsApiResponse> {
  const response = await fetch(`${API_BASE_URL}/env/cordova-presets`)
  console.log('🚀 ~ fetchCordovaPresets ~ response:', response)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

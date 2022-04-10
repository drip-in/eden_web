import { uaParser } from '@/transforms/ua';

export interface GlobalStateConfig {
  userAgent: string
  language: string
}

export type GlobalState = ReturnType<typeof createGlobalState>
export const createGlobalState = (config: GlobalStateConfig) => {
  // UserAgent & device info
  const userAgent = {
    original: config.userAgent,
    ...uaParser(config.userAgent)
  }

  return {
    userAgent
  }
}
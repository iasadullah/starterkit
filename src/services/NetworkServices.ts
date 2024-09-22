//src/services/NetworkServices.ts
import axios from 'axios'

import { ANTHROPIC_API_KEY, baseUrl, baseUrlAnthropic, requestTimeout } from '@/configs/Config'

export const fetchPostRpc = async (endpoint: string, data: Record<string, any>) => {
  try {
    const response = await axios.post(baseUrl + endpoint, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: requestTimeout
    })

    return response.data
  } catch (error) {
    console.error('Error in fetchPostRpc:', error)
    throw error
  }
}

export const fetchPostAnthropic = async (endpoint: string, data: Record<string, any>) => {
  try {
    const response = await axios.post(baseUrlAnthropic + endpoint, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ANTHROPIC_API_KEY}`
      },
      timeout: requestTimeout
    })

    return response.data
  } catch (error) {
    console.error('Error in fetchPostAnthropic:', error)
    throw error
  }
}

//src/services/Course-Outline/index.ts
import type { CourseOutlineResponse } from '@/types/courseOutlinetype'
import { fetchPostAnthropic, fetchPostRpc } from '../NetworkServices'

// to get the ai generated outline
export const generateOutline = async (endpoint: string, requestData: {}) => {
  const response = await fetchPostAnthropic(endpoint, requestData)

  return response
}

// to save the outline
export const saveOutline = async (endpoint: string, requestData: {}) => {
  const response = await fetchPostRpc(endpoint, requestData)

  return response
}

// to get the outline list
export const getOutlineList = async (endpoint: string, requestData: {}) => {
  const response: CourseOutlineResponse = await fetchPostRpc(endpoint, requestData)

  return response
}

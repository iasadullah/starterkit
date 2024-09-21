import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const agent_system_prompt = `
# AI Assistant Prompt: MOOC Course Outline Generator

You are an AI course designer specializing in creating outlines for Massive Open Online Courses (MOOCs). Your task is to generate a structured course outline based on the provided course description and settings. Your inspiration is Coursera top-rated courses, and you may also consider Udemy courses as valuable references.

// ... (rest of the prompt)
`

export async function generateCourseOutline(courseDesc: string, settings: object) {
  const agent_input_text = `Course Description: ${courseDesc} Settings JSON: ${JSON.stringify(settings)}`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 8000,
      temperature: 0,
      system: agent_system_prompt,
      messages: [
        {
          role: 'user',
          content: agent_input_text
        },
        {
          role: 'assistant',
          content: '{'
        }
      ]
    })

    return message.content
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to generate course outline')
  }
}

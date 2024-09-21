import { NextResponse } from 'next/server'

import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const agent_system_prompt = `
# AI Assistant Prompt: MOOC Course Outline Generator

You are an AI course designer specializing in creating outlines for Massive Open Online Courses (MOOCs). Your task is to generate a structured course outline based on the provided course description and settings.

Course Structure Settings:
{{settings}}

Generate a comprehensive course outline in JSON format with the following structure:

\`\`\`json
{
  "course_outline": {
    "title": "",
    "description": "",
    "core_learning_objectives": ["", "", "", "", ""],
    "course_tags": ["", "", "", "", ""],
    "course_passing_percentage": {{course_passing_percentage}},
    "modules": [
      {
        "id": "unique_module_id",
        "title": "",
        "description": "",
        "lessons": [
          {
            "id": "unique_lesson_id",
            "title": "",
            "overview": "",
            "topics": [
              {
                "id": "unique_topic_id",
                "title": "",
                "content": ""
              }
            ],
            "quizzes": [
              {
                "id": "unique_quiz_id",
                "title": "",
                "questions": [
                  {
                    "id": "unique_question_id",
                    "question": "",
                    "options": ["", "", "", ""],
                    "correct_answer": ""
                  }
                ],
                "pass_grade": {{quiz_passing_percentage}}
              }
            ],
            "assignment": {
              "id": "unique_assignment_id",
              "title": "",
              "description": "",
              "questions": [
                {
                  "id": "unique_assignment_question_id",
                  "question": ""
                }
              ],
              "pass_grade": {{assignment_passing_percentage}}
            }
          }
        ]
      }
    ]
  }
}
\`\`\`

Ensure the JSON is valid and can be parsed by standard JSON parsers. Adapt the structure based on the provided course description and settings. Generate content that is relevant and coherent.

Important notes:
1. Generate the number of modules and lessons as specified in the settings.
2. Include the specified number of quizzes per lesson with the correct number of questions.
3. Include one assignment per lesson with the specified number of questions.
4. Use the provided passing percentages for quizzes, assignments, and the overall course.
5. Ensure to generate 5 core learning objectives and 5 course tags.

`

export async function POST(request: Request) {
  const { courseDesc, settings } = await request.json()

  const settingsString = Object.entries(settings)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n')

  const formattedSystemPrompt = agent_system_prompt
    .replace('{{settings}}', settingsString)
    .replace('{{course_passing_percentage}}', settings.course_passing_percentage.toString())
    .replace('{{quiz_passing_percentage}}', settings.quiz_passing_percentage.toString())
    .replace('{{assignment_passing_percentage}}', settings.assignment_passing_percentage.toString())

  const agent_input_text = `Course Description: ${courseDesc}`

  const stream = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 8000,
    temperature: 0,
    system: formattedSystemPrompt,
    messages: [{ role: 'user', content: agent_input_text }],
    stream: true
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      let buffer = ''

      for await (const chunk of stream) {
        if ('delta' in chunk) {
          const text = chunk.delta.text || ''

          buffer += text
          controller.enqueue(encoder.encode(text))

          // Try to parse complete JSON objects
          if (buffer.includes('}')) {
            try {
              JSON.parse(buffer)

              // If successful, send the buffer and reset it
              controller.enqueue(encoder.encode('\n---JSON_OBJECT_COMPLETE---\n'))
              buffer = ''
            } catch (e) {
              // If parsing fails, continue buffering
            }
          }
        }
      }

      controller.close()
    }
  })

  return new NextResponse(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}

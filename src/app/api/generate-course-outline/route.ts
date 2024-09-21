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
    "modules": [
      {
        "id": "unique_module_id",
        "title": "",
        "description": "",
        "lessons": [
          {
            "id": "unique_lesson_id",
            "title": "",
            "topics": [
              {
                "id": "unique_topic_id",
                "title": ""
              }
            ]
          }
        ],
        "quiz": {
          "id": "unique_quiz_id",
          "title": "",
          "question_count": 5
        },
        "assignment": {
          "id": "unique_assignment_id",
          "title": "",
          "description": ""
        }
      }
    ]
  }
}
\`\`\`

Ensure the JSON is valid and can be parsed by standard JSON parsers. Adapt the structure based on the provided course description and settings. Generate content that is relevant and coherent.

Important notes:
1. Generate the number of modules and lessons as specified in the settings.
2. Include one quiz per module with the specified number of questions.
3. Include one assignment per module.
4. Ensure to generate 5 core learning objectives and 5 course tags.
5. Do not include detailed content for topics, only titles.
6. Your response must be a valid JSON object and nothing else.
`

export async function POST(request: Request) {
  const { courseDesc, settings } = await request.json()

  const settingsString = Object.entries(settings)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n')

  const formattedSystemPrompt = agent_system_prompt.replace('{{settings}}', settingsString)

  const agent_input_text = `Course Description: ${courseDesc}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4000,
      temperature: 0.5,
      system: formattedSystemPrompt,
      messages: [{ role: 'user', content: agent_input_text }]
    })

    const responseText = response.content[0].text

    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
      const jsonString = jsonMatch[0]

      try {
        const generatedOutline = JSON.parse(jsonString)

        return NextResponse.json(generatedOutline, { status: 200 })
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)

        return NextResponse.json({ error: 'Invalid JSON in AI response' }, { status: 500 })
      }
    } else {
      console.error('No valid JSON found in AI response')

      return NextResponse.json({ error: 'No valid JSON found in AI response' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error generating course outline:', error)

    return NextResponse.json({ error: 'Failed to generate course outline' }, { status: 500 })
  }
}

import React, { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { v4 as uuidv4 } from 'uuid'

import type { Module, Lesson, MediaItem, Quiz, Question, Option } from '@/types/course'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

interface LessonCreationProps {
  onSubmit: (lessons: Lesson[], mediaItems: MediaItem[], quizzes: Quiz[], questions: Question[]) => void
  modules: Module[]
  initialLessons: Lesson[]
  initialMediaItems: MediaItem[]
  initialQuizzes: Quiz[]
  initialQuestions: Question[]
}

export default function LessonCreation({
  onSubmit,
  modules,
  initialLessons,
  initialMediaItems,
  initialQuizzes,
  initialQuestions
}: LessonCreationProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems)
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes)
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addLesson = (moduleId: string) => {
    setLessons(prev => [
      ...prev,
      {
        id: uuidv4(),
        module_id: moduleId,
        title: '',
        content: '',
        position: prev.filter(l => l.module_id === moduleId).length,
        is_prerequisite: false,
        is_published: false
      }
    ])
  }

  const updateLesson = (lessonId: string, field: keyof Lesson, value: string | boolean | number) => {
    setLessons(prev => prev.map(lesson => (lesson.id === lessonId ? { ...lesson, [field]: value } : lesson)))
  }

  const removeLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== lessonId))
    setMediaItems(prev => prev.filter(item => item.lesson_id !== lessonId))
    setQuizzes(prev => prev.filter(quiz => quiz.lesson_id !== lessonId))
    setQuestions(prev =>
      prev.filter(question => !quizzes.find(q => q.id === question.quiz_id && q.lesson_id === lessonId))
    )
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, lessonId: string) => {
    const files = e.target.files

    if (files) {
      const newMediaItems: MediaItem[] = await Promise.all(
        Array.from(files).map(async file => {
          const fileId = uuidv4()
          const fileExtension = file.name.split('.').pop() || ''
          const fileName = `${fileId}.${fileExtension}`

          // Here, you would typically upload the file to your server or cloud storage
          // For this example, we'll just use a placeholder URL
          const uploadedUrl = `https://your-upload-url.com/${fileName}`

          return {
            id: fileId,
            lesson_id: lessonId,
            type: file.type,
            url: uploadedUrl,
            name: file.name,
            file_extension: fileExtension
          }
        })
      )

      setMediaItems(prev => [...prev, ...newMediaItems])
    }
  }

  const removeMediaItem = (mediaItemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== mediaItemId))
  }

  const addQuiz = (lessonId: string) => {
    setQuizzes(prev => [
      ...prev,
      {
        id: uuidv4(),
        lesson_id: lessonId,
        title: '',
        max_attempts: 1
      }
    ])
  }

  const updateQuiz = (quizId: string, field: keyof Quiz, value: string | number) => {
    setQuizzes(prev => prev.map(quiz => (quiz.id === quizId ? { ...quiz, [field]: value } : quiz)))
  }

  const removeQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId))
    setQuestions(prev => prev.filter(question => question.quiz_id !== quizId))
  }

  const addQuestion = (quizId: string) => {
    setQuestions(prev => [
      ...prev,
      {
        id: uuidv4(),
        quiz_id: quizId,
        type: 'multiple_choice',
        question_text: '',
        options: [
          { id: uuidv4(), text: '', is_correct: false },
          { id: uuidv4(), text: '', is_correct: false }
        ],
        correct_answer: null
      }
    ])
  }

  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    setQuestions(prev =>
      prev.map(question => (question.id === questionId ? { ...question, [field]: value } : question))
    )
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(question => question.id !== questionId))
  }

  const addOption = (questionId: string) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId
          ? { ...question, options: [...question.options, { id: uuidv4(), text: '', is_correct: false }] }
          : question
      )
    )
  }

  const updateOption = (questionId: string, optionId: string, field: keyof Option, value: string | boolean) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map(option => (option.id === optionId ? { ...option, [field]: value } : option))
            }
          : question
      )
    )
  }

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId
          ? { ...question, options: question.options.filter(option => option.id !== optionId) }
          : question
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(lessons, mediaItems, quizzes, questions)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {modules.map(module => (
        <div key={module.id} className='p-4 border rounded-md space-y-4'>
          <h3 className='text-lg font-semibold'>{module.title}</h3>
          {lessons
            .filter(lesson => lesson.module_id === module.id)
            .map(lesson => (
              <div key={lesson.id} className='p-3 border rounded space-y-3'>
                <input
                  type='text'
                  value={lesson.title}
                  onChange={e => updateLesson(lesson.id, 'title', e.target.value)}
                  placeholder='Lesson Title'
                  className='w-full p-2 border rounded'
                />

                {mounted && (
                  <ReactQuill
                    theme='snow'
                    value={lesson.content}
                    onChange={content => updateLesson(lesson.id, 'content', content)}
                    className='mt-2'
                  />
                )}

                <div className='mt-4'>
                  <h4 className='font-medium'>Media</h4>
                  <input
                    type='file'
                    onChange={e => handleFileUpload(e, lesson.id)}
                    className='mt-2'
                    multiple
                    accept='image/*,video/*,application/pdf'
                  />
                  <div className='mt-2 space-y-2'>
                    {mediaItems
                      .filter(item => item.lesson_id === lesson.id)
                      .map(item => (
                        <div key={item.id} className='flex items-center justify-between p-2 border rounded'>
                          <span>{item.name}</span>
                          <button
                            type='button'
                            onClick={() => removeMediaItem(item.id)}
                            className='px-2 py-1 bg-red-500 text-white rounded'
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {quizzes
                  .filter(quiz => quiz.lesson_id === lesson.id)
                  .map(quiz => (
                    <div key={quiz.id} className='p-2 border rounded'>
                      <input
                        type='text'
                        value={quiz.title}
                        onChange={e => updateQuiz(quiz.id, 'title', e.target.value)}
                        placeholder='Quiz Title'
                        className='w-full p-2 border rounded'
                      />
                      <input
                        type='number'
                        value={quiz.max_attempts}
                        onChange={e => updateQuiz(quiz.id, 'max_attempts', parseInt(e.target.value) || 1)}
                        placeholder='Max Attempts'
                        className='mt-2 p-2 border rounded'
                      />
                      {questions
                        .filter(question => question.quiz_id === quiz.id)
                        .map(question => (
                          <div key={question.id} className='mt-2 p-2 border rounded'>
                            <input
                              type='text'
                              value={question.question_text}
                              onChange={e => updateQuestion(question.id, 'question_text', e.target.value)}
                              placeholder='Question'
                              className='w-full p-2 border rounded'
                            />
                            <select
                              value={question.type}
                              onChange={e => updateQuestion(question.id, 'type', e.target.value as Question['type'])}
                              className='mt-2 p-2 border rounded'
                            >
                              <option value='multiple_choice'>Multiple Choice</option>
                              <option value='true_false'>True/False</option>
                              <option value='essay'>Essay</option>
                            </select>
                            {question.type === 'multiple_choice' && (
                              <div className='mt-2 space-y-2'>
                                {question.options.map(option => (
                                  <div key={option.id} className='flex items-center space-x-2'>
                                    <input
                                      type='text'
                                      value={option.text}
                                      onChange={e => updateOption(question.id, option.id, 'text', e.target.value)}
                                      placeholder='Option'
                                      className='flex-grow p-2 border rounded'
                                    />
                                    <label className='flex items-center'>
                                      <input
                                        type='checkbox'
                                        checked={option.is_correct}
                                        onChange={e =>
                                          updateOption(question.id, option.id, 'is_correct', e.target.checked)
                                        }
                                        className='mr-2'
                                      />
                                      Correct
                                    </label>
                                    <button
                                      type='button'
                                      onClick={() => removeOption(question.id, option.id)}
                                      className='px-2 py-1 bg-red-500 text-white rounded'
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type='button'
                                  onClick={() => addOption(question.id)}
                                  className='px-2 py-1 bg-green-500 text-white rounded'
                                >
                                  Add Option
                                </button>
                              </div>
                            )}
                            {question.type === 'true_false' && (
                              <div className='mt-2'>
                                <label className='flex items-center'>
                                  <input
                                    type='radio'
                                    checked={question.correct_answer === 'true'}
                                    onChange={() => updateQuestion(question.id, 'correct_answer', 'true')}
                                    className='mr-2'
                                  />
                                  True
                                </label>
                                <label className='flex items-center mt-2'>
                                  <input
                                    type='radio'
                                    checked={question.correct_answer === 'false'}
                                    onChange={() => updateQuestion(question.id, 'correct_answer', 'false')}
                                    className='mr-2'
                                  />
                                  False
                                </label>
                              </div>
                            )}
                            <button
                              type='button'
                              onClick={() => removeQuestion(question.id)}
                              className='mt-2 px-2 py-1 bg-red-500 text-white rounded'
                            >
                              Remove Question
                            </button>
                          </div>
                        ))}
                      <button
                        type='button'
                        onClick={() => addQuestion(quiz.id)}
                        className='mt-2 px-2 py-1 bg-green-500 text-white rounded'
                      >
                        Add Question
                      </button>
                      <button
                        type='button'
                        onClick={() => removeQuiz(quiz.id)}
                        className='mt-2 px-2 py-1 bg-red-500 text-white rounded'
                      >
                        Remove Quiz
                      </button>
                    </div>
                  ))}
                <button
                  type='button'
                  onClick={() => addQuiz(lesson.id)}
                  className='px-2 py-1 bg-green-500 text-white rounded'
                >
                  Add Quiz
                </button>

                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={lesson.is_prerequisite}
                    onChange={e => updateLesson(lesson.id, 'is_prerequisite', e.target.checked)}
                    className='mr-2'
                  />
                  <label>Is Prerequisite</label>
                </div>
                <button
                  type='button'
                  onClick={() => removeLesson(lesson.id)}
                  className='px-2 py-1 bg-red-500 text-white rounded'
                >
                  Remove Lesson
                </button>
              </div>
            ))}
          <button
            type='button'
            onClick={() => addLesson(module.id)}
            className='px-2 py-1 bg-green-500 text-white rounded'
          >
            Add Lesson
          </button>
        </div>
      ))}
      <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded'>
        Next
      </button>
    </form>
  )
}

import React, { useState } from 'react'

import DOMPurify from 'dompurify'

import { supabase } from '@/lib/supabaseClient'
import type { Course, Module, Lesson, MediaItem, Quiz, Question } from '@/types/course'

interface ReviewAndPublishProps {
  course: Course
  modules: Module[]
  lessons: Lesson[]
  mediaItems: MediaItem[]
  quizzes: Quiz[]
  questions: Question[]
  onPublish: () => Promise<void>
  onSaveAsDraft: () => Promise<void>
}

export default function ReviewAndPublish({
  course,
  modules,
  lessons,
  mediaItems,
  quizzes,
  questions,
  onPublish,
  onSaveAsDraft
}: ReviewAndPublishProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCourseJSON = (): any => {
    return {
      course_data: {
        title: course.title,
        description: course.description,
        category: course.category,
        created_by: course.created_by || '038d7837-0c61-42e3-a893-2cbdd994f3c4',
        is_published: course.is_published,
        modules: modules.map(module => ({
          title: module.title,
          description: module.description,
          position: module.position,
          lessons: lessons
            .filter(lesson => lesson.module_id === module.id)
            .map(lesson => ({
              title: lesson.title,
              content: lesson.content,
              position: lesson.position,
              is_prerequisite: lesson.is_prerequisite,
              is_published: lesson.is_published,
              media_items: mediaItems
                .filter(item => item.lesson_id === lesson.id)
                .map(item => ({
                  url: item.url,
                  type: item.type,
                  file_extension: item.file_extension,
                  name: item.name
                })),
              quizzes: quizzes
                .filter(quiz => quiz.lesson_id === lesson.id)
                .map(quiz => ({
                  title: quiz.title,
                  max_attempts: quiz.max_attempts,
                  questions: questions
                    .filter(q => q.quiz_id === quiz.id)
                    .map(question => ({
                      type: question.type,
                      question_text: question.question_text,
                      options: question.options,
                      correct_answer: question.correct_answer
                    }))
                }))
            }))
        }))
      }
    }
  }

  const handlePublish = async () => {
    await saveCourse(true)
    await onPublish()
  }

  const handleSaveAsDraft = async () => {
    await saveCourse(false)
    await onSaveAsDraft()
  }

  const saveCourse = async (isPublished: boolean) => {
    setIsLoading(true)
    setError(null)

    try {
      const courseData = createCourseJSON()

      courseData.course_data.is_published = isPublished

      console.log('Course data to be saved:', JSON.stringify(courseData, null, 2))

      const { data, error } = await supabase.rpc('create_course', courseData)

      if (error) {
        console.error('Supabase error:', error)
        setError(`Error saving course: ${error.message}`)
        throw error
      }

      if (data === null) {
        console.warn('Supabase returned null data. This might indicate an issue with the create_course function.')
        setError('Course was not saved. Please check your Supabase function.')
      } else {
        console.log('Course saved successfully:', data)
      }

      return data
    } catch (error) {
      console.error('Error saving course:', error)
      setError(`An error occurred while saving the course: ${error.message}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const sanitizeHTML = (html: string) => {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }

  return (
    <div className='space-y-8'>
      <h2 className='text-2xl font-bold'>Review Your Course</h2>

      <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>Course Details</h3>
        </div>
        <div className='border-t border-gray-200'>
          <dl>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Title</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{course.title}</dd>
            </div>
            <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Description</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{course.description}</dd>
            </div>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Category</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{course.category}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-xl font-semibold'>Modules and Lessons</h3>
        {modules.map(module => (
          <div key={module.id} className='bg-white shadow overflow-hidden sm:rounded-lg'>
            <div className='px-4 py-5 sm:px-6'>
              <h4 className='text-lg leading-6 font-medium text-gray-900'>{module.title}</h4>
              <p className='mt-1 max-w-2xl text-sm text-gray-500'>{module.description}</p>
            </div>
            <div className='border-t border-gray-200'>
              <ul className='divide-y divide-gray-200'>
                {lessons
                  .filter(lesson => lesson.module_id === module.id)
                  .map(lesson => (
                    <li key={lesson.id} className='px-4 py-4 sm:px-6'>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <p className='text-sm font-medium text-indigo-600 truncate'>{lesson.title}</p>
                          <div className='ml-2 flex-shrink-0 flex'>
                            {lesson.is_prerequisite && (
                              <p className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                                Prerequisite
                              </p>
                            )}
                          </div>
                        </div>
                        <div
                          className='text-sm text-gray-900 quill-content'
                          dangerouslySetInnerHTML={sanitizeHTML(lesson.content)}
                        />

                        {/* Display Media Items */}
                        {mediaItems.filter(item => item.lesson_id === lesson.id).length > 0 && (
                          <div className='mt-2'>
                            <h5 className='text-sm font-medium text-gray-700'>Media Files:</h5>
                            <ul className='list-disc pl-5'>
                              {mediaItems
                                .filter(item => item.lesson_id === lesson.id)
                                .map(item => (
                                  <li key={item.id} className='text-sm text-gray-600'>
                                    {item.name} ({item.type})
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                        {/* Display Quizzes */}
                        {quizzes
                          .filter(quiz => quiz.lesson_id === lesson.id)
                          .map(quiz => (
                            <div key={quiz.id} className='mt-4 border-t pt-2'>
                              <h5 className='text-sm font-medium text-gray-700'>{quiz.title}</h5>
                              <p className='text-xs text-gray-500'>Max attempts: {quiz.max_attempts}</p>
                              <ul className='mt-2 space-y-2'>
                                {questions
                                  .filter(q => q.quiz_id === quiz.id)
                                  .map(question => (
                                    <li key={question.id} className='text-sm'>
                                      <p className='font-medium'>{question.question_text}</p>
                                      {question.type === 'multiple_choice' && (
                                        <ul className='pl-4 mt-1'>
                                          {question.options.map(option => (
                                            <li key={option.id} className={option.is_correct ? 'text-green-600' : ''}>
                                              {option.text} {option.is_correct && '(Correct)'}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                      {question.type === 'true_false' && (
                                        <p className='pl-4 mt-1'>
                                          Correct answer: {question.correct_answer ? 'True' : 'False'}
                                        </p>
                                      )}
                                      {question.type === 'essay' && <p className='pl-4 mt-1 italic'>Essay question</p>}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          ))}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className='flex items-center space-x-4'>
        <button
          onClick={handlePublish}
          disabled={isLoading}
          className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50'
        >
          {isLoading ? 'Publishing...' : 'Publish Course'}
        </button>
        <button
          onClick={handleSaveAsDraft}
          disabled={isLoading}
          className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50'
        >
          {isLoading ? 'Saving...' : 'Save as Draft'}
        </button>
      </div>

      {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  )
}

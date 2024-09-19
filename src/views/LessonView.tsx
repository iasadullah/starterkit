'use client'

import { useState, useEffect } from 'react'

import { getLessonDetails, updateLessonProgress } from '@/api/lessons'
import type { LessonDetails } from '@/types/lessonTypes'

interface LessonViewProps {
  courseId: string
  lessonId: string
}

export default function LessonView({ courseId, lessonId }: LessonViewProps) {
  const [lessonDetails, setLessonDetails] = useState<LessonDetails | null>(null)

  useEffect(() => {
    async function fetchLessonDetails() {
      try {
        const details = await getLessonDetails(courseId, lessonId)

        setLessonDetails(details)
      } catch (error) {
        console.error('Error fetching lesson details:', error)
      }
    }

    fetchLessonDetails()
  }, [courseId, lessonId])

  async function handleCompleteLesson() {
    if (lessonDetails) {
      try {
        await updateLessonProgress(courseId, lessonId, 100, true)
        setLessonDetails({ ...lessonDetails, is_completed: true })
      } catch (error) {
        console.error('Error updating lesson progress:', error)
      }
    }
  }

  if (!lessonDetails) return <div>Loading...</div>

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>{lessonDetails.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: lessonDetails.content }} className='mb-8' />
      {!lessonDetails.is_completed && (
        <button onClick={handleCompleteLesson} className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
          Mark as Complete
        </button>
      )}
    </div>
  )
}

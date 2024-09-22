import { useState, useEffect } from 'react'

import { getUserCourseProgress } from '@/app/api/Courses/progress'
import type { Progress } from '@/types/progressTypes'

interface ProgressProps {
  courseId: string
}

export default function UserProgress({ courseId }: ProgressProps) {
  const [progress, setProgress] = useState<Progress | null>(null)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const progressData = await getUserCourseProgress(courseId)

        setProgress(progressData)
      } catch (error) {
        console.error('Error fetching progress:', error)
      }
    }

    fetchProgress()
  }, [courseId])

  if (!progress) return null

  return (
    <div className='mt-4'>
      <div className='text-lg font-semibold mb-2'>Your Progress</div>
      <div className='w-full bg-gray-200 rounded-full h-2.5'>
        <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: `${progress.percentComplete}%` }}></div>
      </div>
      <div className='text-sm text-gray-600 mt-1'>
        {progress.completedLessons} of {progress.totalLessons} lessons completed ({progress.percentComplete}%)
      </div>
    </div>
  )
}

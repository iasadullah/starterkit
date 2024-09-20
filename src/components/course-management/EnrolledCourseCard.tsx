import React from 'react'

import { useRouter } from 'next/navigation' // Change this import

import { Card, CardContent, Typography, LinearProgress } from '@mui/material'

import type { EnrolledCourse } from '@/types/course-management/course'

interface EnrolledCourseCardProps {
  course: EnrolledCourse
}

export const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({ course }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/enrolled-course/${course.course_id}`)
  }

  return (
    <Card onClick={handleClick} style={{ cursor: 'pointer' }}>
      <CardContent>
        <Typography variant='h5' component='div'>
          {course.title}
        </Typography>
        <Typography color='text.secondary'>{course.description}</Typography>
        <Typography variant='body2'>Enrolled at: {new Date(course.enrolled_at).toLocaleDateString()}</Typography>
        <Typography variant='body2'>Progress: {course.progress}%</Typography>
        <LinearProgress
          variant='determinate'
          value={course.progress}
          style={{ marginTop: '10px', marginBottom: '10px' }}
        />
        <Typography variant='body2'>Status: {course.status}</Typography>
        <Typography variant='body2'>
          Completed lessons: {course.completed_lessons} / {course.total_lessons}
        </Typography>
      </CardContent>
    </Card>
  )
}

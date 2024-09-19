// src/components/course-management/CourseCard.tsx

import React from 'react'

import Link from 'next/link'

import { Card, CardContent, Typography, Button } from '@mui/material'

import type { Course } from '@/types/course-management/course'

interface CourseCardProps {
  course: Course
  onEnroll: (courseId: string) => Promise<void>
  isEnrolled: boolean
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, isEnrolled }) => {
  return (
    <Card>
      <CardContent>
        <Link href={`/courses/${course.course_id}?creator=${encodeURIComponent(course.creator_name)}`}>
          <Typography variant='h5' component='div'>
            {course.title}
          </Typography>
        </Link>
        <Typography color='text.secondary'>{course.description}</Typography>
        <Typography variant='body2'>Created by: {course.creator_name}</Typography>
        <Typography variant='body2'>Created at: {new Date(course.created_at).toLocaleDateString()}</Typography>
        {!isEnrolled && (
          <Button
            variant='contained'
            color='primary'
            onClick={() => onEnroll(course.course_id)}
            style={{ marginTop: '10px' }}
          >
            Enroll
          </Button>
        )}
        {isEnrolled && (
          <Typography variant='body2' color='primary' style={{ marginTop: '10px' }}>
            Enrolled
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

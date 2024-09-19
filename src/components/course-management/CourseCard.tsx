import React from 'react'

import { Card, CardContent, Typography, Button } from '@mui/material'

import type { Course } from '@/types/course-management/course'

interface CourseCardProps {
  course: Course
  onEnroll: (courseId: string) => void
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h5' component='div'>
          {course.title}
        </Typography>
        <Typography color='text.secondary'>{course.description}</Typography>
        <Typography variant='body2'>Created by: {course.creator_name}</Typography>
        <Typography variant='body2'>Created at: {new Date(course.created_at).toLocaleDateString()}</Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() => onEnroll(course.course_id)}
          style={{ marginTop: '10px' }}
        >
          Enroll
        </Button>
      </CardContent>
    </Card>
  )
}

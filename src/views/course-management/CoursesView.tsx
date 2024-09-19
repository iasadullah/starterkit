import React, { useState } from 'react'

import { Typography, Button, Box } from '@mui/material'

import type { Course, EnrolledCourse } from '@/types/course-management/course'
import { CourseCard } from '@/components/course-management/CourseCard'
import { EnrolledCourseCard } from '@/components/course-management/EnrolledCourseCard'

interface CoursesViewProps {
  allCourses: Course[]
  enrolledCourses: EnrolledCourse[]
  onEnroll: (courseId: string) => Promise<void>
}

export const CoursesView: React.FC<CoursesViewProps> = ({ allCourses, enrolledCourses, onEnroll }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all')

  const enrolledCourseIds = new Set(enrolledCourses.map(course => course.course_id))

  // Filter out enrolled courses from allCourses
  const unenrolledCourses = allCourses.filter(course => !enrolledCourseIds.has(course.course_id))

  const NoCoursesMessage = () => (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' height='200px'>
      <Typography variant='h6' gutterBottom>
        {activeTab === 'all' ? 'No available courses.' : "You haven't enrolled in any courses yet."}
      </Typography>
      {activeTab === 'enrolled' && (
        <Button variant='contained' color='primary' onClick={() => setActiveTab('all')}>
          Explore Courses
        </Button>
      )}
    </Box>
  )

  return (
    <div className='container mx-auto px-4'>
      <h1 className='text-3xl font-bold mb-6'>Courses</h1>
      <div className='mb-6'>
        <Button
          onClick={() => setActiveTab('all')}
          variant={activeTab === 'all' ? 'contained' : 'outlined'}
          className='mr-4'
        >
          All Courses
        </Button>
        <Button onClick={() => setActiveTab('enrolled')} variant={activeTab === 'enrolled' ? 'contained' : 'outlined'}>
          My Learning
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {activeTab === 'all' ? (
          unenrolledCourses.length > 0 ? (
            unenrolledCourses.map(course => (
              <CourseCard key={course.course_id} course={course} onEnroll={onEnroll} isEnrolled={false} />
            ))
          ) : (
            <NoCoursesMessage />
          )
        ) : enrolledCourses.length > 0 ? (
          enrolledCourses.map(course => <EnrolledCourseCard key={course.course_id} course={course} />)
        ) : (
          <NoCoursesMessage />
        )}
      </div>
    </div>
  )
}

'use client'

import { useParams } from 'next/navigation'

const EnrolledCoursePage = () => {
  const { courseId } = useParams()

  console.log('courseId', courseId)

  return (
    <div>
      <h1>Course ID: {courseId}</h1>
      {/* Render the rest of your component */}
    </div>
  )
}

export default EnrolledCoursePage

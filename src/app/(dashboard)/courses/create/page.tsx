import Head from 'next/head'

import type { NextPage } from 'next'

import CourseCreationWizard from '@views/CoureCreationWizard'

const CreateCoursePage: NextPage = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <Head>
        <title>Create a New Course</title>
        <meta name='description' content='Create a new course on our platform' />
      </Head>
      {/* <h1 className='text-3xl font-bold mb-8'>Create a New Course</h1> */}
      <CourseCreationWizard />
    </div>
  )
}

export default CreateCoursePage

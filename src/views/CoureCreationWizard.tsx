'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { v4 as uuidv4 } from 'uuid'

import { supabase } from '@/lib/supabaseClient'
import type { Course, Module, Lesson, MediaItem, Quiz, Question } from '@/types/course'
import { BasicInfo, ModuleCreation, LessonCreation, ReviewAndPublish } from '@/components/CourseSteps'

const STEPS = ['Basic Info', 'Modules', 'Lessons', 'Review & Publish']

export default function CourseCreationWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const [course, setCourse] = useState<Course>({
    id: uuidv4(),
    title: '',
    description: '',
    category: '',
    is_published: false,
    created_by: '' // You'll need to set this with the current user's ID
  })

  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [questions, setQuestions] = useState<Question[]>([])

  const nextStep = () => setStep(prevStep => prevStep + 1)
  const prevStep = () => setStep(prevStep => (prevStep > 0 ? prevStep - 1 : prevStep))

  const handleBasicInfoSubmit = (basicInfo: Partial<Course>) => {
    setCourse(prev => ({ ...prev, ...basicInfo }))
    nextStep()
  }

  const handleModuleCreation = (newModules: Module[]) => {
    setModules(newModules)

    // Remove the nextStep() call from here
  }

  const handleLessonCreation = (
    newLessons: Lesson[],
    newMediaItems: MediaItem[],
    newQuizzes: Quiz[],
    newQuestions: Question[]
  ) => {
    setLessons(newLessons)
    setMediaItems(newMediaItems)
    setQuizzes(newQuizzes)
    setQuestions(newQuestions)
    nextStep()
  }

  const handlePublish = async () => {
    try {
      // Insert course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert([{ ...course, is_published: true }])
        .select()

      if (courseError) throw courseError

      const courseId = courseData[0].id

      // Insert modules
      const { error: modulesError } = await supabase
        .from('course_modules')
        .insert(modules.map(module => ({ ...module, course_id: courseId })))

      if (modulesError) throw modulesError

      // Insert lessons
      const { error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessons.map(lesson => ({ ...lesson, course_id: courseId })))

      if (lessonsError) throw lessonsError

      // Insert media items
      const { error: mediaError } = await supabase.from('media_library').insert(mediaItems)

      if (mediaError) throw mediaError

      // Insert quizzes
      const { error: quizzesError } = await supabase.from('quizzes').insert(quizzes)

      if (quizzesError) throw quizzesError

      // Insert questions
      const { error: questionsError } = await supabase.from('questions').insert(questions)

      if (questionsError) throw questionsError

      console.log('Course published successfully')
      router.push('/courses')
    } catch (error) {
      console.error('Error publishing course:', error)

      // Handle error (e.g., show an error message to the user)
    }
  }

  const handleSaveAsDraft = async () => {
    try {
      // Insert course as draft
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert([{ ...course, is_published: false }])
        .select()

      if (courseError) throw courseError

      const courseId = courseData[0].id

      // Insert modules
      const { error: modulesError } = await supabase
        .from('course_modules')
        .insert(modules.map(module => ({ ...module, course_id: courseId })))

      if (modulesError) throw modulesError

      // Insert lessons
      const { error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessons.map(lesson => ({ ...lesson, course_id: courseId, is_published: false })))

      if (lessonsError) throw lessonsError

      // Insert media items
      const { error: mediaError } = await supabase.from('media_library').insert(mediaItems)

      if (mediaError) throw mediaError

      // Insert quizzes
      const { error: quizzesError } = await supabase.from('quizzes').insert(quizzes)

      if (quizzesError) throw quizzesError

      // Insert questions
      const { error: questionsError } = await supabase.from('questions').insert(questions)

      if (questionsError) throw questionsError

      console.log('Course saved as draft successfully')
      router.push('/courses/drafts')
    } catch (error) {
      console.error('Error saving course as draft:', error)

      // Handle error (e.g., show an error message to the user)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BasicInfo onSubmit={handleBasicInfoSubmit} initialData={course} onNext={nextStep} onBack={prevStep} />
      case 1:
        return (
          <ModuleCreation
            onSubmit={handleModuleCreation}
            initialModules={modules}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 2:
        return (
          <LessonCreation
            onSubmit={handleLessonCreation}
            modules={modules}
            initialLessons={lessons}
            initialMediaItems={mediaItems}
            initialQuizzes={quizzes}
            initialQuestions={questions}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <ReviewAndPublish
            course={course}
            modules={modules}
            lessons={lessons}
            mediaItems={mediaItems}
            quizzes={quizzes}
            questions={questions}
            onPublish={handlePublish}
            onSaveAsDraft={handleSaveAsDraft}
            onBack={prevStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Course Creation Wizard</h2>
      <div className='mb-4'>
        <p>Current Step: {STEPS[step]}</p>
      </div>
      {renderStep()}
    </div>
  )
}

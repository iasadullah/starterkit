// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const StepCourseDescription = ({ activeStep, handleNext, handlePrev }: Props) => {
  const [courseDetails, setCourseDetails] = useState({
    modules: '0',
    lessons: '0',
    quizzes: '0',
    assignments: '0',
    gradePerQuiz: '',
    gradePerAssignment: '',
    totalAttempts: '0'
  })
  const wizardSteps = [
    { label: 'Modules', field: 'modules', placeholder: 'No of modules', type: 'number' },
    { label: 'Lessons', field: 'lessons', placeholder: 'No of lessons per module', type: 'number' },
    { label: 'Quizzes', field: 'quizzes', placeholder: 'No of quizzes per lesson', type: 'number' },
    { label: 'Assignments', field: 'assignments', placeholder: 'No of assignments per module', type: 'number' },
    { label: 'Grading per Quiz', field: 'gradePerQuiz', placeholder: 'Passing grade per quiz', type: 'text' },
    {
      label: 'Grading per Assignment',
      field: 'gradePerAssignment',
      placeholder: 'Passing grade per assignment',
      type: 'text'
    },
    { label: 'Total Attempts', field: 'totalAttempts', placeholder: 'Attempts allowed for quizzes', type: 'number' }
  ]

  const handleChange = (field: keyof typeof courseDetails) => (event: ChangeEvent<HTMLInputElement>) => {
    setCourseDetails(prevDetails => ({
      ...prevDetails,
      [field]: event.target.value
    }))
  }

  const isFormIncomplete = Object.values(courseDetails).some(value => value === '')

  const generateOutlines = async () => {
    console.log(courseDetails)
  }

  return (
    <Grid container spacing={5}>
      {wizardSteps.map(({ label, field, placeholder, type }, index) => (
        <Grid item xs={6} sm={6} key={index}>
          <TextField
            type={type}
            value={courseDetails[field as keyof typeof courseDetails]}
            onChange={handleChange(field as keyof typeof courseDetails)}
            fullWidth
            label={label}
            placeholder={placeholder}
          />
        </Grid>
      ))}

      <Grid item xs={12}>
        <div className='flex items-center justify-between'>
          <Button
            variant='outlined'
            color='secondary'
            disabled={activeStep === 0}
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
          >
            Previous
          </Button>

          <Button
            disabled={isFormIncomplete}
            variant='contained'
            onClick={() => {
              generateOutlines()
              handleNext()
            }}
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Next
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default StepCourseDescription

'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepConnector from '@mui/material/StepConnector'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Component Imports
import StepDealType from './StepCourseType'

import StepDealUsage from './StepCourseOutlines'
import StepReview from './StepReview'

// Styled Component Imports
import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from '@components/stepper-dot'
import StepCourseDescription from './StepCourseDescription'

// Vars
const steps = [
  {
    title: 'Title',
    subtitle: 'Title of the course'
  },
  {
    title: 'Course Description',
    subtitle: 'Provide course details'
  },
  {
    title: 'Outline creation',
    subtitle: 'Create your course outline'
  },
  {
    subtitle: 'Review & Complete',
    title: 'Review & Complete'
  }
]

// Styled Components
const ConnectorHeight = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    minHeight: 20
  }
}))

const getStepContent = (step: number, handleNext: () => void, handlePrev: () => void) => {
  const Tag = step === 0 ? StepDealType : step === 1 ? StepCourseDescription : step === 2 ? StepDealUsage : StepReview

  return <Tag activeStep={step} handleNext={handleNext} handlePrev={handlePrev} steps={steps} />
}

const CreateCourseWizard = () => {
  // States
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      setActiveStep(activeStep + 1)
    } else {
      alert('Submitted..!!')
    }
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  return (
    <Card style={{ padding: '10px' }} className='flex flex-col md:flex-row'>
      <CardContent className='max-md:border-be md:border-ie md:min-is-[300px]'>
        <StepperWrapper className='bs-full'>
          <Stepper activeStep={activeStep} connector={<ConnectorHeight />} orientation='vertical'>
            {steps.map((step, index) => {
              return (
                <Step key={index} onClick={() => setActiveStep(index)}>
                  <StepLabel StepIconComponent={StepperCustomDot} className='p-0'>
                    <div className='step-label cursor-pointer'>
                      <Typography className='step-number' color='text.primary'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title' color='text.primary'>
                          {step.title}
                        </Typography>
                        <Typography className='step-subtitle' color='text.primary'>
                          {step.subtitle}
                        </Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <CardContent className='flex-1'>{getStepContent(activeStep, handleNext, handlePrev)}</CardContent>
    </Card>
  )
}

export default CreateCourseWizard

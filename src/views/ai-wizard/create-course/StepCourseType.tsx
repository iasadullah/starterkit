// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Button from '@mui/material/Button'
import type { SelectChangeEvent } from '@mui/material/Select'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Component Imports
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import DirectionalIcon from '@components/DirectionalIcon'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const StepDealType = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} sm={12}>
        <TextField
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          fullWidth
          label='Title'
          placeholder='Title'
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          value={description}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
          label='Description'
          placeholder='Description'
        />
      </Grid>
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
            disabled={title === '' || description === ''}
            variant='contained'
            onClick={handleNext}
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Next
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default StepDealType

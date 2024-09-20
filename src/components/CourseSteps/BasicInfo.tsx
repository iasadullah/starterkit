'use client'

import React from 'react'

import { Box, Button, TextField } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

interface BasicInfoProps {
  onSubmit: (data: Partial<Course>) => void
  initialData: Partial<Course>
  onNext: () => void
  onBack: () => void
}

export default function BasicInfo({ onSubmit, initialData, onNext, onBack }: BasicInfoProps) {
  const [formData, setFormData] = React.useState(initialData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 10, borderRadius: 2, '& > *': { mb: 2 } }}
    >
      <TextField
        id='title'
        name='title'
        label='Course Title'
        value={formData.title}
        onChange={handleChange}
        fullWidth
        required
        variant='outlined'
      />
      <TextField
        id='description'
        name='description'
        label='Description'
        value={formData.description}
        onChange={handleChange}
        fullWidth
        required
        variant='outlined'
        multiline
        rows={3}
      />
      <TextField
        id='category'
        name='category'
        label='Category'
        value={formData.category}
        onChange={handleChange}
        required
        variant='outlined'
      />
      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
        {/* <Button onClick={onBack} startIcon={<ArrowBackIcon />}>Back</Button> */}
        <Button variant='contained' type='submit' endIcon={<ArrowForwardIcon />}>
          Next
        </Button>
      </Box>
    </Box>
  )
}

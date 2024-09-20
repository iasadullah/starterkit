'use client'

import React, { useState, useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'
import { Box, Button, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import type { Module } from '@/types/course'

interface ModuleCreationProps {
  onSubmit: (modules: Module[]) => void
  initialModules: Module[]
  onNext: () => void
  onBack: () => void
}

export default function ModuleCreation({ onSubmit, initialModules, onNext, onBack }: ModuleCreationProps) {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (initialModules.length === 0) {
      setModules([{ id: uuidv4(), title: '', description: '', position: 0, lessons: [] }])
    } else {
      setModules(initialModules)
    }
  }, [initialModules])

  const addModule = () => {
    setModules(prev => [...prev, { id: uuidv4(), title: '', description: '', position: prev.length, lessons: [] }])
  }

  const updateModule = (index: number, field: keyof Module, value: string) => {
    setModules(prev => prev.map((module, i) => (i === index ? { ...module, [field]: value } : module)))
  }

  const removeModule = (index: number) => {
    setModules(prev => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    modules.forEach((module, index) => {
      if (!module.title) newErrors[`title-${index}`] = 'Title is required'
      if (!module.description) newErrors[`description-${index}`] = 'Description is required'
    })
    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      onSubmit(modules)

      // Remove onNext() from here
    }
  }

  const handleNext = () => {
    if (validate()) {
      onSubmit(modules)
      onNext()
    }
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ py: 3, px: 2, display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      {modules.map((module, index) => (
        <Box
          key={module.id}
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            mb: 2
          }}
        >
          <TextField
            label='Module Title'
            fullWidth
            id={`module-title-${index}`}
            value={module.title}
            onChange={e => updateModule(index, 'title', e.target.value)}
            required
            variant='outlined'
            margin='normal'
            error={!!errors[`title-${index}`]}
            helperText={errors[`title-${index}`]}
          />
          <TextField
            label='Module Description'
            id={`module-description-${index}`}
            value={module.description}
            onChange={e => updateModule(index, 'description', e.target.value)}
            required
            multiline
            rows={7}
            fullWidth
            variant='outlined'
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { height: '200px' } }} // Set a fixed height
            error={!!errors[`description-${index}`]}
            helperText={errors[`description-${index}`]}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type='button'
              variant='outlined'
              startIcon={<DeleteIcon />}
              onClick={() => removeModule(index)}
              disabled={modules.length === 1}
              color='error'
              size='small'
            >
              Remove Module
            </Button>
          </Box>
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          type='button'
          variant='outlined'
          color='primary'
          onClick={addModule}
          startIcon={<AddIcon />}
          size='small'
        >
          Add Module
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, mt: 2 }}>
        <Button
          type='button'
          variant='outlined'
          color='primary'
          size='small'
          sx={{ mt: 2, width: '10%' }}
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Button
          variant='contained'
          color='primary'
          size='small'
          type='button'
          onClick={handleNext}
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 2, width: '10%' }}
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}

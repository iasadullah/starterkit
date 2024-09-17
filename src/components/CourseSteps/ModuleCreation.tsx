'use client'

import React, { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import type { Module } from '@/types/course'

interface ModuleCreationProps {
  onSubmit: (modules: Module[]) => void
  initialModules: Module[]
}

export default function ModuleCreation({ onSubmit, initialModules }: ModuleCreationProps) {
  const [modules, setModules] = useState<Module[]>(initialModules)

  const addModule = () => {
    setModules(prev => [...prev, { id: uuidv4(), title: '', description: '', position: prev.length, lessons: [] }])
  }

  const updateModule = (index: number, field: keyof Module, value: string) => {
    setModules(prev => prev.map((module, i) => (i === index ? { ...module, [field]: value } : module)))
  }

  const removeModule = (index: number) => {
    setModules(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(modules)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {modules.map((module, index) => (
        <div key={module.id} className='p-4 border rounded-md space-y-4'>
          <div>
            <label htmlFor={`module-title-${index}`} className='block text-sm font-medium text-gray-700'>
              Module Title
            </label>
            <input
              type='text'
              id={`module-title-${index}`}
              value={module.title}
              onChange={e => updateModule(index, 'title', e.target.value)}
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
            />
          </div>
          <div>
            <label htmlFor={`module-description-${index}`} className='block text-sm font-medium text-gray-700'>
              Module Description
            </label>
            <textarea
              id={`module-description-${index}`}
              value={module.description}
              onChange={e => updateModule(index, 'description', e.target.value)}
              required
              rows={3}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
            />
          </div>
          <button
            type='button'
            onClick={() => removeModule(index)}
            className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'
          >
            Remove Module
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={addModule}
        className='w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
      >
        Add Module
      </button>
      <button type='submit' className='w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
        Next
      </button>
    </form>
  )
}

'use client'

import React from 'react'

import type { Course } from '@/types/course'

interface BasicInfoProps {
  onSubmit: (data: Partial<Course>) => void
  initialData: Partial<Course>
}

export default function BasicInfo({ onSubmit, initialData }: BasicInfoProps) {
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
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
          Course Title
        </label>
        <input
          type='text'
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          required
        />
      </div>
      <div>
        <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
          Description
        </label>
        <textarea
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor='category' className='block text-sm font-medium text-gray-700'>
          Category
        </label>
        <input
          type='text'
          id='category'
          name='category'
          value={formData.category}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          required
        />
      </div>
      <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
        Next
      </button>
    </form>
  )
}

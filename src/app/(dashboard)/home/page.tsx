'use client'
import type { ChangeEvent, MouseEvent } from 'react'
import React, { useState } from 'react'

import { Box, Button, TextField, Typography, Grid, InputAdornment, IconButton } from '@mui/material'
import { Edit, Save, Search } from '@mui/icons-material'

import coursesData from '../../../utils/courseData/courseData'
import { CourseCard, EditableHeading, SortingMenu, TabControls } from '../../../components/CourseList'

// Define types for course and props
interface Course {
  id: string
  title: string
  isDraft: boolean
}

const Page: React.FC = () => {
  const [courseName, setCourseName] = useState<string>(localStorage.getItem('courseName') || 'Courses')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [tabValue, setTabValue] = useState<number>(0)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)

    // Apply the sorting/filtering logic here based on the selected option
    handleClose()
  }

  const saveCourseName = () => {
    localStorage.setItem('courseName', courseName)
    setIsEditing(false)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleGenerateCourseOutline = async () => {
    setIsGenerating(true)

    try {
      const courseDesc = 'Deep insights into AI'

      const settings = {
        number_of_modules: 2,
        number_of_lessons_per_module: 3,
        quiz_passing_percentage: 80,
        quizzes_per_lesson: 2,
        questions_per_quiz: 4,
        assignment_passing_percentage: 80,
        assignment_per_lesson: 2,
        questions_per_assignment: 3,
        course_passing_percentage: 60
      }

      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseDesc, settings })
      })

      if (!response.ok) {
        throw new Error('Failed to generate course outline')
      }

      const data = await response.json()

      console.log('Generated Course Outline:', data.content)
    } catch (error) {
      console.error('Error:', error)

      // Handle error (e.g., show error message to user)
    } finally {
      setIsGenerating(false)
    }
  }

  const filteredCourses = coursesData.filter((course: Course) => {
    if (tabValue === 1 && course.isDraft) return false // My Learning tab: no drafts
    if (tabValue === 2 && !course.isDraft) return false // Drafts tab: only drafts

    return course.title.toLowerCase().includes(searchQuery)
  })

  return (
    <Box sx={{ p: 3 }}>
      {/* Editable Heading */}
      <EditableHeading
        courseName={courseName}
        setCourseName={setCourseName}
        isEditing={isEditing}
        toggleEditing={() => {
          if (isEditing) saveCourseName()
          else setIsEditing(true)
        }}
      />

      {/* Create and Certificate Buttons */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button variant='contained' onClick={handleGenerateCourseOutline} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Course Outline'}
        </Button>
      </Box>

      {/* Tabs */}
      <TabControls tabValue={tabValue} handleTabChange={handleTabChange} />

      {/* Search and Sort */}
      <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ mt: 2 }}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search />
              </InputAdornment>
            )
          }}
          placeholder='Search...'
          variant='outlined'
          fullWidth
          sx={{ mr: 2 }}
          onChange={handleSearchChange}
        />
        <Button variant='contained' onClick={handleClick} sx={{ minWidth: 150 }}>
          Sort
        </Button>

        {/* Sort Menu */}
        <SortingMenu
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
          handleOptionClick={handleOptionClick}
          selectedOption={selectedOption}
        />
      </Box>

      {/* Course Cards */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course: Course) => <CourseCard key={course.id} course={course} />)
        ) : (
          <Typography variant='body1' sx={{ mt: 4 }}>
            No courses available for this tab.
          </Typography>
        )}
      </Grid>
    </Box>
  )
}

export default Page

'use client'
import React, { useState, ChangeEvent, MouseEvent } from 'react'
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

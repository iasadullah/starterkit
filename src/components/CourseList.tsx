'use client'
import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import { Edit, Save } from '@mui/icons-material' // Ensure you have these icons installed
import './Course.css'
import { options } from '../utils/data/data'

interface Option {
  value: string
  label: string
}

interface SortingMenuProps {
  anchorEl: null | HTMLElement
  open: boolean
  handleClose: () => void
  handleOptionClick: (value: string) => void
  selectedOption: string
}

export const SortingMenu: React.FC<SortingMenuProps> = ({
  anchorEl,
  open,
  handleClose,
  handleOptionClick,
  selectedOption
}) => (
  <Menu anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
    {options.map((option: Option) => (
      <MenuItem
        key={option.value}
        onClick={() => handleOptionClick(option.value)}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Checkbox checked={selectedOption === option.value} color='primary' />
        <Typography
          sx={{
            fontWeight: selectedOption === option.value ? 'bold' : 'normal',
            ml: 1
          }}
        >
          {option.label}
        </Typography>
      </MenuItem>
    ))}
  </Menu>
)

interface Course {
  id: string
  image: string
  title: string
  owner: string
  createdBy: string
  description: string
  participants: number
}

interface CourseCardProps {
  course: Course
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
  <Grid item xs={12} sm={6} md={4} key={course.id}>
    <Card className='card'>
      <CardContent>
        <Box sx={{ height: '70%', width: '70%' }}>
          <img src={course.image} alt={course.title} style={{ width: '100%', height: 'auto' }} />
        </Box>
        <Typography className='title' variant='h6'>
          {course.title}
        </Typography>
        <Typography color='textSecondary'>{course.owner}</Typography>
        <Typography color='textSecondary'>by: {course.createdBy}</Typography>
        <Typography className='course-description' color='textSecondary'>
          {course.description}
        </Typography>
        <Typography color='textSecondary'>{course.participants} participants</Typography>
        <Button variant='contained' sx={{ mt: 2, width: '100%' }} endIcon={<Edit />}>
          Edit
        </Button>
      </CardContent>
    </Card>
  </Grid>
)

interface EditableHeadingProps {
  courseName: string
  setCourseName: (name: string) => void
  isEditing: boolean
  toggleEditing: () => void
}

export const EditableHeading: React.FC<EditableHeadingProps> = ({
  courseName,
  setCourseName,
  isEditing,
  toggleEditing
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    {isEditing ? (
      <TextField
        value={courseName}
        onChange={e => setCourseName(e.target.value)}
        variant='outlined'
        size='small'
        autoFocus
      />
    ) : (
      <Typography className='title' variant='h4'>
        {courseName}
      </Typography>
    )}
    <IconButton onClick={toggleEditing}>{isEditing ? <Save /> : <Edit />}</IconButton>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, ml: 'auto' }}>
      <Button variant='contained' sx={{ mr: 1 }} href='#'>
        + Create
      </Button>
      <Button variant='outlined' href='#'>
        Certificate
      </Button>
    </Box>
  </Box>
)

interface TabControlsProps {
  tabValue: number
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void
}

export const TabControls: React.FC<TabControlsProps> = ({ tabValue, handleTabChange }) => (
  <Tabs value={tabValue} onChange={handleTabChange} aria-label='course-tabs'>
    {['All', 'My Learning', 'Drafts'].map((label, index) => (
      <Tab
        key={label}
        label={label}
        value={index}
        sx={{
          textTransform: 'none',
          color: tabValue === index ? '#1976d2' : 'white',
          fontWeight: tabValue === index ? 'bold' : 'normal',
          '&:hover': {
            color: '#1976d2'
          }
        }}
      />
    ))}
  </Tabs>
)

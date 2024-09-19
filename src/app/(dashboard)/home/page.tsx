'use client'
import React, { useEffect, useState } from 'react'
import {
  Card,
  Grid,
  Typography,
  Container,
  Button,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@mui/material'
import { styled } from '@mui/system'
import { getAllCourses } from '@/services/courseService'
import { getAllUsers } from '@/services/users/users'
import { updateUserRole } from '@/services/users/updateRole/update-role'

interface Person {
  user_id: number
  role_name: string
  id: number
  name: string
  role: 'Teacher' | 'Student' | 'Guest'
}

interface Course {
  id: number
  title: string
  teacher: string
  enrolledUsers: number
  totalDuration: string
}

// Dummy data
const initialTeachers: Person[] = [
  { id: 1, name: 'John Doe', role: 'Teacher' },
  { id: 2, name: 'Jane Smith', role: 'Teacher' }
]

const initialStudents: Person[] = [
  { id: 3, name: 'Alice Brown', role: 'Student' },
  { id: 4, name: 'Bob White', role: 'Student' }
]

const initialGuests: Person[] = [
  { id: 5, name: 'Charlie Guest', role: 'Guest' },
  { id: 6, name: 'Diana Guest', role: 'Guest' }
]

const initialCourses: Course[] = [
  { id: 1, title: 'React 101', teacher: 'John Doe', enrolledUsers: 150, totalDuration: '10h 30m' },
  { id: 2, title: 'Advanced TypeScript', teacher: 'Jane Smith', enrolledUsers: 120, totalDuration: '12h 15m' },
  { id: 3, title: 'Node.js Mastery', teacher: 'Mark Spencer', enrolledUsers: 95, totalDuration: '8h 45m' },
  { id: 4, title: 'GraphQL Basics', teacher: 'Emma Watson', enrolledUsers: 80, totalDuration: '7h 20m' },
  { id: 5, title: 'React Native Advanced', teacher: 'Alice Johnson', enrolledUsers: 110, totalDuration: '15h 0m' }
]
const ITEMS_PER_PAGE = 10
const CustomCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3)
}))

const Page: React.FC = () => {
  const [teachers, setTeachers] = useState(initialTeachers)
  const [students, setStudents] = useState(initialStudents)
  const [guests, setGuests] = useState(initialGuests)
  const [courses, setCourse] = useState(initialCourses)
  const [page, setPage] = useState(1)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const paginatedCourses = courses.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE)

  const topCourses = [...courses].sort((a, b) => b.enrolledUsers - a.enrolledUsers).slice(0, 3)

  useEffect(() => {
    fetchAllCourses()
    fetchAllUsers()
  }, [])

  const fetchAllCourses = async () => {
    try {
      console.log('Fetching all courses...')
      const response = await getAllCourses()
      console.log('response of courses::', response)
      setCourse(response)
    } catch (error) {
      console.error(error)
    }
  }
  const fetchAllUsers = async () => {
    try {
      const response = await getAllUsers()
      console.log('response of users::', response)
      const teachers = response.filter(user => user.role_name === 'teacher')
      const students = response.filter(user => user.role_name === 'student')
      const guests = response.filter(user => !user.role_name || ['undefined', 'null', 'guest'].includes(user.role_name))
      setTeachers(teachers)
      setStudents(students)
      setGuests(guests)
    } catch (error) {
      console.error(error)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1)
  }
  const changeGuestRole = async (guestId: string, newRole: 'Teacher' | 'Student') => {
    const roleId = newRole === 'Teacher' ? 2 : 3
    try {
      const result = await updateUserRole(guestId, roleId)
      console.log('result::', result)
      fetchAllUsers()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Typography component='h1' variant='h4' gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Teachers */}
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h4'>Teachers</Typography>
                <Typography variant='h4'>{teachers.length}</Typography>
              </div>
              {teachers.map(teacher => (
                <Typography key={teacher.id}>
                  {teacher.name} - {teacher.role_name}
                </Typography>
              ))}
            </CardContent>
          </CustomCard>
        </Grid>

        {/* Students */}
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h4'>Students</Typography>
                <Typography variant='h4'>{students.length} </Typography>
              </div>
              {students.map(student => (
                <Typography key={student.id}>
                  {student.name} - {student.role_name}
                </Typography>
              ))}
            </CardContent>
          </CustomCard>
        </Grid>

        {/* Guests */}
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h4'>Guests</Typography>
                <Typography variant='h4'>{guests.length}</Typography>
              </div>
              {guests.map(guest => (
                <div style={{ padding: '10px' }} key={guest.id}>
                  <Typography>
                    {guest.name} - {guest.role_name}
                  </Typography>
                  <div style={{ marginRight: '10px', marginTop: '10px' }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => changeGuestRole(guest.user_id, 'Student')}
                    >
                      Make Student
                    </Button>
                    <Button
                      style={{ marginLeft: '10px' }}
                      variant='contained'
                      color='secondary'
                      onClick={() => changeGuestRole(guest.user_id, 'Teacher')}
                    >
                      Make Teacher
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </CustomCard>
        </Grid>
        {/* Top Courses */}
        <Grid item xs={12}>
          <CustomCard>
            <CardContent>
              <Typography variant='h4' gutterBottom>
                Top courses
              </Typography>
              <List>
                {topCourses.map(course => (
                  <ListItem key={course.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#f0f0f0', color: 'black' }}>A</Avatar>
                    </ListItemAvatar>
                    <Typography variant='h6' gutterBottom>
                      {course.title}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </CustomCard>
        </Grid>

        {/* Courses */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant='h4'>Course Title</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='h4'>Teacher</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='h4'>Enrolled Users</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='h4'>Total Duration</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCourses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>{course.teacher}</TableCell>
                      <TableCell>{course.enrolledUsers}</TableCell>
                      <TableCell>{course.totalDuration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button disabled={page === 1} onClick={handlePreviousPage}>
                Previous
              </Button>
              <Typography style={{ margin: '0 10px', alignSelf: 'center' }}>
                Page {page} of {totalPages}
              </Typography>
              <Button disabled={page === totalPages} onClick={handleNextPage}>
                Next
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default Page

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { useParams } from 'next/navigation'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  LinearProgress,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  TextField
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DownloadIcon from '@mui/icons-material/Download'

import type {
  CourseStructure,
  Lesson,
  CourseProgress,
  MediaItem,
  Quiz_lesson,
  Question_lesson
} from '@/types/enrolled-course/course-structure'
import {
  getCourseStructure,
  startLesson,
  completeLesson,
  getCourseProgress,
  getAvailableLessonQuizzes,
  startQuizAttempt,
  submitQuizAnswer,
  submitQuiz,
  getQuizProgress
} from '@/services/enrolled-course/index'

const EnrolledCoursePage = () => {
  const supabase = createClientComponentClient()
  const { courseId } = useParams()
  const [courseStructure, setCourseStructure] = useState<CourseStructure | null>(null)
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz_lesson | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [availableQuiz, setAvailableQuiz] = useState<Quiz_lesson | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)

  // New state variables for quiz functionality
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<Question_lesson[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error) {
        console.error('Error fetching user:', error)
        setError('Failed to authenticate user')
        setIsLoading(false)

        return
      }

      if (user) {
        setUserId(user.id)
      } else {
        setError('No authenticated user found')
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [supabase.auth])

  const fetchCourseProgress = useCallback(async () => {
    if (!courseId || typeof courseId !== 'string' || !userId) return

    try {
      const progress = await getCourseProgress(userId, courseId)

      setCourseProgress(progress)
    } catch (e) {
      console.error('Failed to fetch course progress:', e)
    }
  }, [userId, courseId])

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || typeof courseId !== 'string' || !userId) {
        if (!courseId || typeof courseId !== 'string') setError('Invalid Course ID')
        if (!userId) setError('User not authenticated')
        setIsLoading(false)

        return
      }

      try {
        const [structure, progress] = await Promise.all([
          getCourseStructure(courseId),
          getCourseProgress(userId, courseId)
        ])

        setCourseStructure(structure)
        setCourseProgress(progress)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) fetchData()
  }, [courseId, userId])

  useEffect(() => {
    return () => {
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current)
      }
    }
  }, [])

  const handleModuleChange = (moduleId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedModule(isExpanded ? moduleId : null)
  }

  const handleLessonSelect = async (lesson: Lesson) => {
    if (!userId) {
      setSnackbarMessage('User not authenticated')
      setSnackbarOpen(true)

      return
    }

    try {
      const response = await startLesson(userId, lesson.id)

      setSelectedLesson(lesson)
      setSnackbarMessage(response.message)
      setSnackbarOpen(true)

      // Fetch available quizzes for the selected lesson, regardless of completion status
      const quizzes = await getAvailableLessonQuizzes(userId, lesson.id)

      if (quizzes && quizzes.length > 0) {
        setAvailableQuiz(quizzes[0])
      } else {
        setAvailableQuiz(null)
      }

      if (response.success && response.status === 'started') {
        if (completionTimerRef.current) {
          clearTimeout(completionTimerRef.current)
        }

        completionTimerRef.current = setTimeout(() => {
          handleCompleteLesson(lesson.id)
        }, 5000)
      }
    } catch (error) {
      console.error('Failed to start lesson:', error)
      setSnackbarMessage('Failed to start lesson. Please try again.')
      setSnackbarOpen(true)
    }
  }

  const handleCompleteLesson = async (lessonId: string) => {
    if (!userId) {
      setSnackbarMessage('User not authenticated')
      setSnackbarOpen(true)

      return
    }

    try {
      const response = await completeLesson(userId, lessonId)

      setSnackbarMessage(response.message)
      setSnackbarOpen(true)

      if (response.status === 'completed') {
        setCourseStructure(prevStructure => {
          if (!prevStructure) return null

          return {
            ...prevStructure,
            modules: prevStructure.modules.map(module => ({
              ...module,
              lessons: module.lessons.map(l => (l.id === lessonId ? { ...l, is_completed: true, progress: 100 } : l))
            }))
          }
        })

        setSelectedLesson(prev =>
          prev && prev.id === lessonId ? { ...prev, is_completed: true, progress: 100 } : prev
        )

        await fetchCourseProgress()

        // Only fetch available quizzes if there isn't one already set
        if (!availableQuiz) {
          const quizzes = await getAvailableLessonQuizzes(userId, lessonId)

          if (quizzes && quizzes.length > 0) {
            setAvailableQuiz(quizzes[0])
            setSnackbarMessage(`Lesson completed. A quiz with ${quizzes[0].question_count} questions is available.`)
          } else {
            setAvailableQuiz(null)
            setSnackbarMessage('Lesson completed. No quiz available.')
          }

          setSnackbarOpen(true)
        }
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error)
      setSnackbarMessage('Failed to complete lesson. Please try again.')
      setSnackbarOpen(true)
    }
  }

  const handleShowQuiz = async () => {
    if (!availableQuiz || !userId) return

    try {
      const response = await startQuizAttempt(userId, availableQuiz.id)

      if (response.success) {
        setQuizAttemptId(response.attempt_id)
        setQuizQuestions(response.questions)
        setCurrentQuestionIndex(0)
        setQuizAnswers({})
        setShowQuiz(true)
        setQuizCompleted(false)
        setQuizScore(null)
      } else {
        setSnackbarMessage(response.message || 'Failed to start quiz')
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error('Failed to start quiz:', error)
      setSnackbarMessage('Failed to start quiz. Please try again.')
      setSnackbarOpen(true)
    }
  }

  const handleQuizAnswerChange = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleQuizAnswerSubmit = async () => {
    if (!quizAttemptId || !quizQuestions[currentQuestionIndex]) return

    const question = quizQuestions[currentQuestionIndex]
    let answer = quizAnswers[question.id]

    if (!answer) {
      setSnackbarMessage('Please provide an answer before proceeding.')
      setSnackbarOpen(true)

      return
    }

    // Format the answer based on the question type
    if (question.type === 'multiple_choice') {
      // Ensure answer is just the option ID
      answer = typeof answer === 'object' && answer !== null ? (answer as { id: string }).id : answer
    } else if (question.type === 'true_false') {
      // Ensure answer is a string 'true' or 'false'
      answer = answer.toString().toLowerCase()
    } else if (question.type === 'essay') {
      // Ensure answer is a string
      answer = answer.toString().trim()
    }

    try {
      const response = await submitQuizAnswer(quizAttemptId, question.id, answer, question.type)

      if (response.success) {
        if (currentQuestionIndex < quizQuestions.length - 1) {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1)
        } else {
          await handleQuizComplete()
        }
      } else {
        setSnackbarMessage(response.message || 'Failed to submit answer')
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
      setSnackbarMessage('Failed to submit answer. Please try again.')
      setSnackbarOpen(true)
    }
  }

  const handleQuizComplete = async () => {
    if (!quizAttemptId) return

    try {
      const response = await submitQuiz(quizAttemptId)

      if (response.success) {
        setQuizCompleted(true)
        setQuizScore(response.score)
        setSnackbarMessage(`Quiz completed. Your score: ${response.score}/${response.total_questions}`)
        setSnackbarOpen(true)
        await fetchCourseProgress()
      } else {
        setSnackbarMessage(response.message || 'Failed to complete quiz')
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error('Failed to complete quiz:', error)
      setSnackbarMessage('Failed to complete quiz. Please try again.')
      setSnackbarOpen(true)
    }
  }

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbarOpen(false)
  }

  const renderMedia = (mediaItems: MediaItem[]) => {
    return (
      <Box mt={2}>
        <Typography variant='h6' gutterBottom>
          Attached Media
        </Typography>
        <List>
          {mediaItems.map(item => (
            <ListItem key={item.id}>
              <Chip
                icon={<AttachFileIcon />}
                label={`${item.type} (${item.file_extension})`}
                onClick={() => window.open(item.url, '_blank')}
                onDelete={() => handleDownload(item.url, `file.${item.file_extension}`)}
                deleteIcon={<DownloadIcon />}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderQuiz = () => {
    if (quizCompleted) {
      return (
        <Box mt={2}>
          <Typography variant='h5' gutterBottom>
            Quiz Completed
          </Typography>
          <Typography variant='body1'>
            Your score: {quizScore !== null ? `${quizScore}/${quizQuestions.length}` : 'N/A'}
          </Typography>
          <Button variant='contained' color='primary' onClick={() => setShowQuiz(false)} sx={{ mt: 2 }}>
            Back to Lesson
          </Button>
        </Box>
      )
    }

    const currentQuestion = quizQuestions[currentQuestionIndex]

    if (!currentQuestion) return null

    return (
      <Box mt={2}>
        <Typography variant='h5' gutterBottom>
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </Typography>
        <FormControl component='fieldset' margin='normal' fullWidth>
          <FormLabel component='legend'>{currentQuestion.question_text}</FormLabel>
          {currentQuestion.type === 'multiple_choice' && (
            <RadioGroup
              aria-label={currentQuestion.question_text}
              name={currentQuestion.id}
              value={quizAnswers[currentQuestion.id] || ''}
              onChange={e => handleQuizAnswerChange(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.options?.map(option => (
                <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.text} />
              ))}
            </RadioGroup>
          )}
          {currentQuestion.type === 'true_false' && (
            <RadioGroup
              aria-label={currentQuestion.question_text}
              name={currentQuestion.id}
              value={quizAnswers[currentQuestion.id] || ''}
              onChange={e => handleQuizAnswerChange(currentQuestion.id, e.target.value)}
            >
              <FormControlLabel value='true' control={<Radio />} label='True' />
              <FormControlLabel value='false' control={<Radio />} label='False' />
            </RadioGroup>
          )}
          {currentQuestion.type === 'essay' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={quizAnswers[currentQuestion.id] || ''}
              onChange={e => handleQuizAnswerChange(currentQuestion.id, e.target.value)}
            />
          )}
        </FormControl>
        <Button
          variant='contained'
          color='primary'
          onClick={handleQuizAnswerSubmit}
          sx={{ mt: 2 }}
          disabled={!quizAnswers[currentQuestion.id]}
        >
          {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Submit Quiz'}
        </Button>
      </Box>
    )
  }

  if (isLoading)
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  if (error) return <Alert severity='error'>Error: {error}</Alert>
  if (!courseStructure || !courseProgress) return <Alert severity='warning'>No course data found</Alert>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Typography variant='h4' gutterBottom>
          {courseStructure.course_title}
        </Typography>
        <Typography variant='body1' gutterBottom>
          {courseStructure.course_description}
        </Typography>
        <Typography variant='h6' gutterBottom>
          Course Progress
        </Typography>
        <LinearProgress variant='determinate' value={courseProgress.overall_progress} sx={{ mb: 1 }} />
        <Typography variant='body2'>Overall Progress: {courseProgress.overall_progress}%</Typography>
        <Typography variant='body2'>
          Enrolled At: {new Date(courseProgress.enrolled_at).toLocaleDateString()}
        </Typography>
        <Typography variant='body2'>Status: {courseProgress.status}</Typography>
        {courseProgress.completion_date && (
          <Typography variant='body2'>
            Completed On: {new Date(courseProgress.completion_date).toLocaleDateString()}
          </Typography>
        )}
      </Paper>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Paper elevation={3} sx={{ width: 300, overflow: 'auto', mr: 2 }}>
          {courseStructure.modules.map(module => (
            <Accordion key={module.id} expanded={expandedModule === module.id} onChange={handleModuleChange(module.id)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{module.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List disablePadding>
                  {module.lessons.map(lesson => (
                    <ListItem key={lesson.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleLessonSelect(lesson)}
                        selected={selectedLesson?.id === lesson.id}
                      >
                        <ListItemText
                          primary={
                            <Box display='flex' alignItems='center'>
                              {lesson.title}
                              {lesson.media_items && lesson.media_items.length > 0 && (
                                <AttachFileIcon fontSize='small' sx={{ ml: 1 }} />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <LinearProgress variant='determinate' value={lesson.progress} sx={{ my: 1 }} />
                              <Typography variant='caption' display='block' textAlign='right'>
                                {lesson.progress}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
        <Paper elevation={3} sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {showQuiz ? (
            renderQuiz()
          ) : selectedLesson ? (
            <Box>
              <Typography variant='h5' gutterBottom>
                {selectedLesson.title}
              </Typography>
              <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
              {selectedLesson.media_items &&
                selectedLesson.media_items.length > 0 &&
                renderMedia(selectedLesson.media_items)}
              {availableQuiz && !showQuiz && (
                <Button variant='contained' color='primary' onClick={handleShowQuiz} sx={{ mt: 2 }}>
                  Take Quiz ({availableQuiz.question_count} questions)
                </Button>
              )}
            </Box>
          ) : (
            <Typography variant='body1'>Select a lesson from the sidebar to view its content.</Typography>
          )}
        </Paper>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </Box>
  )
}

export default EnrolledCoursePage

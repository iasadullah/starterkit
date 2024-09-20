import React, { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { v4 as uuidv4 } from 'uuid'
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import UploadIcon from '@mui/icons-material/Upload'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import type { Module, Lesson, MediaItem, Quiz, Question, Option } from '@/types/course'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <Typography>Loading editor...</Typography>
})

interface LessonCreationProps {
  onSubmit: (lessons: Lesson[], mediaItems: MediaItem[], quizzes: Quiz[], questions: Question[]) => void
  modules: Module[]
  initialLessons: Lesson[]
  initialMediaItems: MediaItem[]
  initialQuizzes: Quiz[]
  initialQuestions: Question[]
  onNext: () => void
  onBack: () => void
}

export default function LessonCreation({
  onSubmit,
  modules,
  initialLessons,
  initialMediaItems,
  initialQuizzes,
  initialQuestions,
  onNext,
  onBack
}: LessonCreationProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems)
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes)
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addLesson = (moduleId: string) => {
    setLessons(prev => [
      ...prev,
      {
        id: uuidv4(),
        module_id: moduleId,
        title: '',
        content: '',
        position: prev.filter(l => l.module_id === moduleId).length,
        is_prerequisite: false,
        is_published: false
      }
    ])
  }

  const updateLesson = (lessonId: string, field: keyof Lesson, value: string | boolean | number) => {
    setLessons(prev => prev.map(lesson => (lesson.id === lessonId ? { ...lesson, [field]: value } : lesson)))
  }

  const removeLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== lessonId))
    setMediaItems(prev => prev.filter(item => item.lesson_id !== lessonId))
    setQuizzes(prev => prev.filter(quiz => quiz.lesson_id !== lessonId))
    setQuestions(prev =>
      prev.filter(question => !quizzes.find(q => q.id === question.quiz_id && q.lesson_id === lessonId))
    )
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, lessonId: string) => {
    const files = e.target.files

    if (files) {
      const newMediaItems: MediaItem[] = await Promise.all(
        Array.from(files).map(async file => {
          const fileId = uuidv4()
          const fileExtension = file.name.split('.').pop() || ''
          const fileName = `${fileId}.${fileExtension}`

          // Here, you would typically upload the file to your server or cloud storage
          // For this example, we'll just use a placeholder URL
          const uploadedUrl = `https://your-upload-url.com/${fileName}`

          return {
            id: fileId,
            lesson_id: lessonId,
            type: file.type,
            url: uploadedUrl,
            name: file.name,
            file_extension: fileExtension
          }
        })
      )

      setMediaItems(prev => [...prev, ...newMediaItems])
    }
  }

  const removeMediaItem = (mediaItemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== mediaItemId))
  }

  const addQuiz = (lessonId: string) => {
    setQuizzes(prev => [
      ...prev,
      {
        id: uuidv4(),
        lesson_id: lessonId,
        title: '',
        max_attempts: 1
      }
    ])
  }

  const updateQuiz = (quizId: string, field: keyof Quiz, value: string | number) => {
    setQuizzes(prev => prev.map(quiz => (quiz.id === quizId ? { ...quiz, [field]: value } : quiz)))
  }

  const removeQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId))
    setQuestions(prev => prev.filter(question => question.quiz_id !== quizId))
  }

  const addQuestion = (quizId: string) => {
    setQuestions(prev => [
      ...prev,
      {
        id: uuidv4(),
        quiz_id: quizId,
        type: 'multiple_choice',
        question_text: '',
        options: [
          { id: uuidv4(), text: '', is_correct: false },
          { id: uuidv4(), text: '', is_correct: false }
        ],
        correct_answer: null
      }
    ])
  }

  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    setQuestions(prev =>
      prev.map(question => (question.id === questionId ? { ...question, [field]: value } : question))
    )
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(question => question.id !== questionId))
  }

  const addOption = (questionId: string) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId
          ? { ...question, options: [...question.options, { id: uuidv4(), text: '', is_correct: false }] }
          : question
      )
    )
  }

  const updateOption = (questionId: string, optionId: string, field: keyof Option, value: string | boolean) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map(option => (option.id === optionId ? { ...option, [field]: value } : option))
            }
          : question
      )
    )
  }

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId
          ? { ...question, options: question.options.filter(option => option.id !== optionId) }
          : question
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(lessons, mediaItems, quizzes, questions)
  }

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {modules.map(module => (
        <Paper key={module.id} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant='h2' sx={{ fontWeight: 'bold', marginBottom: 4 }}>
            Lesson Name: {module.title}
          </Typography>
          <Divider sx={{ marginBottom: 4 }} />
          {lessons
            .filter(lesson => lesson.module_id === module.id)
            .map(lesson => (
              <Box key={lesson.id} sx={{ padding: 2, borderRadius: 2, marginBottom: 2 }}>
                <TextField
                  label='Lesson Title'
                  value={lesson.title}
                  onChange={e => updateLesson(lesson.id, 'title', e.target.value)}
                  fullWidth
                  variant='outlined'
                  sx={{ marginBottom: 2 }}
                />

                {mounted && (
                  <Box sx={{ marginTop: 2 }}>
                    <ReactQuill
                      theme='snow'
                      value={lesson.content}
                      onChange={content => updateLesson(lesson.id, 'content', content)}
                      style={{ height: '200px' }}
                    />
                  </Box>
                )}

                <Box sx={{ marginTop: 2, paddingTop: 15 }}>
                  <Typography variant='subtitle1'>Media</Typography>
                  <Button variant='contained' component='label' sx={{ marginTop: 1 }} startIcon={<UploadIcon />}>
                    Upload Files
                    <input
                      type='file'
                      onChange={e => handleFileUpload(e, lesson.id)}
                      multiple
                      accept='image/*,video/*,application/pdf'
                      hidden
                    />
                  </Button>
                  <List sx={{ marginTop: 2 }}>
                    {mediaItems
                      .filter(item => item.lesson_id === lesson.id)
                      .map(item => (
                        <ListItem key={item.id} sx={{ padding: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                          <ListItemText primary={item.name} />
                          <ListItemSecondaryAction>
                            <IconButton edge='end' onClick={() => removeMediaItem(item.id)} color='error'>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </Box>

                {quizzes
                  .filter(quiz => quiz.lesson_id === lesson.id)
                  .map(quiz => (
                    <Box key={quiz.id} sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2, marginTop: 2 }}>
                      <TextField
                        label='Quiz Title'
                        value={quiz.title}
                        onChange={e => updateQuiz(quiz.id, 'title', e.target.value)}
                        fullWidth
                        variant='outlined'
                        sx={{ marginBottom: 2 }}
                      />
                      <TextField
                        label='Max Attempts'
                        type='number'
                        value={quiz.max_attempts}
                        onChange={e => updateQuiz(quiz.id, 'max_attempts', parseInt(e.target.value) || 1)}
                        fullWidth
                        variant='outlined'
                        sx={{ marginBottom: 2 }}
                      />
                      {questions
                        .filter(question => question.quiz_id === quiz.id)
                        .map(question => (
                          <Box
                            key={question.id}
                            sx={{
                              padding: 2,
                              border: '1px solid #ddd',
                              borderRadius: 2,
                              marginTop: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2
                            }}
                          >
                            <TextField
                              label='Question'
                              value={question.question_text}
                              onChange={e => updateQuestion(question.id, 'question_text', e.target.value)}
                              fullWidth
                              variant='outlined'
                              sx={{ marginBottom: 2 }}
                            />
                            <FormControl fullWidth variant='outlined' sx={{ marginBottom: 2 }}>
                              <InputLabel>Question Type</InputLabel>
                              <Select
                                value={question.type}
                                onChange={e => updateQuestion(question.id, 'type', e.target.value as Question['type'])}
                              >
                                <MenuItem value='multiple_choice'>Multiple Choice</MenuItem>
                                <MenuItem value='true_false'>True/False</MenuItem>
                                <MenuItem value='essay'>Essay</MenuItem>
                              </Select>
                            </FormControl>
                            {question.type === 'multiple_choice' && (
                              <Box sx={{ marginTop: 2 }}>
                                {question.options.map(option => (
                                  <Box
                                    key={option.id}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1 }}
                                  >
                                    <TextField
                                      label='Option'
                                      value={option.text}
                                      onChange={e => updateOption(question.id, option.id, 'text', e.target.value)}
                                      fullWidth
                                      variant='outlined'
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={option.is_correct}
                                          onChange={e =>
                                            updateOption(question.id, option.id, 'is_correct', e.target.checked)
                                          }
                                        />
                                      }
                                      label='Correct'
                                    />

                                    <IconButton
                                      onClick={() => removeOption(question.id, option.id)}
                                      color='error'
                                      size='small'
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                ))}
                                <Button
                                  variant='outlined'
                                  color='primary'
                                  size='small'
                                  startIcon={<AddIcon />}
                                  onClick={() => addOption(question.id)}
                                >
                                  Add Option
                                </Button>
                              </Box>
                            )}
                            {question.type === 'true_false' && (
                              <Box sx={{ marginTop: 2 }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={question.correct_answer === 'true'}
                                      onChange={() => updateQuestion(question.id, 'correct_answer', 'true')}
                                    />
                                  }
                                  label='True'
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={question.correct_answer === 'false'}
                                      onChange={() => updateQuestion(question.id, 'correct_answer', 'false')}
                                    />
                                  }
                                  label='False'
                                />
                              </Box>
                            )}
                            <Button
                              variant='outlined'
                              color='error'
                              size='small'
                              onClick={() => removeQuestion(question.id)}
                              startIcon={<DeleteIcon />}
                              sx={{ marginTop: 2 }}
                            >
                              Remove Question
                            </Button>
                          </Box>
                        ))}
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='contained'
                          size='small'
                          color='primary'
                          startIcon={<AddIcon />}
                          onClick={() => addQuestion(quiz.id)}
                          sx={{ marginTop: 2 }}
                        >
                          Add Question
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          size='small'
                          onClick={() => removeQuiz(quiz.id)}
                          startIcon={<DeleteIcon />}
                          sx={{ marginTop: 2 }}
                        >
                          Remove Quiz
                        </Button>
                      </div>
                    </Box>
                  ))}
                <Button
                  variant='outlined'
                  color='primary'
                  size='small'
                  startIcon={<AddIcon />}
                  onClick={() => addQuiz(lesson.id)}
                  sx={{ marginTop: 2 }}
                >
                  Add Quiz
                </Button>
                <div className='flex justify-end gap-2'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={lesson.is_prerequisite}
                        onChange={e => updateLesson(lesson.id, 'is_prerequisite', e.target.checked)}
                      />
                    }
                    label='Is Prerequisite'
                    sx={{ marginTop: 2 }}
                  />
                  <Button
                    variant='outlined'
                    color='error'
                    size='small'
                    onClick={() => removeLesson(lesson.id)}
                    startIcon={<DeleteIcon />}
                    sx={{ marginTop: 2 }}
                  >
                    Remove Lesson
                  </Button>
                </div>
              </Box>
            ))}
          <Button
            variant='outlined'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => addLesson(module.id)}
            sx={{ marginTop: 2 }}
          >
            Add Lesson
          </Button>
        </Paper>
      ))}
      <div className='flex justify-end gap-2'>
        <Button
          type='button'
          variant='outlined'
          color='primary'
          size='small'
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Button type='submit' variant='contained' color='primary' endIcon={<ArrowForwardIcon />}>
          Next
        </Button>
      </div>
    </Box>
  )
}

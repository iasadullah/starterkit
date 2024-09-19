import CourseDetailsView from '@/views/CourseDetailsView'

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  return <CourseDetailsView courseId={params.id} />
}

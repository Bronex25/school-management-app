'use client'

import {
  deleteAssignment,
  deleteClass,
  deleteExam,
  deleteLesson,
  deleteParent,
  deleteResult,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from '@/lib/actions'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Dispatch, JSX, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import { FormConatinerProps } from './FormContainer'
import BigFormSkeleton from './skeletons/BigFormSkeleton'
import EventForm from '../features/events/EventForm'
import { deleteAnnouncement } from '@/features/announcements/announcements.actions'
import { SmallFormSkeleton } from './skeletons/SmallFormSkeleton'
import { deleteEvent } from '@/features/events/events.actions'

type TableName = FormConatinerProps['table']

type ModalFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

type DeleteAction = (
  state: {
    success: boolean
    error: boolean | { message: string }[] | false | true
  },
  data: FormData,
) => Promise<{
  success: boolean
  error: boolean | { message: string }[] | false | true
}>

const deleteActionMap: Partial<Record<TableName, DeleteAction>> = {
  subject: deleteSubject as DeleteAction,
  class: deleteClass as DeleteAction,
  teacher: deleteTeacher as DeleteAction,
  student: deleteStudent as DeleteAction,
  parent: deleteParent as DeleteAction,
  lesson: deleteLesson as DeleteAction,
  exam: deleteExam as DeleteAction,
  assignment: deleteAssignment as DeleteAction,
  result: deleteResult as DeleteAction,
  event: deleteEvent as DeleteAction,
  announcement: deleteAnnouncement as DeleteAction,
}

const TeacherForm = dynamic<ModalFormProps>(
  () => import('./forms/TeacherForm'),
  {
    loading: () => <BigFormSkeleton />,
  },
)

const StudentForm = dynamic<ModalFormProps>(
  () => import('./forms/StudentForm'),
  {
    loading: () => <BigFormSkeleton />,
  },
)

const SubjectForm = dynamic<ModalFormProps>(
  () => import('./forms/SubjectForm'),
  {
    loading: () => <SmallFormSkeleton />,
  },
)

const AnnouncementForm = dynamic<ModalFormProps>(
  () => import('@/features/announcements/AnnouncementForm'),
  {
    loading: () => <SmallFormSkeleton />,
  },
)

const ClassForm = dynamic<ModalFormProps>(() => import('./forms/ClassForm'), {
  loading: () => <BigFormSkeleton />,
})

const ExamForm = dynamic<ModalFormProps>(() => import('./forms/ExamForm'), {
  loading: () => <SmallFormSkeleton />,
})

const LessonForm = dynamic<ModalFormProps>(() => import('./forms/LessonForm'), {
  loading: () => <SmallFormSkeleton />,
})
const AssignmentForm = dynamic<ModalFormProps>(
  () => import('./forms/AssignmentForm'),
  {
    loading: () => <SmallFormSkeleton />,
  },
)
const ParentForm = dynamic<ModalFormProps>(
  () => import('./forms/ParentForm').then((mod) => mod.default),
  {
    loading: () => <BigFormSkeleton />,
  },
)
const ResultForm = dynamic<ModalFormProps>(() => import('./forms/ResultForm'), {
  loading: () => <SmallFormSkeleton />,
})

const forms: Record<
  Exclude<TableName, 'attendance'>,
  (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: 'create' | 'update',
    data?: unknown,
    relativeData?: unknown,
  ) => JSX.Element
> = {
  teacher: (setOpen, type, data, relativeData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  student: (setOpen, type, data, relativeData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  subject: (setOpen, type, data, relativeData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  class: (setOpen, type, data, relativeData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  event: (setOpen, type, data, relativeData) => (
    <EventForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  exam: (setOpen, type, data, relativeData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  announcement: (setOpen, type, data, relativeData) => (
    <AnnouncementForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  lesson: (setOpen, type, data, relativeData) => (
    <LessonForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  assignment: (setOpen, type, data, relativeData) => (
    <AssignmentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  parent: (setOpen, type, data, relativeData) => (
    <ParentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
  result: (setOpen, type, data, relativeData) => (
    <ResultForm
      type={type}
      data={data}
      setOpen={setOpen}
      relativeData={relativeData}
    />
  ),
}

const FormModal = ({
  table,
  type,
  data,
  id,
  relativeData,
}: FormConatinerProps & { relativeData?: unknown }) => {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7'
  const bgColor =
    type === 'create'
      ? 'bg-myYellow'
      : type === 'update'
        ? 'bg-mySky'
        : 'bg-myPurple'

  const [open, setOpen] = useState(false)

  const deleteAction = deleteActionMap[table]

  if (type === 'delete' && !deleteAction) {
    throw new Error(`Delete action missing for table: ${table}`)
  }

  const handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!deleteAction) return

    const formData = new FormData(e.currentTarget)
    const result = await deleteAction(
      { success: false, error: false },
      formData,
    )

    if (result.success) {
      toast(`${table} has been deleted!`)
      setOpen(false)
    } else {
      toast.error(`Failed to delete ${table}`)
    }
  }

  const Form = () => {
    if (type === 'delete' && id) {
      return (
        <form onSubmit={handleDeleteSubmit} className="p-4 flex flex-col gap-4">
          <input type="hidden" name="id" value={id} />
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button
            type="submit"
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center cursor-pointer"
          >
            Delete
          </button>
        </form>
      )
    }

    if (type === 'create' || type === 'update') {
      return forms[table](setOpen, type, data, relativeData)
    }

    return <p>Form not found!</p>
  }

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor} cursor-pointer`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FormModal

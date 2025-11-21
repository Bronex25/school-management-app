/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  deleteAnnouncement,
  deleteClass,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from '@/lib/actions'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  Dispatch,
  JSX,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from 'react'
import { toast } from 'react-toastify'
import { FormConatinerProps } from './FormContainer'
import BigFormSkeleton from './skeletons/BigFormSkeleton'

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  parentSubject: deleteSubject,
  lesson: deleteSubject,
  exam: deleteSubject,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteAnnouncement,
}

const TeacherForm = dynamic(() => import('./forms/TeacherForm'), {
  loading: () => <BigFormSkeleton />,
})
const StudentForm = dynamic(() => import('./forms/StudentForm'), {
  loading: () => <BigFormSkeleton />,
})
const SubjectForm = dynamic(() => import('./forms/SubjectForm'), {
  loading: () => <h1>Loading...</h1>,
})
const ClassForm = dynamic(() => import('./forms/ClassForm'), {
  loading: () => <h1>Loading...</h1>,
})
const ExamForm = dynamic(() => import('./forms/ExamForm'), {
  loading: () => <h1>Loading...</h1>,
})
const AnnouncementForm = dynamic(() => import('./forms/AnnouncementForm'), {
  loading: () => <h1>Loading...</h1>,
})

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: 'create' | 'update',
    data?: any,
    relativeData?: any,
  ) => JSX.Element
} = {
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
}

const FormModal = ({
  table,
  type,
  data,
  id,
  relativeData,
}: FormConatinerProps & { relativeData?: any }) => {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7'
  const bgColor =
    type === 'create'
      ? 'bg-myYellow'
      : type === 'update'
        ? 'bg-mySky'
        : 'bg-myPurple'

  const [open, setOpen] = useState(false)

  const deleteAction =
    table in deleteActionMap
      ? deleteActionMap[table as keyof typeof deleteActionMap]
      : undefined
  const [state, formAction] = useActionState(
    deleteAction ?? (async () => ({ success: false, error: true })),
    {
      success: false,
      error: false,
    },
  )

  useEffect(() => {
    if (state.success) {
      toast(`${table} has been deleted!`)
      setOpen(false)
    }
  }, [state, table])

  const Form = () => {
    if (type === 'delete' && id) {
      return (
        <form action={formAction} className="p-4 flex flex-col gap-4">
          <input type="hidden" name="id" value={id} />
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center cursor-pointer">
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

import z from 'zod'

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long!' })
    .max(20, { message: 'Username must be at most 20 characters long!' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' })
    .or(z.literal('')),
  name: z.string().min(1, { message: 'First name is required!' }),
  surname: z.string().min(1, { message: 'Last name is required!' }),
  email: z
    .string()
    .email({ message: 'Invalid email address!' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().nullish(),
  bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
  birthday: z.string().min(1, { message: 'Birthday is required!' }),
  sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex is required!' }),
  subjects: z
    .preprocess(
      (val) => (Array.isArray(val) ? val.map((v) => Number(v)) : []),
      z.array(z.number()),
    )
    .optional(),
})

export type TeacherFormValues = z.input<typeof teacherSchema>
export type TeacherSchema = z.output<typeof teacherSchema>

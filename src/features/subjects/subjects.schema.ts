import z from 'zod'

export const subjectSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: 'Subject name is required' }),
  teachers: z.array(z.string()),
})

export type SubjectFormValues = z.input<typeof subjectSchema>
export type SubjectSchema = z.output<typeof subjectSchema>

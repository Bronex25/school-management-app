import React from 'react'

type Props = {
  isPending: boolean
  type: 'create' | 'update'
}
const FormButton = ({ isPending, type }: Props) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`p-2 rounded-md text-white ${
        isPending ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-400'
      }`}
    >
      {isPending ? 'Saving...' : type === 'create' ? 'Create' : 'Update'}
    </button>
  )
}

export default FormButton

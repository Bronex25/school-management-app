import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import type { Dispatch, SetStateAction } from 'react'
import type { CloudinaryUploadWidgetInfo } from '@cloudinary-util/types'

type UploadPhotoButtonProps = {
  img: CloudinaryUploadWidgetInfo | null
  setImg: Dispatch<SetStateAction<CloudinaryUploadWidgetInfo | null>>
}

const UploadPhotoButton = ({ img, setImg }: UploadPhotoButtonProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4 items-center justify-center">
      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(result, { widget }) => {
          if (result?.info && typeof result.info !== 'string') {
            setImg(result.info)
          }
          widget.close()
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              <Image
                src="/upload.png"
                alt="Upload image button"
                width={28}
                height={28}
              />
              <span>Upload a photo</span>
            </div>
          )
        }}
      </CldUploadWidget>
      {img && (
        <Image
          src={img.secure_url}
          alt="Teacher photo preview"
          width={80}
          height={80}
          className="rounded-full w-20 h-20 object-cover"
        />
      )}
    </div>
  )
}

export default UploadPhotoButton

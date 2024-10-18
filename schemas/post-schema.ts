import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(10, "Minimum 10 symbols").max(128, "Maximum 128 symbols"),
  content: z.string().min(1, "Content is required").max(40960, "Maximum 40960 symbols"),
  tags: z.coerce.string().array().min(1, "Tags are required"),
  thumbnail: z.custom<File>(
    (file) => {
      // Ensure it's a File and its type starts with "image/"
      return file instanceof File && file.type.startsWith("image/")
    },
    {
      message: "Thumbnail is required",
    },
  ),
})

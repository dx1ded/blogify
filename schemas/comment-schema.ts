import { z } from "zod"

export const commentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  text: z.string().min(10, "Minimum 10 symbols").max(255, "Maximum 255 symbols"),
  authorId: z.string().min(1, "Author ID is required"),
  parentCommentId: z.number().optional(),
})

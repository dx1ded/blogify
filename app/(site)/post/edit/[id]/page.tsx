import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { authOptions } from "~/app/api/auth/[...nextauth]/route"
import prisma from "~/prisma"
import { editPost } from "~/server-actions/post"
import PostForm from "~/shared/ui/PostForm"

export const metadata: Metadata = {
  title: "Edit",
}

export default async function EditPost({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const post = await prisma.post.findUnique({
    where: { id: params.id },
  })

  if (!post || post.authorId !== session?.user.id) {
    notFound()
  }

  return (
    <PostForm
      title="Edit post"
      defaultValues={post}
      action={async (formData) => {
        "use server"
        editPost(formData, post.id)
      }}
      onSuccessMessage="Post has been successfully updated"
    />
  )
}

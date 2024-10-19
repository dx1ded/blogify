import { getServerSession } from "next-auth"
import { toast } from "sonner"
import { authOptions } from "~/app/api/auth/[...nextauth]/route"
import prisma from "~/prisma"
import { editPost } from "~/server-actions/post"
import PostForm from "~/shared/ui/PostForm"

export default async function EditPost({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  console.log(session)

  const post = await prisma.post.findUnique({
    where: { id: params.id },
  })

  if (!post || post.authorId !== session?.user.id) throw new Error("Not found")

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

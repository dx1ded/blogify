import { create } from "zustand"
import type { Comment, Post } from "~/shared/lib"

type State = {
  post: Post
  isLoading: boolean
}

type Action = {
  setPost: (post: Post) => void
  setIsLoading: (isLoading: boolean) => void
  togglePostLike: (userId: string) => void
  addComment: (comment: Comment) => void
  removeComment: (commentId: number) => void
  toggleCommentLike: (commentId: number, userId: string) => void
}

const initialState: State = {
  post: {
    id: "",
    slug: "",
    title: "",
    content: "",
    tags: [],
    thumbnailUrl: "",
    createdAt: new Date(),
    author: {
      id: "",
      name: "",
      image: "",
    },
    likedBy: [],
    comments: [],
  },
  isLoading: true,
}

export const usePostStore = create<State & Action>((set) => ({
  ...initialState,
  setPost: (post: Post) => set(() => ({ post })),
  setIsLoading: (isLoading) =>
    set(() => ({
      isLoading,
    })),
  togglePostLike: (userId) =>
    set((state) => ({
      post: {
        ...state.post,
        likedBy: state.post.likedBy.includes(userId)
          ? state.post.likedBy.filter((likedBy) => likedBy !== userId)
          : [...state.post.likedBy, userId],
      },
    })),
  addComment: (comment) =>
    set((state) => ({
      post: {
        ...state.post,
        comments: [...state.post.comments, comment],
      },
    })),
  removeComment: (commentId) =>
    set((state) => {
      const recursiveDelete = (commentId: number) => {
        const comment = state.post.comments.find((comment) => comment.id === commentId)
        if (!comment) return
        if (comment.subcomments.length) {
          comment.subcomments.forEach((comment) => recursiveDelete(comment.id))
        }

        state.post.comments = state.post.comments.filter((comment) => comment.id !== commentId)
        // This one for the filter callback
        return false
      }

      return {
        post: {
          ...state.post,
          comments: state.post.comments.filter((comment) => comment.id !== commentId && recursiveDelete(comment.id)),
        },
      }
    }),
  toggleCommentLike: (commentId, userId) =>
    set((state) => ({
      post: {
        ...state.post,
        comments: state.post.comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likedBy: comment.likedBy.includes(userId)
                  ? comment.likedBy.filter((likedBy) => likedBy !== userId)
                  : [...comment.likedBy, userId],
              }
            : comment,
        ),
      },
    })),
}))

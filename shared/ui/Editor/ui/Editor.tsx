"use client"

import { Link } from "@tiptap/extension-link"
import { Image } from "@tiptap/extension-image"
import { Blockquote } from "@tiptap/extension-blockquote"
import { Bold } from "@tiptap/extension-bold"
import { BulletList } from "@tiptap/extension-bullet-list"
import { ListItem } from "@tiptap/extension-list-item"
import { Document } from "@tiptap/extension-document"
import { Heading } from "@tiptap/extension-heading"
import { Italic } from "@tiptap/extension-italic"
import { OrderedList } from "@tiptap/extension-ordered-list"
import { Paragraph } from "@tiptap/extension-paragraph"
import { Strike } from "@tiptap/extension-strike"
import { Text } from "@tiptap/extension-text"
import { Underline } from "@tiptap/extension-underline"
import { Highlight } from "@tiptap/extension-highlight"
import { type EditorContentProps, EditorContent, mergeAttributes, EditorProvider } from "@tiptap/react"
import { forwardRef } from "react"
import { cn } from "~/shared/lib"
import {
  BlockquoteClassname,
  BulletListClassname,
  H1Classname,
  H2Classname,
  H3Classname,
  H4Classname,
  OrderedListClassname,
  TextClassname,
} from "~/shared/ui/Typography"
import { Toolbar } from "./Toolbar"

const extensions = [
  Document,
  Text,
  Bold,
  Italic,
  Underline,
  Strike,
  ListItem,
  BulletList.configure({
    HTMLAttributes: {
      class: BulletListClassname,
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: OrderedListClassname,
    },
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class: BlockquoteClassname,
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: cn("[&.ProseMirror-selectednode]:brightness-90"),
    },
  }),
  Link.configure({
    HTMLAttributes: {
      class: cn("text-blue-500 bg-gray-100 cursor-pointer rounded font-medium py-0.5 px-1"),
    },
  }),
  Highlight.configure({
    HTMLAttributes: {
      class: cn("p-0.5 font-medium rounded"),
    },
  }),
  Paragraph.configure({
    HTMLAttributes: {
      class: TextClassname,
    },
  }),
  Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
      const level = this.options.levels.includes(node.attrs.level) ? node.attrs.level : this.options.levels[0]
      const classes: Record<number, string> = {
        1: H1Classname,
        2: H2Classname,
        3: H3Classname,
        4: H4Classname,
      }
      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: classes[level],
        }),
        0,
      ]
    },
  }),
]

interface EditorProps extends Omit<EditorContentProps, "editor" | "ref"> {
  onUpdate?: (value: string) => void
  editable?: boolean
}

export const Editor = forwardRef<HTMLDivElement, EditorProps>(function Editor(
  { editable = true, onUpdate, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(editable && "rounded-md border border-input bg-white shadow-sm")}>
      <EditorProvider
        editable={editable}
        {...(editable ? { slotBefore: <Toolbar /> } : {})}
        content={String(props.value)}
        extensions={extensions}
        immediatelyRender={false}
        editorProps={{
          attributes: {
            class: cn("outline-0 font-serif", editable && "min-h-[16rem] max-h-[37.5rem] overflow-auto p-2"),
          },
        }}
        onUpdate={(updated) => {
          if (onUpdate) onUpdate(updated.editor.getHTML())
        }}>
        <EditorContent editor={null} {...props} />
      </EditorProvider>
    </div>
  )
})

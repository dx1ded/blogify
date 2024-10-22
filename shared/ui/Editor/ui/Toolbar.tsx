"use client"

import {
  BoldIcon,
  HighlighterIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  TextQuoteIcon,
  UnderlineIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/ui-kit/select"
import { Separator } from "~/shared/ui-kit/separator"
import { useEditorContext } from "~/shared/ui/Editor"
import { ToolbarButton } from "./ToolbarButton"
import { LinkButton } from "./LinkButton"
import { ImageButton } from "./ImageButton"

export function Toolbar() {
  const editor = useEditorContext()

  const selectValueChangeHandler = (value: string) => {
    if (value === "paragraph") {
      editor?.chain().focus().setParagraph().run()
    } else if (value === "h1") {
      editor?.chain().focus().setHeading({ level: 1 }).run()
    } else if (value === "h2") {
      editor?.chain().focus().setHeading({ level: 2 }).run()
    } else if (value === "h3") {
      editor?.chain().focus().setHeading({ level: 3 }).run()
    } else if (value === "h4") {
      editor?.chain().focus().setHeading({ level: 4 }).run()
    }
  }

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-input bg-transparent px-2 py-1.5">
      <Select
        onValueChange={selectValueChangeHandler}
        value={
          editor?.isActive("heading", { level: 1 })
            ? "h1"
            : editor?.isActive("heading", { level: 2 })
              ? "h2"
              : editor?.isActive("heading", { level: 3 })
                ? "h3"
                : editor?.isActive("heading", { level: 4 })
                  ? "h4"
                  : editor?.isActive("paragraph")
                    ? "paragraph"
                    : ""
        }>
        <SelectTrigger className="w-[8rem]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Paragraph</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="h-6" />
      <ToolbarButton
        name="Bold"
        isActive={Boolean(editor?.isActive("bold"))}
        Icon={BoldIcon}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        name="Italic"
        isActive={Boolean(editor?.isActive("italic"))}
        Icon={ItalicIcon}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        name="Underline"
        isActive={Boolean(editor?.isActive("underline"))}
        Icon={UnderlineIcon}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        name="Strike"
        isActive={Boolean(editor?.isActive("strike"))}
        Icon={StrikethroughIcon}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
      />
      <Separator orientation="vertical" className="h-6" />
      <LinkButton />
      <ToolbarButton
        name="Highlight"
        isActive={Boolean(editor?.isActive("highlight"))}
        Icon={HighlighterIcon}
        onClick={() => editor?.chain().focus().toggleHighlight().run()}
      />
      <Separator orientation="vertical" className="h-6" />
      <ToolbarButton
        name="Bullet list"
        isActive={Boolean(editor?.isActive("bulletList"))}
        Icon={ListIcon}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        name="Ordered list"
        isActive={Boolean(editor?.isActive("orderedList"))}
        Icon={ListOrderedIcon}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      />
      <Separator orientation="vertical" className="h-6" />
      <ToolbarButton
        name="Blockquote"
        isActive={Boolean(editor?.isActive("blockquote"))}
        Icon={TextQuoteIcon}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
      />
      <ImageButton />
    </div>
  )
}

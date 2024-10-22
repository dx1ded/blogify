"use client"

import type { Editor } from "@tiptap/core"
import { createContext, useContext } from "react"

const EditorContext = createContext<Editor | null>(null)

export function EditorContextProvider({ value, children }: { value: Editor | null; children: React.ReactNode }) {
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export function useEditorContext() {
  return useContext(EditorContext)
}

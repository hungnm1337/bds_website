'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { Extension } from '@tiptap/core'
import { useState } from 'react'

interface RichTextEditorProps {
  name: string
  defaultValue?: string
  placeholder?: string
  minHeight?: string
}

type Level = 1 | 2 | 3

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg text-sm transition-all ${
        active
          ? 'bg-blue-100 text-blue-700 font-semibold'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({
  name,
  defaultValue = '',
  placeholder = 'Nhập nội dung...',
  minHeight = '160px',
}: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    onUpdate({ editor }) {
      setHtml(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'outline-none prose prose-sm max-w-none px-4 py-3 min-h-[inherit]',
      },
    },
    immediatelyRender: false,
  })

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden">
      {/* Hidden input để submit HTML vào FormData */}
      <input type="hidden" name={name} value={html} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-white">
        {/* History */}
        <ToolbarButton title="Undo" onClick={() => editor?.chain().focus().undo().run()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor?.chain().focus().redo().run()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Headings */}
        {([1, 2, 3] as Level[]).map((level) => (
          <ToolbarButton
            key={level}
            title={`Heading ${level}`}
            active={editor?.isActive('heading', { level }) ?? false}
            onClick={() => editor?.chain().focus().toggleHeading({ level }).run()}
          >
            <span className="font-bold text-xs">H{level}</span>
          </ToolbarButton>
        ))}

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Text style */}
        <ToolbarButton
          title="Bold"
          active={editor?.isActive('bold') ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor?.isActive('italic') ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 4h-9M14 20H5M15 4L9 20" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor?.isActive('underline') ?? false}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v7a5 5 0 0010 0V4M3 21h18" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Lists */}
        <ToolbarButton
          title="Bullet List"
          active={editor?.isActive('bulletList') ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            <circle cx="2" cy="6" r="1" fill="currentColor" />
            <circle cx="2" cy="12" r="1" fill="currentColor" />
            <circle cx="2" cy="18" r="1" fill="currentColor" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Ordered List"
          active={editor?.isActive('orderedList') ?? false}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h11M10 12h11M10 18h11M4 6h.01M4 12h.01M4 18h.01" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Blockquote */}
        <ToolbarButton
          title="Blockquote"
          active={editor?.isActive('blockquote') ?? false}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Align */}
        <ToolbarButton
          title="Căn trái"
          active={editor?.isActive({ textAlign: 'left' }) ?? false}
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Căn giữa"
          active={editor?.isActive({ textAlign: 'center' }) ?? false}
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Căn phải"
          active={editor?.isActive({ textAlign: 'right' }) ?? false}
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor content */}
      <div style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

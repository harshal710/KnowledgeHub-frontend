import { useRef, useEffect } from 'react'
import './RichTextEditor.css'

/**
 * RichTextEditor using native contenteditable with formatting toolbar.
 * Compatible with React 19 without peer dep issues.
 * Uses execCommand for formatting - gracefully degrades in modern browsers.
 */
export default function RichTextEditor({ value, onChange, placeholder = 'Start writing your article...' }) {
    const editorRef = useRef(null)
    const isInternalChange = useRef(false)

    // Sync external value → editor (only on first mount or external reset)
    useEffect(() => {
        if (!editorRef.current) return
        if (isInternalChange.current) {
            isInternalChange.current = false
            return
        }
        if (editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || ''
        }
    }, [value])

    const handleInput = () => {
        isInternalChange.current = true
        onChange(editorRef.current?.innerHTML || '')
    }

    const execCmd = (command, arg = null) => {
        editorRef.current?.focus()
        document.execCommand(command, false, arg)
        handleInput()
    }

    const insertCode = () => {
        const sel = window.getSelection()
        const range = sel?.getRangeAt(0)
        if (range) {
            const code = document.createElement('code')
            code.textContent = range.toString() || 'code here'
            range.deleteContents()
            range.insertNode(code)
            handleInput()
        }
    }

    const toolbarButtons = [
        { label: 'B', title: 'Bold', action: () => execCmd('bold'), style: { fontWeight: 'bold' } },
        { label: 'I', title: 'Italic', action: () => execCmd('italic'), style: { fontStyle: 'italic' } },
        { label: 'U', title: 'Underline', action: () => execCmd('underline'), style: { textDecoration: 'underline' } },
        { sep: true },
        { label: 'H2', title: 'Heading 2', action: () => execCmd('formatBlock', '<h2>') },
        { label: 'H3', title: 'Heading 3', action: () => execCmd('formatBlock', '<h3>') },
        { label: 'P', title: 'Paragraph', action: () => execCmd('formatBlock', '<p>') },
        { sep: true },
        { label: '≡', title: 'Bullet List', action: () => execCmd('insertUnorderedList') },
        { label: '1.', title: 'Numbered List', action: () => execCmd('insertOrderedList') },
        { label: '❝', title: 'Block Quote', action: () => execCmd('formatBlock', '<blockquote>') },
        { label: '</>', title: 'Inline Code', action: insertCode },
        { sep: true },
        { label: '⟵', title: 'Undo', action: () => execCmd('undo') },
        { label: '⟶', title: 'Redo', action: () => execCmd('redo') },
    ]

    return (
        <div className="rte-wrapper">
            {/* Toolbar */}
            <div className="rte-toolbar">
                {toolbarButtons.map((btn, i) =>
                    btn.sep
                        ? <div key={i} className="rte-sep" />
                        : (
                            <button
                                key={i}
                                type="button"
                                title={btn.title}
                                className="rte-btn"
                                style={btn.style}
                                onMouseDown={e => { e.preventDefault(); btn.action() }}
                            >
                                {btn.label}
                            </button>
                        )
                )}
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                className="rte-editor"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                data-placeholder={placeholder}
                aria-label="Article content editor"
                aria-multiline="true"
            />
        </div>
    )
}

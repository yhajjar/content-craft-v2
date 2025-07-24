import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import './tiptap-editor.css';

// Import icons
import {
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Undo, Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  compact?: boolean;
  editorKey?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(({
  value,
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  compact = false,
  editorKey
}) => {
  const handleUpdate = useCallback(({ editor }: any) => {
    const html = editor.getHTML();
    onChange(html);
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
    ],
    content: value || '',
    onUpdate: handleUpdate,
    editable: !readOnly,
    immediatelyRender: false,
  });

  // Update editor content when value changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  // Update editor editable state when readOnly changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  const colors = [
    { name: 'Text Color', value: '' },
    { name: 'Black', value: '#000000' },
    { name: 'Gray', value: '#666666' },
    { name: 'Red', value: '#ff0000' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Green', value: '#00ff00' },
  ];

  if (readOnly) {
    return (
      <div className="tiptap-editor">
        <div className="tiptap-content tiptap-readonly">
          <div
            className="tiptap-display-content"
            dangerouslySetInnerHTML={{
              __html: value || `<p class="text-muted-foreground italic">${placeholder}</p>`
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="tiptap-editor" key={editorKey}>
      {editor && (
        <div className="tiptap-toolbar">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'is-active' : ''}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          
          <select
            className="h-8"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            value={editor.getAttributes('textStyle').color || ''}
          >
            {colors.map((color) => (
              <option key={color.value} value={color.value}>{color.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="tiptap-content" style={{ minHeight: '400px' }}>
        <EditorContent
          editor={editor}
          className="min-h-[400px] focus:outline-none cursor-text"
          onClick={() => {
            if (editor && !readOnly) {
              editor.chain().focus().run();
            }
          }}
        />
      </div>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
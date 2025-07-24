import React, { useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from '@tiptap/extension-font-size';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Code from '@tiptap/extension-code';
import './tiptap-editor.css';

// Import icons
import {
  Bold, Italic, Underline as UnderlineIcon, Code as CodeIcon, 
  List, ListOrdered, Undo, Redo, Superscript as SuperscriptIcon, Subscript as SubscriptIcon
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  compact?: boolean;
  editorKey?: string; // Add unique key for each editor instance
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  compact = false,
  editorKey
}) => {
  // Create a unique key for this editor instance
  const uniqueKey = useMemo(() => {
    return editorKey || `editor-${Math.random().toString(36).substr(2, 9)}`;
  }, [editorKey]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Underline,
      Superscript,
      Subscript,
      Code,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !readOnly,
  }, [uniqueKey]); // Use uniqueKey as dependency

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  // Update editor editable state when readOnly prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

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

  const fontFamilies = [
    { name: 'Font Family', value: '' },
    { name: 'Default', value: 'sans-serif' },
    { name: 'Serif', value: 'serif' },
    { name: 'Monospace', value: 'monospace' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
  ];

  const fontSizes = [
    { name: 'Font Size', value: '' },
    { name: 'Small', value: '12px' },
    { name: 'Normal', value: '16px' },
    { name: 'Large', value: '20px' },
    { name: 'X-Large', value: '24px' },
  ];

  const colors = [
    { name: 'Text Color', value: '' },
    { name: 'Black', value: '#000000' },
    { name: 'Gray', value: '#666666' },
    { name: 'Red', value: '#ff0000' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Green', value: '#00ff00' },
  ];

  return (
    <div className="tiptap-editor" key={uniqueKey}>
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
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'is-active' : ''}
            title="Code"
          >
            <CodeIcon className="h-4 w-4" />
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
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            value={editor.getAttributes('textStyle').fontFamily || ''}
          >
            {fontFamilies.map((font) => (
              <option key={font.value} value={font.value}>{font.name}</option>
            ))}
          </select>
          
          <select 
            className="h-8"
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
            value={editor.getAttributes('textStyle').fontSize || ''}
          >
            {fontSizes.map((size) => (
              <option key={size.value} value={size.value}>{size.name}</option>
            ))}
          </select>
          
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
      <div className="tiptap-content">
        <EditorContent editor={editor} className="min-h-[100px] focus:outline-none" />
      </div>
    </div>
  );
};
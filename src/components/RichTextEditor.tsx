import React, { useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  compact?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  compact = false
}) => {
  const modules = useMemo(() => ({
    toolbar: compact 
      ? [
          ['bold', 'italic', 'underline'],
          ['link'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      : [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'align': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
          ['link', 'image'],
          ['blockquote', 'code-block'],
          ['clean']
        ],
  }), [compact]);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'link', 'image',
    'blockquote', 'code-block'
  ];

  // Apply compact class dynamically
  useEffect(() => {
    const editorElements = document.querySelectorAll('.rich-text-editor .ql-editor');
    editorElements.forEach(editor => {
      if (compact) {
        editor.classList.add('compact');
      } else {
        editor.classList.remove('compact');
      }
    });
  }, [compact]);

  if (readOnly) {
    return (
      <div className="bg-editor-background border border-input rounded-md">
        <div 
          className="prose prose-slate max-w-none p-4 min-h-[100px] quill-content"
          dangerouslySetInnerHTML={{ 
            __html: value || `<p class="text-muted-foreground italic">${placeholder}</p>` 
          }}
        />
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};
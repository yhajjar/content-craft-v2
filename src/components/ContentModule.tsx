import React from 'react';
import { Edit3, Check, Trash2, FileText, Video, BookOpen, Library, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { RichTextEditor } from './RichTextEditor';
import type { Module } from './CourseContentBuilder';

interface ContentModuleProps {
  module: Module;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Module>) => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export const ContentModule: React.FC<ContentModuleProps> = ({
  module,
  isPreviewMode,
  onUpdate,
  onDelete,
  dragHandleProps
}) => {
  const handleTitleEdit = (title: string) => {
    onUpdate({ title });
  };

  const handleContentEdit = (content: string) => {
    onUpdate({ content });
  };

  const toggleEdit = () => {
    onUpdate({ isEditing: !module.isEditing });
  };

  const getModuleIcon = () => {
    switch (module.template) {
      case 'video-lesson':
        return <Video className="h-5 w-5 text-primary" />;
      case 'lecture-notes':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'resource-collection':
        return <Library className="h-5 w-5 text-primary" />;
      default:
        return <BookOpen className="h-5 w-5 text-primary" />;
    }
  };

  if (isPreviewMode) {
    return (
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center gap-3 mb-3">
          {getModuleIcon()}
          <h4 className="font-medium text-foreground">{module.title}</h4>
        </div>
        <RichTextEditor
          value={module.content}
          onChange={() => {}} // No-op since it's preview mode
          readOnly={true}
          compact={true}
          editorKey={`preview-${module.id}`}
        />
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-muted/30 border-l-4 border-l-primary">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          {getModuleIcon()}
          {module.isEditing ? (
            <Input
              value={module.title}
              onChange={(e) => handleTitleEdit(e.target.value)}
              placeholder="Module title"
              className="font-medium"
            />
          ) : (
            <h4 className="font-medium text-foreground">{module.title}</h4>
          )}
          <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
            {module.template.replace('-', ' ')}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={module.isEditing ? "default" : "ghost"}
            size="sm"
            onClick={toggleEdit}
            className="gap-1"
          >
            {module.isEditing ? <Check className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <RichTextEditor
        key={`${module.id}-${module.isEditing}`}
        value={module.content}
        onChange={handleContentEdit}
        placeholder="Add your module content here..."
        readOnly={!module.isEditing}
        compact={true}
        editorKey={module.id}
      />
    </Card>
  );
};

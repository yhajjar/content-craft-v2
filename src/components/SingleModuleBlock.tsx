import React from 'react';
import { Edit3, Check, Trash2, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { RichTextEditor } from './RichTextEditor';
import type { Section } from './CourseContentBuilder';

interface SingleModuleBlockProps {
  section: Section;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export const SingleModuleBlock: React.FC<SingleModuleBlockProps> = ({
  section,
  isPreviewMode,
  onUpdate,
  onDelete,
  dragHandleProps
}) => {
  const module = section.module!;

  const handleTitleEdit = (title: string) => {
    onUpdate({ title });
  };

  const handleModuleTitleEdit = (title: string) => {
    onUpdate({
      module: { ...module, title }
    });
  };

  const handleContentEdit = (content: string) => {
    onUpdate({
      module: { ...module, content }
    });
  };

  const toggleEdit = () => {
    onUpdate({ isEditing: !section.isEditing });
  };

  if (isPreviewMode) {
    return (
      <Card className="p-6 shadow-content">
        <h2 className="text-xl font-semibold text-foreground mb-4">{section.title}</h2>
        <div className="bg-section-header rounded-lg p-4">
          <h3 className="text-lg font-medium text-foreground mb-3">{module.title}</h3>
          <RichTextEditor
            value={module.content}
            onChange={() => {}} // No-op since it's preview mode
            readOnly={true}
            compact={true}
            editorKey={`preview-${module.id}`}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-content">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          {section.isEditing ? (
            <Input
              value={section.title}
              onChange={(e) => handleTitleEdit(e.target.value)}
              placeholder="Section title"
              className="text-lg font-medium"
            />
          ) : (
            <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={section.isEditing ? "default" : "outline"}
            size="sm"
            onClick={toggleEdit}
            className="gap-2"
          >
            {section.isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {section.isEditing ? 'Done' : 'Edit'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive gap-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-section-header rounded-lg p-4">
        <div className="mb-3">
          {section.isEditing ? (
            <Input
              value={module.title}
              onChange={(e) => handleModuleTitleEdit(e.target.value)}
              placeholder="Module title"
              className="font-medium"
            />
          ) : (
            <h3 className="text-lg font-medium text-foreground">{module.title}</h3>
          )}
        </div>
        
        <RichTextEditor
          key={`${module.id}-${section.isEditing}`}
          value={module.content}
          onChange={handleContentEdit}
          placeholder="Add your content here. Use the rich text editor to format text, add images, links, and structure your content..."
          readOnly={!section.isEditing}
          editorKey={module.id}
        />
      </div>
    </Card>
  );
};
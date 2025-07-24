import React, { useMemo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Edit3, Check, Trash2, GripVertical, ChevronDown, ChevronRight, Plus, FileText, Video, BookOpen, Library, FolderPlus, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ContentModule } from './ContentModule';
import type { Section } from './CourseContentBuilder';

interface MultiModuleSectionProps {
  section: Section;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
  onDelete: () => void;
  onAddModule: (template: string) => void;
  templates: Record<string, { title: string; content: string }>;
  dragHandleProps?: any;
}

export const MultiModuleSection: React.FC<MultiModuleSectionProps> = React.memo(({
  section,
  isPreviewMode,
  onUpdate,
  onDelete,
  onAddModule,
  templates,
  dragHandleProps
}) => {
  const modules = useMemo(() => section.modules || [], [section.modules]);

  const handleTitleEdit = (title: string) => {
    onUpdate({ title });
  };

  const toggleExpanded = () => {
    onUpdate({ isExpanded: !section.isExpanded });
  };

  const toggleEdit = () => {
    onUpdate({ isEditing: !section.isEditing });
  };

  const updateModule = (moduleId: string, updates: any) => {
    onUpdate({
      modules: modules.map(module =>
        module.id === moduleId ? { ...module, ...updates } : module
      )
    });
  };

  const deleteModule = (moduleId: string) => {
    onUpdate({
      modules: modules.filter(module => module.id !== moduleId)
    });
  };

  const templateIcons = useMemo(() => ({
    'course-overview': BookOpen,
    'reading-content': FileText,
    'video-lesson': Video,
    'lecture-notes': FileText,
    'resources-references': Library,
    'interactive-activity': FolderPlus,
    'discussion-prompt': Layers,
    'assignment-brief': FileText
  }), []);

  if (isPreviewMode) {
    return (
      <Card className="shadow-content">
        <div 
          className="p-6 border-b border-border cursor-pointer hover:bg-section-header transition-colors"
          onClick={toggleExpanded}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            {section.isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {section.isExpanded && (
          <div className="p-6 space-y-4">
            {modules.map(module => (
              <ContentModule
                key={module.id}
                module={module}
                isPreviewMode={true}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            ))}
            {modules.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No modules in this section yet.</p>
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="shadow-content">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="p-1"
            >
              {section.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
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

        {section.isExpanded && section.isEditing && (
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground mb-3">Add content modules:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(templates).map(([key, template]) => {
                const Icon = templateIcons[key as keyof typeof templateIcons];
                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => onAddModule(key)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {template.title}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {section.isExpanded && (
        <div className="p-6 space-y-4">
          <Droppable droppableId={section.id} type="module">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {modules.map((module, index) => (
                  <Draggable key={module.id} draggableId={module.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <ContentModule
                          module={module}
                          isPreviewMode={false}
                          onUpdate={(updates) => updateModule(module.id, updates)}
                          onDelete={() => deleteModule(module.id)}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          
          {modules.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No modules in this section yet.</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
});

MultiModuleSection.displayName = 'MultiModuleSection';

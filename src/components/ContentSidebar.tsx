import React from 'react';
import { Plus, FileText, Video, BookOpen, Library, FolderPlus, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ContentSidebarProps {
  onAddSection: (type: 'single-module' | 'multi-module', template?: string) => void;
  onAddModule: (template: string) => void;
  templates: Record<string, { title: string; content: string }>;
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({ onAddSection, onAddModule, templates }) => {
  const templateIcons = {
    'course-overview': BookOpen,
    'reading-content': FileText,
    'video-lesson': Video,
    'lecture-notes': FileText,
    'resources-references': Library,
    'interactive-activity': FolderPlus,
    'discussion-prompt': Layers,
    'assignment-brief': FileText
  };

  const templateDescriptions = {
    'course-overview': 'A complete syllabus and course structure.',
    'reading-content': 'Text content, articles, and written materials',
    'video-lesson': 'Video content with descriptions and notes',
    'lecture-notes': 'Detailed lecture content and key concepts',
    'resources-references': 'Links, references, and additional resources',
    'interactive-activity': 'A hands-on lab or simulation.',
    'discussion-prompt': 'A prompt to encourage discussion.',
    'assignment-brief': 'A brief for a project or assignment.'
  };

  return (
    <aside className="w-80 bg-muted border-r border-border flex flex-col sticky top-0 h-screen">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Content Builder</h2>
        <p className="text-sm text-muted-foreground">Add sections and modules to structure your course</p>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <Button onClick={() => onAddSection('multi-module')} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Section
          </Button>
        </div>

        {/* Content Templates */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Content Templates
          </h3>
          <div className="space-y-3">
            {Object.entries(templates).map(([key, template]) => {
              const Icon = templateIcons[key as keyof typeof templateIcons];
              return (
                <Card 
                  key={key}
                  className="p-4 hover:shadow-soft transition-shadow cursor-pointer"
                  onClick={() => onAddModule(key)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{template.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {templateDescriptions[key as keyof typeof templateDescriptions]}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
};

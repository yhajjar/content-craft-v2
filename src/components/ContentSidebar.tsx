import React, { useState, useMemo } from 'react';
import { Plus, FileText, Video, BookOpen, Library, FolderPlus, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ContentSidebarProps {
  onAddSection: (type: 'single-module' | 'multi-module', template?: string) => void;
  onAddModule: (template: string) => void;
  templates: Record<string, { title: string; content: string }>;
}

export const ContentSidebar: React.FC<ContentSidebarProps> = React.memo(({ onAddSection, onAddModule, templates }) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Memoize static objects to prevent recreation
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

  const templateDescriptions = useMemo(() => ({
    'course-overview': 'A complete syllabus and course structure.',
    'reading-content': 'Text content, articles, and written materials',
    'video-lesson': 'Video content with descriptions and notes',
    'lecture-notes': 'Detailed lecture content and key concepts',
    'resources-references': 'Links, references, and additional resources',
    'interactive-activity': 'A hands-on lab or simulation.',
    'discussion-prompt': 'A prompt to encourage discussion.',
    'assignment-brief': 'A brief for a project or assignment.'
  }), []);
  return (
    <>
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
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Content Templates
          </h3>
          <div className="space-y-3">
            {Object.entries(templates).map(([key, template]) => {
              const Icon = templateIcons[key as keyof typeof templateIcons];
              const isHovered = hoveredTemplate === key;
              const isSelected = selectedTemplate === key;
              
              return (
                <Card
                  key={key}
                  className={`
                    p-4 cursor-pointer transition-colors duration-150 ease-out
                    ${isHovered ? 'bg-primary/5 border-primary/20' : ''}
                    ${isSelected ? 'ring-1 ring-primary/40 bg-primary/8' : ''}
                  `}
                  onMouseEnter={() => setHoveredTemplate(key)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  onClick={() => {
                    setSelectedTemplate(key);
                    onAddModule(key);
                    // Reset selection after a brief moment
                    setTimeout(() => setSelectedTemplate(null), 200);
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      p-2 rounded-lg transition-colors duration-150
                      ${isHovered ? 'bg-primary/15' : 'bg-primary/10'}
                      ${isSelected ? 'bg-primary/25' : ''}
                    `}>
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`
                        font-medium text-sm
                        ${isHovered ? 'text-primary' : 'text-foreground'}
                        ${isSelected ? 'text-primary font-semibold' : ''}
                      `}>
                        {template.title}
                      </h4>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {templateDescriptions[key as keyof typeof templateDescriptions]}
                      </p>
                    </div>
                  </div>
                  
                  {/* Minimal selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
});

ContentSidebar.displayName = 'ContentSidebar';

import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import courseSchemaData from '../../course-schema.json';
import { marked } from 'marked';
import { Plus, BookOpen, FileText, Video, Library, Eye, Save, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { CourseOverview } from './CourseOverview';
import { SingleModuleBlock } from './SingleModuleBlock';
import { MultiModuleSection } from './MultiModuleSection';
import { ContentSidebar } from './ContentSidebar';

const contentModuleTemplates = {
  'course-overview': {
    title: 'Course Overview & Syllabus',
    content: `
# 📚 [Course Title]

**👨‍🏫 Instructor:** [Name]  
**⏰ Duration:** [6 weeks]  
**🎯 Mode:** [Self-paced]

---

## 🎯 What You'll Learn
- ✅ [Outcome 1]
- ✅ [Outcome 2]  
- ✅ [Outcome 3]

## 📅 Weekly Schedule
| Week | 📖 Topic | 🎯 Activity | 📝 Assessment |
|:----:|---------|------------|---------------|
| 1️⃣ | [Topic] | [Activity] | [Quiz] |
| 2️⃣ | [Topic] | [Activity] | [Project] |
| 3️⃣ | [Topic] | [Activity] | [Discussion] |

## 📊 Grade Breakdown
- 🔹 **Quizzes:** 40%
- 🔹 **Projects:** 40%  
- 🔹 **Participation:** 20%

> 🚀 **Ready to start?** [Start Date] → [End Date]
`
  },
  'reading-content': {
    title: 'Reading Content',
    content: `
# 📖 [Module Title]

**⏰ Estimated Time:** [xx min]  
**📋 Prerequisites:** [Prior knowledge or modules]

---

## 🔥 Why This Matters
[Brief paragraph explaining real-world relevance]

## 🎯 Learning Objectives
- [ ] [Objective 1]
- [ ] [Objective 2]
- [ ] [Objective 3]

---

## 📝 Core Content

### 💡 Key Concept #1
[Explanation here]

> 💡 **Example:** [Concrete example]

### 💡 Key Concept #2
[Explanation here]

### 📊 Key Terms
| Term | Definition | Example |
|------|------------|---------|
| [Term 1] | [Definition] | [Example] |
| [Term 2] | [Definition] | [Example] |

---

## 🤔 Check Your Understanding
1. [Question 1]
2. [Question 2]

## 📚 Further Reading
- 🔗 [Resource 1] — *[Why it's useful]*
- 🔗 [Resource 2] — *[Why it's useful]*
`
  },
  'video-lesson': {
    title: 'Video Lesson',
    content: `
# 🎥 [Video Title]

**⏰ Duration:** [xx min]  
**📋 Level:** [Beginner/Intermediate/Advanced]

---

## 🎯 What You'll Learn
- [Learning point 1]
- [Learning point 2]
- [Learning point 3]

## 📺 Video Content
[Video embed or link]

### 🕐 Key Timestamps
| Time | Topic | Notes |
|------|-------|-------|
| 00:00 | Introduction | [Brief note] |
| 03:45 | [Concept] | [Brief note] |
| 07:10 | Demo | [Brief note] |

---

## 📝 Video Notes
[Key takeaways or transcript highlights]

## 🛠️ Try It Yourself
**Your Task:** [Clear instruction]  
**Time:** [5 minutes]  
**Submit:** [What to upload/do]

## 💭 Reflection Questions
- What was the most important concept?
- How does this apply to your work?
- What questions do you still have?
`
  },
  'lecture-notes': {
    title: 'Lecture Notes',
    content: `
# 📚 [Lecture Topic]

**👨‍🏫 Instructor:** [Name]  
**📅 Date:** [Date]  
**⏰ Session:** [Week X - Lecture Y]

---

## 📋 Today's Agenda
1. [Item 1]
2. [Item 2]
3. [Item 3]

## 📝 Detailed Notes

### 🎯 Section 1: [Heading]
- [Key point A]
- [Key point B]
- [Key point C]

> 💡 **Example:** [Concrete example]

### 🎯 Section 2: [Heading]
[Content here]

### 📊 Important Formulas/Concepts
| Concept | Formula/Description | Application |
|---------|-------------------|-------------|
| [Concept 1] | [Formula] | [When to use] |
| [Concept 2] | [Formula] | [When to use] |

---

## 🔑 Key Takeaways
- [Main point 1]
- [Main point 2]
- [Main point 3]

## 📖 Next Steps
- **Read:** [Chapter/Article]
- **Practice:** [Exercise]
- **Prepare for:** [Next topic]
`
  },
  'resources-references': {
    title: 'Resources & References',
    content: `
# 📚 Essential Resources

## 🔥 Must-Read/Watch
| 📎 Resource | 📱 Type | 🎯 Why Important |
|------------|--------|------------------|
| [Title] | 📄 Article | [Benefit] |
| [Title] | 🎥 Video | [Benefit] |
| [Title] | 🛠️ Tool | [Benefit] |

---

## 💡 Supplementary Materials
- 🔗 **[Resource 1]** - [Brief description]
- 🔗 **[Resource 2]** - [Brief description]  
- 🔗 **[Resource 3]** - [Brief description]

## 📚 Academic References
1. [Author]. ([Year]). *[Title]*. [Publisher].
2. [Author]. ([Year]). *[Title]*. [Publisher].
3. [Author]. ([Year]). *[Title]*. [Publisher].

---

## 📥 Downloadable Files
- 📄 [File 1] - [Description]
- 📊 [File 2] - [Description]
- 💻 [File 3] - [Description]

> 🎯 **Start here:** Focus on the "Must-Read/Watch" section first!
`
  },
  'interactive-activity': {
    title: 'Interactive Activity',
    content: `
# 🧪 Activity: [Title]

**🎯 Objective:** [Clear goal]  
**⏰ Time Required:** [xx min]  
**🛠️ Tools Needed:** [List tools]

---

## 🚀 Getting Started
1. [Step 1]
2. [Step 2]
3. [Step 3]

## 📋 Instructions

### Phase 1: [Phase Name]
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

### Phase 2: [Phase Name]
- [ ] [Task 1]
- [ ] [Task 2]

## 📊 Expected Outcomes
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | [Do this] | [See this] |
| 2 | [Do this] | [See this] |
| 3 | [Do this] | [See this] |

---

## 🤔 Reflection Questions
- What did you discover?
- What challenges did you face?
- How would you apply this in real situations?

## 📤 Submission
**What to submit:** [File type/format]  
**Where to submit:** [Platform/location]  
**Due date:** [Date]

> 🆘 **Need help?** Check the FAQ or ask in the discussion forum!
`
  },
  'discussion-prompt': {
    title: 'Discussion Prompt',
    content: `
# 💬 Discussion: [Topic]

## 🎯 The Question
> [Thought-provoking question or scenario]

---

## 📝 Your Mission
- **✍️ Initial Post:** [150+ words] by [date]
- **💬 Responses:** Reply to [2] classmates by [date]
- **📚 Sources:** Include at least [1] credible source

## 🌟 What Makes a Great Post?
- ✅ **Connects** course concepts to real examples
- ✅ **Asks** thoughtful follow-up questions
- ✅ **Cites** credible sources (APA format)
- ✅ **Engages** respectfully with others' ideas

## 🤔 Discussion Starters
- Consider the perspective of...
- What would happen if...
- Based on [reading/video], I think...
- This reminds me of...

---

> 📚 **Tip:** Review [specific course materials] before posting!
`
  },
  'assignment-brief': {
    title: 'Assignment Brief',
    content: `
# 📋 Assignment: [Title]

**📊 Weight:** [XX%] of final grade  
**📅 Due Date:** [Date and time]  
**⏰ Estimated Time:** [X hours]

---

## 🎯 Assignment Overview
[Clear description of what students need to create/analyze/solve]

## 📋 Requirements
- [ ] [Requirement 1]
- [ ] [Requirement 2]
- [ ] [Requirement 3]
- [ ] [Requirement 4]

## 📦 Deliverables
1. **[Item 1]:** [Description] ([format], max [size/length])
2. **[Item 2]:** [Description] ([format], max [size/length])  
3. **[Item 3]:** [Description] ([format], max [size/length])

---

## 🏆 Grading Criteria
| Criteria | Excellent (A) | Good (B) | Satisfactory (C) |
|----------|---------------|----------|------------------|
| **[Criterion 1]** | [Description] | [Description] | [Description] |
| **[Criterion 2]** | [Description] | [Description] | [Description] |
| **[Criterion 3]** | [Description] | [Description] | [Description] |

## 📤 Submission Guidelines
- **Format:** [File type]
- **Naming:** [Convention]
- **Platform:** [Where to submit]
- **Late Policy:** [Penalty description]

> 💡 **Success Tip:** Start early and ask questions during office hours!
`
  }
};

export interface Module {
  id: string;
  title: string;
  content: string;
  template: string;
  isEditing: boolean;
}

export interface Section {
  id: string;
  title: string;
  type: 'single-module' | 'multi-module';
  isEditing: boolean;
  isExpanded?: boolean;
  module?: Module;
  modules?: Module[];
}

export interface CourseData {
  courseId: string;
  title: string;
  overview: {
    title: string;
    content: string;
    objectives: string[];
    prerequisites: string;
    duration: string;
    difficulty: string;
    isEditing: boolean;
  };
  sections: Section[];
}

const CourseContentBuilder: React.FC = () => {
  const { toast } = useToast();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [courseData, setCourseData] = useState<CourseData>(() => {
    const transformedSections = courseSchemaData.sections.map((section): Section => {
      const modules = section.modules.map((mod): Module => ({
        id: mod.moduleId,
        title: mod.moduleTitle,
        content: mod.content.map(c => c.data).join('<hr />'),
        template: 'custom',
        isEditing: false,
      }));

      // The logic in the app seems to be that a section is either single or multi module.
      // Let's infer from the number of modules in the schema.
      if (modules.length === 1) {
        return {
          id: section.sectionId,
          title: section.sectionTitle,
          type: 'single-module',
          isEditing: false,
          module: modules[0],
        };
      } else {
        return {
          id: section.sectionId,
          title: section.sectionTitle,
          type: 'multi-module',
          isEditing: false,
          isExpanded: true,
          modules: modules,
        };
      }
    });

    return {
      courseId: uuidv4(),
      title: courseSchemaData.courseTitle,
      overview: {
        title: courseSchemaData.courseTitle,
        content: courseSchemaData.courseDescription,
        objectives: ['Define course learning objectives', 'Understand the course structure'],
        prerequisites: 'No prior knowledge required',
        duration: '8 weeks',
        difficulty: 'Beginner',
        isEditing: false
      },
      sections: transformedSections
    };
  });

  // Dark mode toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'module') {
      const sourceSection = courseData.sections.find(section => section.id === source.droppableId);
      const destSection = courseData.sections.find(section => section.id === destination.droppableId);

      if (!sourceSection || !destSection) return;

      const sourceModules = Array.from(sourceSection.modules || []);
      const [movedModule] = sourceModules.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceModules.splice(destination.index, 0, movedModule);
        const newSections = courseData.sections.map(section =>
          section.id === source.droppableId ? { ...section, modules: sourceModules } : section
        );
        setCourseData(prev => ({ ...prev, sections: newSections }));
      } else {
        const destModules = Array.from(destSection.modules || []);
        destModules.splice(destination.index, 0, movedModule);
        const newSections = courseData.sections.map(section => {
          if (section.id === source.droppableId) return { ...section, modules: sourceModules };
          if (section.id === destination.droppableId) return { ...section, modules: destModules };
          return section;
        });
        setCourseData(prev => ({ ...prev, sections: newSections }));
      }
    } else {
      const items = Array.from(courseData.sections);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setCourseData(prev => ({
        ...prev,
        sections: items
      }));
    }
  }, [courseData.sections]);

  const addSection = useCallback((type: 'single-module' | 'multi-module', template?: string) => {
    const newSection: Section = {
      id: uuidv4(),
      title: type === 'single-module' ? 'New Policy' : 'New Section',
      type,
      isEditing: true,
      isExpanded: type === 'multi-module' ? true : undefined,
      ...(type === 'single-module' 
        ? {
            module: {
              id: uuidv4(),
              title: contentModuleTemplates[template as keyof typeof contentModuleTemplates]?.title || 'New Content',
              content: marked(contentModuleTemplates[template as keyof typeof contentModuleTemplates]?.content) as string || '<p>Add your content here...</p>',
              template: template || 'course-overview',
              isEditing: false
            }
          }
        : { modules: [] }
      )
    };

    setCourseData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));

    toast({
      title: "Section Added",
      description: `New ${type.replace('-', ' ')} has been added to your course.`
    });
  }, [toast]);

  const updateSection = useCallback((sectionId: string, updates: Partial<Section>) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    
    toast({
      title: "Section Deleted",
      description: "The section has been removed from your course."
    });
  }, [toast]);

  const addModuleToSection = useCallback((sectionId: string, template: string) => {
    const newModule: Module = {
      id: uuidv4(),
      title: contentModuleTemplates[template as keyof typeof contentModuleTemplates]?.title || 'New Module',
      content: marked(contentModuleTemplates[template as keyof typeof contentModuleTemplates]?.content) as string || '<p>Add your content here...</p>',
      template,
      isEditing: false
    };

    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId && section.type === 'multi-module'
          ? { ...section, modules: [...(section.modules || []), newModule] }
          : section
      )
    }));

    toast({
      title: "Module Added",
      description: "New module has been added to the section."
    });
  }, [toast]);

  const onAddModule = (template: string) => {
    if (courseData.sections.length === 0) {
      addSection('multi-module', template);
    } else {
      const lastSection = courseData.sections[courseData.sections.length - 1];
      addModuleToSection(lastSection.id, template);
    }
  };

  const updateCourseOverview = useCallback((updates: Partial<CourseData['overview']>) => {
    setCourseData(prev => ({
      ...prev,
      overview: { ...prev.overview, ...updates }
    }));
  }, []);

  const saveCourse = useCallback(async () => {
    const n8nWebhookUrl = '/webhook/course-builder';

    // 1. Send data to n8n webhook
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        toast({
          title: "Webhook Sent",
          description: "Course data successfully sent to n8n.",
        });
      } else {
        const errorData = await response.text();
        toast({
          title: "Webhook Error",
          description: `Failed to send data: ${response.status} ${response.statusText}. ${errorData}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: `Could not connect to the webhook: ${error}`,
        variant: "destructive",
      });
    }

    // 2. Trigger JSON file download
    try {
      const jsonString = JSON.stringify(courseData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'course-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Course Saved",
        description: "Your course content has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Error",
        description: `Could not prepare file for download: ${error}`,
        variant: "destructive",
      });
    }
  }, [courseData, toast]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <ContentSidebar 
        onAddSection={addSection}
        onAddModule={onAddModule}
        templates={contentModuleTemplates}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-hero border-b border-border px-6 py-4 shadow-medium">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
              <div>
                <h1 className="text-xl font-semibold text-primary-foreground">Course Content Builder</h1>
                <p className="text-sm text-primary-foreground/80">Create and organize your educational content</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? 'Light' : 'Dark'}
              </Button>
              <Button
                variant={isPreviewMode ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="gap-2 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Eye className="h-4 w-4" />
                {isPreviewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              <Button 
                onClick={saveCourse} 
                size="sm"
                variant="secondary"
                className="gap-2 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 border-primary-foreground/20"
              >
                <Save className="h-4 w-4" />
                Save Course
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Course Overview */}
            <CourseOverview
              overview={courseData.overview}
              isPreviewMode={isPreviewMode}
              onUpdate={updateCourseOverview}
            />

            {/* Course Sections */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {courseData.sections.map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'opacity-75' : ''}`}
                          >
                            {section.type === 'single-module' ? (
                              <SingleModuleBlock
                                section={section}
                                isPreviewMode={isPreviewMode}
                                onUpdate={(updates) => updateSection(section.id, updates)}
                                onDelete={() => deleteSection(section.id)}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            ) : (
                              <MultiModuleSection
                                section={section}
                                isPreviewMode={isPreviewMode}
                                onUpdate={(updates) => updateSection(section.id, updates)}
                                onDelete={() => deleteSection(section.id)}
                                onAddModule={(template) => addModuleToSection(section.id, template)}
                                templates={contentModuleTemplates}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Empty State */}
            {courseData.sections.length === 0 && (
              <Card className="p-8 text-center border-dashed border-2 border-border">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No content sections yet</h3>
                <p className="text-muted-foreground mb-4">Get started by adding your first content section or module from the sidebar.</p>
                <div className="flex justify-center space-x-3">
                  <Button onClick={() => addSection('multi-module')} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                  <Button onClick={() => addSection('single-module', 'course-overview')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Module
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseContentBuilder;

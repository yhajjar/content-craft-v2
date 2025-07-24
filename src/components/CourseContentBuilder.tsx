import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import courseSchemaData from '../../course-schema.json';
import { Plus, BookOpen, FileText, Video, Library, Eye, Save, Moon, Sun, PanelLeftOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { CourseOverview } from './CourseOverview';
import { SingleModuleBlock } from './SingleModuleBlock';
import { MultiModuleSection } from './MultiModuleSection';
import { ContentSidebar } from './ContentSidebar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const contentModuleTemplates = {
  'course-overview': {
    title: 'Course Overview & Syllabus',
    content: `<h1>📚 [Course Title]</h1>
<p><strong>👨‍🏫 Instructor:</strong> [Name]<br>
<strong>⏰ Duration:</strong> [6 weeks]<br>
<strong>🎯 Mode:</strong> [Self-paced]</p>

<h2>🎯 What You'll Learn</h2>
<ul>
<li>✅ [Outcome 1]</li>
<li>✅ [Outcome 2]</li>
<li>✅ [Outcome 3]</li>
</ul>

<h2>📅 Weekly Schedule</h2>
<p><em>Customize your learning timeline:</em></p>
<ul>
<li><strong>Week 1:</strong> [Topic] - [Activity] - [Assessment]</li>
<li><strong>Week 2:</strong> [Topic] - [Activity] - [Assessment]</li>
<li><strong>Week 3:</strong> [Topic] - [Activity] - [Assessment]</li>
</ul>

<h2>📊 Grade Breakdown</h2>
<ul>
<li>🔹 <strong>Quizzes:</strong> 40%</li>
<li>🔹 <strong>Projects:</strong> 40%</li>
<li>🔹 <strong>Participation:</strong> 20%</li>
</ul>

<p><strong>🚀 Ready to start?</strong> [Start Date] → [End Date]</p>`
  },
  'reading-content': {
    title: 'Reading Content',
    content: `<h1>📖 [Module Title]</h1>
<p><strong>⏰ Estimated Time:</strong> [xx min]<br>
<strong>📋 Prerequisites:</strong> [Prior knowledge or modules]</p>

<h2>🔥 Why This Matters</h2>
<p>[Brief paragraph explaining real-world relevance]</p>

<h2>🎯 Learning Objectives</h2>
<ul>
<li>☐ [Objective 1]</li>
<li>☐ [Objective 2]</li>
<li>☐ [Objective 3]</li>
</ul>

<h2>📝 Core Content</h2>

<h3>💡 Key Concept #1</h3>
<p>[Explanation here]</p>
<blockquote>
<p><strong>💡 Example:</strong> [Concrete example]</p>
</blockquote>

<h3>💡 Key Concept #2</h3>
<p>[Explanation here]</p>

<h3>📊 Key Terms</h3>
<p><strong>Important definitions to remember:</strong></p>
<ul>
<li><strong>[Term 1]:</strong> [Definition] - <em>[Example]</em></li>
<li><strong>[Term 2]:</strong> [Definition] - <em>[Example]</em></li>
</ul>

<h2>🤔 Check Your Understanding</h2>
<ol>
<li>[Question 1]</li>
<li>[Question 2]</li>
</ol>

<h2>📚 Further Reading</h2>
<ul>
<li>🔗 <strong>[Resource 1]</strong> — <em>[Why it's useful]</em></li>
<li>🔗 <strong>[Resource 2]</strong> — <em>[Why it's useful]</em></li>
</ul>`
  },
  'video-lesson': {
    title: 'Video Lesson',
    content: `<h1>🎥 [Video Title]</h1>
<p><strong>⏰ Duration:</strong> [xx min]<br>
<strong>📋 Level:</strong> [Beginner/Intermediate/Advanced]</p>

<h2>🎯 What You'll Learn</h2>
<ul>
<li>[Learning point 1]</li>
<li>[Learning point 2]</li>
<li>[Learning point 3]</li>
</ul>

<h2>📺 Video Content</h2>
<p><em>[Video embed or link]</em></p>

<h3>🕐 Key Timestamps</h3>
<p><strong>Navigate to important sections:</strong></p>
<ul>
<li><strong>00:00</strong> - Introduction: <em>[Brief note]</em></li>
<li><strong>03:45</strong> - [Concept]: <em>[Brief note]</em></li>
<li><strong>07:10</strong> - Demo: <em>[Brief note]</em></li>
</ul>

<h2>📝 Video Notes</h2>
<p>[Key takeaways or transcript highlights]</p>

<h2>🛠️ Try It Yourself</h2>
<p><strong>Your Task:</strong> [Clear instruction]<br>
<strong>Time:</strong> [5 minutes]<br>
<strong>Submit:</strong> [What to upload/do]</p>

<h2>💭 Reflection Questions</h2>
<ul>
<li>What was the most important concept?</li>
<li>How does this apply to your work?</li>
<li>What questions do you still have?</li>
</ul>`
  },
  'lecture-notes': {
    title: 'Lecture Notes',
    content: `<h1>📚 [Lecture Topic]</h1>
<p><strong>👨‍🏫 Instructor:</strong> [Name]<br>
<strong>📅 Date:</strong> [Date]<br>
<strong>⏰ Session:</strong> [Week X - Lecture Y]</p>

<h2>📋 Today's Agenda</h2>
<ol>
<li>[Item 1]</li>
<li>[Item 2]</li>
<li>[Item 3]</li>
</ol>

<h2>📝 Detailed Notes</h2>

<h3>🎯 Section 1: [Heading]</h3>
<ul>
<li>[Key point A]</li>
<li>[Key point B]</li>
<li>[Key point C]</li>
</ul>

<blockquote>
<p><strong>💡 Example:</strong> [Concrete example]</p>
</blockquote>

<h3>🎯 Section 2: [Heading]</h3>
<p>[Content here]</p>

<h3>📊 Important Formulas/Concepts</h3>
<p><strong>Key concepts to remember:</strong></p>
<ul>
<li><strong>[Concept 1]:</strong> [Formula/Description] - <em>Use when: [When to use]</em></li>
<li><strong>[Concept 2]:</strong> [Formula/Description] - <em>Use when: [When to use]</em></li>
</ul>

<h2>🔑 Key Takeaways</h2>
<ul>
<li>[Main point 1]</li>
<li>[Main point 2]</li>
<li>[Main point 3]</li>
</ul>

<h2>📖 Next Steps</h2>
<ul>
<li><strong>Read:</strong> [Chapter/Article]</li>
<li><strong>Practice:</strong> [Exercise]</li>
<li><strong>Prepare for:</strong> [Next topic]</li>
</ul>`
  },
  'resources-references': {
    title: 'Resources & References',
    content: `<h1>📚 Essential Resources</h1>

<h2>🔥 Must-Read/Watch</h2>
<p><strong>Priority resources for this module:</strong></p>
<ul>
<li>📄 <strong>[Title]</strong> (Article) - <em>[Benefit]</em></li>
<li>🎥 <strong>[Title]</strong> (Video) - <em>[Benefit]</em></li>
<li>🛠️ <strong>[Title]</strong> (Tool) - <em>[Benefit]</em></li>
</ul>

<h2>💡 Supplementary Materials</h2>
<ul>
<li>🔗 <strong>[Resource 1]</strong> - [Brief description]</li>
<li>🔗 <strong>[Resource 2]</strong> - [Brief description]</li>
<li>🔗 <strong>[Resource 3]</strong> - [Brief description]</li>
</ul>

<h2>📚 Academic References</h2>
<ol>
<li>[Author]. ([Year]). <em>[Title]</em>. [Publisher].</li>
<li>[Author]. ([Year]). <em>[Title]</em>. [Publisher].</li>
<li>[Author]. ([Year]). <em>[Title]</em>. [Publisher].</li>
</ol>

<h2>📥 Downloadable Files</h2>
<ul>
<li>📄 <strong>[File 1]</strong> - [Description]</li>
<li>📊 <strong>[File 2]</strong> - [Description]</li>
<li>💻 <strong>[File 3]</strong> - [Description]</li>
</ul>

<blockquote>
<p><strong>🎯 Start here:</strong> Focus on the "Must-Read/Watch" section first!</p>
</blockquote>`
  },
  'interactive-activity': {
    title: 'Interactive Activity',
    content: `<h1>🧪 Activity: [Title]</h1>
<p><strong>🎯 Objective:</strong> [Clear goal]<br>
<strong>⏰ Time Required:</strong> [xx min]<br>
<strong>🛠️ Tools Needed:</strong> [List tools]</p>

<h2>🚀 Getting Started</h2>
<ol>
<li>[Step 1]</li>
<li>[Step 2]</li>
<li>[Step 3]</li>
</ol>

<h2>📋 Instructions</h2>

<h3>Phase 1: [Phase Name]</h3>
<ul>
<li>☐ [Task 1]</li>
<li>☐ [Task 2]</li>
<li>☐ [Task 3]</li>
</ul>

<h3>Phase 2: [Phase Name]</h3>
<ul>
<li>☐ [Task 1]</li>
<li>☐ [Task 2]</li>
</ul>

<h2>📊 Expected Outcomes</h2>
<p><strong>What you should see at each step:</strong></p>
<ul>
<li><strong>Step 1:</strong> [Do this] → <em>[See this]</em></li>
<li><strong>Step 2:</strong> [Do this] → <em>[See this]</em></li>
<li><strong>Step 3:</strong> [Do this] → <em>[See this]</em></li>
</ul>

<h2>🤔 Reflection Questions</h2>
<ul>
<li>What did you discover?</li>
<li>What challenges did you face?</li>
<li>How would you apply this in real situations?</li>
</ul>

<h2>📤 Submission</h2>
<p><strong>What to submit:</strong> [File type/format]<br>
<strong>Where to submit:</strong> [Platform/location]<br>
<strong>Due date:</strong> [Date]</p>

<blockquote>
<p><strong>🆘 Need help?</strong> Check the FAQ or ask in the discussion forum!</p>
</blockquote>`
  },
  'discussion-prompt': {
    title: 'Discussion Prompt',
    content: `<h1>💬 Discussion: [Topic]</h1>

<h2>🎯 The Question</h2>
<blockquote>
<p>[Thought-provoking question or scenario]</p>
</blockquote>

<h2>📝 Your Mission</h2>
<ul>
<li><strong>✍️ Initial Post:</strong> [150+ words] by [date]</li>
<li><strong>💬 Responses:</strong> Reply to [2] classmates by [date]</li>
<li><strong>📚 Sources:</strong> Include at least [1] credible source</li>
</ul>

<h2>🌟 What Makes a Great Post?</h2>
<ul>
<li>✅ <strong>Connects</strong> course concepts to real examples</li>
<li>✅ <strong>Asks</strong> thoughtful follow-up questions</li>
<li>✅ <strong>Cites</strong> credible sources (APA format)</li>
<li>✅ <strong>Engages</strong> respectfully with others' ideas</li>
</ul>

<h2>🤔 Discussion Starters</h2>
<ul>
<li>Consider the perspective of...</li>
<li>What would happen if...</li>
<li>Based on [reading/video], I think...</li>
<li>This reminds me of...</li>
</ul>

<blockquote>
<p><strong>📚 Tip:</strong> Review [specific course materials] before posting!</p>
</blockquote>`
  },
  'assignment-brief': {
    title: 'Assignment Brief',
    content: `<h1>📋 Assignment: [Title]</h1>
<p><strong>📊 Weight:</strong> [XX%] of final grade<br>
<strong>📅 Due Date:</strong> [Date and time]<br>
<strong>⏰ Estimated Time:</strong> [X hours]</p>

<h2>🎯 Assignment Overview</h2>
<p>[Clear description of what students need to create/analyze/solve]</p>

<h2>📋 Requirements</h2>
<ul>
<li>☐ [Requirement 1]</li>
<li>☐ [Requirement 2]</li>
<li>☐ [Requirement 3]</li>
<li>☐ [Requirement 4]</li>
</ul>

<h2>📦 Deliverables</h2>
<ol>
<li><strong>[Item 1]:</strong> [Description] ([format], max [size/length])</li>
<li><strong>[Item 2]:</strong> [Description] ([format], max [size/length])</li>
<li><strong>[Item 3]:</strong> [Description] ([format], max [size/length])</li>
</ol>

<h2>🏆 Grading Criteria</h2>
<p><strong>How your work will be evaluated:</strong></p>
<ul>
<li><strong>[Criterion 1]:</strong>
  <ul>
    <li>Excellent (A): [Description]</li>
    <li>Good (B): [Description]</li>
    <li>Satisfactory (C): [Description]</li>
  </ul>
</li>
<li><strong>[Criterion 2]:</strong>
  <ul>
    <li>Excellent (A): [Description]</li>
    <li>Good (B): [Description]</li>
    <li>Satisfactory (C): [Description]</li>
  </ul>
</li>
</ul>

<h2>📤 Submission Guidelines</h2>
<ul>
<li><strong>Format:</strong> [File type]</li>
<li><strong>Naming:</strong> [Convention]</li>
<li><strong>Platform:</strong> [Where to submit]</li>
<li><strong>Late Policy:</strong> [Penalty description]</li>
</ul>

<blockquote>
<p><strong>💡 Success Tip:</strong> Start early and ask questions during office hours!</p>
</blockquote>`
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

interface CourseContentBuilderProps {
  rowId?: string;
}

const CourseContentBuilder: React.FC<CourseContentBuilderProps> = ({ rowId }) => {
  const { toast } = useToast();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const initializeCourseData = () => {
      if (rowId) {
        // Start with a default structure associated with the rowId
        setCourseData({
          courseId: rowId,
          title: 'New Course',
          overview: {
            title: 'Course Overview',
            content: '<p>Welcome to this new course!</p>',
            objectives: [],
            prerequisites: '',
            duration: '',
            difficulty: 'Beginner',
            isEditing: false,
          },
          sections: [],
        });
      } else {
        // Fallback to default schema if no rowId is provided
        const transformedSections = courseSchemaData.sections.map((section): Section => {
          const modules = section.modules.map((mod): Module => ({
            id: mod.moduleId,
            title: mod.moduleTitle,
            content: mod.content.map(c => c.data).join('<hr />'),
            template: 'custom',
            isEditing: false,
          }));

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

        setCourseData({
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
        });
      }
    };

    initializeCourseData();
  }, [rowId, toast]);

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
    if (!result.destination || !courseData) return;

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
        setCourseData(prev => prev ? ({ ...prev, sections: newSections }) : null);
      } else {
        const destModules = Array.from(destSection.modules || []);
        destModules.splice(destination.index, 0, movedModule);
        const newSections = courseData.sections.map(section => {
          if (section.id === source.droppableId) return { ...section, modules: sourceModules };
          if (section.id === destination.droppableId) return { ...section, modules: destModules };
          return section;
        });
        setCourseData(prev => prev ? ({ ...prev, sections: newSections }) : null);
      }
    } else {
      const items = Array.from(courseData.sections);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setCourseData(prev => prev ? ({
        ...prev,
        sections: items
      }) : null);
    }
  }, [courseData]);

  const addSection = useCallback((type: 'single-module' | 'multi-module', template?: string) => {
    if (!courseData) return;

    const newSectionId = `sec_${courseData.sections.length + 1}`;

    const newSection: Section = {
      id: newSectionId,
      title: type === 'single-module' ? 'New Policy' : 'New Section',
      type,
      isEditing: true,
      isExpanded: type === 'multi-module' ? true : undefined,
      ...(type === 'single-module' 
        ? {
            module: {
              id: `mod_${newSectionId}_1`,
              title: contentModuleTemplates[template as keyof typeof contentModuleTemplates]?.title || 'New Content',
              content: contentModuleTemplates[template as keyof typeof contentModuleTemplates]?.content || '<p>Add your content here...</p>',
              template: template || 'course-overview',
              isEditing: false
            }
          }
        : { modules: [] }
      )
    };

    setCourseData(prev => prev ? ({
      ...prev,
      sections: [...prev.sections, newSection]
    }) : null);

    toast({
      title: "Section Added",
      description: `New ${type.replace('-', ' ')} has been added to your course.`
    });
  }, [toast, courseData]);

  const updateSection = useCallback((sectionId: string, updates: Partial<Section>) => {
    if (!courseData) return;
    setCourseData(prev => prev ? ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }) : null);
  }, [courseData]);

  const deleteSection = useCallback((sectionId: string) => {
    if (!courseData) return;
    setCourseData(prev => prev ? ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }) : null);
    
    toast({
      title: "Section Deleted",
      description: "The section has been removed from your course."
    });
  }, [toast, courseData]);

  const addModuleToSection = useCallback((sectionId: string, template: string) => {
    if (!courseData) return;

    const section = courseData.sections.find(sec => sec.id === sectionId);
    if (!section) return;

    const newModuleId = `mod_${sectionId}_${(section.modules?.length || 0) + 1}`;

    const newModule: Module = {
      id: newModuleId,
      title: contentModuleTemplates[template as keyof typeof contentModuleTemplates]?.title || 'New Module',
      content: contentModuleTemplates[template as keyof typeof contentModuleTemplates]?.content || '<p>Add your content here...</p>',
      template,
      isEditing: false
    };

    setCourseData(prev => prev ? ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId && section.type === 'multi-module'
          ? { ...section, modules: [...(section.modules || []), newModule] }
          : section
      )
    }) : null);

    toast({
      title: "Module Added",
      description: "New module has been added to the section."
    });
  }, [toast, courseData]);

  const onAddModule = (template: string) => {
    if (!courseData) return;
    if (courseData.sections.length === 0) {
      addSection('multi-module', template);
    } else {
      const lastSection = courseData.sections[courseData.sections.length - 1];
      addModuleToSection(lastSection.id, template);
    }
  };

  const updateCourseOverview = useCallback((updates: Partial<CourseData['overview']>) => {
    if (!courseData) return;
    setCourseData(prev => prev ? ({
      ...prev,
      overview: { ...prev.overview, ...updates }
    }) : null);
  }, [courseData]);

  const saveCourse = useCallback(() => {
    if (!courseData) return;

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

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading course...</div>
      </div>
    );
  }

  const handleAddModule = (template: string) => {
    onAddModule(template);
    setIsSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="w-80 bg-muted border-r border-border flex-col sticky top-0 h-screen hidden md:flex">
        <ContentSidebar
          onAddSection={addSection}
          onAddModule={handleAddModule}
          templates={contentModuleTemplates}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-hero border-b border-border px-4 md:px-6 py-3 shadow-medium">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center">
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-transparent text-white hover:bg-white/10 border-white/20">
                      <PanelLeftOpen className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0 flex flex-col bg-muted">
                    <ContentSidebar
                      onAddSection={addSection}
                      onAddModule={handleAddModule}
                      templates={contentModuleTemplates}
                    />
                  </SheetContent>
                </Sheet>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <BookOpen className="h-6 w-6 text-white" />
                <div>
                  <h1 className="text-xl font-semibold text-white">Course Content Builder</h1>
                  <p className="text-sm text-white/80">Create and organize your educational content</p>
                </div>
              </div>
            </div>

            {/* Center Logo */}
            <div className="flex-grow flex justify-center">
                <img src="/logo.png" alt="Logo" className="h-10 hidden md:block" />
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-white hover:bg-white/10 gap-2"
              >
                <span className="hidden md:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button 
                onClick={saveCourse} 
                size="sm"
                variant="secondary"
                className="gap-2 bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <span className="hidden md:inline">Save Course</span>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
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

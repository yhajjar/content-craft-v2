import React, { useState } from 'react';
import { Edit3, Check, X, Plus, Target, Clock, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { RichTextEditor } from './RichTextEditor';
import type { CourseData } from './CourseContentBuilder';

interface CourseOverviewProps {
  overview: CourseData['overview'];
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<CourseData['overview']>) => void;
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({ overview, isPreviewMode, onUpdate }) => {
  const [newObjective, setNewObjective] = useState('');

  const handleTitleEdit = (title: string) => {
    onUpdate({ title });
  };

  const handleContentEdit = (content: string) => {
    onUpdate({ content });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      onUpdate({
        objectives: [...overview.objectives, newObjective.trim()]
      });
      setNewObjective('');
    }
  };

  const updateObjective = (index: number, value: string) => {
    const updatedObjectives = [...overview.objectives];
    updatedObjectives[index] = value;
    onUpdate({ objectives: updatedObjectives });
  };

  const removeObjective = (index: number) => {
    onUpdate({
      objectives: overview.objectives.filter((_, i) => i !== index)
    });
  };

  if (isPreviewMode) {
    return (
      <Card className="p-8 shadow-soft">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">{overview.title}</h1>
          
          <div className="mb-8">
            <RichTextEditor
              value={overview.content}
              onChange={() => {}} // No-op since it's preview mode
              readOnly={true}
              compact={true}
              editorKey="preview-course-overview"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <Target className="h-5 w-5 mr-2 text-accent" />
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {overview.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  Duration
                </h4>
                <p className="text-muted-foreground">{overview.duration}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                  Difficulty Level
                </h4>
                <p className="text-muted-foreground">{overview.difficulty}</p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Prerequisites</h4>
                <p className="text-muted-foreground">{overview.prerequisites}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Course Overview</h2>
        <Button
          variant={overview.isEditing ? "default" : "outline"}
          size="sm"
          onClick={() => onUpdate({ isEditing: !overview.isEditing })}
          className="gap-2"
        >
          {overview.isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          {overview.isEditing ? 'Done' : 'Edit'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Course Title</label>
          {overview.isEditing ? (
            <Input
              value={overview.title}
              onChange={(e) => handleTitleEdit(e.target.value)}
              placeholder="Enter course title"
              className="text-lg font-medium"
            />
          ) : (
            <h3 className="text-lg font-medium text-foreground">{overview.title}</h3>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Course Description</label>
          <RichTextEditor
            key={`course-overview-${overview.isEditing}`}
            value={overview.content}
            onChange={handleContentEdit}
            placeholder="Describe your course, what students will learn, and what makes it valuable..."
            readOnly={!overview.isEditing}
            editorKey="course-overview"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Learning Objectives</label>
            <div className="space-y-2">
              {overview.objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-2">
                  {overview.isEditing ? (
                    <>
                      <Input
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        placeholder="Learning objective"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-foreground">{objective}</span>
                    </div>
                  )}
                </div>
              ))}
              
              {overview.isEditing && (
                <div className="flex items-center gap-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add new learning objective"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                  />
                  <Button onClick={addObjective} size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Course Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Prerequisites</label>
              {overview.isEditing ? (
                <Input
                  value={overview.prerequisites}
                  onChange={(e) => onUpdate({ prerequisites: e.target.value })}
                  placeholder="What should students know before taking this course?"
                />
              ) : (
                <p className="text-muted-foreground">{overview.prerequisites}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
              {overview.isEditing ? (
                <Input
                  value={overview.duration}
                  onChange={(e) => onUpdate({ duration: e.target.value })}
                  placeholder="e.g., 8 weeks, 3 months"
                />
              ) : (
                <p className="text-muted-foreground">{overview.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Difficulty Level</label>
              {overview.isEditing ? (
                <select 
                  value={overview.difficulty}
                  onChange={(e) => onUpdate({ difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              ) : (
                <p className="text-muted-foreground">{overview.difficulty}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
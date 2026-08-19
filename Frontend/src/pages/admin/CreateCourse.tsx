import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Plus, Trash2, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';
import { CourseModule } from '../../types';

export const CreateCourse: React.FC = () => {
  const { createCourse } = useCourses();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cloud Computing');
  const [skill, setSkill] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('');
  
  // Modules State
  const [modules, setModules] = useState<CourseModule[]>([]);
  
  // Temporary Module Input Form
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [modContent, setModContent] = useState('');
  const [modDuration, setModDuration] = useState('');
  const [modError, setModError] = useState('');

  // Main Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddModule = () => {
    setModError('');

    if (!modTitle.trim() || !modDesc.trim() || !modContent.trim() || !modDuration.trim()) {
      setModError('Please complete all fields for this module.');
      return;
    }

    const newModule: CourseModule = {
      id: `MOD_${Date.now()}_${modules.length + 1}`,
      title: `Module ${modules.length + 1}: ${modTitle}`,
      description: modDesc,
      readingContent: modContent,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      duration: modDuration
    };

    setModules(prev => [...prev, newModule]);
    
    // Clear inputs
    setModTitle('');
    setModDesc('');
    setModContent('');
    setModDuration('');
  };

  const handleRemoveModule = (index: number) => {
    setModules(prev => {
      const filtered = prev.filter((_, idx) => idx !== index);
      // Re-index remaining module names
      return filtered.map((m, idx) => ({
        ...m,
        title: m.title.includes(': ') ? `Module ${idx + 1}: ${m.title.split(': ')[1]}` : `Module ${idx + 1}: ${m.title}`
      }));
    });
  };

  const validateForm = (): boolean => {
    const tempErrors: { [key: string]: string } = {};

    if (!title.trim()) tempErrors.title = 'Course Title is required.';
    if (!description.trim()) tempErrors.description = 'Description is required.';
    if (!skill.trim()) tempErrors.skill = 'Target Skill (e.g. AWS, Java) is required.';
    if (!instructor.trim()) tempErrors.instructor = 'Instructor name is required.';
    if (!duration.trim()) tempErrors.duration = 'Estimated duration (e.g. 8 Hours) is required.';

    if (modules.length === 0) {
      tempErrors.modules = 'Please add at least one module to create this course curriculum.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, status: 'Draft' | 'Published') => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Form validation errors. Please review fields.', 'error');
      return;
    }

    const success = await createCourse({
      title,
      description,
      category,
      skill,
      instructor,
      duration,
      modules
    });

    if (success) {
      navigate('/admin/courses');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Back breadcrumb header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/admin/courses')}
          className="text-slate-500 hover:text-slate-700 bg-white p-2 rounded-lg border border-slate-200 shadow-xs"
          aria-label="Back to courses"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          HR Management / New Course Composer
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
          Create New Course Curriculum
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Define core details and assemble modular training chapters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: General Course Metadata Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white">
            <CardContent className="p-6 md:p-8">
              <form className="space-y-6">
                <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100 leading-none">
                  Course Curricular Settings
                </h3>

                <Input
                  label="Course Title"
                  placeholder="e.g. Docker Containers for Developers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-slate-700">Course Long Description</label>
                  <textarea
                    placeholder="Provide an overview of the curriculum and training goals..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className={`px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400 ${
                      errors.description && 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                    }`}
                  />
                  {errors.description && <span className="text-xs font-semibold text-rose-600">{errors.description}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Curricular Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                      { value: 'Cloud Computing', label: 'Cloud Computing' },
                      { value: 'Software Engineering', label: 'Software Engineering' },
                      { value: 'Data Science', label: 'Data Science' },
                      { value: 'Cybersecurity', label: 'Cybersecurity' }
                    ]}
                  />

                  <Input
                    label="Competency Skill Target"
                    placeholder="e.g. Docker, Python, AWS"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    error={errors.skill}
                    helperText="Skill target mapped directly to corporate matrix."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Course Instructor"
                    placeholder="e.g. John Doe (Software Architect)"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    error={errors.instructor}
                  />

                  <Input
                    label="Total Syllabus Duration"
                    placeholder="e.g. 5 Hours 30 Minutes"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    error={errors.duration}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Module composer block */}
          <Card className="bg-white">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 leading-none">
                  Assemble Modules
                </h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {modules.length} Modules added
                </span>
              </div>

              {errors.modules && (
                <div className="flex gap-2.5 p-3.5 bg-rose-50 text-rose-800 rounded-lg border border-rose-100 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errors.modules}</span>
                </div>
              )}

              {/* Added Modules summary */}
              {modules.length > 0 && (
                <div className="space-y-3">
                  {modules.map((mod, idx) => (
                    <div key={mod.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 bg-slate-50/50">
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 block leading-none">{mod.title}</span>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug truncate max-w-lg">{mod.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveModule(idx)}
                        className="p-2 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-colors shrink-0"
                        title="Remove Module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Module Sub form */}
              <div className="border border-slate-250 bg-slate-50/20 p-5 rounded-2xl space-y-4">
                <span className="text-xs font-bold text-slate-450 uppercase tracking-widest block flex items-center gap-1">
                  <PlusCircle className="w-4 h-4 text-brand-600" />
                  <span>Curriculum Module Composer (Module #{modules.length + 1})</span>
                </span>

                {modError && (
                  <div className="text-xs font-semibold text-rose-600 bg-rose-50/50 border border-rose-100 p-2.5 rounded-lg">
                    {modError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Chapter Title"
                      placeholder="e.g. Introduction & Virtual Machine Setup"
                      value={modTitle}
                      onChange={(e) => setModTitle(e.target.value)}
                    />
                  </div>
                  <Input
                    label="Reading Duration"
                    placeholder="e.g. 45 mins"
                    value={modDuration}
                    onChange={(e) => setModDuration(e.target.value)}
                  />
                </div>

                <Input
                  label="Short Summary description"
                  placeholder="Summarize what learners will extract from this chapter..."
                  value={modDesc}
                  onChange={(e) => setModDesc(e.target.value)}
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-slate-700">Detailed Lecture Notes & Reading Material</label>
                  <textarea
                    placeholder="Provide full text, notes, guidelines, or checklists..."
                    value={modContent}
                    onChange={(e) => setModContent(e.target.value)}
                    rows={4}
                    className="px-3.5 py-2 rounded-lg border border-slate-350 bg-white text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100/50">
                  <Button
                    type="button"
                    onClick={handleAddModule}
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs"
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Chapter to Curriculum
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Side: Action panel (1 col) */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <h3 className="text-sm font-bold text-slate-900 leading-none">Publish Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Creating a course publishes it instantly in the company catalog, making it eligible for immediate assignment to corporate employees.
              </p>
              
              <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
                <Button
                  onClick={(e) => handleSubmit(e, 'Published')}
                  className="w-full font-bold"
                >
                  Create & Publish Course
                </Button>
                <Button
                  onClick={(e) => handleSubmit(e, 'Draft')}
                  variant="outline"
                  className="w-full font-bold"
                >
                  Save Draft
                </Button>
                <Button
                  onClick={() => navigate('/admin/courses')}
                  variant="secondary"
                  className="w-full font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
export default CreateCourse;

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Palette, Bell, FileText } from 'lucide-react';
import type { CountdownEvent } from '../types';
import { COLOR_PRESETS, PRESET_TEMPLATES } from '../types';
import { formatDateForInput, getNextOccurrence } from '../utils/date';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt' | 'isFinished'>) => void;
  editEvent?: CountdownEvent | null;
}

export function AddEventModal({ isOpen, onClose, onSave, editEvent }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [notifyBefore, setNotifyBefore] = useState(0);
  const [activeTab, setActiveTab] = useState<'custom' | 'template'>('custom');

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setTargetDate(formatDateForInput(new Date(editEvent.targetDate)));
      setDescription(editEvent.description || '');
      setColor(editEvent.color || COLOR_PRESETS[0]);
      setNotifyBefore(editEvent.notifyBefore);
      setActiveTab('custom');
    } else {
      resetForm();
    }
  }, [editEvent, isOpen]);

  const resetForm = () => {
    setTitle('');
    setTargetDate(formatDateForInput(new Date()));
    setDescription('');
    setColor(COLOR_PRESETS[0]);
    setNotifyBefore(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;
    onSave({
      title: title.trim(),
      targetDate: new Date(targetDate).toISOString(),
      description: description.trim() || undefined,
      color,
      notifyBefore,
    });
    resetForm();
    onClose();
  };

  const handleTemplateSelect = (template: typeof PRESET_TEMPLATES[number]) => {
    if (template.month === -1) {
      setTitle('生日');
      setTargetDate(formatDateForInput(new Date()));
    } else {
      setTitle(template.name);
      const next = getNextOccurrence(template.month, template.day);
      setTargetDate(formatDateForInput(next));
    }
    setColor(template.color);
    setActiveTab('custom');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl w-full max-w-md shadow-xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-primary">
            {editEvent ? '编辑倒计时' : '添加倒计时'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {!editEvent && (
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'custom' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'
              }`}
            >
              自定义
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'template' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'
              }`}
            >
              预设模板
            </button>
          </div>
        )}

        {activeTab === 'template' && !editEvent ? (
          <div className="p-4 grid grid-cols-2 gap-3">
            {PRESET_TEMPLATES.map((template) => (
              <button
                key={template.name}
                onClick={() => handleTemplateSelect(template)}
                className="p-3 rounded-xl border border-gray-100 hover:shadow-md transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg mb-2" style={{ backgroundColor: template.color }} />
                <span className="text-sm font-medium text-text">{template.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-text mb-1.5">
                <Calendar className="w-4 h-4" /> 事件名称
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：项目截止、生日..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-text mb-1.5">
                <Clock className="w-4 h-4" /> 目标时间
              </label>
              <input
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-text mb-1.5">
                <FileText className="w-4 h-4" /> 备注（可选）
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="添加一些备注..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-text mb-1.5">
                <Palette className="w-4 h-4" /> 标签颜色
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-text mb-1.5">
                <Bell className="w-4 h-4" /> 提前提醒
              </label>
              <select
                value={notifyBefore}
                onChange={(e) => setNotifyBefore(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors"
              >
                <option value={0}>不提醒</option>
                <option value={5}>提前 5 分钟</option>
                <option value={15}>提前 15 分钟</option>
                <option value={30}>提前 30 分钟</option>
                <option value={60}>提前 1 小时</option>
                <option value={1440}>提前 1 天</option>
                <option value={10080}>提前 1 周</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-text hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-secondary transition-colors text-sm font-medium"
              >
                {editEvent ? '保存' : '添加'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

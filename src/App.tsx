import { useState } from 'react';
import { Plus, Download, Upload, X, Minus, Pin, PinOff } from 'lucide-react';
import { CountdownCard } from './components/CountdownCard';
import { AddEventModal } from './components/AddEventModal';
import { EmptyState } from './components/EmptyState';
import { useCountdown } from './hooks/useCountdown';
import type { CountdownEvent } from './types';

function App() {
  const { events, times, loaded, addEvent, updateEvent, deleteEvent } = useCountdown();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CountdownEvent | null>(null);
  const [isPinned, setIsPinned] = useState(true);

  const handleEdit = (event: CountdownEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSave = (eventData: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt' | 'isFinished'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(events, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `countdown-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as CountdownEvent[];
        if (Array.isArray(imported)) {
          imported.forEach((item) => addEvent(item));
        }
      } catch {
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col select-none">
      {/* Custom Title Bar (drag region) */}
      <div className="bg-card/90 backdrop-blur-sm border-b border-gray-100/50 flex items-center justify-between px-3 py-2" data-tauri-drag-region>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">K</span>
          </div>
          <h1 className="text-sm font-semibold text-primary">Kimi 倒计时</h1>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={togglePin} className="p-1.5 rounded-md hover:bg-gray-100/80 transition-colors" title={isPinned ? '取消置顶' : '置顶'}>
            {isPinned ? <Pin className="w-3.5 h-3.5 text-primary" /> : <PinOff className="w-3.5 h-3.5 text-text-secondary" />}
          </button>
          <button className="p-1.5 rounded-md hover:bg-gray-100/80 transition-colors" title="最小化">
            <Minus className="w-3.5 h-3.5 text-text-secondary" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-red-50 transition-colors" title="隐藏">
            <X className="w-3.5 h-3.5 text-text-secondary hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-3 py-3 overflow-y-auto">
        {events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2.5">
            {events.map((event) => (
              <CountdownCard
                key={event.id}
                event={event}
                time={times[event.id]}
                onEdit={handleEdit}
                onDelete={deleteEvent}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Bar */}
      <div className="bg-card/90 backdrop-blur-sm border-t border-gray-100/50 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <label className="p-1.5 rounded-md hover:bg-gray-100/80 transition-colors cursor-pointer" title="导入">
            <Upload className="w-3.5 h-3.5 text-text-secondary" />
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleExport} className="p-1.5 rounded-md hover:bg-gray-100/80 transition-colors" title="导出">
            <Download className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        </div>
        <span className="text-xs text-text-secondary">{events.length} 个事件</span>
        <button
          onClick={() => { setEditingEvent(null); setIsModalOpen(true); }}
          className="p-1.5 rounded-md bg-primary hover:bg-secondary transition-colors"
          title="添加倒计时"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {/* Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        editEvent={editingEvent}
      />
    </div>
  );
}

export default App;

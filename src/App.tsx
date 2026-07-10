import { useMemo, useState } from 'react';
import { Download, Hourglass, Minus, Pin, PinOff, Plus, Upload, X } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
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

  const orderedEvents = useMemo(() => [...events].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()), [events]);
  const featured = orderedEvents.find((event) => !times[event.id]?.isOver) ?? orderedEvents[0];
  const remaining = orderedEvents.filter((event) => event.id !== featured?.id);

  const openNewEvent = () => { setEditingEvent(null); setIsModalOpen(true); };
  const openEditor = (event: CountdownEvent) => { setEditingEvent(event); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingEvent(null); };
  const saveEvent = (data: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt' | 'isFinished'>) => editingEvent ? updateEvent(editingEvent.id, data) : addEvent(data);

  const togglePinned = async () => {
    const next = !isPinned;
    setIsPinned(next);
    await invoke('set_always_on_top', { alwaysOnTop: next });
  };

  const exportEvents = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `countdown-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importEvents = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        const imported = JSON.parse(target?.result as string) as CountdownEvent[];
        if (!Array.isArray(imported)) throw new Error('Invalid backup');
        imported.forEach(addEvent);
      } catch { alert('导入失败，请选择由本应用导出的 JSON 备份。'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (!loaded) return <div className="app-loading"><span /></div>;

  return (
    <div className="app-shell">
      <header className="titlebar" data-tauri-drag-region>
        <div className="brand" data-tauri-drag-region><span className="brand-symbol"><Hourglass size={15} /></span><strong>Moment</strong><span>倒计时</span></div>
        <div className="window-actions">
          <button onClick={togglePinned} title={isPinned ? '取消置顶' : '窗口置顶'}>{isPinned ? <Pin size={14} /> : <PinOff size={14} />}</button>
          <button onClick={() => getCurrentWindow().minimize()} title="最小化"><Minus size={15} /></button>
          <button className="close-window" onClick={() => getCurrentWindow().hide()} title="隐藏"><X size={15} /></button>
        </div>
      </header>

      <main className="content">
        {featured ? <CountdownCard variant="featured" event={featured} time={times[featured.id]} onEdit={openEditor} onDelete={deleteEvent} /> : <EmptyState onAddClick={openNewEvent} />}

        {featured && <section className="timeline-section">
          <div className="section-heading"><div><span>UPCOMING</span><h1>接下来的日子</h1></div><button onClick={openNewEvent}><Plus size={16} />新建</button></div>
          {remaining.length ? <div className="event-list">{remaining.map((item) => <CountdownCard key={item.id} variant="compact" event={item} time={times[item.id]} onEdit={openEditor} onDelete={deleteEvent} />)}</div> : <button className="add-another" onClick={openNewEvent}><Plus size={17} /><span>再添加一个值得期待的日子</span></button>}
        </section>}
      </main>

      <footer className="utility-bar"><span>{events.length} EVENTS</span><div><label title="导入备份"><Upload size={14} /><input type="file" accept=".json" onChange={importEvents} /></label><button onClick={exportEvents} title="导出备份"><Download size={14} /></button></div></footer>
      <AddEventModal isOpen={isModalOpen} onClose={closeModal} onSave={saveEvent} editEvent={editingEvent} />
    </div>
  );
}

export default App;

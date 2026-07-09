import { useState } from 'react';
import { Trash2, Edit3, Bell, BellOff } from 'lucide-react';
import type { CountdownEvent, TimeParts } from '../types';
import { formatDateTime } from '../utils/date';

interface CountdownCardProps {
  event: CountdownEvent;
  time: TimeParts;
  onEdit: (event: CountdownEvent) => void;
  onDelete: (id: string) => void;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-lg px-3 py-2 min-w-[52px] text-center shadow-sm border border-gray-100">
        <span className="text-xl font-semibold text-primary tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-text-secondary mt-1">{label}</span>
    </div>
  );
}

export function CountdownCard({ event, time, onEdit, onDelete }: CountdownCardProps) {
  const [showDelete, setShowDelete] = useState(false);
  const borderColor = event.color || '#1a1a2e';

  return (
    <div
      className={`bg-card rounded-xl p-4 shadow-sm border-l-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
        time?.isOver ? 'animate-pulse-border' : ''
      }`}
      style={{ borderLeftColor: borderColor }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-text truncate">{event.title}</h3>
          <p className="text-sm text-text-secondary mt-0.5">{formatDateTime(event.targetDate)}</p>
          {event.description && (
            <p className="text-xs text-text-secondary mt-1 truncate">{event.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          {event.notifyBefore > 0 ? (
            <Bell className="w-4 h-4 text-text-secondary" />
          ) : (
            <BellOff className="w-4 h-4 text-text-secondary/50" />
          )}
          <button
            onClick={() => onEdit(event)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-text-secondary transition-colors"
            title="编辑"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="p-1.5 rounded-md hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {time?.isOver ? (
        <div className="text-center py-2">
          <span className="text-accent font-semibold text-lg">已到达！</span>
        </div>
      ) : (
        <div className="flex justify-center gap-2 py-1">
          {time && time.days > 0 && <TimeUnit value={time.days} label="天" />}
          <TimeUnit value={time?.hours ?? 0} label="时" />
          <TimeUnit value={time?.minutes ?? 0} label="分" />
          <TimeUnit value={time?.seconds ?? 0} label="秒" />
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowDelete(false)}>
          <div className="bg-card rounded-xl p-5 max-w-xs w-full mx-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <p className="text-text text-center mb-4">确定要删除「{event.title}」吗？</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-text hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => { onDelete(event.id); setShowDelete(false); }}
                className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Bell, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { CountdownEvent, TimeParts } from '../types';

interface Props { event: CountdownEvent; time: TimeParts; variant: 'featured' | 'compact'; onEdit: (event: CountdownEvent) => void; onDelete: (id: string) => void; }

function formatTarget(date: string) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

function getClock(time?: TimeParts) {
  const totalHours = Math.floor((time?.totalSeconds ?? 0) / 3600);
  return {
    hours: String(totalHours).padStart(2, '0'),
    minutes: String(time?.minutes ?? 0).padStart(2, '0'),
    seconds: String(time?.seconds ?? 0).padStart(2, '0'),
  };
}

function ActionMenu({ event, onEdit, onDelete, inverted = false }: Omit<Props, 'time' | 'variant'> & { inverted?: boolean }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  return <div className={`card-menu ${inverted ? 'inverted' : ''}`}>
    <button className="menu-trigger" onClick={() => setOpen(!open)} aria-label="事件操作"><MoreHorizontal size={19} /></button>
    {open && <div className="menu-popover"><button onClick={() => onEdit(event)}><Pencil size={14} />编辑事件</button><button className="danger" onClick={() => { setOpen(false); setConfirming(true); }}><Trash2 size={14} />删除事件</button></div>}
    {confirming && <div className="delete-overlay" onClick={() => setConfirming(false)}><div className="delete-dialog" onClick={(e) => e.stopPropagation()}><span>DELETE EVENT</span><h3>删除“{event.title}”？</h3><p>这个倒计时及备注将被永久移除。</p><footer><button onClick={() => setConfirming(false)}>保留</button><button className="delete-confirm" onClick={() => onDelete(event.id)}>确认删除</button></footer></div></div>}
  </div>;
}

export function CountdownCard({ event, time, variant, onEdit, onDelete }: Props) {
  const style = { '--event-color': event.color || '#ff7051' } as React.CSSProperties;
  const date = new Date(event.targetDate);
  const clock = getClock(time);
  if (variant === 'featured') return <article className="featured-card" style={style}>
    <div className="featured-orb" />
    <header><div><span className="overline">NEXT MOMENT</span><span className="target-chip">{formatTarget(event.targetDate)}</span></div><ActionMenu event={event} onEdit={onEdit} onDelete={onDelete} inverted /></header>
    <div className="featured-copy"><p>{event.description || '下一个值得期待的时刻'}</p><h1>{event.title}</h1></div>
    {time?.isOver ? <div className="arrived">时间已到</div> : <div className="hero-clock" aria-label={`${clock.hours}小时${clock.minutes}分钟${clock.seconds}秒`}><div><strong>{clock.hours}</strong><span>小时</span></div><i>:</i><div><strong>{clock.minutes}</strong><span>分钟</span></div><i>:</i><div><strong>{clock.seconds}</strong><span>秒钟</span></div></div>}
    <footer><span className="date-index">{String(date.getMonth() + 1).padStart(2, '0')} / {String(date.getDate()).padStart(2, '0')}</span><span className="year">{date.getFullYear()}</span>{event.notifyBefore > 0 && <Bell size={14} />}</footer>
  </article>;

  return <article className="compact-card" style={style}>
    <div className="date-tile"><strong>{String(date.getDate()).padStart(2, '0')}</strong><span>{new Intl.DateTimeFormat('en', { month: 'short' }).format(date).toUpperCase()}</span></div>
    <i className="timeline-dot" /><div className="compact-copy"><h2>{event.title}</h2><p>{event.description || formatTarget(event.targetDate)}</p></div>
    <div className="compact-time">{time?.isOver ? <strong>已到达</strong> : <><strong>{clock.hours}:{clock.minutes}:{clock.seconds}</strong><span>时</span></>}</div>
    <ActionMenu event={event} onEdit={onEdit} onDelete={onDelete} />
  </article>;
}

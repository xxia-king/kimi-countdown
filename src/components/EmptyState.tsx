import { ArrowUpRight, Plus } from 'lucide-react';

export function EmptyState({ onAddClick }: { onAddClick?: () => void }) {
  const today = new Date();
  return <section className="empty-state"><div className="empty-orb" /><span className="overline">YOUR MOMENTS</span><div className="empty-date"><strong>{String(today.getDate()).padStart(2, '0')}</strong><span>{new Intl.DateTimeFormat('en', { month: 'long' }).format(today).toUpperCase()}<br />{today.getFullYear()}</span></div><h1>期待，让时间<br />有了方向。</h1><p>把重要的日子放在这里。每一次打开，都知道自己正在靠近什么。</p>{onAddClick && <button onClick={onAddClick}><Plus size={17} />创建第一个倒计时<ArrowUpRight size={16} /></button>}</section>;
}

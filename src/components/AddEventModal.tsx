import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { CountdownEvent } from '../types';
import { COLOR_PRESETS, PRESET_TEMPLATES } from '../types';
import { formatDateForInput, getNextOccurrence } from '../utils/date';

interface Props { isOpen: boolean; onClose: () => void; onSave: (event: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt' | 'isFinished'>) => void; editEvent?: CountdownEvent | null; }

export function AddEventModal({ isOpen, onClose, onSave, editEvent }: Props) {
  const [title, setTitle] = useState(''); const [targetDate, setTargetDate] = useState(''); const [description, setDescription] = useState(''); const [color, setColor] = useState(COLOR_PRESETS[0]); const [notifyBefore, setNotifyBefore] = useState(0); const [templates, setTemplates] = useState(false);
  useEffect(() => { if (editEvent) { setTitle(editEvent.title); setTargetDate(formatDateForInput(new Date(editEvent.targetDate))); setDescription(editEvent.description || ''); setColor(editEvent.color || COLOR_PRESETS[0]); setNotifyBefore(editEvent.notifyBefore); setTemplates(false); } else if (isOpen) { setTitle(''); setTargetDate(formatDateForInput(new Date())); setDescription(''); setColor(COLOR_PRESETS[0]); setNotifyBefore(0); } }, [editEvent, isOpen]);
  const selectTemplate = (template: typeof PRESET_TEMPLATES[number]) => { setTitle(template.month === -1 ? '生日' : template.name); setTargetDate(formatDateForInput(template.month === -1 ? new Date() : getNextOccurrence(template.month, template.day))); setColor(template.color); setTemplates(false); };
  if (!isOpen) return null;
  return <div className="modal-overlay" onClick={onClose}><form className="event-modal" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave({ title: title.trim(), targetDate: new Date(targetDate).toISOString(), description: description.trim() || undefined, color, notifyBefore }); onClose(); }}>
    <header><div><span className="eyebrow">{editEvent ? '修改事件' : '新建事件'}</span><h2>{editEvent ? '编辑倒计时' : '添加倒计时'}</h2></div><button type="button" className="icon-button" onClick={onClose}><X size={19} /></button></header>
    {!editEvent && <div className="modal-tabs"><button type="button" className={!templates ? 'active' : ''} onClick={() => setTemplates(false)}>自定义</button><button type="button" className={templates ? 'active' : ''} onClick={() => setTemplates(true)}>常用日期</button></div>}
    {templates ? <div className="template-grid">{PRESET_TEMPLATES.map((item) => <button type="button" key={item.name} onClick={() => selectTemplate(item)}><i style={{ background: item.color }} />{item.name}</button>)}</div> : <div className="form-body"><label>名称<input required autoFocus value={title} maxLength={50} onChange={(e) => setTitle(e.target.value)} placeholder="例如：项目交付" /></label><label>目标时间<input required type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></label><label>备注 <em>可选</em><input value={description} maxLength={100} onChange={(e) => setDescription(e.target.value)} placeholder="写一句提醒自己" /></label><fieldset><legend>标签颜色</legend><div className="color-row">{COLOR_PRESETS.map((item) => <button type="button" aria-label={item} key={item} className={color === item ? 'selected' : ''} style={{ background: item }} onClick={() => setColor(item)} />)}</div></fieldset><label>提前提醒<select value={notifyBefore} onChange={(e) => setNotifyBefore(Number(e.target.value))}><option value="0">不提醒</option><option value="5">提前 5 分钟</option><option value="30">提前 30 分钟</option><option value="60">提前 1 小时</option><option value="1440">提前 1 天</option></select></label></div>}
    {!templates && <footer><button type="button" className="secondary" onClick={onClose}>取消</button><button type="submit" className="primary">{editEvent ? '保存修改' : '添加倒计时'}</button></footer>}
  </form></div>;
}

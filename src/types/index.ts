export interface CountdownEvent {
  id: string;
  title: string;
  targetDate: string;
  description?: string;
  color?: string;
  notifyBefore: number;
  createdAt: string;
  updatedAt: string;
  isFinished: boolean;
}

export interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
  totalSeconds: number;
}

export interface AppConfig {
  notifications: boolean;
  minimizeToTray: boolean;
  defaultNotifyBefore: number;
}

export const PRESET_TEMPLATES = [
  { name: '元旦', month: 0, day: 1, color: '#e74c3c' },
  { name: '情人节', month: 1, day: 14, color: '#e91e63' },
  { name: '劳动节', month: 4, day: 1, color: '#27ae60' },
  { name: '国庆节', month: 9, day: 1, color: '#e74c3c' },
  { name: '圣诞节', month: 11, day: 25, color: '#2ecc71' },
  { name: '生日', month: -1, day: -1, color: '#f39c12' },
] as const;

export const COLOR_PRESETS = [
  '#e74c3c', '#e91e63', '#9b59b6', '#3498db',
  '#1abc9c', '#27ae60', '#f39c12', '#e67e22',
  '#e94560', '#1a1a2e', '#636e72', '#95a5a6',
];

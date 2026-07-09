import { Timer } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Timer className="w-8 h-8 text-text-secondary" />
      </div>
      <h3 className="text-lg font-medium text-text mb-2">还没有倒计时</h3>
      <p className="text-sm text-text-secondary max-w-xs">
        点击右上角的「+」按钮，添加你的第一个倒计时事件吧！
      </p>
    </div>
  );
}

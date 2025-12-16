import { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { Todo } from '../App';

interface TodoModalProps {
  todo?: Todo;
  onClose: () => void;
  onSave: (data: Omit<Todo, 'id' | 'userId'>) => void;
}

export function TodoModal({ todo, onClose, onSave }: TodoModalProps) {
  const [text, setText] = useState(todo?.text || '');
  const [status, setStatus] = useState<Todo['status']>(todo?.status || 'pending');
  const [deadline, setDeadline] = useState(
    todo?.deadline
      ? new Date(todo.deadline).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Vui lòng nhập nội dung công việc');
      return;
    }

    if (!deadline) {
      setError('Vui lòng chọn deadline');
      return;
    }

    const todoData: Omit<Todo, 'id' | 'userId'> = {
      text: text.trim(),
      status,
      deadline: new Date(deadline).toISOString(),
    };

    if (status === 'done' && todo?.status !== 'done') {
      todoData.finishedTime = new Date().toISOString();
    } else if (status === 'done' && todo?.finishedTime) {
      todoData.finishedTime = todo.finishedTime;
    }

    onSave(todoData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2>
            {todo ? '✏️ Chỉnh sửa công việc' : '➕ Thêm công việc mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="text" className="block text-gray-700 mb-2">
              Nội dung công việc <span className="text-red-500">*</span>
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập nội dung công việc cần làm..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-gray-700 mb-2">
              ⏰ Deadline <span className="text-red-500">*</span>
            </label>
            <input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-gray-700 mb-2">
              📊 Trạng thái <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Todo['status'])}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
            >
              <option value="pending">⏳ Chưa hoàn thành</option>
              <option value="done">✓ Đã hoàn thành</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 border border-red-200">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {todo ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
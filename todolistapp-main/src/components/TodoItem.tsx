import { Calendar, Edit2, Trash2, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import type { Todo } from '../App';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function TodoItem({ todo, onEdit, onDelete, onToggleStatus }: TodoItemProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = () => {
    const deadline = new Date(todo.deadline);
    const now = new Date();
    return deadline < now && todo.status === 'pending';
  };

  const isPending = todo.status === 'pending';

  return (
    <div className={`p-5 hover:bg-gray-50 transition ${!isPending ? 'bg-gradient-to-r from-green-50/30 to-emerald-50/30' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Status Toggle */}
        <button
          onClick={() => onToggleStatus(todo.id)}
          className="mt-1 flex-shrink-0 group"
          title={isPending ? 'Đánh dấu hoàn thành' : 'Đánh dấu chưa hoàn thành'}
        >
          {isPending ? (
            <Circle className="w-6 h-6 text-gray-300 group-hover:text-indigo-600 transition" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-green-600 group-hover:text-green-700" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <h3
              className={`text-gray-900 flex-1 ${
                !isPending ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.text}
            </h3>
            <span
              className={`px-3 py-1.5 rounded-full text-sm flex-shrink-0 ${
                isPending
                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200'
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
              }`}
            >
              {isPending ? '⏳ Đang thực hiện' : '✓ Hoàn thành'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-gray-500">
            <div className={`flex items-center gap-2 ${isOverdue() ? 'text-red-600' : ''}`}>
              {isOverdue() ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              <span>
                Deadline: {formatDateTime(todo.deadline)}
                {isOverdue() && ' ⚠️'}
              </span>
            </div>
            {todo.finishedTime && (
              <div className="flex items-center gap-2 text-green-600">
                <Clock className="w-4 h-4" />
                <span>Hoàn thành: {formatDateTime(todo.finishedTime)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(todo)}
            className="p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
            title="Chỉnh sửa"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm('Bạn có chắc muốn xóa công việc này không?')) {
                onDelete(todo.id);
              }
            }}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
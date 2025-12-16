import { useState, useEffect, useMemo } from 'react';
import { Plus, LogOut, Search, Filter, SlidersHorizontal, TrendingUp, Clock } from 'lucide-react';
import type { User, Todo } from '../App';
import { TodoItem } from './TodoItem';
import { TodoModal } from './TodoModal';

interface TodoListProps {
  user: User;
  onLogout: () => void;
}

export function TodoList({ user, onLogout }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'status'>('deadline');

  useEffect(() => {
    const savedTodos = localStorage.getItem(`taskmaster_todos_${user.id}`);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      const sampleTodos: Todo[] = [
        {
          id: '1',
          userId: user.id,
          text: 'Hoàn thành báo cáo dự án Q4 và trình bày cho ban giám đốc',
          status: 'pending',
          deadline: '2025-12-15T09:00:00',
        },
        {
          id: '2',
          userId: user.id,
          text: 'Họp team weekly review công việc tuần và lên kế hoạch tuần sau',
          status: 'pending',
          deadline: '2025-12-13T14:00:00',
        },
        {
          id: '3',
          userId: user.id,
          text: 'Code review PR #123 về tính năng authentication mới',
          status: 'done',
          deadline: '2025-12-10T16:00:00',
          finishedTime: '2025-12-10T15:30:00',
        },
        {
          id: '4',
          userId: user.id,
          text: 'Chuẩn bị tài liệu và slide cho buổi training nhân viên mới',
          status: 'done',
          deadline: '2025-12-08T10:00:00',
          finishedTime: '2025-12-08T09:45:00',
        },
      ];
      setTodos(sampleTodos);
      localStorage.setItem(`taskmaster_todos_${user.id}`, JSON.stringify(sampleTodos));
    }
  }, [user.id]);

  const saveTodos = (updatedTodos: Todo[]) => {
    setTodos(updatedTodos);
    localStorage.setItem(`taskmaster_todos_${user.id}`, JSON.stringify(updatedTodos));
  };

  const handleCreateTodo = (todoData: Omit<Todo, 'id' | 'userId'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: `todo_${Date.now()}`,
      userId: user.id,
    };
    saveTodos([...todos, newTodo]);
    setIsModalOpen(false);
  };

  const handleUpdateTodo = (id: string, todoData: Omit<Todo, 'id' | 'userId'>) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...todoData } : todo
    );
    saveTodos(updatedTodos);
    setEditingTodo(null);
  };

  const handleToggleStatus = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        const newStatus = todo.status === 'pending' ? 'done' : 'pending';
        return {
          ...todo,
          status: newStatus,
          finishedTime: newStatus === 'done' ? new Date().toISOString() : undefined,
        };
      }
      return todo;
    });
    saveTodos(updatedTodos);
  };

  const handleDeleteTodo = (id: string) => {
    saveTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((todo) =>
        todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((todo) => todo.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else {
        // Sort by status: pending first, then done
        const statusOrder = { pending: 0, done: 1 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
    });

    return filtered;
  }, [todos, searchQuery, statusFilter, sortBy]);

  const stats = useMemo(() => {
    return {
      total: todos.length,
      pending: todos.filter((t) => t.status === 'pending').length,
      done: todos.filter((t) => t.status === 'done').length,
    };
  }, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-indigo-100"
                  />
                )}
                <div>
                  <h1 className="text-gray-900">TaskMaster</h1>
                  <p className="text-gray-600">Xin chào, {user.name}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-600">Tổng công việc</div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-sm p-6 border border-yellow-200 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-600">Chưa hoàn thành</div>
              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-700" />
              </div>
            </div>
            <div className="text-yellow-700">{stats.pending}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm p-6 border border-green-200 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-600">Đã hoàn thành</div>
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="text-green-700">{stats.done}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm công việc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="pl-9 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chưa xong</option>
                  <option value="done">Đã xong</option>
                </select>
              </div>
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="pl-9 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="deadline">Deadline</option>
                  <option value="status">Trạng thái</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-gray-900">Danh sách công việc</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition shadow-lg shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm công việc</span>
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAndSortedTodos.length === 0 ? (
              <div className="p-16 text-center text-gray-500">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Không tìm thấy công việc nào'
                    : 'Chưa có công việc nào'}
                </p>
                <p className="text-gray-500 text-sm">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                    : 'Nhấn nút "Thêm công việc" để bắt đầu'}
                </p>
              </div>
            ) : (
              filteredAndSortedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={setEditingTodo}
                  onDelete={handleDeleteTodo}
                  onToggleStatus={handleToggleStatus}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <TodoModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateTodo}
        />
      )}

      {editingTodo && (
        <TodoModal
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onSave={(data) => handleUpdateTodo(editingTodo.id, data)}
        />
      )}
    </div>
  );
}
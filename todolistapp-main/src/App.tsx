import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { TodoList } from './components/TodoList';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
}

export interface Todo {
  id: string;
  userId: string;
  text: string;
  status: 'pending' | 'done';
  deadline: string;
  finishedTime?: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication
    setTimeout(() => {
      const savedUser = localStorage.getItem('taskmaster_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('taskmaster_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('taskmaster_user');
    localStorage.removeItem(`taskmaster_todos_${currentUser?.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <TodoList user={currentUser} onLogout={handleLogout} />;
}
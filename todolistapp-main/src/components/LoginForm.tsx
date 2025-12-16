import { useState } from 'react';
import { Mail, Lock, Chrome, CheckCircle } from 'lucide-react';
import type { User } from '../App';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

// Mock users database (KHÔNG còn tài khoản demo)
const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Đỗ Huỳnh Gia Vĩ',
    email: 'dohuynhgiavi@example.com',
    password: 'hashed_demo123',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Giavi',
  },
];

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (isSignUp) {
      if (!name) {
        setError('Vui lòng nhập tên của bạn');
        return;
      }

      const existingUser = mockUsers.find((u) => u.email === email);
      if (existingUser) {
        setError('Email đã được sử dụng');
        return;
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        password: `hashed_${password}`,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      mockUsers.push(newUser);
      onLogin(newUser);
    } else {
      const user = mockUsers.find((u) => u.email === email);

      if (!user) {
        setError('Email không tồn tại');
        return;
      }

      onLogin(user);
    }
  };

  const handleGoogleLogin = () => {
    const user: User = {
      id: `google_${Date.now()}`,
      name: 'Người dùng Google',
      email: 'user@gmail.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
    };

    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-indigo-100 text-lg">
            Quản lý công việc thông minh
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg"
            >
              {isSignUp ? 'Đăng ký tài khoản' : 'Đăng nhập'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl hover:bg-gray-50"
          >
            <Chrome className="w-5 h-5 text-red-500" />
            Google
          </button>

          <p className="text-center mt-6 text-gray-600">
            {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-indigo-600 hover:text-indigo-700"
            >
              {isSignUp ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

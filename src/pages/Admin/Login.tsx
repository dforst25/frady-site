import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('כתובת אימייל לא תקינה').required('אימייל הוא שדה חובה'),
  password: yup.string().required('סיסמה היא שדה חובה').min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
});

interface LoginFormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success('התחברת בהצלחה!');
        navigate('/admin');
      } else {
        toast.error('שם משתמש או סיסמה שגויים');
      }
    } catch (error) {
      toast.error('אירעה שגיאה בהתחברות');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center px-4">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            כניסה לפאנל ניהול
          </h1>
          <p className="text-gray-600">
            הזינו את פרטי ההתחברות שלכם
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              כתובת אימייל
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
              placeholder="admin@photography.co.il"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              סיסמה
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>התחבר</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">פרטי התחברות לדוגמה:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>מנהל:</strong> admin@photography.co.il / admin123</p>
            <p><strong>עורך:</strong> editor@photography.co.il / editor123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
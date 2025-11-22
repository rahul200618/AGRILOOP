import React, { useState } from 'react';
import { UserRole } from '../utils/types';
import { Sprout, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthScreenProps {
  onAuthComplete: (userData: AuthUser) => void;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  location: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  location?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthComplete }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation (only for sign up)
    if (isSignUp) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
        newErrors.name = 'Name should only contain letters and spaces';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name should be at least 2 characters';
      }

      // Phone validation
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      } else if (formData.phone.replace(/\D/g, '').length < 10) {
        newErrors.phone = 'Phone number should be at least 10 digits';
      }

      // Location validation
      if (!formData.location.trim()) {
        newErrors.location = 'Location is required';
      } else if (formData.location.trim().length < 3) {
        newErrors.location = 'Location should be at least 3 characters';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters';
    } else if (isSignUp && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password should contain uppercase, lowercase, and number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userData: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        phone: formData.phone || '',
        location: formData.location || 'India'
      };
      
      setIsLoading(false);
      onAuthComplete(userData);
    }, 1500);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section className="relative flex justify-center items-center w-full h-screen overflow-hidden">
      {/* Nature Background */}
      <img 
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop" 
        alt="Nature Background" 
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
      />
      
      {/* Trees Overlay */}
      <img 
        src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop" 
        alt="Trees" 
        className="absolute top-0 left-0 w-full h-full object-cover z-10 pointer-events-none opacity-30"
      />
      
      {/* Animated Girl */}
      <div className="absolute scale-65 pointer-events-none animate-girl z-20">
        <img 
          src="https://images.unsplash.com/photo-1494790108755-2616c669c494?q=80&w=400&auto=format&fit=crop" 
          alt="Person" 
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>
      
      {/* Falling Leaves */}
      <div className="leaves absolute w-full h-screen overflow-hidden flex justify-center items-center z-1 pointer-events-none">
        <div className="set absolute w-full h-full top-0 left-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute block animate-leaf"
              style={{
                left: `${[20, 50, 70, 5, 85, 90, 15, 60][i]}%`,
                animationDuration: `${[20, 14, 12, 15, 18, 12, 14, 15][i]}s`,
                animationDelay: `${i * 2}s`
              }}
            >
              <div className="w-6 h-6 bg-green-500 rounded-full opacity-70" />
            </div>
          ))}
        </div>
      </div>

      {/* Login Form */}
      <div className="relative p-16 bg-white/25 backdrop-blur-md border border-white border-b-white/50 border-r-white/50 rounded-3xl w-full max-w-lg flex flex-col gap-8 shadow-2xl z-30">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Sprout size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AgriLoop</h1>
              <p className="text-xs text-white/70">Circular Economy</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name Field (Sign Up Only) */}
          {isSignUp && (
            <div className="inputBox relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full p-4 outline-none text-xl text-green-800 rounded-md bg-white border-none mb-8 ${
                  errors.name ? 'border-2 border-red-500' : ''
                }`}
                placeholder="Full Name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          {/* Email Field */}
          <div className="inputBox relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-4 outline-none text-xl text-green-800 rounded-md bg-white border-none mb-8 ${
                errors.email ? 'border-2 border-red-500' : ''
              }`}
              placeholder={isSignUp ? "Email Address" : "Username or Email"}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone Field (Sign Up Only) */}
          {isSignUp && (
            <div className="inputBox relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full p-4 outline-none text-xl text-green-800 rounded-md bg-white border-none mb-8 ${
                  errors.phone ? 'border-2 border-red-500' : ''
                }`}
                placeholder="Phone Number"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>
          )}

          {/* Location Field (Sign Up Only) */}
          {isSignUp && (
            <div className="inputBox relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full p-4 outline-none text-xl text-green-800 rounded-md bg-white border-none mb-8 ${
                  errors.location ? 'border-2 border-red-500' : ''
                }`}
                placeholder="Location"
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
            </div>
          )}

          {/* Password Field */}
          <div className="inputBox relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full p-4 outline-none text-xl text-green-800 rounded-md bg-white border-none mb-8 ${
                errors.password ? 'border-2 border-red-500' : ''
              }`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-green-600 hover:text-green-800"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {isSignUp && (
            <div className="inputBox relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full p-4 outline-none text-xl text-green-800 rounded-md bg-white border-none mb-8 ${
                  errors.confirmPassword ? 'border-2 border-red-500' : ''
                }`}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-green-600 hover:text-green-800"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Submit Button */}
          <div className="inputBox">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-4 border-none outline-none bg-green-800 text-white cursor-pointer text-xl font-medium rounded-md transition-all duration-500 hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                isSignUp ? 'Sign Up' : 'Login'
              )}
            </button>
          </div>
        </form>

        {/* Links */}
        <div className="group flex justify-between">
          <a href="#" className="text-xl text-green-800 font-medium no-underline hover:text-green-600">
            Forgot Password?
          </a>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrors({});
              setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                location: ''
              });
            }}
            className="text-xl text-green-800 font-medium underline hover:text-green-600 bg-transparent border-none cursor-pointer"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .animate-girl {
          animation: animateGirl 10s linear infinite;
        }
        
        @keyframes animateGirl {
          0% { transform: translateX(calc(100% + 100vw)); }
          50% { transform: translateX(calc(-100% - 100vw)); }
          50.01% { transform: translateX(calc(-100% - 100vw)) rotateY(180deg); }
          100% { transform: translateX(calc(100% + 100vw)) rotateY(180deg); }
        }
        
        .animate-leaf {
          animation: animate linear infinite;
        }
        
        @keyframes animate {
          0% {
            opacity: 0;
            top: -10%;
            transform: translateX(20px) rotate(0deg);
          }
          10% { opacity: 1; }
          20% { transform: translateX(-20px) rotate(45deg); }
          40% { transform: translateX(-20px) rotate(90deg); }
          60% { transform: translateX(20px) rotate(180deg); }
          80% { transform: translateX(-20px) rotate(45deg); }
          100% {
            top: 110%;
            transform: translateX(20px) rotate(225deg);
          }
        }
      `}</style>
    </section>
  );
};
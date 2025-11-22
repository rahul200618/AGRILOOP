import React, { useState } from 'react';

interface NatureAuthScreenProps {
  onAuthComplete: (userData: AuthUser) => void;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

export const NatureAuthScreen: React.FC<NatureAuthScreenProps> = ({ onAuthComplete }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isSignUp) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
        newErrors.name = 'Name should only contain letters and spaces';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      }

      if (!formData.location.trim()) {
        newErrors.location = 'Location is required';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userData: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      phone: formData.phone || '',
      location: formData.location || 'India'
    };

    setTimeout(() => {
      onAuthComplete(userData);
    }, 1000);
  };

  return (
    <section style={{ 
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Background */}
      <img 
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop" 
        alt="Forest Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none'
        }}
      />

      {/* Trees Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
          zIndex: 100,
          pointerEvents: 'none'
        }}
      />

      {/* Animated Character */}
      <div
        style={{
          position: 'absolute',
          scale: '0.65',
          pointerEvents: 'none',
          animation: 'animateGirl 10s linear infinite',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px'
        }}
      >
        🚶‍♀️
      </div>

      {/* Falling Leaves */}
      <div className="leaves" style={{
        position: 'absolute',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <div className="set" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}>
          {[1, 2, 3, 4, 1, 2, 3, 4].map((leafNum, index) => (
            <div key={index} style={{
              position: 'absolute',
              display: 'block',
              left: ['20%', '50%', '70%', '5%', '85%', '90%', '15%', '60%'][index],
              animation: `animate ${[20, 14, 12, 15, 18, 12, 14, 15][index]}s linear infinite`,
              fontSize: '30px',
              opacity: 0.8
            }}>
              🍃
            </div>
          ))}
        </div>
      </div>

      {/* Login Form */}
      <div className="login" style={{
        position: 'relative',
        padding: '60px',
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(15px)',
        border: '1px solid #fff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
        borderRight: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '20px',
        width: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
        zIndex: 200
      }}>
        <h2 style={{
          position: 'relative',
          width: '100%',
          textAlign: 'center',
          fontSize: '2.5em',
          fontWeight: 600,
          color: '#8f2c24',
          marginBottom: '10px'
        }}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isSignUp && (
            <div className="inputBox" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '15px 20px',
                  outline: 'none',
                  fontSize: '1.25em',
                  color: '#8f2c24',
                  borderRadius: '5px',
                  background: '#fff',
                  border: 'none',
                  marginBottom: '10px'
                }}
              />
              {errors.name && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.name}</p>}
            </div>
          )}

          <div className="inputBox" style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder={isSignUp ? "Email Address" : "Username"}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                position: 'relative',
                width: '100%',
                padding: '15px 20px',
                outline: 'none',
                fontSize: '1.25em',
                color: '#8f2c24',
                borderRadius: '5px',
                background: '#fff',
                border: 'none',
                marginBottom: '10px'
              }}
            />
            {errors.email && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.email}</p>}
          </div>

          {isSignUp && (
            <>
              <div className="inputBox" style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{
                    position: 'relative',
                    width: '100%',
                    padding: '15px 20px',
                    outline: 'none',
                    fontSize: '1.25em',
                    color: '#8f2c24',
                    borderRadius: '5px',
                    background: '#fff',
                    border: 'none',
                    marginBottom: '10px'
                  }}
                />
                {errors.phone && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.phone}</p>}
              </div>

              <div className="inputBox" style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  style={{
                    position: 'relative',
                    width: '100%',
                    padding: '15px 20px',
                    outline: 'none',
                    fontSize: '1.25em',
                    color: '#8f2c24',
                    borderRadius: '5px',
                    background: '#fff',
                    border: 'none',
                    marginBottom: '10px'
                  }}
                />
                {errors.location && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.location}</p>}
              </div>
            </>
          )}

          <div className="inputBox" style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                position: 'relative',
                width: '100%',
                padding: '15px 20px',
                outline: 'none',
                fontSize: '1.25em',
                color: '#8f2c24',
                borderRadius: '5px',
                background: '#fff',
                border: 'none',
                marginBottom: '10px'
              }}
            />
            {errors.password && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.password}</p>}
          </div>

          {isSignUp && (
            <div className="inputBox" style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '15px 20px',
                  outline: 'none',
                  fontSize: '1.25em',
                  color: '#8f2c24',
                  borderRadius: '5px',
                  background: '#fff',
                  border: 'none',
                  marginBottom: '10px'
                }}
              />
              {errors.confirmPassword && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.confirmPassword}</p>}
            </div>
          )}

          <div className="inputBox" style={{ position: 'relative' }}>
            <input
              type="submit"
              value={isSignUp ? "Sign Up" : "Login"}
              style={{
                position: 'relative',
                border: 'none',
                outline: 'none',
                background: '#8f2c24',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1.25em',
                fontWeight: 500,
                transition: '0.5s',
                width: '100%',
                padding: '15px 20px',
                borderRadius: '5px'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#d64c42'}
              onMouseOut={(e) => e.currentTarget.style.background = '#8f2c24'}
            />
          </div>
        </form>

        <div className="group" style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <a href="#" style={{
            fontSize: '1.25em',
            color: '#8f2c24',
            fontWeight: 500,
            textDecoration: 'none'
          }}>
            Forget Password
          </a>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                location: ''
              });
              setErrors({});
            }}
            style={{
              fontSize: '1.25em',
              color: '#8f2c24',
              fontWeight: 500,
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isSignUp ? 'Sign In' : 'Signup'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes animateGirl {
          0% { transform: translateX(calc(100% + 100vw)); }
          50% { transform: translateX(calc(-100% - 100vw)); }
          50.01% { transform: translateX(calc(-100% - 100vw)) rotateY(180deg); }
          100% { transform: translateX(calc(100% + 100vw)) rotateY(180deg); }
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

        .login .inputBox ::placeholder {
          color: #8f2c24;
        }
      `}</style>
    </section>
  );
};
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Key } from 'lucide-react';
import './Login.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      {/* Background Orbs */}
      <div className="login-orb orb-1"></div>
      <div className="login-orb orb-2"></div>
      
      <div className="login-card animate-slide-up">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <Lock size={24} />
          </div>
          <h1>Shahi Coaching</h1>
          <p>Admin Dashboard Login</p>
        </div>

        {errorMsg && (
          <div className="login-error animate-fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field minimal-input pl-10" 
                placeholder="admin@shahicoaching.com"
                required 
              />
            </div>
          </div>

          <div className="form-group mt-4">
            <label>Password</label>
            <div className="input-with-icon">
              <Key size={16} className="input-icon" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field minimal-input pl-10" 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary login-btn" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>This is a restricted area. Only authorized staff may log in.</p>
        </div>
      </div>
    </div>
  );
};

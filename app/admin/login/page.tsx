"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      localStorage.setItem('admin-auth', 'true');
      router.push('/admin');
    } else {
      setError('رمز اشتباه است');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '1rem', width: '300px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: 'white' }}>ورود به پنل مدیریت</h2>
        <input 
          type="password" 
          placeholder="رمز عبور" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid gray', background: 'black', color: 'white' }}
        />
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.5rem', backgroundColor: 'blue', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>ورود</button>
      </form>
    </div>
  );
}
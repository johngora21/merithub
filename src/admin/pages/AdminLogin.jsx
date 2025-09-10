import React, { useState } from 'react'
import { apiService } from '../../lib/api-service'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

const AdminLogin = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setError('Request timeout - please check your connection')
      setLoading(false)
    }, 10000) // 10 second timeout
    
    try {
      const resp = await apiService.post('/auth/login', { email, password })
      clearTimeout(timeoutId)
      
      console.log('Login response:', resp)
      
      if (resp && resp.data && resp.data.token && resp.data.user) {
        localStorage.setItem('auth-token', resp.data.token)
        localStorage.setItem('user-type', 'admin')
        // simple admin check: is_admin true or enterprise subscription
        const isAdmin = !!resp.data.user.is_admin || resp.data.user.subscription_type === 'enterprise'
        if (!isAdmin) {
          setError('Admin access required')
          setLoading(false)
          return
        }
        onSuccess && onSuccess()
      } else if (resp && resp.success && resp.token) {
        // fallback shape
        localStorage.setItem('auth-token', resp.token)
        localStorage.setItem('user-type', 'admin')
        onSuccess && onSuccess()
      } else {
        setError(resp?.message || 'Login failed')
        setLoading(false)
      }
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('Login error:', err)
      setError(err?.message || 'Connection failed - check backend server')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff 0%, #fff7ed 50%, #fff1e6 100%)', padding: '16px' }}>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px 28px', border: '1px solid #eef2f7' }}>
            <Loader2 className="animate-spin" style={{ height: 48, width: 48, color: '#f97316', margin: '0 auto 12px auto' }} />
            <p style={{ color: '#475569', fontWeight: 600 }}>Signing in...</p>
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #fee2e2', background: 'white' }}>
            <div style={{ textAlign: 'center', padding: 0, background: 'linear-gradient(90deg, #f97316, #ea580c)', color: 'white' }}>
              <div style={{ padding: '20px 16px 0 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '36px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: '#f97316',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mask: 'url(/assets/images/merit-logo.png) no-repeat center/contain',
                      WebkitMask: 'url(/assets/images/merit-logo.png) no-repeat center/contain'
                    }}></div>
                  </div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800 }}>Welcome to Merit Admin</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }}>Sign in to access the admin dashboard</div>
              </div>
            </div>

            <div style={{ padding: '20px 20px 24px 20px' }}>
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <AlertCircle size={18} color="#dc2626" />
                  <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#1f2937', marginBottom: '6px', fontWeight: 600 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      style={{ width: '100%', padding: '12px 12px 12px 38px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s ease-in-out' }}
                      onFocus={(e) => { e.target.style.borderColor = '#f97316' }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#1f2937', marginBottom: '6px', fontWeight: 600 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{ width: '100%', padding: '12px 38px 12px 38px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s ease-in-out' }}
                      onFocus={(e) => { e.target.style.borderColor = '#f97316' }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', background: 'linear-gradient(90deg, #f97316, #ea580c)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 16px rgba(234,88,12,0.2)', transform: 'translateZ(0)', transition: 'transform 0.12s ease, background 0.2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.background = 'linear-gradient(90deg, #ea580c, #c2410c)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {loading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <Loader2 className="animate-spin" size={16} />
                      Logging in...
                    </span>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <div style={{ marginTop: '12px', textAlign: 'right' }}>
                <button type="button" style={{ background: 'transparent', border: 'none', color: '#ea580c', fontSize: '12px', cursor: 'pointer' }}>Forgot Password?</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLogin



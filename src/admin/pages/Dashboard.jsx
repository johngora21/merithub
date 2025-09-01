import React, { useState } from 'react'
import { 
  Users, 
  FileText, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Briefcase,
  GraduationCap,
  Gavel,
  BookOpen,
  CheckCircle,
  AlertCircle,
  UserCheck,
  RefreshCw,
  Shield,
  Menu,
  LogOut,
  Eye,
  LineChart,
  PieChart,
  Download
} from 'lucide-react'
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart as RechartsAreaChart
} from 'recharts'
import CRM from './CRM'
import Finance from './Finance'
import Content from './Content'
import Reports from './Reports'
import Applications from './Applications'

const AdminDashboard = () => {
  // Simple responsive detection
  const [screenSize] = useState({
    isMobile: window.innerWidth < 768,
    isDesktop: window.innerWidth >= 1024
  })
  const [activeModule, setActiveModule] = useState('overview')

  // Chart data - Merit platform specific
  const chartData = {
    monthlySubscriptions: [
      { month: 'Jan', subscriptions: 1200, applications: 12000 },
      { month: 'Feb', subscriptions: 1350, applications: 13200 },
      { month: 'Mar', subscriptions: 1250, applications: 12800 },
      { month: 'Apr', subscriptions: 1450, applications: 14100 },
      { month: 'May', subscriptions: 1550, applications: 15200 },
      { month: 'Jun', subscriptions: 1680, applications: 16100 },
      { month: 'Jul', subscriptions: 1750, applications: 16800 },
      { month: 'Aug', subscriptions: 1650, applications: 16400 },
      { month: 'Sep', subscriptions: 1800, applications: 17200 },
      { month: 'Oct', subscriptions: 1950, applications: 18100 },
      { month: 'Nov', subscriptions: 2050, applications: 18900 },
      { month: 'Dec', subscriptions: 2150, applications: 19500 }
    ],
    contentDistribution: [
      { name: 'Jobs', value: 3547, color: '#3b82f6' },
      { name: 'Tenders', value: 892, color: '#16a34a' },
      { name: 'Opportunities', value: 1456, color: '#8b5cf6' },
      { name: 'Courses', value: 234, color: '#ea580c' },
      { name: 'Business Plans', value: 156, color: '#0891b2' }
    ],
    userActivity: [
      { status: 'Active Users', count: 12634, color: '#16a34a' },
      { status: 'Pending Approval', count: 1247, color: '#f59e0b' },
      { status: 'Inactive', count: 3966, color: '#ef4444' }
    ],
    dailyStats: [
      { day: 'Mon', jobs: 245, tenders: 32, opportunities: 89 },
      { day: 'Tue', jobs: 278, tenders: 28, opportunities: 95 },
      { day: 'Wed', jobs: 312, tenders: 35, opportunities: 102 },
      { day: 'Thu', jobs: 289, tenders: 41, opportunities: 87 },
      { day: 'Fri', jobs: 334, tenders: 38, opportunities: 115 },
      { day: 'Sat', jobs: 198, tenders: 22, opportunities: 76 },
      { day: 'Sun', jobs: 156, tenders: 18, opportunities: 64 }
    ],
    jobsStatusDistribution: [
      { name: 'Active', value: 2847, color: '#16a34a' },
      { name: 'Expired', value: 456, color: '#ef4444' },
      { name: 'Rejected', value: 189, color: '#dc2626' },
      { name: 'Pending', value: 55, color: '#f59e0b' }
    ],
    tendersStatusDistribution: [
      { name: 'Active', value: 623, color: '#16a34a' },
      { name: 'Expired', value: 156, color: '#ef4444' },
      { name: 'Rejected', value: 78, color: '#dc2626' },
      { name: 'Pending', value: 35, color: '#f59e0b' }
    ],
    opportunitiesStatusDistribution: [
      { name: 'Active', value: 1023, color: '#16a34a' },
      { name: 'Expired', value: 234, color: '#ef4444' },
      { name: 'Rejected', value: 145, color: '#dc2626' },
      { name: 'Pending', value: 54, color: '#f59e0b' }
    ]
  }

  const modules = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'crm', name: 'CRM', icon: Users },
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'applications', name: 'Applications', icon: UserCheck },
    { id: 'finance', name: 'Finance', icon: DollarSign },
    { id: 'reports', name: 'Reports', icon: CheckCircle }
  ]

  const renderOverview = () => (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          flexDirection: screenSize.isMobile ? 'column' : 'row',
          alignItems: screenSize.isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 8px 0',
              fontFamily: 'var(--font-poppins)',
              letterSpacing: '-0.025em'
            }}>
              Merit Dashboard
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              margin: 0,
              fontWeight: '500'
            }}>
              Welcome back! Here's what's happening on Merit platform today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        className="merit-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <p style={{
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0
              }}>
                Total Users
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: 0,
                color: '#0f172a'
              }}>
                15,847
              </p>
            </div>
            <Users style={{ height: '32px', width: '32px', color: '#3b82f6' }} />
          </div>
          
          {/* Subscription Breakdown */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#0ea5e9'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Free Users</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>12,600</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Premium</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>2,847</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Enterprise</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>400</span>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        className="merit-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <p style={{
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0
              }}>
                Total Content
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: 0,
                color: '#0f172a'
              }}>
                6,285
              </p>
            </div>
            <FileText style={{ height: '32px', width: '32px', color: '#8b5cf6' }} />
          </div>
          
          {/* Content Breakdown */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Jobs</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>3,547</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Tenders</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>892</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#8b5cf6'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Opportunities</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>1,456</span>
            </div>
            

          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        className="merit-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <p style={{
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0
              }}>
                Applications
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: 0,
                color: '#0f172a'
              }}>
                12,847
              </p>
            </div>
            <CheckCircle style={{ height: '32px', width: '32px', color: '#10b981' }} />
          </div>
          
          {/* Applications Breakdown */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Active</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>8,234</span>
            </div>
            

            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Rejected</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>1,234</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#64748b'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Expired</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>923</span>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        className="merit-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <p style={{
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0
              }}>
                Revenue
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: 0,
                color: '#0f172a'
              }}>
                $847K
              </p>
            </div>
            <DollarSign style={{ height: '32px', width: '32px', color: '#f97316' }} />
          </div>
          
          {/* Revenue Breakdown */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Premium Subscriptions</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>$623K</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Enterprise</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>$156K</span>
            </div>
            

          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Revenue Trend Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0
            }}>
              Subscription Growth
            </h3>
            <LineChart size={20} color="#3b82f6" />
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={chartData.monthlySubscriptions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value.toLocaleString()}`, 'Subscriptions']}
                  labelStyle={{ color: '#475569', fontWeight: '600' }}
                />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Distribution Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0
            }}>
              Content Distribution
            </h3>
            <PieChart size={20} color="#16a34a" />
          </div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.contentDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.contentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [`${value}`, name]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '16px'
          }}>
            {chartData.contentDistribution.map((item) => (
              <div key={item.name} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: item.color
                  }}></div>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>{item.name}</span>
                </div>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a',
            margin: 0
          }}>
            Weekly Activity
          </h3>
          <BarChart3 size={20} color="#8b5cf6" />
        </div>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="jobs" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Jobs" />
              <Bar dataKey="tenders" fill="#16a34a" radius={[2, 2, 0, 0]} name="Tenders" />
              <Bar dataKey="opportunities" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Opportunities" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* User Behavior Analytics */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0
            }}>
              User Behavior Analytics
            </h3>
            <Users size={20} color="#3b82f6" />
          </div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart data={chartData.monthlySubscriptions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#3b82f6"
                  fill="url(#colorGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </RechartsAreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Engagement Analytics */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0
            }}>
              Content Engagement
            </h3>
            <FileText size={20} color="#16a34a" />
          </div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData.contentDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>



      {/* Service Status Distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Jobs Status Distribution */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0
            }}>
              Jobs Status
            </h3>
            <Briefcase size={20} color="#3b82f6" />
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {chartData.jobsStatusDistribution.map((item) => (
              <div key={item.name} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>{item.name}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{item.value}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(item.value / Math.max(...chartData.jobsStatusDistribution.map(d => d.value))) * 100}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tenders Status Distribution */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0
            }}>
              Tenders Status
            </h3>
            <Gavel size={20} color="#16a34a" />
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {chartData.tendersStatusDistribution.map((item) => (
              <div key={item.name} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>{item.name}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{item.value}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(item.value / Math.max(...chartData.tendersStatusDistribution.map(d => d.value))) * 100}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities Status Distribution */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0
            }}>
              Opportunities Status
            </h3>
            <GraduationCap size={20} color="#8b5cf6" />
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {chartData.opportunitiesStatusDistribution.map((item) => (
              <div key={item.name} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>{item.name}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{item.value}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(item.value / Math.max(...chartData.opportunitiesStatusDistribution.map(d => d.value))) * 100}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a',
            margin: 0
          }}>
            Recent Activity
          </h3>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            color: '#64748b',
            transition: 'all 0.2s ease'
          }}>
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: Briefcase, text: 'New job posted: Senior Developer at TechCorp', time: '2 minutes ago' },
            { icon: Users, text: '15 new user registrations', time: '1 hour ago' },
            { icon: Gavel, text: 'Tender submitted: City Infrastructure Project', time: '3 hours ago' },
            { icon: GraduationCap, text: 'New scholarship opportunity added', time: '5 hours ago' },
            { icon: BookOpen, text: '3 new courses published', time: '1 day ago' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#fafafa',
              borderRadius: '10px',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <activity.icon size={16} color="#16a34a" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0f172a',
                  margin: '0 0 2px 0'
                }}>
                  {activity.text}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

           const renderModuleContent = () => {
           switch(activeModule) {
             case 'overview':
               return renderOverview()
             case 'crm':
               return <CRM />
             case 'content':
               return <Content />
             case 'applications':
               return <Applications />
             case 'reports':
               return <Reports />
             case 'finance':
               return <Finance />
             default:
               return renderOverview()
           }
         }

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      display: 'flex',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'var(--font-poppins)'
    }}>
      {/* Fixed Sidebar */}
      <div style={{
        width: screenSize.isMobile ? '100%' : '260px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        display: screenSize.isMobile && activeModule !== 'sidebar' ? 'none' : 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000
      }}>
        {/* Logo */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'white',
            margin: 0,
            fontFamily: 'var(--font-poppins)'
          }}>
            Merit Hub
          </h2>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 12px' }}>
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '4px',
                backgroundColor: activeModule === module.id ? '#ea580c' : 'transparent',
                border: 'none',
                color: activeModule === module.id ? 'white' : 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderRadius: '10px',
                textAlign: 'left',
                fontFamily: 'var(--font-poppins)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeModule !== module.id) {
                  e.target.style.backgroundColor = 'rgba(234, 88, 12, 0.1)'
                  e.target.style.color = 'white'
                }
              }}
              onMouseLeave={(e) => {
                if (activeModule !== module.id) {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)'
                }
              }}
            >
              <module.icon size={18} />
              {module.name}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px' }}>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              borderRadius: '10px',
              textAlign: 'left',
              fontFamily: 'var(--font-poppins)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
              e.target.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: screenSize.isMobile ? '0' : '260px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Fixed Header */}
        <div style={{
          height: '60px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#64748b',
              margin: 0,
              fontFamily: 'var(--font-poppins)'
            }}>
              Merit Hub System
            </h1>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#64748b'
            }}>
              Admin User
            </span>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              A
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          padding: '32px',
          overflow: 'auto',
          backgroundColor: '#f8fafc'
        }}>
          {renderModuleContent()}
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      {screenSize.isMobile && (
        <button
          onClick={() => setActiveModule(activeModule === 'sidebar' ? 'overview' : 'sidebar')}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(234, 88, 12, 0.25)',
            zIndex: 1001,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)'
            e.target.style.boxShadow = '0 12px 35px rgba(234, 88, 12, 0.35)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
            e.target.style.boxShadow = '0 8px 25px rgba(234, 88, 12, 0.25)'
          }}
        >
          <Menu size={24} />
        </button>
      )}
    </div>
  )
}

export default AdminDashboard
import React, { useEffect, useState } from 'react'
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
import { apiService } from '../../lib/api-service'
import Applications from './Applications'

const AdminDashboard = ({ user, onLogout }) => {
  // Simple responsive detection
  const [screenSize] = useState({
    isMobile: window.innerWidth < 768,
    isDesktop: window.innerWidth >= 1024
  })
  const [activeModule, setActiveModule] = useState('overview')

  const [chartData, setChartData] = useState({
    monthlySubscriptions: [],
    contentDistribution: [],
    userActivity: [],
    dailyStats: [],
    jobsStatusDistribution: [],
    tendersStatusDistribution: [],
    opportunitiesStatusDistribution: [],
    // New pie chart data
    coursesDistribution: [],
    videosIndustryDistribution: [],
    booksIndustryDistribution: [],
    businessPlansIndustryDistribution: [],
    jobsIndustryDistribution: [],
    tendersIndustryDistribution: [],
    opportunitiesIndustryDistribution: [],
    // User distribution data
    ageDistribution: [],
    ageDistributionIndividual: [],
    genderDistribution: [],
    educationDistribution: [],
    countryDistribution: [],
    nationalityDistribution: [],
    // Top downloaded content
    topVideos: [],
    topBooks: [],
    topBusinessPlans: [],
    topJobs: [],
    topTenders: [],
    topOpportunities: []
  })
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    totalApplications: 0,
    totalRevenue: 0,
    breakdown: { free: 0, premium: 0, enterprise: 0 }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')
        const resp = await apiService.get('/admin/dashboard')
        const data = resp?.data || resp || {}
        console.log('Dashboard data received:', data)
        setChartData({
          monthlySubscriptions: data.monthlySubscriptions || [],
          contentDistribution: data.contentDistribution || [],
          userActivity: data.userActivity || [],
          dailyStats: data.dailyStats || [],
          jobsStatusDistribution: data.jobsStatusDistribution || [],
          tendersStatusDistribution: data.tendersStatusDistribution || [],
          opportunitiesStatusDistribution: data.opportunitiesStatusDistribution || [],
          applicationsStatusDistribution: data.applicationsStatusDistribution || [],
          recentActivity: data.recentActivity || [],
          // New pie chart data
          coursesDistribution: data.coursesDistribution || [],
          videosIndustryDistribution: data.videosIndustryDistribution || [],
          booksIndustryDistribution: data.booksIndustryDistribution || [],
          businessPlansIndustryDistribution: data.businessPlansIndustryDistribution || [],
          jobsIndustryDistribution: data.jobsIndustryDistribution || [],
          tendersIndustryDistribution: data.tendersIndustryDistribution || [],
          opportunitiesIndustryDistribution: data.opportunitiesIndustryDistribution || [],
          // User distribution data
          ageDistribution: data.ageDistribution || [],
          ageDistributionIndividual: data.ageDistributionIndividual || [],
          genderDistribution: data.genderDistribution || [],
          educationDistribution: data.educationDistribution || [],
          countryDistribution: data.countryDistribution || [],
          nationalityDistribution: data.nationalityDistribution || [],
          // Top downloaded content
          topVideos: data.topVideos || [],
          topBooks: data.topBooks || [],
          topBusinessPlans: data.topBusinessPlans || [],
          topJobs: data.topJobs || [],
          topTenders: data.topTenders || [],
          topOpportunities: data.topOpportunities || []
        })
        const s = data.stats || {}
        console.log('Stats data:', s)
        setStats({
          totalUsers: s.totalUsers || 0,
          totalContent: (s.totalJobs || 0) + (s.totalTenders || 0) + (s.totalOpportunities || 0) + (s.totalCourses || 0),
          totalApplications: s.totalApplications || 0,
          totalRevenue: s.totalRevenue || 0,
          jobSeekers: s.jobSeekers || 0,
          employers: s.employers || 0,
          breakdown: { 
            free: s.basicUsers || 0, 
            premium: s.proUsers || 0, 
            enterprise: s.enterpriseUsers || 0 
          }
        })
      } catch (e) {
        console.error('Failed to load dashboard', e)
        setError(e?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

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
                  {(stats.totalUsers || 0).toLocaleString()}
                </p>
            </div>
            <Users style={{ height: '32px', width: '32px', color: '#3b82f6' }} />
          </div>
          
          {/* User Type Breakdown */}
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
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Job Seekers</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{(stats.jobSeekers || 0).toLocaleString()}</span>
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
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Employers</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{(stats.employers || 0).toLocaleString()}</span>
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
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Admins</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{(stats.breakdown?.enterprise || 0).toLocaleString()}</span>
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
                  {(stats.totalContent || 0).toLocaleString()}
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
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{(chartData?.contentDistribution?.find(c => c.name === 'Jobs')?.value || 0).toLocaleString()}</span>
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
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{(chartData?.contentDistribution?.find(c => c.name === 'Tenders')?.value || 0).toLocaleString()}</span>
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
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{(chartData?.contentDistribution?.find(c => c.name === 'Opportunities')?.value || 0).toLocaleString()}</span>
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
                Applicants
              </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#0f172a'
                }}>
                  {(stats.totalApplications || 0).toLocaleString()}
                </p>
            </div>
            <CheckCircle style={{ height: '32px', width: '32px', color: '#10b981' }} />
          </div>
          
          {/* Applicants Breakdown */}
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
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Approved</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{chartData?.applicationsStatusDistribution?.find(a => a.name === 'Approved')?.value || 0}</span>
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
                  backgroundColor: '#3b82f6'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Shortlisted</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{chartData?.applicationsStatusDistribution?.find(a => a.name === 'Shortlisted')?.value || 0}</span>
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
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{chartData?.applicationsStatusDistribution?.find(a => a.name === 'Rejected')?.value || 0}</span>
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
                Active Users
              </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#0f172a'
                }}>
                  {(stats.activeUsers || 0).toLocaleString()}
                </p>
            </div>
            <Users style={{ height: '32px', width: '32px', color: '#10b981' }} />
          </div>
          
          {/* User Subscription Breakdown */}
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
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Merit Basic</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{(stats.breakdown?.free || 0).toLocaleString()}</span>
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
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Merit Pro</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{(stats.breakdown?.premium || 0).toLocaleString()}</span>
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
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Merit Enterprise</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{(stats.breakdown?.enterprise || 0).toLocaleString()}</span>
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

      {/* Pie Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Courses Distribution */}
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
              Courses Distribution
            </h3>
            <PieChart size={20} color="#ea580c" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.coursesDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.coursesDistribution.map((entry, index) => (
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
            {chartData.coursesDistribution.map((item) => (
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

        {/* Videos Industry Distribution */}
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
              Videos Industry Distribution
            </h3>
            <PieChart size={20} color="#3b82f6" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.videosIndustryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.videosIndustryDistribution.map((entry, index) => (
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
            {chartData.videosIndustryDistribution.map((item) => (
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

      {/* Second Row of Pie Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Books Industry Distribution */}
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
              Books Industry Distribution
          </h3>
            <PieChart size={20} color="#16a34a" />
        </div>
          <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.booksIndustryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.booksIndustryDistribution.map((entry, index) => (
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
            {chartData.booksIndustryDistribution.map((item) => (
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

        {/* Business Plans Industry Distribution */}
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
              Business Plans Industry Distribution
            </h3>
            <PieChart size={20} color="#8b5cf6" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.businessPlansIndustryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.businessPlansIndustryDistribution.map((entry, index) => (
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
            {chartData.businessPlansIndustryDistribution.map((item) => (
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

      {/* Third Row of Pie Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Jobs Industry Distribution */}
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
              Jobs Industry Distribution
            </h3>
            <PieChart size={20} color="#3b82f6" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.jobsIndustryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.jobsIndustryDistribution.map((entry, index) => (
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
            {chartData.jobsIndustryDistribution.map((item) => (
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

        {/* Tenders Industry Distribution */}
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
              Tenders Industry Distribution
            </h3>
            <PieChart size={20} color="#16a34a" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.tendersIndustryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.tendersIndustryDistribution.map((entry, index) => (
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
            {chartData.tendersIndustryDistribution.map((item) => (
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

        {/* Opportunities Industry Distribution */}
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
              Opportunities Industry Distribution
            </h3>
            <PieChart size={20} color="#8b5cf6" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.opportunitiesIndustryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.opportunitiesIndustryDistribution.map((entry, index) => (
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
            {chartData.opportunitiesIndustryDistribution.map((item) => (
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

      {/* User Distribution Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Age Distribution */}
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
              Age Distribution
            </h3>
            <Users size={20} color="#3b82f6" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.ageDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.ageDistribution.map((entry, index) => (
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
                  formatter={(value, name) => {
                    const total = chartData.ageDistribution.reduce((sum, item) => sum + item.value, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return [`${percentage}%`, name];
                  }}
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
            {chartData.ageDistribution.map((item) => {
              const total = chartData.ageDistribution.reduce((sum, ageItem) => sum + ageItem.value, 0);
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
              
              return (
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
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Age Distribution Individual - Bar Chart */}
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
              Age Distribution (Individual)
            </h3>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              Bar Chart (15+ years)
            </div>
          </div>
          <div style={{ height: '300px', overflowY: 'auto' }}>
            {chartData.ageDistributionIndividual.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chartData.ageDistributionIndividual.map((item, index) => {
                  const maxCount = Math.max(...chartData.ageDistributionIndividual.map(d => d.count));
                  const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={item.age} style={{ marginBottom: '8px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                          Age {item.age}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {item.count} users
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '20px',
                        background: '#f3f4f6',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                          borderRadius: '10px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
                padding: '20px'
              }}>
                No age data available
              </div>
            )}
          </div>
        </div>

        {/* Gender Distribution */}
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
              Gender Distribution
            </h3>
            <Users size={20} color="#ec4899" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.genderDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.genderDistribution.map((entry, index) => (
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
            {chartData.genderDistribution.map((item) => (
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

      {/* Education and Location Distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Education Distribution */}
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
              Education Distribution
            </h3>
            <GraduationCap size={20} color="#16a34a" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.educationDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.educationDistribution.map((entry, index) => (
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
            {chartData.educationDistribution.map((item) => (
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

        {/* Country Distribution */}
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
              Country Distribution
            </h3>
            <Users size={20} color="#8b5cf6" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.countryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.countryDistribution.map((entry, index) => (
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
            {chartData.countryDistribution.map((item) => (
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

        {/* Nationality Distribution */}
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
              Nationality Distribution
            </h3>
            <Users size={20} color="#f59e0b" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.nationalityDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.nationalityDistribution.map((entry, index) => (
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
            {chartData.nationalityDistribution.map((item) => (
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

      {/* Top Downloaded Content Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Top Videos */}
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
              Top 10 Videos
            </h3>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              By Downloads
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {chartData.topVideos.length > 0 ? (
              chartData.topVideos.map((video, index) => (
                <div key={video.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < chartData.topVideos.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0f172a',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {video.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {video.downloads || 0} downloads • {video.enrollment_count || 0} enrollments
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6366f1',
                    backgroundColor: '#eef2ff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginLeft: '12px'
                  }}>
                    #{index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
                padding: '20px'
              }}>
                No videos data available
              </div>
            )}
          </div>
        </div>

        {/* Top Books */}
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
              Top 10 Books
            </h3>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              By Downloads
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {chartData.topBooks.length > 0 ? (
              chartData.topBooks.map((book, index) => (
                <div key={book.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < chartData.topBooks.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0f172a',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {book.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {book.downloads || 0} downloads • {book.enrollment_count || 0} enrollments
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#059669',
                    backgroundColor: '#ecfdf5',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginLeft: '12px'
                  }}>
                    #{index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
                padding: '20px'
              }}>
                No books data available
              </div>
            )}
          </div>
        </div>

        {/* Top Business Plans */}
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
              Top 10 Business Plans
            </h3>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              By Downloads
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {chartData.topBusinessPlans.length > 0 ? (
              chartData.topBusinessPlans.map((plan, index) => (
                <div key={plan.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < chartData.topBusinessPlans.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0f172a',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {plan.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {plan.downloads || 0} downloads • {plan.enrollment_count || 0} enrollments
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#dc2626',
                    backgroundColor: '#fef2f2',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginLeft: '12px'
                  }}>
                    #{index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
                padding: '20px'
              }}>
                No business plans data available
              </div>
            )}
          </div>
        </div>

        {/* Top Jobs */}
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
              Top 10 Jobs
            </h3>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              By Views
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {chartData.topJobs.length > 0 ? (
              chartData.topJobs.map((job, index) => (
                <div key={job.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < chartData.topJobs.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0f172a',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {job.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {job.company} • {job.views_count || 0} views • {job.applications_count || 0} applications
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#7c3aed',
                    backgroundColor: '#f3f4f6',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginLeft: '12px'
                  }}>
                    #{index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
                padding: '20px'
              }}>
                No jobs data available
              </div>
            )}
          </div>
        </div>

        {/* Top Tenders */}
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
              Top 10 Tenders
            </h3>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              By Views
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {chartData.topTenders.length > 0 ? (
              chartData.topTenders.map((tender, index) => (
                <div key={tender.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < chartData.topTenders.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0f172a',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {tender.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {tender.organization} • {tender.views_count || 0} views • {tender.submissions_count || 0} submissions
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ea580c',
                    backgroundColor: '#fff7ed',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginLeft: '12px'
                  }}>
                    #{index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
                padding: '20px'
              }}>
                No tenders data available
              </div>
            )}
          </div>
        </div>

        {/* Top Opportunities */}
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
              Top 10 Opportunities
            </h3>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              By Views
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {chartData.topOpportunities.length > 0 ? (
              chartData.topOpportunities.map((opportunity, index) => (
                <div key={opportunity.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index < chartData.topOpportunities.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0f172a',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {opportunity.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {opportunity.organization} • {opportunity.views_count || 0} views • {opportunity.applications_count || 0} applications
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#0891b2',
                    backgroundColor: '#ecfeff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginLeft: '12px'
                  }}>
                    #{index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
                padding: '20px'
              }}>
                No opportunities data available
              </div>
            )}
          </div>
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
          {(chartData.recentActivity || []).map((activity, index) => {
            // Get appropriate icon based on activity type
            const getActivityIcon = (type) => {
              switch (type) {
                case 'job': return Briefcase;
                case 'user_registration': return Users;
                case 'tender': return Gavel;
                case 'opportunity': return GraduationCap;
                case 'application': return FileText;
                default: return Activity;
              }
            };
            
            const ActivityIcon = getActivityIcon(activity.type);
            
            return (
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
                <ActivityIcon size={16} color="#16a34a" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0f172a',
                  margin: '0 0 2px 0'
                }}>
                  {activity.message}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {activity.timeAgo}
                </p>
              </div>
            </div>
            )
          })}
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
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      boxSizing: 'border-box',
      display: 'flex',
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
        zIndex: 1000,
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{
          padding: '16px 20px',

          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#f97316',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mask: 'url(/assets/images/merit-logo.png) no-repeat center/contain',
              WebkitMask: 'url(/assets/images/merit-logo.png) no-repeat center/contain'
            }}></div>
          </div>
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
        <div style={{ padding: '12px', marginTop: 'auto' }}>
          <button
            onClick={onLogout}
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
              {user ? (user.username ? `@${user.username}` : `${user.first_name} ${user.last_name}`) : 'Admin User'}
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
              {user && user.first_name ? user.first_name.charAt(0).toUpperCase() : 'A'}
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
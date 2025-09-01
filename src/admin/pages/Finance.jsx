import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Calculator,
  Search,
  Plus,
  Receipt,
  BookOpen,
  Scale,
  FileText,
  Download,
  Clock,
  Target,
  LineChart,
  PieChart,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

const Finance = () => {
  // Simple responsive detection
  const [screenSize] = useState({
    isMobile: window.innerWidth < 768,
    isDesktop: window.innerWidth >= 1024
  })

  const [selectedPeriod, setSelectedPeriod] = useState("current_month")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransactionType, setSelectedTransactionType] = useState("all")
  const [selectedAccount, setSelectedAccount] = useState("all")
  const [selectedStatement, setSelectedStatement] = useState("")
  const [selectedAccountingPeriod, setSelectedAccountingPeriod] = useState("current_month")
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    account: '',
    category: '',
    description: '',
    amount: '',
    reference: '',
    tags: []
  })

  // Subscription plans and pricing
  const subscriptionPlans = [
    { id: 'basic', name: 'Basic Plan', price: 0, features: ['Limited job applications', 'Basic profile', 'Course access'] },
    { id: 'premium', name: 'Premium Plan', price: 29.99, features: ['Unlimited applications', 'Priority support', 'Advanced analytics', 'Premium courses'] },
    { id: 'enterprise', name: 'Enterprise Plan', price: 99.99, features: ['Custom solutions', 'Dedicated support', 'Team management', 'API access'] }
  ]

  // Subscription revenue categories
  const getSubscriptionCategories = () => {
    return [
      { value: 'premium_monthly', label: 'Premium Monthly Subscriptions' },
      { value: 'premium_annual', label: 'Premium Annual Subscriptions' },
      { value: 'enterprise_monthly', label: 'Enterprise Monthly Subscriptions' },
      { value: 'enterprise_annual', label: 'Enterprise Annual Subscriptions' },
      { value: 'plan_upgrades', label: 'Plan Upgrades' },
      { value: 'subscription_renewals', label: 'Subscription Renewals' }
    ]
  }

  // Category mappings based on account
  const getCategoriesByAccount = (account) => {
    const categoryMap = {
      // Income categories
      'job_postings': ['Individual Postings', 'Bulk Postings', 'Featured Listings', 'Premium Visibility'],
      'tender_postings': ['Government Tenders', 'Private Tenders', 'International Tenders'],
      'premium_subscriptions': ['Monthly Plans', 'Annual Plans', 'Enterprise Plans'],
      'course_sales': ['Online Courses', 'Certification Programs', 'Workshop Fees'],
      
      // Expense categories
      'server_costs': ['Cloud Hosting', 'CDN Services', 'Database Hosting', 'Security Services'],
      'salary_expense': ['Employee Salaries', 'Contractor Fees', 'Bonuses', 'Benefits'],
      'software_expense': ['Development Tools', 'Analytics Software', 'Security Software'],
      'marketing_expense': ['Digital Marketing', 'Social Media Ads', 'Content Marketing', 'SEO Tools'],
      'content_creation': ['Video Production', 'Course Development', 'Writing Services'],
      'office_supplies': ['Equipment', 'Software Licenses', 'Office Materials'],
      'travel_expense': ['Air Travel', 'Hotel', 'Transportation', 'Meals'],
      
      // Transfer categories
      'cash': ['Cash Withdrawal', 'Cash Deposit', 'Petty Cash'],
      'bank_account': ['Bank Transfer', 'Wire Transfer', 'Check Deposit']
    }
    
    return categoryMap[account] || []
  }

  const financialData = {
    revenue: 0,
    expenses: 0,
    profit: 0,
    cashFlow: 0,
    growth: 0,
    expensesGrowth: 0,
    accountsReceivable: 0,
    accountsPayable: 0
  }

  const currentData = financialData

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getGrowthIcon = (isPositive) => {
    return isPositive ? (
      <ArrowUpRight style={{ width: '12px', height: '12px', color: '#16a34a' }} />
    ) : (
      <ArrowDownRight style={{ width: '12px', height: '12px', color: '#dc2626' }} />
    )
  }

  const TabButton = ({ value, children, isActive, onClick }) => (
    <button
      onClick={() => onClick(value)}
      style={{
        padding: '8px 16px',
        backgroundColor: isActive ? '#f97316' : 'transparent',
        color: isActive ? 'white' : '#64748b',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {children}
    </button>
  )

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: screenSize.isMobile ? '20px' : '32px'
    }}>


        {/* Tabs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: screenSize.isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
            gap: '8px',
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <TabButton value="dashboard" isActive={activeTab === "dashboard"} onClick={setActiveTab}>
              Dashboard
            </TabButton>
            <TabButton value="subscriptions" isActive={activeTab === "subscriptions"} onClick={setActiveTab}>
              Subscriptions
            </TabButton>
            <TabButton value="revenue" isActive={activeTab === "revenue"} onClick={setActiveTab}>
              Revenue
            </TabButton>
            <TabButton value="analytics" isActive={activeTab === "analytics"} onClick={setActiveTab}>
              Analytics
            </TabButton>
            <TabButton value="reports" isActive={activeTab === "reports"} onClick={setActiveTab}>
              Reports
            </TabButton>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Financial Overview Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: screenSize.isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Subscription Revenue
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {formatCurrency(0)}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '8px'
                    }}>
                      <TrendingUp size={16} color="#16a34a" />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#16a34a'
                      }}>
                        0%
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <DollarSign size={24} color="#16a34a" />
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Active Subscriptions
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {formatNumber(0)}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '8px'
                    }}>
                      <TrendingUp size={16} color="#16a34a" />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#16a34a'
                      }}>
                        0%
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#fecaca',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <Receipt size={24} color="#dc2626" />
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Monthly Recurring Revenue
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {formatCurrency(0)}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '8px'
                    }}>
                      <TrendingUp size={16} color="#16a34a" />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#16a34a'
                      }}>
                        0%
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <BarChart3 size={24} color="#3b82f6" />
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Churn Rate
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      0%
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '8px'
                    }}>
                      <TrendingDown size={16} color="#dc2626" />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#f97316'
                      }}>
                        0%
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#fed7aa',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <Banknote size={24} color="#f97316" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr',
              gap: '24px'
            }}>
              {/* Revenue vs Expenses Chart */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <LineChart size={20} color="#3b82f6" />
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    Revenue vs Expenses (6 Months)
                  </h3>
                </div>
                <div style={{
                  height: '320px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '256px',
                      height: '192px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          width: '192px',
                          height: '128px',
                          background: 'linear-gradient(to right, #dcfce7, #fecaca)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            width: '160px',
                            height: '96px',
                            background: 'linear-gradient(to right, #bbf7d0, #fca5a5)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <div style={{
                              width: '128px',
                              height: '64px',
                              background: 'linear-gradient(to right, #86efac, #f87171)',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <div style={{
                                width: '96px',
                                height: '32px',
                                background: 'linear-gradient(to right, #4ade80, #ef4444)',
                                borderRadius: '4px'
                              }}></div>
                            </div>
                          </div>
                        </div>
                        <p style={{
                          fontSize: '14px',
                          color: '#64748b',
                          margin: '8px 0 0 0',
                          fontWeight: '500'
                        }}>
                          Revenue vs Expenses
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: '#64748b',
                          margin: 0
                        }}>
                          Monthly comparison
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit Distribution Chart */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <PieChart size={20} color="#f97316" />
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    Profit Distribution
                  </h3>
                </div>
                <div style={{
                  height: '320px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '192px',
                      height: '192px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: '8px',
                        background: 'linear-gradient(135deg, #4ade80, #3b82f6)',
                        borderRadius: '50%'
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        inset: '16px',
                        backgroundColor: 'white',
                        borderRadius: '50%'
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        inset: '24px',
                        background: 'linear-gradient(135deg, #86efac, #60a5fa)',
                        borderRadius: '50%'
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        inset: '32px',
                        backgroundColor: 'white',
                        borderRadius: '50%'
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        inset: '40px',
                        background: 'linear-gradient(135deg, #bbf7d0, #93c5fd)',
                        borderRadius: '50%'
                      }}></div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#1e293b'
                        }}>
                          --
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          No data available
                        </div>
                      </div>
                    </div>
                    <div style={{
                      marginTop: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%'
                        }}></div>
                        <span style={{ color: '#374151' }}>Chart data will appear here</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <Activity size={20} color="#64748b" />
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Recent Financial Activity
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      backgroundColor: '#dcfce7',
                      padding: '8px',
                      borderRadius: '8px'
                    }}>
                      <TrendingUp size={16} color="#16a34a" />
                    </div>
                    <div>
                      <p style={{
                        fontWeight: '500',
                        color: '#1e293b',
                        margin: 0
                      }}>
                        No recent activity
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: 0
                      }}>
                        Financial activity will appear here
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      --
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      --
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      backgroundColor: '#fecaca',
                      padding: '8px',
                      borderRadius: '8px'
                    }}>
                      <TrendingDown size={16} color="#dc2626" />
                    </div>
                    <div>
                      <p style={{
                        fontWeight: '500',
                        color: '#1e293b',
                        margin: 0
                      }}>
                        No recent activity
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: 0
                      }}>
                        Financial activity will appear here
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      --
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      --
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      backgroundColor: '#dbeafe',
                      padding: '8px',
                      borderRadius: '8px'
                    }}>
                      <Banknote size={16} color="#3b82f6" />
                    </div>
                    <div>
                      <p style={{
                        fontWeight: '500',
                        color: '#1e293b',
                        margin: 0
                      }}>
                        No recent activity
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: 0
                      }}>
                        Financial activity will appear here
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      --
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      --
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Subscription Plans Overview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '24px'
            }}>
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {plan.name}
                    </h3>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: plan.price === 0 ? '#6b7280' : '#16a34a'
                    }}>
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#0f172a'
                    }}>
                      {formatNumber(0)}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      Active subscribers
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <TrendingUp size={16} color="#16a34a" />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#16a34a'
                    }}>
                      +0%
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      this month
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Subscribers Table */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    Recent Subscriptions
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <select style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      <option value="all">All Plans</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 24px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Customer
                      </th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 24px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Plan
                      </th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 24px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Status
                      </th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 24px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Started
                      </th>
                      <th style={{
                        textAlign: 'right',
                        padding: '12px 24px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" style={{
                        padding: '48px',
                        textAlign: 'center',
                        color: '#64748b'
                      }}>
                        No subscription data available
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Revenue Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: screenSize.isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      This Month
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {formatCurrency(0)}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <DollarSign size={24} color="#16a34a" />
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Annual Recurring Revenue
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {formatCurrency(0)}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <TrendingUp size={24} color="#3b82f6" />
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Average Revenue Per User
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {formatCurrency(0)}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#f3e8ff',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <Users size={24} color="#8b5cf6" />
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Customer Lifetime Value
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {formatCurrency(0)}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#fed7aa',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <Calendar size={24} color="#f97316" />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 16px 0'
              }}>
                Subscription Revenue Trend
              </h3>
              <div style={{
                height: '300px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <LineChart size={48} color="#d1d5db" />
                  <p style={{
                    fontSize: '16px',
                    color: '#64748b',
                    margin: '16px 0 0 0'
                  }}>
                    Revenue chart will display here
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Key Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: screenSize.isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Conversion Rate
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      0%
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <Target size={24} color="#16a34a" />
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Trial Conversion
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      0%
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <TrendingUp size={24} color="#3b82f6" />
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Upgrade Rate
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      0%
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#f3e8ff',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <ArrowUpRight size={24} color="#8b5cf6" />
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Retention Rate
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      0%
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#fed7aa',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <Shield size={24} color="#f97316" />
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: '0 0 16px 0'
                }}>
                  Subscription Funnel
                </h3>
                <div style={{
                  height: '300px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <PieChart size={48} color="#d1d5db" />
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: '16px 0 0 0'
                    }}>
                      Funnel analytics
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: '0 0 16px 0'
                }}>
                  Churn Analysis
                </h3>
                <div style={{
                  height: '300px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <BarChart3 size={48} color="#d1d5db" />
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: '16px 0 0 0'
                    }}>
                      Churn rate analysis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Report Categories */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <FileText size={24} color="#16a34a" />
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: 0
                  }}>
                    Subscription Reports
                  </h3>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  Monthly and annual subscription performance reports
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <DollarSign size={24} color="#3b82f6" />
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: 0
                  }}>
                    Revenue Reports
                  </h3>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  Detailed revenue breakdown and forecasting
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    backgroundColor: '#f3e8ff',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <Users size={24} color="#8b5cf6" />
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: 0
                  }}>
                    Customer Reports
                  </h3>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  Customer lifecycle and behavior analysis
                </p>
              </div>
            </div>

            {/* Recent Reports */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    Generated Reports
                  </h3>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    <Plus size={16} />
                    Generate Report
                  </button>
                </div>
              </div>
              
              <div style={{
                padding: '48px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <FileText size={48} color="#d1d5db" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#0f172a',
                  margin: '0 0 8px 0'
                }}>
                  No reports generated yet
                </h3>
                <p style={{
                  color: '#64748b',
                  margin: 0
                }}>
                  Generate your first subscription report to get started.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Transaction Filters */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: screenSize.isMobile ? 'column' : 'row',
                alignItems: screenSize.isMobile ? 'stretch' : 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: screenSize.isMobile ? 'column' : 'row',
                  gap: '16px',
                  flex: 1
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Transaction Type
                    </label>
                    <select
                      value={selectedTransactionType}
                      onChange={(e) => setSelectedTransactionType(e.target.value)}
                      style={{
                        width: '192px',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="all">All Types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Account
                    </label>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      style={{
                        width: '192px',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="all">All Accounts</option>
                      {selectedTransactionType !== 'all' && getAccountsByType(selectedTransactionType).map((account) => (
                        <option key={account.value} value={account.value}>
                          {account.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Period
                    </label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      style={{
                        width: '192px',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="current_month">Current Month</option>
                      <option value="last_month">Last Month</option>
                      <option value="current_quarter">Current Quarter</option>
                      <option value="last_quarter">Last Quarter</option>
                      <option value="current_year">Current Year</option>
                      <option value="last_year">Last Year</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '16px',
                      height: '16px',
                      color: '#9ca3af'
                    }} />
                    <input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        paddingLeft: '40px',
                        paddingRight: '16px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        width: '256px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Recent Transactions
                </h3>
                <button
                  onClick={() => setShowTransactionModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#f97316',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                  Add Transaction
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Date
                      </th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Type
                      </th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Description
                      </th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Account
                      </th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Category
                      </th>
                      <th style={{
                        textAlign: 'right',
                        padding: '12px 16px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Amount
                      </th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ borderCollapse: 'collapse' }}>
                    <tr style={{
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}>
                      <td style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        --
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#f8fafc',
                          color: '#374151',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          --
                        </span>
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        No transactions found
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        --
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        --
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#64748b'
                      }}>
                        --
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer'
                          }}>
                            <Eye size={16} color="#64748b" />
                          </button>
                          <button style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer'
                          }}>
                            <Edit size={16} color="#64748b" />
                          </button>
                          <button style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer'
                          }}>
                            <Trash2 size={16} color="#64748b" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add placeholder content for other tabs */}
        {activeTab === "accounting" && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '48px',
            textAlign: 'center'
          }}>
            <Calculator size={48} color="#d1d5db" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#0f172a',
              margin: '0 0 8px 0'
            }}>
              Accounting Module
            </h3>
            <p style={{
              color: '#64748b',
              margin: 0
            }}>
              Financial statements and accounting features will be available here.
            </p>
          </div>
        )}

        {activeTab === "cashflow" && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '48px',
            textAlign: 'center'
          }}>
            <TrendingUp size={48} color="#d1d5db" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#0f172a',
              margin: '0 0 8px 0'
            }}>
              Cash Flow Management
            </h3>
            <p style={{
              color: '#64748b',
              margin: 0
            }}>
              Cash flow analysis and forecasting tools will be available here.
            </p>
          </div>
        )}

        {activeTab === "revenue" && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '48px',
            textAlign: 'center'
          }}>
            <BarChart3 size={48} color="#d1d5db" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#0f172a',
              margin: '0 0 8px 0'
            }}>
              Revenue Analytics
            </h3>
            <p style={{
              color: '#64748b',
              margin: 0
            }}>
              Revenue tracking and forecasting features will be available here.
            </p>
          </div>
        )}

        {activeTab === "reports" && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '48px',
            textAlign: 'center'
          }}>
            <FileText size={48} color="#d1d5db" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#0f172a',
              margin: '0 0 8px 0'
            }}>
              Financial Reports
            </h3>
            <p style={{
              color: '#64748b',
              margin: 0
            }}>
              Comprehensive financial reporting tools will be available here.
            </p>
          </div>
        )}

        {activeTab === "approvals" && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '48px',
            textAlign: 'center'
          }}>
            <Shield size={48} color="#d1d5db" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#0f172a',
              margin: '0 0 8px 0'
            }}>
              Financial Approvals
            </h3>
            <p style={{
              color: '#64748b',
              margin: 0
            }}>
              Expense and financial approval workflows will be available here.
            </p>
          </div>
        )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '32rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0
              }}>
                Record New Transaction
              </h2>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Transaction Type
                  </label>
                  <select
                    value={transactionForm.type}
                    onChange={(e) => {
                      setTransactionForm({...transactionForm, type: e.target.value, account: '', category: ''})
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Account
                  </label>
                  <select
                    value={transactionForm.account}
                    onChange={(e) => {
                      setTransactionForm({...transactionForm, account: e.target.value, category: ''})
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select account</option>
                    {getAccountsByType(transactionForm.type).map((account) => (
                      <option key={account.value} value={account.value}>
                        {account.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Category
                  </label>
                  <select
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                    disabled={!transactionForm.account}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      opacity: !transactionForm.account ? 0.5 : 1
                    }}
                  >
                    <option value="">Select category</option>
                    {getCategoriesByAccount(transactionForm.account).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Description
                </label>
                <textarea
                  placeholder="Enter transaction description"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Reference
                  </label>
                  <input
                    type="text"
                    placeholder="Transaction reference"
                    value={transactionForm.reference}
                    onChange={(e) => setTransactionForm({...transactionForm, reference: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{
              padding: '24px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle transaction submission
                    console.log('Transaction submitted:', transactionForm)
                    setShowTransactionModal(false)
                    // Reset form
                    setTransactionForm({
                      type: 'expense',
                      date: new Date().toISOString().split('T')[0],
                      account: '',
                      category: '',
                      description: '',
                      amount: '',
                      reference: '',
                      tags: []
                    })
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Record Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Finance

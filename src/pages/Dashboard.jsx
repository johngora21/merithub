import { 
  Briefcase, 
  TrendingUp, 
  GraduationCap, 
  BookOpen,
  Activity,
  Target
} from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      name: 'Job Applications',
      value: '23',
      change: '+5 this week',
      changeType: 'increase',
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'Opportunities Saved',
      value: '12',
      change: '+3 new today',
      changeType: 'increase',
      icon: GraduationCap,
      color: 'text-primary-600 bg-primary-100'
    },
    {
      name: 'Courses Completed',
      value: '8',
      change: '+2 this month',
      changeType: 'increase',
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      name: 'Profile Views',
      value: '156',
      change: '+18% from last week',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100'
    }
  ]

  const recentActivity = [
    { id: 1, type: 'Job Application', description: 'Applied to Senior Developer at TechCorp', status: 'Submitted', time: '2 hours ago' },
    { id: 2, type: 'Course Progress', description: 'Completed Module 3 of Digital Marketing', status: 'Completed', time: '4 hours ago' },
    { id: 3, type: 'Opportunity Match', description: 'New scholarship opportunity matched your profile', status: 'New', time: '6 hours ago' },
    { id: 4, type: 'Profile Update', description: 'Profile viewed by HR Manager at InnovateLabs', status: 'Viewed', time: '8 hours ago' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100'
      case 'Submitted': return 'text-blue-600 bg-blue-100'
      case 'New': return 'text-purple-600 bg-purple-100'
      case 'Viewed': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="omify-card p-6 m-4">
        <h1 className="text-2xl font-semibold text-merit-gray-800">Welcome to Merit</h1>
        <p className="text-merit-gray-600 mt-2">Your Professional Growth Platform - Track your career journey</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="omify-card p-5 smooth-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-merit-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-merit-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-omify-small ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-merit-gray-500">{stat.change}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4">
        {/* Recent activity */}
        <div className="lg:col-span-2 omify-card overflow-hidden">
          <div className="p-5 border-b border-merit-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-merit-gray-800">Recent Activity</h2>
              <Activity className="h-5 w-5 text-merit-gray-500" />
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-merit-gray-50 rounded-omify-small smooth-hover">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </div>
                    <div>
                      <p className="font-semibold text-merit-gray-800">{activity.type}</p>
                      <p className="text-sm text-merit-gray-600">{activity.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-merit-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="omify-card overflow-hidden">
          <div className="p-5 border-b border-merit-gray-200">
            <h2 className="text-lg font-semibold text-merit-gray-800">Quick Actions</h2>
          </div>
          <div className="p-5 space-y-3">
            <button className="w-full text-left p-4 bg-merit-gray-50 rounded-omify-small hover:bg-merit-gray-100 smooth-hover">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-merit-gray-800">Find Jobs</p>
                  <p className="text-sm text-merit-gray-600">Search for your next career opportunity</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 bg-merit-gray-50 rounded-omify-small hover:bg-merit-gray-100 smooth-hover">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-merit-gray-800">Explore Opportunities</p>
                  <p className="text-sm text-merit-gray-600">Discover scholarships and fellowships</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 bg-merit-gray-50 rounded-omify-small hover:bg-merit-gray-100 smooth-hover">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-merit-gray-800">Take a Course</p>
                  <p className="text-sm text-merit-gray-600">Develop new skills and knowledge</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Opportunities from './pages/Opportunities'
import Tenders from './pages/Tenders'
import Courses from './pages/Courses'
import CareerTools from './pages/CareerTools'
import MyApplications from './pages/MyApplications'
import MyCourses from './pages/MyCourses'
import Subscriptions from './pages/Subscriptions'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/tenders" element={<Tenders />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/career-tools" element={<CareerTools />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

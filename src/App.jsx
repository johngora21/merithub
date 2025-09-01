import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Jobs from './pages/Jobs'
import Opportunities from './pages/Opportunities'
import Tenders from './pages/Tenders'
import Courses from './pages/Courses'
import CareerTools from './pages/CareerTools'
import TenderTools from './pages/TenderTools'
import MyApplications from './pages/MyApplications'
import MyCourses from './pages/MyCourses'
import Subscriptions from './pages/Subscriptions'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Bookmarks from './pages/Bookmarks'
import Post from './pages/Post'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Jobs />} />

          <Route path="/jobs" element={<Jobs />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/tenders" element={<Tenders />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/career-tools" element={<CareerTools />} />
          <Route path="/tender-tools" element={<TenderTools />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/post" element={<Post />} />
          

        </Routes>
      </Layout>
    </Router>
  )
}

export default App

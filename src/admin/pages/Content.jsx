import React, { useState, useEffect } from 'react'
import {
  Briefcase,
  FileText,
  GraduationCap,
  BookOpen,
  Users,
  UserCheck,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Star,
  Award,
  Download,
  Upload,
  Play,
  X
} from 'lucide-react'
import Post from '../../pages/Post'

const Content = () => {
  // Simple responsive detection
  const [screenSize] = useState({
    isMobile: window.innerWidth < 768,
    isDesktop: window.innerWidth >= 1024
  })

  // Responsive grid functions
  const getGridColumns = (screenSize) => {
    if (screenSize.isMobile) return 1
    if (screenSize.isDesktop) return 3
    return 2
  }

  const getGridGap = (screenSize) => {
    if (screenSize.isMobile) return '16px'
    return '20px'
  }

  const [activeTab, setActiveTab] = useState('jobs')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [showPostPage, setShowPostPage] = useState(false)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [courseFormData, setCourseFormData] = useState({
    type: 'video', // video, book, business-plan
    title: '',
    description: '',
    instructor: '',
    author: '',
    authorType: '',
    companyName: '',
    duration: '',
    language: 'English',
    category: '',
    level: 'Beginner',
    format: '',
    price: 'Free',
    rating: 5,
    enrolledStudents: 0,
    thumbnailUrl: '',
    videoUrl: '',
    downloadUrl: '',
    tags: [],
    customTag: '',
    businessType: '',
    industrySector: '',
    stage: '',
    pageCount: '',
    fileSize: '',
    targetAudience: '',
    documents: []
  })

  // Sample data - in real app this would come from API
  const contentData = {
    jobs: [
      {
        id: '1',
        company: 'TechCorp Solutions',
        industry: 'Technology',
        title: 'Senior Frontend Developer',
        location: 'San Francisco, CA',
        salary: '$120,000 - $160,000',
        type: 'Full-time',
        experience: '5+ years',
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        description: 'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building scalable web applications using modern technologies.',
        postedTime: '2 hours ago',
        applicants: 23,
        status: 'Active',
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop',
        responsibilities: [
          'Develop and maintain responsive web applications using React and TypeScript',
          'Collaborate with UX/UI designers to implement pixel-perfect designs',
          'Build reusable components and maintain component libraries',
          'Optimize applications for maximum speed and scalability',
          'Work with backend developers to integrate APIs and services',
          'Participate in code reviews and maintain coding standards',
          'Debug and troubleshoot technical issues across browsers',
          'Mentor junior developers and contribute to technical documentation'
        ],
        requirements: [
          '5+ years of experience with React and modern JavaScript',
          'Strong proficiency in TypeScript and ES6+',
          'Experience with state management (Redux, Context API)',
          'Knowledge of build tools (Webpack, Vite) and testing frameworks',
          'Familiarity with Node.js and RESTful API integration',
          'Experience with AWS services and cloud deployment',
          'Strong understanding of responsive design and CSS',
          'Excellent problem-solving and communication skills'
        ],
        companyInfo: {
          size: '200-500 employees',
          founded: '2018',
          funding: 'Series B',
          mission: 'Building innovative technology solutions that transform businesses'
        },
        benefits: ['Health Insurance', 'Remote Work', '401k Match', 'Stock Options']
      },
      {
        id: '2',
        company: 'InnovateTech',
        industry: 'Technology',
        title: 'Product Manager',
        location: 'New York, NY',
        salary: '$130,000 - $180,000',
        type: 'Full-time',
        experience: '7+ years',
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research'],
        description: 'Lead product development and strategy for our flagship platform. Drive innovation and user experience across all product lines.',
        postedTime: '1 day ago',
        applicants: 45,
        status: 'Active',
        logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=80&h=80&fit=crop',
        responsibilities: [
          'Define product vision, strategy, and roadmap',
          'Lead cross-functional teams in product development',
          'Conduct market research and competitive analysis',
          'Gather and prioritize product requirements',
          'Work closely with engineering, design, and marketing teams',
          'Analyze product metrics and user feedback',
          'Drive product launches and go-to-market strategies',
          'Manage stakeholder relationships and expectations'
        ],
        requirements: [
          '7+ years of product management experience',
          'Strong analytical and problem-solving skills',
          'Experience with Agile methodologies and tools',
          'Proven track record of successful product launches',
          'Excellent communication and leadership skills',
          'Experience with data analysis and user research',
          'Technical background or understanding preferred',
          'MBA or relevant advanced degree preferred'
        ],
        companyInfo: {
          size: '500-1000 employees',
          founded: '2015',
          funding: 'Series C',
          mission: 'Empowering businesses through innovative technology solutions'
        },
        benefits: ['Health Insurance', 'Stock Options', 'Flexible PTO', 'Professional Development']
      },
      {
        id: '3',
        company: 'Global Solutions Inc',
        industry: 'Consulting',
        title: 'Senior Consultant',
        location: 'Chicago, IL',
        salary: '$110,000 - $150,000',
        type: 'Full-time',
        experience: '6+ years',
        skills: ['Strategy', 'Business Analysis', 'Client Management', 'Project Management'],
        description: 'Provide strategic consulting services to Fortune 500 companies. Help organizations transform and achieve their business objectives.',
        postedTime: '3 days ago',
        applicants: 32,
        status: 'Active',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop',
        responsibilities: [
          'Lead client engagements and project delivery',
          'Develop strategic recommendations and implementation plans',
          'Conduct business analysis and process improvement',
          'Manage client relationships and stakeholder communication',
          'Mentor junior consultants and contribute to team development',
          'Develop thought leadership content and presentations',
          'Participate in business development and proposal writing',
          'Ensure high-quality deliverables and client satisfaction'
        ],
        requirements: [
          '6+ years of consulting experience with Fortune 500 clients',
          'Strong analytical and strategic thinking skills',
          'Excellent client relationship management abilities',
          'Experience in business transformation and change management',
          'Proven project management and team leadership skills',
          'Strong presentation and communication abilities',
          'MBA or relevant advanced degree required',
          'Willingness to travel up to 80%'
        ],
        companyInfo: {
          size: '1000-5000 employees',
          founded: '2010',
          funding: 'Private Equity',
          mission: 'Delivering exceptional value through strategic consulting and transformation services'
        },
        benefits: ['Health Insurance', 'Performance Bonus', 'Travel Allowance', 'Professional Development']
      },
      {
        id: '4',
        company: 'StartupXYZ',
        industry: 'Technology',
        title: 'Full Stack Developer',
        location: 'Austin, TX',
        salary: '$90,000 - $130,000',
        type: 'Full-time',
        experience: '3+ years',
        skills: ['JavaScript', 'Python', 'React', 'Node.js'],
        description: 'Join our fast-growing startup and build amazing products. Be part of a team that\'s changing the world through technology.',
        postedTime: '1 week ago',
        applicants: 67,
        status: 'Active',
        logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&h=80&fit=crop',
        responsibilities: [
          'Develop and maintain full-stack web applications',
          'Collaborate with product and design teams',
          'Write clean, maintainable, and scalable code',
          'Participate in code reviews and technical discussions',
          'Debug and fix issues across the application stack',
          'Contribute to technical architecture decisions',
          'Mentor junior developers and share knowledge',
          'Stay updated with latest technologies and best practices'
        ],
        requirements: [
          '3+ years of full-stack development experience',
          'Proficiency in JavaScript, Python, and modern frameworks',
          'Experience with React, Node.js, and database technologies',
          'Strong understanding of web technologies and APIs',
          'Experience with version control and deployment processes',
          'Knowledge of cloud platforms (AWS, GCP, or Azure)',
          'Strong problem-solving and debugging skills',
          'Ability to work in a fast-paced startup environment'
        ],
        companyInfo: {
          size: '50-200 employees',
          founded: '2020',
          funding: 'Series A',
          mission: 'Building innovative solutions that solve real-world problems'
        },
        benefits: ['Health Insurance', 'Stock Options', 'Remote Work', 'Flexible Hours']
      },
      {
        id: '5',
        company: 'Enterprise Corp',
        industry: 'Finance',
        title: 'Financial Analyst',
        location: 'Boston, MA',
        salary: '$85,000 - $120,000',
        type: 'Full-time',
        experience: '4+ years',
        skills: ['Financial Modeling', 'Excel', 'SQL', 'Risk Analysis'],
        description: 'Analyze financial data and provide insights for business decisions. Support strategic planning and investment analysis.',
        postedTime: '2 weeks ago',
        applicants: 28,
        status: 'Closed',
        logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=80&h=80&fit=crop',
        responsibilities: [
          'Develop and maintain financial models and forecasts',
          'Analyze financial performance and key metrics',
          'Prepare financial reports and presentations for stakeholders',
          'Conduct market research and competitive analysis',
          'Support budgeting and planning processes',
          'Perform risk assessment and scenario analysis',
          'Collaborate with cross-functional teams on financial projects',
          'Ensure compliance with financial regulations and standards'
        ],
        requirements: [
          '4+ years of financial analysis experience',
          'Strong proficiency in Excel, SQL, and financial modeling',
          'Experience with financial analysis and reporting tools',
          'Knowledge of accounting principles and financial statements',
          'Strong analytical and quantitative skills',
          'Experience in investment analysis or corporate finance',
          'CFA or CPA certification preferred',
          'Excellent communication and presentation skills'
        ],
        companyInfo: {
          size: '5000+ employees',
          founded: '1995',
          funding: 'Public Company',
          mission: 'Providing comprehensive financial services and solutions'
        },
        benefits: ['Health Insurance', '401k Match', 'Performance Bonus', 'Professional Development']
      }
    ],
    tenders: [
      {
        id: '1',
        organization: 'Government Procurement Agency',
        title: 'IT Infrastructure Upgrade Project',
        location: 'Nairobi, Kenya',
        value: '$500,000',
        deadline: '2024-02-15',
        category: 'Technology',
        description: 'Comprehensive IT infrastructure upgrade for government offices across multiple departments.',
        status: 'Open',
        postedTime: '3 days ago',
        logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=80&h=80&fit=crop',
        requirements: [
          'Proven experience in large-scale IT infrastructure projects',
          'Certified network and system administration expertise',
          'Experience with government procurement processes',
          'Strong project management and team leadership skills',
          'Knowledge of cybersecurity best practices',
          'Experience with cloud migration and hybrid solutions',
          'Excellent documentation and reporting abilities',
          'Local presence and understanding of government regulations'
        ],
        deliverables: [
          'Complete network infrastructure upgrade',
          'Server and storage system modernization',
          'Security system implementation',
          'User training and documentation',
          '24/7 support and maintenance plan',
          'Compliance and audit documentation'
        ],
        evaluationCriteria: [
          'Technical expertise and experience (40%)',
          'Project management approach (25%)',
          'Cost-effectiveness (20%)',
          'Timeline and delivery capability (15%)'
        ],
        contactInfo: {
          name: 'Procurement Officer',
          email: 'procurement@gov.ke',
          phone: '+254-20-1234567'
        }
      },
      {
        id: '2',
        organization: 'Ministry of Education',
        title: 'Digital Learning Platform Development',
        location: 'Mombasa, Kenya',
        value: '$300,000',
        deadline: '2024-03-01',
        category: 'Education',
        description: 'Development of a comprehensive digital learning platform for primary and secondary schools.',
        status: 'Open',
        postedTime: '1 week ago',
        logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=80&h=80&fit=crop',
        requirements: [
          'Experience in educational technology development',
          'Proficiency in modern web development frameworks',
          'Understanding of learning management systems',
          'Experience with mobile app development',
          'Knowledge of accessibility standards',
          'Experience with multi-language platform development',
          'Strong UI/UX design capabilities',
          'Experience with government education systems'
        ],
        deliverables: [
          'Web-based learning management system',
          'Mobile applications for iOS and Android',
          'Content management system for educators',
          'Student progress tracking and analytics',
          'Parent communication portal',
          'Administrative dashboard and reporting tools'
        ],
        evaluationCriteria: [
          'Technical solution quality (35%)',
          'Educational content integration (25%)',
          'User experience and accessibility (20%)',
          'Implementation timeline (20%)'
        ],
        contactInfo: {
          name: 'Education Technology Director',
          email: 'edutech@education.go.ke',
          phone: '+254-41-9876543'
        }
      },
      {
        id: '3',
        organization: 'Kenya Power and Lighting Company',
        title: 'Smart Grid Implementation Project',
        location: 'Nairobi, Kenya',
        value: '$2,500,000',
        deadline: '2024-04-15',
        category: 'Energy',
        description: 'Implementation of smart grid technology for improved power distribution and monitoring.',
        status: 'Open',
        postedTime: '2 weeks ago',
        logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=80&h=80&fit=crop',
        requirements: [
          'Extensive experience in smart grid technology',
          'Certified electrical engineering expertise',
          'Experience with IoT and sensor networks',
          'Knowledge of power distribution systems',
          'Experience with real-time monitoring systems',
          'Understanding of energy management software',
          'Project management certification preferred',
          'Experience in developing countries preferred'
        ],
        deliverables: [
          'Smart meter installation and integration',
          'Real-time monitoring and control systems',
          'Data analytics and reporting platform',
          'Customer portal for usage tracking',
          'Staff training and capacity building',
          'System maintenance and support plan'
        ],
        evaluationCriteria: [
          'Technical expertise and innovation (40%)',
          'Cost-effectiveness and ROI (30%)',
          'Implementation timeline (20%)',
          'Local capacity building (10%)'
        ],
        contactInfo: {
          name: 'Technical Procurement Manager',
          email: 'procurement@kplc.co.ke',
          phone: '+254-20-7654321'
        }
      }
    ],
    opportunities: [
      {
        id: '1',
        organization: 'African Development Bank',
        title: 'Youth Entrepreneurship Fellowship',
        location: 'Pan-African',
        type: 'Fellowship',
        duration: '12 months',
        value: '$25,000',
        description: 'Supporting young entrepreneurs across Africa with funding, mentorship, and business development resources.',
        deadline: '2024-02-28',
        status: 'Open',
        postedTime: '5 days ago',
        logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=80&fit=crop',
        eligibility: [
          'Age 18-35 years old',
          'Citizen of an African country',
          'Demonstrated entrepreneurial spirit',
          'Business idea or existing startup',
          'Commitment to social impact',
          'English or French proficiency',
          'No previous major funding received',
          'Willingness to participate in mentorship program'
        ],
        benefits: [
          '$25,000 seed funding',
          '12-month mentorship program',
          'Business development training',
          'Access to investor network',
          'Technical support and resources',
          'Regional networking opportunities',
          'Market access support',
          'Follow-up funding opportunities'
        ],
        applicationProcess: [
          'Online application submission',
          'Business plan development',
          'Video pitch submission',
          'Panel interview',
          'Final selection and onboarding'
        ],
        selectionCriteria: [
          'Innovation and creativity (30%)',
          'Market potential and scalability (25%)',
          'Social impact potential (20%)',
          'Team capabilities and commitment (15%)',
          'Financial sustainability (10%)'
        ]
      },
      {
        id: '2',
        organization: 'Google Africa',
        title: 'Google Developer Scholarship',
        location: 'Online',
        type: 'Scholarship',
        duration: '6 months',
        value: 'Full Tuition',
        description: 'Comprehensive training program for aspiring developers with hands-on projects and industry mentorship.',
        deadline: '2024-03-15',
        status: 'Open',
        postedTime: '2 weeks ago',
        logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=80&h=80&fit=crop',
        eligibility: [
          'Age 18+ years old',
          'Resident of an African country',
          'Basic computer literacy',
          'Interest in software development',
          'Commitment to complete 6-month program',
          'Access to stable internet connection',
          'No prior professional development experience required',
          'Willingness to learn and collaborate'
        ],
        benefits: [
          'Full tuition coverage',
          'Access to Google Cloud Platform credits',
          'Industry mentor assignment',
          'Project-based learning experience',
          'Career development workshops',
          'Networking with Google engineers',
          'Certificate upon completion',
          'Job placement assistance'
        ],
        curriculum: [
          'Programming fundamentals',
          'Web development (HTML, CSS, JavaScript)',
          'Backend development (Python, Node.js)',
          'Database design and management',
          'Cloud computing and deployment',
          'Mobile app development',
          'Software testing and debugging',
          'Professional development skills'
        ],
        selectionCriteria: [
          'Motivation and commitment (40%)',
          'Problem-solving abilities (30%)',
          'Communication skills (20%)',
          'Diversity and inclusion factors (10%)'
        ]
      },
      {
        id: '3',
        organization: 'Mastercard Foundation',
        title: 'Young Africa Works Innovation Fund',
        location: 'East Africa',
        type: 'Grant',
        duration: '18 months',
        value: '$50,000',
        description: 'Supporting innovative solutions that address youth employment challenges in East Africa.',
        deadline: '2024-04-30',
        status: 'Open',
        postedTime: '3 weeks ago',
        logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=80&h=80&fit=crop',
        eligibility: [
          'Youth-led organizations (18-35 years)',
          'Registered in East African countries',
          'Innovative solution for youth employment',
          'Demonstrated social impact',
          'Sustainable business model',
          'Team of at least 3 members',
          'Clear implementation plan',
          'Commitment to monitoring and evaluation'
        ],
        benefits: [
          '$50,000 grant funding',
          'Technical assistance and capacity building',
          'Mentorship from industry experts',
          'Access to Mastercard network',
          'Monitoring and evaluation support',
          'Knowledge sharing opportunities',
          'Scaling support for successful projects',
          'Recognition and visibility'
        ],
        focusAreas: [
          'Digital skills training and employment',
          'Agricultural innovation and value chains',
          'Creative industries and entrepreneurship',
          'Green economy and sustainability',
          'Healthcare and wellness solutions',
          'Education technology and access'
        ],
        selectionCriteria: [
          'Innovation and creativity (35%)',
          'Youth employment impact potential (30%)',
          'Sustainability and scalability (20%)',
          'Team capacity and commitment (15%)'
        ]
      }
    ],
    courses: [
      {
        id: '1',
        title: 'Complete React Developer Course',
        instructor: 'John Doe',
        type: 'video',
        duration: '15h 30m',
        level: 'Beginner',
        category: 'Programming',
        rating: 4.8,
        students: 1250,
        price: 'Free',
        description: 'Learn React from scratch with hands-on projects and real-world applications.',
        status: 'Published',
        postedTime: '1 week ago',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=80&h=80&fit=crop',
        language: 'English',
        format: 'Course',
        tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
        chapters: [
          'Introduction to React and JSX',
          'Components and Props',
          'State and Lifecycle',
          'Event Handling',
          'Conditional Rendering',
          'Lists and Keys',
          'Forms and Controlled Components',
          'Hooks (useState, useEffect)',
          'Context API',
          'Routing with React Router',
          'State Management with Redux',
          'Testing React Applications',
          'Deployment and Optimization'
        ],
        learningOutcomes: [
          'Build complete React applications from scratch',
          'Understand modern React patterns and best practices',
          'Implement state management solutions',
          'Deploy React applications to production',
          'Write tests for React components',
          'Optimize React applications for performance'
        ],
        prerequisites: [
          'Basic JavaScript knowledge',
          'Understanding of HTML and CSS',
          'Familiarity with ES6+ syntax',
          'Basic understanding of web development concepts'
        ],
        resources: [
          '15+ hours of video content',
          'Downloadable source code',
          'Practice exercises and projects',
          'Certificate of completion',
          'Lifetime access to updates'
        ]
      },
      {
        id: '2',
        title: 'Business Strategy Masterclass',
        author: 'Jane Smith',
        type: 'book',
        duration: '200 pages',
        level: 'Advanced',
        category: 'Business',
        rating: 4.6,
        students: 890,
        price: 'Pro',
        description: 'Comprehensive guide to business strategy and planning for executives and entrepreneurs.',
        status: 'Published',
        postedTime: '2 weeks ago',
        thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=80&h=80&fit=crop',
        language: 'English',
        format: 'PDF',
        authorType: 'Industry Expert',
        tags: ['Strategy', 'Business', 'Leadership', 'Management'],
        chapters: [
          'Strategic Thinking and Analysis',
          'Market Research and Competitive Intelligence',
          'Business Model Innovation',
          'Strategic Planning and Execution',
          'Organizational Design and Structure',
          'Change Management and Transformation',
          'Risk Management and Contingency Planning',
          'Performance Measurement and KPIs',
          'Strategic Communication and Stakeholder Management',
          'Future Trends and Strategic Adaptation'
        ],
        keyInsights: [
          'Framework for strategic decision-making',
          'Tools for competitive analysis',
          'Methods for business model innovation',
          'Approaches to organizational transformation',
          'Techniques for strategic communication',
          'Best practices for execution excellence'
        ],
        targetAudience: [
          'Senior executives and C-suite leaders',
          'Entrepreneurs and business owners',
          'Strategy consultants and advisors',
          'MBA students and business professionals',
          'Anyone interested in strategic management'
        ],
        resources: [
          '200-page comprehensive guide',
          'Strategic planning templates',
          'Case studies and examples',
          'Interactive exercises',
          'Executive summary and key takeaways'
        ]
      },
      {
        id: '3',
        title: 'E-commerce Startup Business Plan',
        author: 'Tech Ventures Inc',
        type: 'business-plan',
        duration: '50 pages',
        level: 'Intermediate',
        category: 'Business',
        rating: 4.7,
        students: 450,
        price: 'Pro',
        description: 'Complete business plan template for launching a successful e-commerce startup.',
        status: 'Published',
        postedTime: '3 weeks ago',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=80&h=80&fit=crop',
        language: 'English',
        format: 'PDF',
        businessType: 'E-commerce',
        industrySector: 'Retail',
        stage: 'Startup',
        tags: ['E-commerce', 'Business Plan', 'Startup', 'Retail'],
        sections: [
          'Executive Summary',
          'Market Analysis and Research',
          'Business Model and Revenue Streams',
          'Marketing and Sales Strategy',
          'Operations and Supply Chain',
          'Financial Projections and Funding',
          'Risk Analysis and Mitigation',
          'Implementation Timeline',
          'Appendices and Supporting Documents'
        ],
        financialProjections: [
          '3-year revenue forecasts',
          'Break-even analysis',
          'Cash flow projections',
          'Funding requirements',
          'ROI calculations',
          'Sensitivity analysis'
        ],
        marketResearch: [
          'Target market segmentation',
          'Competitive landscape analysis',
          'Customer behavior insights',
          'Market size and growth potential',
          'Pricing strategy recommendations',
          'Distribution channel analysis'
        ],
        implementationGuide: [
          'Step-by-step launch checklist',
          'Resource requirements and timeline',
          'Key performance indicators',
          'Risk management strategies',
          'Success metrics and milestones',
          'Scaling and growth plans'
        ]
      }
    ],
    applications: [
      {
        id: '1',
        applicant: 'John Smith',
        appliedFor: 'Senior Frontend Developer',
        type: 'Job',
        company: 'TechCorp Solutions',
        appliedDate: '2024-01-15',
        status: 'Under Review',
        email: 'john.smith@email.com'
      },
      {
        id: '2',
        applicant: 'Sarah Johnson',
        appliedFor: 'Youth Entrepreneurship Fellowship',
        type: 'Opportunity',
        company: 'African Development Bank',
        appliedDate: '2024-01-14',
        status: 'Shortlisted',
        email: 'sarah.johnson@email.com'
      }
    ]
  }

  // Show the course form with a slight delay for animation
  useEffect(() => {
    if (showCourseForm) {
      const timer = setTimeout(() => setShowForm(true), 100)
      return () => clearTimeout(timer)
    } else {
      setShowForm(false)
    }
  }, [showCourseForm])

  const handleCloseCourseForm = () => {
    setShowCourseForm(false)
    setShowForm(false)
    // Reset form data
    setCourseFormData({
      type: 'video',
      title: '',
      description: '',
      instructor: '',
      author: '',
      authorType: '',
      companyName: '',
      duration: '',
      language: 'English',
      category: '',
      level: 'Beginner',
      format: '',
      price: 'Free',
      rating: 5,
      enrolledStudents: 0,
      thumbnailUrl: '',
      videoUrl: '',
      downloadUrl: '',
      tags: [],
      customTag: '',
      businessType: '',
      industrySector: '',
      stage: '',
      pageCount: '',
      fileSize: '',
      targetAudience: '',
      documents: []
    })
  }

  const handleCourseFormSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting course:', courseFormData)
    // Here you would normally send the data to your API
    handleCloseCourseForm()
  }

  const handleCourseInputChange = (field, value) => {
    setCourseFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (courseFormData.customTag.trim() && !courseFormData.tags.includes(courseFormData.customTag.trim())) {
      setCourseFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.customTag.trim()],
        customTag: ''
      }))
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setCourseFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleCourseFileUpload = (files) => {
    const fileArray = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    
    setCourseFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...fileArray]
    }))
  }

  const removeCourseDocument = (documentId) => {
    setCourseFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }))
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type })
    setShowDetails(true)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'open':
      case 'published':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
          borderColor: '#bbf7d0'
        }
      case 'pending':
      case 'under review':
      case 'shortlisted':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderColor: '#fde68a'
        }
      case 'expired':
      case 'closed':
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db'
        }
      case 'rejected':
      case 'cancelled':
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderColor: '#fecaca'
        }
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db'
        }
    }
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

  const ContentTable = ({ type, data, columns }) => (
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
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: 0,
            textTransform: 'capitalize'
          }}>
            {type} Management
          </h3>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              width: '16px',
              height: '16px'
            }} />
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          {selectedItems.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <CheckCircle size={16} />
                Approve ({selectedItems.length})
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <XCircle size={16} />
                Reject ({selectedItems.length})
              </button>
            </div>
          )}
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
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(data.map(item => item.id))
                    } else {
                      setSelectedItems([])
                    }
                  }}
                />
              </th>
              {columns.map((column) => (
                <th key={column.key} style={{
                  textAlign: 'left',
                  padding: '12px 24px',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {column.label}
                </th>
              ))}
              <th style={{
                textAlign: 'right',
                padding: '12px 24px',
                fontWeight: '500',
                color: '#374151',
                fontSize: '14px'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  No {type} found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} style={{
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <td style={{ padding: '12px 24px' }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id])
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.id))
                        }
                      }}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} style={{
                      padding: '12px 24px',
                      fontSize: '14px',
                      color: '#0f172a'
                    }}>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  <td style={{
                    padding: '12px 24px',
                    textAlign: 'right'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px'
                    }}>
                      <button 
                        onClick={() => handleViewDetails(item, type)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6'
                          e.target.style.color = '#16a34a'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent'
                          e.target.style.color = '#6b7280'
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#6b7280',
                        cursor: 'pointer',
                        padding: '4px'
                      }}>
                        <Edit size={16} />
                      </button>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        padding: '4px'
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  const getTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <ContentTable
            type="jobs"
            data={contentData.jobs}
            columns={[
              { key: 'title', label: 'Job Title' },
              { key: 'company', label: 'Company' },
              { key: 'location', label: 'Location' },
              { 
                key: 'status', 
                label: 'Status',
                render: (item) => {
                  const statusStyle = getStatusColor(item.status)
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${statusStyle.borderColor}`,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color
                    }}>
                      {item.status}
                    </span>
                  )
                }
              },
              { 
                key: 'postedDate', 
                label: 'Posted Date',
                render: (item) => formatDate(item.postedDate)
              }
            ]}
          />
        )

      case 'tenders':
        return (
          <ContentTable
            type="tenders"
            data={contentData.tenders}
            columns={[
              { key: 'title', label: 'Tender Title' },
              { key: 'organization', label: 'Organization' },
              { key: 'category', label: 'Category' },
              { 
                key: 'status', 
                label: 'Status',
                render: (item) => {
                  const statusStyle = getStatusColor(item.status)
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${statusStyle.borderColor}`,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color
                    }}>
                      {item.status}
                    </span>
                  )
                }
              },
              { 
                key: 'deadline', 
                label: 'Deadline',
                render: (item) => formatDate(item.deadline)
              }
            ]}
          />
        )

      case 'opportunities':
        return (
          <ContentTable
            type="opportunities"
            data={contentData.opportunities}
            columns={[
              { key: 'title', label: 'Opportunity Title' },
              { key: 'type', label: 'Type' },
              { key: 'organization', label: 'Organization' },
              { 
                key: 'status', 
                label: 'Status',
                render: (item) => {
                  const statusStyle = getStatusColor(item.status)
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${statusStyle.borderColor}`,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color
                    }}>
                      {item.status}
                    </span>
                  )
                }
              },
              { 
                key: 'deadline', 
                label: 'Application Deadline',
                render: (item) => formatDate(item.deadline)
              }
            ]}
          />
        )

      case 'courses':
        return (
          <ContentTable
            type="courses"
            data={contentData.courses}
            columns={[
              { key: 'title', label: 'Course Title' },
              { key: 'category', label: 'Category' },
              { key: 'instructor', label: 'Instructor' },
              { key: 'duration', label: 'Duration' },
              { 
                key: 'status', 
                label: 'Status',
                render: (item) => {
                  const statusStyle = getStatusColor(item.status)
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${statusStyle.borderColor}`,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color
                    }}>
                      {item.status}
                    </span>
                  )
                }
              },
              { 
                key: 'enrollments', 
                label: 'Enrollments',
                render: (item) => item.enrollments || 0
              }
            ]}
          />
        )

      case 'applications':
        return (
          <ContentTable
            type="applications"
            data={contentData.applications}
            columns={[
              { key: 'applicant', label: 'Applicant' },
              { key: 'appliedFor', label: 'Applied For' },
              { key: 'type', label: 'Type' },
              { 
                key: 'status', 
                label: 'Status',
                render: (item) => {
                  const statusStyle = getStatusColor(item.status)
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${statusStyle.borderColor}`,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color
                    }}>
                      {item.status}
                    </span>
                  )
                }
              },
              { 
                key: 'appliedDate', 
                label: 'Applied Date',
                render: (item) => formatDate(item.appliedDate)
              }
            ]}
          />
        )



      default:
        return null
    }
  }

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: screenSize.isMobile ? '20px' : '32px'
    }}>
      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '12px',
        marginBottom: '20px' 
      }}>
        <button
          onClick={() => setShowCourseForm(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563eb'
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <BookOpen size={20} />
          Add Course
        </button>
        <button
          onClick={() => setShowPostPage(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ea580c'
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f97316'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Plus size={20} />
          Post
        </button>
      </div>

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
          <TabButton value="jobs" isActive={activeTab === "jobs"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={16} />
              Jobs
            </div>
          </TabButton>
          <TabButton value="tenders" isActive={activeTab === "tenders"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} />
              Tenders
            </div>
          </TabButton>
          <TabButton value="opportunities" isActive={activeTab === "opportunities"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={16} />
              Opportunities
            </div>
          </TabButton>
          <TabButton value="courses" isActive={activeTab === "courses"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} />
              Courses
            </div>
          </TabButton>
          <TabButton value="applications" isActive={activeTab === "applications"} onClick={setActiveTab}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} />
              Applications
            </div>
          </TabButton>

        </div>
      </div>

      {/* Content */}
      {showCourseForm ? null : (!showPostPage ? getTabContent() : <Post onClose={() => setShowPostPage(false)} />)}

      {/* Course Form Modal */}
      {showCourseForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: screenSize.isMobile ? 'flex-end' : 'center',
          justifyContent: screenSize.isMobile ? 'stretch' : 'center',
          transition: 'all 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: screenSize.isMobile ? '100%' : 'min(600px, 90vw)',
            maxHeight: screenSize.isMobile ? '90vh' : '90vh',
            borderRadius: screenSize.isMobile ? '20px 20px 0 0' : '16px',
            transform: showForm ? 'translateY(0)' : (screenSize.isMobile ? 'translateY(100%)' : 'scale(0.9)'),
            opacity: showForm ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            boxShadow: screenSize.isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: screenSize.isMobile ? '16px 12px 0 12px' : '24px 24px 0 24px',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '16px',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0
              }}>
                Add New Course
              </h2>
              
              <button
                onClick={handleCloseCourseForm}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '20px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            {/* Form Content */}
            <div style={{
              padding: screenSize.isMobile ? '16px 24px 90px 24px' : '32px 40px 90px 40px',
              flex: 1
            }}>
              <form onSubmit={handleCourseFormSubmit} style={{
                maxWidth: screenSize.isMobile ? '100%' : '520px',
                margin: '0 auto'
              }}>
                {/* Course Type */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Course Type *
                  </label>
                  <select
                    value={courseFormData.type}
                    onChange={(e) => handleCourseInputChange('type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="video">Video Course</option>
                    <option value="book">Book/eBook</option>
                    <option value="business-plan">Business Plan</option>
                  </select>
                </div>

                {/* Title */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.title}
                    onChange={(e) => handleCourseInputChange('title', e.target.value)}
                    placeholder={`Enter ${courseFormData.type === 'business-plan' ? 'business plan' : courseFormData.type} title...`}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Instructor/Author */}
                {courseFormData.type === 'video' ? (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Instructor *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseFormData.instructor}
                      onChange={(e) => handleCourseInputChange('instructor', e.target.value)}
                      placeholder="Enter instructor name..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                ) : courseFormData.type === 'book' ? (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Author *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseFormData.author}
                      onChange={(e) => handleCourseInputChange('author', e.target.value)}
                      placeholder="Enter author name..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseFormData.companyName}
                      onChange={(e) => handleCourseInputChange('companyName', e.target.value)}
                      placeholder="Enter company name..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                {/* Duration & Category */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                  gap: '12px', 
                  marginBottom: '16px' 
                }}>
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      value={courseFormData.duration}
                      onChange={(e) => handleCourseInputChange('duration', e.target.value)}
                      placeholder={courseFormData.type === 'video' ? "e.g., 5h 30m" : courseFormData.type === 'book' ? "e.g., 200 pages" : "e.g., 25 pages"}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Category *
                    </label>
                    <select
                      required
                      value={courseFormData.category}
                      onChange={(e) => handleCourseInputChange('category', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select category</option>
                      {courseFormData.type === 'video' ? (
                        <>
                          <option value="Business">Business</option>
                          <option value="Technology">Technology</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Finance">Finance</option>
                          <option value="Design">Design</option>
                          <option value="Health">Health</option>
                          <option value="Education">Education</option>
                          <option value="Personal Development">Personal Development</option>
                          <option value="Leadership">Leadership</option>
                          <option value="Entrepreneurship">Entrepreneurship</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Programming">Programming</option>
                          <option value="Photography">Photography</option>
                          <option value="Music">Music</option>
                          <option value="Art">Art</option>
                        </>
                      ) : courseFormData.type === 'book' ? (
                        <>
                          <option value="Business">Business</option>
                          <option value="Technology">Technology</option>
                          <option value="Self-Help">Self-Help</option>
                          <option value="Biography">Biography</option>
                          <option value="Finance">Finance</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Leadership">Leadership</option>
                          <option value="Health">Health</option>
                          <option value="Education">Education</option>
                          <option value="Fiction">Fiction</option>
                          <option value="Non-Fiction">Non-Fiction</option>
                          <option value="History">History</option>
                          <option value="Science">Science</option>
                          <option value="Philosophy">Philosophy</option>
                        </>
                      ) : (
                        <>
                          <option value="Technology">Technology</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Retail">Retail</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Real Estate">Real Estate</option>
                          <option value="Education">Education</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Energy">Energy</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Level & Language (for videos and books) */}
                {(courseFormData.type === 'video' || courseFormData.type === 'book') && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Level *
                      </label>
                      <select
                        required
                        value={courseFormData.level}
                        onChange={(e) => handleCourseInputChange('level', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Language *
                      </label>
                      <select
                        required
                        value={courseFormData.language}
                        onChange={(e) => handleCourseInputChange('language', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="English">English</option>
                        <option value="Swahili">Swahili</option>
                        <option value="Arabic">Arabic</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Italian">Italian</option>
                        <option value="Dutch">Dutch</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Author Type for books */}
                {courseFormData.type === 'book' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Author Type *
                    </label>
                    <select
                      required
                      value={courseFormData.authorType || ''}
                      onChange={(e) => handleCourseInputChange('authorType', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select author type</option>
                      <option value="Bestselling Author">Bestselling Author</option>
                      <option value="Industry Expert">Industry Expert</option>
                      <option value="Academic">Academic</option>
                      <option value="Entrepreneur">Entrepreneur</option>
                    </select>
                  </div>
                )}

                {/* Business Plan specific fields */}
                {courseFormData.type === 'business-plan' && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Business Type *
                      </label>
                      <select
                        required
                        value={courseFormData.businessType}
                        onChange={(e) => handleCourseInputChange('businessType', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">Select type</option>
                        <option value="Startup">Startup</option>
                        <option value="Small Business">Small Business</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Non-profit">Non-profit</option>
                        <option value="Franchise">Franchise</option>
                        <option value="Online Business">Online Business</option>
                      </select>
                    </div>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Stage *
                      </label>
                      <select
                        required
                        value={courseFormData.stage}
                        onChange={(e) => handleCourseInputChange('stage', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">Select stage</option>
                        <option value="Idea">Idea</option>
                        <option value="Planning">Planning</option>
                        <option value="Launch">Launch</option>
                        <option value="Growth">Growth</option>
                        <option value="Established">Established</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Format & Price */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr', 
                  gap: '12px', 
                  marginBottom: '16px' 
                }}>
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Format *
                    </label>
                    <select
                      required
                      value={courseFormData.format}
                      onChange={(e) => handleCourseInputChange('format', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select format</option>
                      {courseFormData.type === 'video' ? (
                        <>
                          <option value="Course">Course</option>
                          <option value="Tutorial">Tutorial</option>
                          <option value="Webinar">Webinar</option>
                          <option value="Documentary">Documentary</option>
                          <option value="Interview">Interview</option>
                          <option value="Workshop">Workshop</option>
                        </>
                      ) : courseFormData.type === 'book' ? (
                        <>
                          <option value="PDF">PDF</option>
                          <option value="EPUB">EPUB</option>
                          <option value="MOBI">MOBI</option>
                          <option value="Audiobook">Audiobook</option>
                          <option value="Physical">Physical</option>
                        </>
                      ) : (
                        <>
                          <option value="PDF">PDF Template</option>
                          <option value="Word">Word Document</option>
                          <option value="Interactive">Interactive Plan</option>
                          <option value="Editable">Editable Template</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Price *
                    </label>
                    <select
                      required
                      value={courseFormData.price}
                      onChange={(e) => handleCourseInputChange('price', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                                               <option value="Free">Free</option>
                         <option value="Pro">Pro</option>
                    </select>
                  </div>
                </div>

                

                {/* Description */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Description *
                  </label>
                  <textarea
                    required
                    value={courseFormData.description}
                    onChange={(e) => handleCourseInputChange('description', e.target.value)}
                    placeholder={`Describe what learners will gain from this ${courseFormData.type === 'business-plan' ? 'business plan' : courseFormData.type}...`}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                                     {/* File Uploads */}
                     <div style={{ marginBottom: '16px' }}>
                       <label style={{
                         fontSize: '14px',
                         fontWeight: '500',
                         color: '#374151',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         File Uploads
                       </label>
                       
                       {/* Thumbnail/Image Upload */}
                       <div style={{ marginBottom: '12px' }}>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#6b7280',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Thumbnail/Image *
                         </label>
                         <div style={{
                           border: '2px dashed #d1d5db',
                           borderRadius: '8px',
                           padding: '20px',
                           textAlign: 'center',
                           backgroundColor: '#f9fafb',
                           cursor: 'pointer',
                           transition: 'all 0.2s ease'
                         }}
                         onDragOver={(e) => {
                           e.preventDefault()
                           e.currentTarget.style.borderColor = '#16a34a'
                           e.currentTarget.style.backgroundColor = '#f0fdf4'
                         }}
                         onDragLeave={(e) => {
                           e.currentTarget.style.borderColor = '#d1d5db'
                           e.currentTarget.style.backgroundColor = '#f9fafb'
                         }}
                         onDrop={(e) => {
                           e.preventDefault()
                           const files = Array.from(e.dataTransfer.files)
                           if (files.length > 0) {
                             handleFileUpload('thumbnail', files[0])
                           }
                         }}
                         onClick={() => document.getElementById('thumbnail-upload').click()}
                         >
                           {courseFormData.thumbnailUrl ? (
                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                               <img 
                                 src={courseFormData.thumbnailUrl} 
                                 alt="Thumbnail" 
                                 style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                               />
                               <span style={{ fontSize: '14px', color: '#16a34a' }}>✓ Thumbnail uploaded</span>
                             </div>
                           ) : (
                             <div>
                               <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                               <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                 Click to upload or drag & drop
                               </div>
                               <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                 PNG, JPG, GIF up to 5MB
                               </div>
                             </div>
                           )}
                         </div>
                         <input
                           id="thumbnail-upload"
                           type="file"
                           accept="image/*"
                           style={{ display: 'none' }}
                           onChange={(e) => {
                             if (e.target.files.length > 0) {
                               handleFileUpload('thumbnail', e.target.files[0])
                             }
                           }}
                         />
                       </div>

                       {/* Video Upload (for video courses) */}
                       {courseFormData.type === 'video' && (
                         <div style={{ marginBottom: '12px' }}>
                           <label style={{
                             fontSize: '12px',
                             fontWeight: '500',
                             color: '#6b7280',
                             marginBottom: '4px',
                             display: 'block'
                           }}>
                             Video File *
                           </label>
                           <div style={{
                             border: '2px dashed #d1d5db',
                             borderRadius: '8px',
                             padding: '20px',
                             textAlign: 'center',
                             backgroundColor: '#f9fafb',
                             cursor: 'pointer',
                             transition: 'all 0.2s ease'
                           }}
                           onDragOver={(e) => {
                             e.preventDefault()
                             e.currentTarget.style.borderColor = '#16a34a'
                             e.currentTarget.style.backgroundColor = '#f0fdf4'
                           }}
                           onDragLeave={(e) => {
                             e.currentTarget.style.borderColor = '#d1d5db'
                             e.currentTarget.style.backgroundColor = '#f9fafb'
                           }}
                           onDrop={(e) => {
                             e.preventDefault()
                             const files = Array.from(e.dataTransfer.files)
                             if (files.length > 0) {
                               handleFileUpload('video', files[0])
                             }
                           }}
                           onClick={() => document.getElementById('video-upload').click()}
                           >
                             {courseFormData.videoUrl ? (
                               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                 <Play size={20} color="#16a34a" />
                                 <span style={{ fontSize: '14px', color: '#16a34a' }}>✓ Video uploaded</span>
                               </div>
                             ) : (
                               <div>
                                 <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                                 <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                   Click to upload or drag & drop
                                 </div>
                                 <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                   MP4, MOV, AVI up to 500MB
                                 </div>
                               </div>
                             )}
                           </div>
                           <input
                             id="video-upload"
                             type="file"
                             accept="video/*"
                             style={{ display: 'none' }}
                             onChange={(e) => {
                               if (e.target.files.length > 0) {
                                 handleFileUpload('video', e.target.files[0])
                               }
                             }}
                           />
                         </div>
                       )}

                       {/* Document Upload (for books and business plans) */}
                       {(courseFormData.type === 'book' || courseFormData.type === 'business-plan') && (
                         <div style={{ marginBottom: '12px' }}>
                           <label style={{
                             fontSize: '12px',
                             fontWeight: '500',
                             color: '#6b7280',
                             marginBottom: '4px',
                             display: 'block'
                           }}>
                             Document File *
                           </label>
                           <div style={{
                             border: '2px dashed #d1d5db',
                             borderRadius: '8px',
                             padding: '20px',
                             textAlign: 'center',
                             backgroundColor: '#f9fafb',
                             cursor: 'pointer',
                             transition: 'all 0.2s ease'
                           }}
                           onDragOver={(e) => {
                             e.preventDefault()
                             e.currentTarget.style.borderColor = '#16a34a'
                             e.currentTarget.style.backgroundColor = '#f0fdf4'
                           }}
                           onDragLeave={(e) => {
                             e.currentTarget.style.borderColor = '#d1d5db'
                             e.currentTarget.style.backgroundColor = '#f9fafb'
                           }}
                           onDrop={(e) => {
                             e.preventDefault()
                             const files = Array.from(e.dataTransfer.files)
                             if (files.length > 0) {
                               handleFileUpload('document', files[0])
                             }
                           }}
                           onClick={() => document.getElementById('document-upload').click()}
                           >
                             {courseFormData.downloadUrl ? (
                               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                 <FileText size={20} color="#16a34a" />
                                 <span style={{ fontSize: '14px', color: '#16a34a' }}>✓ Document uploaded</span>
                               </div>
                             ) : (
                               <div>
                                 <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                                 <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                   Click to upload or drag & drop
                                 </div>
                                 <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                   PDF, DOC, DOCX up to 50MB
                                 </div>
                               </div>
                             )}
                           </div>
                           <input
                             id="document-upload"
                             type="file"
                             accept=".pdf,.doc,.docx"
                             style={{ display: 'none' }}
                             onChange={(e) => {
                               if (e.target.files.length > 0) {
                                 handleFileUpload('document', e.target.files[0])
                               }
                             }}
                           />
                         </div>
                       )}

                       {/* Additional Documents */}
                       <div style={{ marginBottom: '12px' }}>
                         <label style={{
                           fontSize: '12px',
                           fontWeight: '500',
                           color: '#6b7280',
                           marginBottom: '4px',
                           display: 'block'
                         }}>
                           Additional Documents
                         </label>
                         <div style={{
                           border: '2px dashed #d1d5db',
                           borderRadius: '8px',
                           padding: '20px',
                           textAlign: 'center',
                           backgroundColor: '#f9fafb',
                           cursor: 'pointer',
                           transition: 'all 0.2s ease'
                         }}
                         onDragOver={(e) => {
                           e.preventDefault()
                           e.currentTarget.style.borderColor = '#16a34a'
                           e.currentTarget.style.backgroundColor = '#f0fdf4'
                         }}
                         onDragLeave={(e) => {
                           e.currentTarget.style.borderColor = '#d1d5db'
                           e.currentTarget.style.backgroundColor = '#f9fafb'
                         }}
                         onDrop={(e) => {
                           e.preventDefault()
                           const files = Array.from(e.dataTransfer.files)
                           files.forEach(file => handleAddDocument(file))
                         }}
                         onClick={() => document.getElementById('additional-docs-upload').click()}
                         >
                           <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                           <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                             Click to upload or drag & drop additional files
                           </div>
                           <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                             Any file type up to 20MB each
                           </div>
                         </div>
                         <input
                           id="additional-docs-upload"
                           type="file"
                           multiple
                           style={{ display: 'none' }}
                           onChange={(e) => {
                             Array.from(e.target.files).forEach(file => handleAddDocument(file))
                           }}
                         />
                         
                         {/* Display uploaded additional documents */}
                         {courseFormData.documents.length > 0 && (
                           <div style={{ marginTop: '12px' }}>
                             <div style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                               Uploaded Documents:
                             </div>
                             {courseFormData.documents.map((doc, index) => (
                               <div key={index} style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                                 padding: '8px 12px',
                                 backgroundColor: '#f3f4f6',
                                 borderRadius: '6px',
                                 marginBottom: '6px'
                               }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                   <FileText size={16} color="#6b7280" />
                                   <span style={{ fontSize: '14px', color: '#374151' }}>{doc.name}</span>
                                   <span style={{ fontSize: '12px', color: '#9ca3af' }}>({doc.size})</span>
                                 </div>
                                 <button
                                   type="button"
                                   onClick={() => handleRemoveDocument(index)}
                                   style={{
                                     background: 'none',
                                     border: 'none',
                                     cursor: 'pointer',
                                     padding: '4px',
                                     borderRadius: '4px',
                                     color: '#ef4444'
                                   }}
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                     </div>

                     {/* Tags */}
                     <div style={{ marginBottom: '16px' }}>
                       <label style={{
                         fontSize: '14px',
                         fontWeight: '500',
                         color: '#374151',
                         marginBottom: '6px',
                         display: 'block'
                       }}>
                         Tags
                       </label>
                       <div style={{
                         display: 'flex',
                         gap: '8px',
                         marginBottom: '8px'
                       }}>
                         <input
                           type="text"
                           value={courseFormData.customTag}
                           onChange={(e) => handleCourseInputChange('customTag', e.target.value)}
                           placeholder="Add a tag..."
                           style={{
                             flex: 1,
                             padding: '8px 12px',
                             border: '1px solid #e2e8f0',
                             borderRadius: '8px',
                             fontSize: '14px',
                             outline: 'none',
                             boxSizing: 'border-box'
                           }}
                           onKeyPress={(e) => {
                             if (e.key === 'Enter') {
                               e.preventDefault()
                               handleAddTag()
                             }
                           }}
                         />
                         <button
                           type="button"
                           onClick={handleAddTag}
                           style={{
                             padding: '8px 16px',
                             backgroundColor: '#f3f4f6',
                             color: '#374151',
                             border: '1px solid #e2e8f0',
                             borderRadius: '8px',
                             fontSize: '14px',
                             cursor: 'pointer'
                           }}
                         >
                           Add
                         </button>
                       </div>
                       {courseFormData.tags.length > 0 && (
                         <div style={{
                           display: 'flex',
                           flexWrap: 'wrap',
                           gap: '6px'
                         }}>
                           {courseFormData.tags.map((tag, index) => (
                             <span
                               key={index}
                               style={{
                                 backgroundColor: '#f1f5f9',
                                 color: '#475569',
                                 padding: '4px 8px',
                                 borderRadius: '6px',
                                 fontSize: '12px',
                                 fontWeight: '500',
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '4px'
                               }}
                             >
                               {tag}
                               <button
                                 type="button"
                                 onClick={() => handleRemoveTag(tag)}
                                 style={{
                                   background: 'none',
                                   border: 'none',
                                   cursor: 'pointer',
                                   padding: '0',
                                   display: 'flex',
                                   alignItems: 'center'
                                 }}
                               >
                                 <X size={12} color="#64748b" />
                               </button>
                             </span>
                           ))}
                         </div>
                       )}
                     </div>

                {/* Form Actions */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '32px'
                }}>
                  <button
                    type="button"
                    onClick={handleCloseCourseForm}
                    style={{
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Add {courseFormData.type === 'business-plan' ? 'Business Plan' : courseFormData.type}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Overview Modal */}
      {showDetails && selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: screenSize.isMobile ? 'flex-end' : 'center',
          justifyContent: screenSize.isMobile ? 'stretch' : 'center',
          transition: 'all 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: screenSize.isMobile ? '100%' : 'min(800px, 90vw)',
            maxHeight: screenSize.isMobile ? '90vh' : '90vh',
            borderRadius: screenSize.isMobile ? '20px 20px 0 0' : '16px',
            transform: 'translateY(0)',
            opacity: 1,
            transition: 'all 0.3s ease-in-out',
            boxShadow: screenSize.isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: screenSize.isMobile ? '16px 12px 0 12px' : '24px 24px 0 24px',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '16px',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0
              }}>
                {selectedItem.title || selectedItem.appliedFor || 'Details'}
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '20px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: screenSize.isMobile ? '16px 24px 90px 24px' : '32px 40px 90px 40px',
              flex: 1
            }}>
              {selectedItem.type === 'jobs' && (
                <div>
                  {/* Company Profile Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={selectedItem.logo} 
                      alt={selectedItem.company}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        objectFit: 'cover',
                        border: '2px solid #f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 4px 0'
                      }}>
                        {selectedItem.company}
                      </h3>
                      <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: '0 0 8px 0'
                      }}>
                        {selectedItem.title}
                      </h2>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span>{selectedItem.location}</span>
                        <span>•</span>
                        <span>{selectedItem.type}</span>
                        <span>•</span>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>{selectedItem.salary}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Overview */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Job Overview
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#374151',
                      margin: 0
                    }}>
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Key Responsibilities */}
                  {selectedItem.responsibilities && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Key Responsibilities
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.responsibilities.map((responsibility, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#16a34a',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>•</span>
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements & Qualifications */}
                  {selectedItem.requirements && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Requirements & Qualifications
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.requirements.map((requirement, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#16a34a',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>✓</span>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* About the Company */}
                  {selectedItem.companyInfo && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        About the Company
                      </h3>
                      <p style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#374151',
                        margin: '0 0 12px 0'
                      }}>
                        {selectedItem.companyInfo.mission}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span><strong>Size:</strong> {selectedItem.companyInfo.size}</span>
                        <span><strong>Founded:</strong> {selectedItem.companyInfo.founded}</span>
                        <span><strong>Stage:</strong> {selectedItem.companyInfo.funding}</span>
                      </div>
                    </div>
                  )}

                  {/* Required Skills */}
                  {selectedItem.skills && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Required Skills
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.skills.map((skill, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits & Perks */}
                  {selectedItem.benefits && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Benefits & Perks
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.benefits.map((benefit, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f0fdf4',
                            color: '#166534',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    marginTop: '24px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      <span><strong>Posted:</strong> {selectedItem.postedTime}</span>
                      <span><strong>Applicants:</strong> {selectedItem.applicants}</span>
                      <span><strong>Status:</strong> {selectedItem.status}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'tenders' && (
                <div>
                  {/* Organization Profile Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={selectedItem.logo} 
                      alt={selectedItem.organization}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        objectFit: 'cover',
                        border: '2px solid #f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 4px 0'
                      }}>
                        {selectedItem.organization}
                      </h3>
                      <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: '0 0 8px 0'
                      }}>
                        {selectedItem.title}
                      </h2>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span>{selectedItem.location}</span>
                        <span>•</span>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>{selectedItem.value}</span>
                        <span>•</span>
                        <span>{selectedItem.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Overview */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Project Overview
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#374151',
                      margin: 0
                    }}>
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Requirements */}
                  {selectedItem.requirements && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Requirements
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.requirements.map((requirement, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#16a34a',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>✓</span>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Deliverables */}
                  {selectedItem.deliverables && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Deliverables
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.deliverables.map((deliverable, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#16a34a',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>•</span>
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Evaluation Criteria */}
                  {selectedItem.evaluationCriteria && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Evaluation Criteria
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.evaluationCriteria.map((criteria, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {criteria}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {selectedItem.contactInfo && (
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      marginTop: '24px'
                    }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Contact Information
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span><strong>Contact:</strong> {selectedItem.contactInfo.name}</span>
                        <span><strong>Email:</strong> {selectedItem.contactInfo.email}</span>
                        <span><strong>Phone:</strong> {selectedItem.contactInfo.phone}</span>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    marginTop: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      <span><strong>Deadline:</strong> {selectedItem.deadline}</span>
                      <span><strong>Posted:</strong> {selectedItem.postedTime}</span>
                      <span><strong>Status:</strong> {selectedItem.status}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'opportunities' && (
                <div>
                  {/* Organization Profile Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={selectedItem.logo} 
                      alt={selectedItem.organization}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        objectFit: 'cover',
                        border: '2px solid #f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 4px 0'
                      }}>
                        {selectedItem.organization}
                      </h3>
                      <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: '0 0 8px 0'
                      }}>
                        {selectedItem.title}
                      </h2>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span>{selectedItem.location}</span>
                        <span>•</span>
                        <span>{selectedItem.type}</span>
                        <span>•</span>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>{selectedItem.value}</span>
                        <span>•</span>
                        <span>{selectedItem.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Opportunity Overview */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Opportunity Overview
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#374151',
                      margin: 0
                    }}>
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Eligibility */}
                  {selectedItem.eligibility && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Eligibility Requirements
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.eligibility.map((requirement, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#16a34a',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>✓</span>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Benefits */}
                  {selectedItem.benefits && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Benefits & Support
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.benefits.map((benefit, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#16a34a',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Application Process */}
                  {selectedItem.applicationProcess && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Application Process
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.applicationProcess.map((step, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              backgroundColor: '#16a34a',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '2px'
                            }}>
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Selection Criteria */}
                  {selectedItem.selectionCriteria && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Selection Criteria
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.selectionCriteria.map((criteria, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {criteria}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Focus Areas */}
                  {selectedItem.focusAreas && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Focus Areas
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.focusAreas.map((area, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f0fdf4',
                            color: '#166534',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    marginTop: '24px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      <span><strong>Deadline:</strong> {selectedItem.deadline}</span>
                      <span><strong>Posted:</strong> {selectedItem.postedTime}</span>
                      <span><strong>Status:</strong> {selectedItem.status}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'courses' && (
                <div>
                  {/* Course Profile Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={selectedItem.thumbnail} 
                      alt={selectedItem.title}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '2px solid #f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#64748b',
                        margin: '0 0 4px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {selectedItem.type === 'video' ? 'Video Course' : selectedItem.type === 'book' ? 'E-Book' : 'Business Plan'}
                      </h3>
                      <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: '0 0 8px 0'
                      }}>
                        {selectedItem.title}
                      </h2>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span>{selectedItem.instructor || selectedItem.author}</span>
                        <span>•</span>
                        <span>{selectedItem.category}</span>
                        <span>•</span>
                        <span>{selectedItem.level}</span>
                        <span>•</span>
                        <span style={{ color: selectedItem.price === 'Free' ? '#16a34a' : '#f59e0b', fontWeight: '600' }}>
                          {selectedItem.price}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginTop: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ color: '#f59e0b', fontSize: '16px' }}>★</span>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{selectedItem.rating}</span>
                        </div>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                          {selectedItem.students} students enrolled
                        </span>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                          {selectedItem.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course Overview */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Course Overview
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#374151',
                      margin: 0
                    }}>
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Chapters/Content Structure */}
                  {selectedItem.chapters && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Course Content
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.chapters.map((chapter, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              backgroundColor: '#16a34a',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '2px'
                            }}>
                              {index + 1}
                            </span>
                            {chapter}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learning Outcomes */}
                  {selectedItem.learningOutcomes && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        What You'll Learn
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.learningOutcomes.map((outcome, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#16a34a',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>✓</span>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {selectedItem.prerequisites && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Prerequisites
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.prerequisites.map((prerequisite, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#f59e0b',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>•</span>
                            {prerequisite}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Insights (for books) */}
                  {selectedItem.keyInsights && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Key Insights
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.keyInsights.map((insight, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#16a34a',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Target Audience (for books) */}
                  {selectedItem.targetAudience && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Target Audience
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.targetAudience.map((audience, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sections (for business plans) */}
                  {selectedItem.sections && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Business Plan Sections
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.sections.map((section, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              backgroundColor: '#16a34a',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '2px'
                            }}>
                              {index + 1}
                            </span>
                            {section}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Financial Projections (for business plans) */}
                  {selectedItem.financialProjections && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Financial Projections
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.financialProjections.map((projection, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f0fdf4',
                            color: '#166534',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {projection}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Market Research (for business plans) */}
                  {selectedItem.marketResearch && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Market Research Included
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.marketResearch.map((research, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {research}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {selectedItem.resources && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Included Resources
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {selectedItem.resources.map((resource, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151'
                          }}>
                            <span style={{
                              color: '#16a34a',
                              fontSize: '16px',
                              lineHeight: '1',
                              marginTop: '2px'
                            }}>•</span>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedItem.tags && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0'
                      }}>
                        Tags
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {selectedItem.tags.map((tag, index) => (
                          <span key={index} style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    marginTop: '24px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      <span><strong>Posted:</strong> {selectedItem.postedTime}</span>
                      <span><strong>Status:</strong> {selectedItem.status}</span>
                      {selectedItem.language && <span><strong>Language:</strong> {selectedItem.language}</span>}
                      {selectedItem.format && <span><strong>Format:</strong> {selectedItem.format}</span>}
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'applications' && (
                <div>
                  {/* Profile Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <img 
                      src={selectedItem.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'} 
                      alt={selectedItem.applicant}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '40px',
                        objectFit: 'cover',
                        border: '3px solid #f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: '0 0 8px 0'
                      }}>
                        {selectedItem.applicant}
                      </h2>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#64748b',
                        margin: '0 0 12px 0'
                      }}>
                        {selectedItem.appliedFor} at {selectedItem.company}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <span>📍 {selectedItem.location || 'Nairobi, Kenya'}</span>
                        <span>📧 {selectedItem.email}</span>
                        <span>📱 {selectedItem.phone || '+254 700 000 000'}</span>
                        <span>🌐 {selectedItem.website || 'portfolio.com'}</span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '8px'
                    }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        ...getStatusColor(selectedItem.status)
                      }}>
                        {selectedItem.status}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        Applied {selectedItem.appliedDate}
                      </span>
                    </div>
                  </div>

                  {/* Profile Completion */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#166534'
                      }}>
                        Profile Completion
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#166534'
                      }}>
                        {selectedItem.profileCompletion || '85%'}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#dcfce7',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: selectedItem.profileCompletion || '85%',
                        height: '100%',
                        backgroundColor: '#16a34a',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  {/* About Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      About
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#374151',
                      margin: 0
                    }}>
                      {selectedItem.about || 'Experienced software developer with 5+ years of expertise in frontend development, specializing in React, TypeScript, and modern web technologies. Passionate about creating user-friendly applications and contributing to innovative projects.'}
                    </p>
                  </div>

                  {/* Skills Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Skills
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {(selectedItem.skills || ['React', 'TypeScript', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'Git', 'AWS']).map((skill, index) => (
                        <span key={index} style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Experience
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(selectedItem.experience || [
                        {
                          title: 'Senior Frontend Developer',
                          company: 'TechCorp Solutions',
                          duration: '2022 - Present',
                          description: 'Led development of multiple React applications, mentored junior developers, and implemented best practices for code quality and performance.'
                        },
                        {
                          title: 'Frontend Developer',
                          company: 'Digital Innovations Ltd',
                          duration: '2020 - 2022',
                          description: 'Developed responsive web applications using React and TypeScript, collaborated with design and backend teams.'
                        }
                      ]).map((exp, index) => (
                        <div key={index} style={{
                          padding: '16px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <h4 style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a1a1a',
                              margin: 0
                            }}>
                              {exp.title}
                            </h4>
                            <span style={{
                              fontSize: '14px',
                              color: '#64748b',
                              fontWeight: '500'
                            }}>
                              {exp.duration}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#16a34a',
                            margin: '0 0 8px 0'
                          }}>
                            {exp.company}
                          </p>
                          <p style={{
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#374151',
                            margin: 0
                          }}>
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Education
                    </h3>
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: 0
                        }}>
                          {selectedItem.education?.degree || 'Bachelor of Science in Computer Science'}
                        </h4>
                        <span style={{
                          fontSize: '14px',
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          {selectedItem.education?.duration || '2016 - 2020'}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#16a34a',
                        margin: '0 0 8px 0'
                      }}>
                        {selectedItem.education?.institution || 'University of Nairobi'}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: '#374151',
                        margin: 0
                      }}>
                        {selectedItem.education?.description || 'Graduated with First Class Honours. Specialized in Software Engineering and Web Development.'}
                      </p>
                    </div>
                  </div>

                  {/* Certificates Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Certificates
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(selectedItem.certificates || [
                        {
                          name: 'React Developer Certification',
                          issuer: 'Meta',
                          date: '2023',
                          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=60&h=60&fit=crop'
                        },
                        {
                          name: 'AWS Certified Developer',
                          issuer: 'Amazon Web Services',
                          date: '2022',
                          image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=60&h=60&fit=crop'
                        }
                      ]).map((cert, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <img 
                            src={cert.image} 
                            alt={cert.name}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1a1a1a',
                              margin: '0 0 4px 0'
                            }}>
                              {cert.name}
                            </h4>
                            <p style={{
                              fontSize: '12px',
                              color: '#64748b',
                              margin: 0
                            }}>
                              {cert.issuer} • {cert.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Documents
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(selectedItem.documents || [
                        {
                          name: 'Resume.pdf',
                          type: 'Resume',
                          size: '2.4 MB',
                          date: '2024-01-15'
                        },
                        {
                          name: 'Cover Letter.pdf',
                          type: 'Cover Letter',
                          size: '1.2 MB',
                          date: '2024-01-15'
                        },
                        {
                          name: 'Portfolio.pdf',
                          type: 'Portfolio',
                          size: '5.8 MB',
                          date: '2024-01-10'
                        }
                      ]).map((doc, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span style={{ fontSize: '16px', color: '#64748b' }}>📄</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1a1a1a',
                              margin: '0 0 4px 0'
                            }}>
                              {doc.name}
                            </h4>
                            <p style={{
                              fontSize: '12px',
                              color: '#64748b',
                              margin: 0
                            }}>
                              {doc.type} • {doc.size} • {doc.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Application Timeline */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Application Timeline
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#16a34a'
                        }} />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          Application submitted on {selectedItem.appliedDate}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#f59e0b'
                        }} />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          Application under review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Content

import React, { useState, useEffect } from 'react'
import { FileText, Download, Upload, Edit3, Eye, Plus, Save, X } from 'lucide-react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { apiService, resolveAssetUrl } from '../lib/api-service'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const CareerTools = () => {
  const screenSize = useResponsive()
  const [activeTab, setActiveTab] = useState('cv-builder')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [templateFilter, setTemplateFilter] = useState('all')
  const [resumeJson, setResumeJson] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [templateData, setTemplateData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [previewDocument, setPreviewDocument] = useState(null)

  const tabs = [
    { id: 'cv-builder', name: 'CV Builder' },
    { id: 'templates', name: 'Templates' },
    { id: 'my-documents', name: 'My Documents' }
  ]

  const [cvTemplates, setCvTemplates] = useState([])
  const [myDocuments, setMyDocuments] = useState([])
  const [loading, setLoading] = useState(false)

  // Built-in professional templates catalog
  const professionalTemplates = [
    {
      id: 'classic-black', type: 'resume', name: 'Classic Professional', category: 'Corporate', accent: '#111827', layout: 'two-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'boxed',
      content: {
        name: 'Alex Johnson', title: 'Senior Product Manager',
        profilePhoto: 'https://i.pravatar.cc/100?img=11',
        contact: ['alex@example.com', 'San Francisco, CA', 'linkedin.com/in/alex'],
        profile: 'Product leader with 7+ years delivering B2B SaaS growth.',
        skills: ['Roadmapping', 'A/B Testing', 'Stakeholder Management', 'SQL', 'User Research', 'Pricing', 'Data Analysis', 'Cross-functional Leadership', 'Product Strategy', 'Customer Discovery'],
        experience: [
          { role: 'Senior Product Manager', company: 'Acme Corp', dates: '2021 – Present', bullets: ['Led pricing revamp increasing ARR by 18% within 2 quarters.', 'Scaled experimentation program to 4 squads, +22% activation.', 'Managed $2M product budget and 12-person cross-functional team.'] },
          { role: 'Product Manager', company: 'BetaSoft', dates: '2018 – 2021', bullets: ['Launched 3 features used by 40k MAU.', 'Reduced churn by 3.4% via onboarding improvements.', 'Led customer research with 200+ interviews across 5 markets.'] },
          { role: 'Associate Product Manager', company: 'GammaTech', dates: '2016 – 2018', bullets: ['Built mobile app from 0 to 10k users in 6 months.', 'Implemented analytics dashboard used by entire product team.', 'Collaborated with engineering to reduce bug reports by 40%.'] }
        ],
        projects: [
          'Self-serve onboarding funnel overhaul (+14% conversion).',
          'Pricing experiment platform (revenue +18% YoY).',
          'Activation playbook and KPI framework across 4 squads.',
          'Customer segmentation model (improved targeting by 25%).',
          'Product roadmap automation tool (saved 8 hours/week).'
        ],
        certifications: [
          'Pragmatic Institute PMC®',
          'AIPMM Certified Product Manager (CPM)',
          'Google Analytics Certified',
          'AWS Cloud Practitioner'
        ],
        education: [
          { degree: 'MBA — Product Management', school: 'Berkeley Haas', dates: '2018 – 2020' },
          { degree: 'B.Sc. Business Administration', school: 'UCLA', dates: '2014 – 2018' },
          { degree: 'Certificate in Data Science', school: 'Stanford Online', dates: '2022' }
        ],
        awards: ['Product Manager of the Year 2022', 'Innovation Award Q3 2021', 'Customer Impact Award 2020'],
        languages: ['English (Fluent)', 'Spanish (Conversational)', 'French (Basic)']
      }
    },
    {
      id: 'modern-blue', type: 'resume', name: 'Modern Blue', category: 'Technology', accent: '#2563eb', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'full', pages: 2, variant: 'sidebar',
      content: {
        name: 'Jamie Lee', title: 'Software Engineer',
        profilePhoto: 'https://i.pravatar.cc/100?img=12',
        contact: ['jamie@example.com', 'New York, NY', 'github.com/jamie'],
        profile: 'Full‑stack engineer focused on reliability and DX.',
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Kubernetes', 'Docker', 'AWS', 'GraphQL', 'Redis', 'Microservices'],
        experience: [
          { role: 'Senior Engineer', company: 'Nimbus', dates: '2022 – Present', bullets: ['Cut p95 latency 42% by introducing streaming and caching.', 'Drove migration to TypeScript across 25 repos.', 'Led architecture decisions for microservices migration.'] },
          { role: 'Software Engineer', company: 'Stackly', dates: '2019 – 2022', bullets: ['Built internal UI library used by 10+ teams.', 'Owned auth and RBAC.', 'Implemented CI/CD pipeline reducing deployment time by 60%.'] },
          { role: 'Junior Developer', company: 'TechStart', dates: '2017 – 2019', bullets: ['Developed REST APIs serving 1M+ requests daily.', 'Built automated testing suite with 90% code coverage.', 'Mentored 2 junior developers and conducted code reviews.'] }
        ],
        projects: [
          'Internal UI library (adopted by 10+ teams).',
          'Observability stack (Prometheus/Grafana) reducing MTTR 35%.',
          'CI pipeline with caching (build time −40%).',
          'Real-time chat application with WebSocket integration.',
          'Open-source contribution to React ecosystem (500+ stars).'
        ],
        certifications: [
          'AWS Solutions Architect Associate',
          'CKA — Certified Kubernetes Administrator',
          'Google Cloud Professional Developer',
          'MongoDB Certified Developer'
        ],
        education: [
          { degree: 'M.Sc. Computer Science', school: 'UT Austin', dates: '2019 – 2021' },
          { degree: 'B.Sc. Computer Science', school: 'UT Austin', dates: '2015 – 2019' },
          { degree: 'Certificate in Cloud Architecture', school: 'AWS Training', dates: '2022' }
        ],
        awards: ['Engineering Excellence Award 2023', 'Innovation Award Q2 2022', 'Mentor of the Year 2021'],
        languages: ['English (Native)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'elegant-green', type: 'cv', name: 'Elegant Green', category: 'Research', accent: '#16a34a', layout: 'single-column',
      accentStyle: 'border', headerStyle: 'full', pages: 2, variant: 'serif',
      content: {
        name: 'Dr. Priya Kapoor', title: 'Research Lead',
        profilePhoto: 'https://i.pravatar.cc/100?img=13',
        contact: ['priya@example.com', 'Boston, MA', 'orcid.org/0000-0002'],
        profile: 'Applied AI researcher with focus on NLP for healthcare.',
        skills: ['NLP', 'Causal Inference', 'R', 'Python', 'Clinical Data', 'Machine Learning', 'Statistics', 'TensorFlow', 'PyTorch', 'SQL'],
        publications: ['Kapoor P. et al. (2023) Clinical BERT for triage prediction. JAMIA.', 'Kapoor P. et al. (2022) Bias reduction in EHR models. Nature Med.', 'Kapoor P. et al. (2021) Transfer learning in EHR. AMIA.', 'Kapoor P. et al. (2020) Multi-modal fusion for diagnosis. IEEE TMI.'],
        experience: [
          { role: 'Research Lead', company: 'MedAI Lab', dates: '2020 – Present', bullets: ['Managed 8 researchers; secured $2.1M in grants.', 'Published 6 peer‑reviewed papers.', 'Led clinical trial data analysis for FDA submission.'] },
          { role: 'Postdoctoral Researcher', company: 'MIT CSAIL', dates: '2018 – 2020', bullets: ['Developed novel NLP models for medical text processing.', 'Collaborated with 3 hospitals on real-world validation studies.', 'Presented findings at 5 international conferences.'] },
          { role: 'Research Assistant', company: 'Stanford AI Lab', dates: '2016 – 2018', bullets: ['Contributed to 3 major research projects in healthcare AI.', 'Co-authored 4 papers in top-tier venues.', 'Mentored 2 undergraduate research assistants.'] }
        ],
        awards: ['Best Paper (JAMIA 2023)', 'Young Researcher Award 2022', 'Innovation in Healthcare AI 2021'],
        education: [
          { degree: 'Ph.D. Biomedical Informatics', school: 'Harvard University', dates: '2016 – 2020' },
          { degree: 'M.Sc. Computer Science', school: 'IIT Delhi', dates: '2014 – 2016' },
          { degree: 'B.Tech. Computer Science', school: 'IIT Delhi', dates: '2010 – 2014' }
        ],
        languages: ['English (Fluent)', 'Hindi (Fluent)']
      }
    },
    {
      id: 'crisp-teal', type: 'resume', name: 'Crisp Teal', category: 'Product', accent: '#0d9488', layout: 'single-column',
      accentStyle: 'right', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: {
        name: 'Rosa Martínez', title: 'Product Designer',
        profilePhoto: 'https://i.pravatar.cc/100?img=14',
        contact: ['rosa@example.com', 'Remote', 'behance.net/rosam'],
        profile: 'Designer crafting accessible experiences at scale.',
        skills: ['Figma', 'Accessibility', 'Design Systems', 'User Research', 'Prototyping', 'Design Thinking', 'Usability Testing', 'Sketch', 'Adobe Creative Suite', 'HTML/CSS'],
        experience: [ 
          { role: 'Senior Product Designer', company: 'Orbit', dates: '2021 – Present', bullets: ['Shipped design system v2; reduced delivery time 30%.', 'Led research with 40+ users.', 'Mentored 3 junior designers and established design processes.'] },
          { role: 'Product Designer', company: 'DesignCo', dates: '2019 – 2021', bullets: ['Designed mobile app used by 100k+ users.', 'Conducted usability testing sessions with 50+ participants.', 'Collaborated with PM and engineering on feature specifications.'] },
          { role: 'UX Designer', company: 'StartupXYZ', dates: '2017 – 2019', bullets: ['Created wireframes and prototypes for web platform.', 'Established user research methodology from scratch.', 'Improved conversion rates by 25% through design iterations.'] }
        ],
        projects: ['Design System v2 (token-based, 30% faster delivery).', 'Accessibility audit and remediation (WCAG 2.1 AA compliance).', 'User onboarding flow redesign (+40% completion rate).', 'Mobile app redesign (increased user engagement by 35%).', 'Design token system implementation across 5 product teams.'],
        education: [
          { degree: 'BFA Graphic Design', school: 'RISD', dates: '2013 – 2017' },
          { degree: 'Certificate in UX Design', school: 'General Assembly', dates: '2016' },
          { degree: 'Certificate in Accessibility', school: 'Deque University', dates: '2022' }
        ],
        certifications: ['Certified Usability Analyst (CUA)', 'Google UX Design Certificate', 'Adobe Certified Expert'],
        awards: ['Design Excellence Award 2023', 'Innovation in UX 2022', 'Best Mobile Design 2021'],
        languages: ['English (Fluent)', 'Spanish (Native)', 'Portuguese (Conversational)']
      }
    },
    {
      id: 'refined-purple', type: 'cv', name: 'Refined Purple', category: 'Academia', accent: '#7c3aed', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'full', pages: 2, variant: 'timeline',
      content: {
        name: 'Chen Wei', title: 'Assistant Professor of Marketing',
        profilePhoto: 'https://i.pravatar.cc/100?img=15',
        contact: ['chen@example.com', 'Chicago, IL', 'Google Scholar: Chen Wei'],
        profile: 'Researcher in digital advertising and attribution modeling.',
        skills: ['Econometrics', 'Python', 'R', 'SQL', 'Experiment Design', 'Machine Learning', 'Statistics', 'Stata', 'Tableau', 'Academic Writing'],
        publications: ['Wei C. (2024) MMM under platform privacy. JMR.', 'Wei C. et al. (2023) Causal inference in digital advertising. Marketing Science.', 'Wei C. et al. (2022) Privacy-preserving attribution modeling. Journal of Marketing Research.'],
        experience: [ 
          { role: 'Assistant Professor', company: 'UChicago', dates: '2022 – Present', bullets: ['Taught 4 courses, avg. rating 4.8/5.', 'Published 3 papers in top-tier marketing journals.', 'Secured $500K in research funding from NSF.'] },
          { role: 'Postdoctoral Researcher', company: 'Wharton', dates: '2020 – 2022', bullets: ['Conducted field experiments with Fortune 500 companies.', 'Co-authored 2 papers published in Journal of Marketing Research.', 'Presented research at 8 international conferences.'] },
          { role: 'Research Assistant', company: 'MIT Sloan', dates: '2018 – 2020', bullets: ['Assisted with data collection for 3 major research projects.', 'Developed econometric models for causal inference.', 'Co-authored 1 paper in Marketing Science.'] }
        ],
        awards: ["Dean's Teaching Award 2023", 'Best Paper Award (Marketing Science 2022)', 'Young Scholar Award (American Marketing Association 2021)'],
        education: [
          { degree: 'Ph.D. Marketing', school: 'Wharton', dates: '2017 – 2022' },
          { degree: 'M.Sc. Economics', school: 'LSE', dates: '2015 – 2017' },
          { degree: 'B.A. Economics', school: 'Peking University', dates: '2011 – 2015' }
        ],
        languages: ['English (Fluent)', 'Mandarin (Native)']
      }
    },
    {
      id: 'minimal-slate', type: 'resume', name: 'Minimal Slate', category: 'Finance', accent: '#475569', layout: 'two-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'icons',
      content: {
        name: 'Samir Patel', title: 'Financial Analyst',
        contact: ['samir@example.com', 'Dallas, TX', 'linkedin.com/in/samir'],
        profile: 'Analyst specializing in FP&A and SaaS metrics.',
        skills: ['Excel', 'SQL', 'Looker', 'Cohort Analysis', 'Forecasting', 'Python', 'Tableau', 'Financial Modeling', 'VBA', 'Power BI'],
        experience: [ 
          { role: 'FP&A Analyst', company: 'Finify', dates: '2020 – Present', bullets: ['Built forecasting model, variance <3%.', 'Led annual budgeting process for $50M revenue company.', 'Created monthly board reporting package used by C-suite.'] },
          { role: 'Financial Analyst', company: 'TechCorp', dates: '2018 – 2020', bullets: ['Developed KPI dashboard tracking 20+ metrics.', 'Conducted variance analysis saving $2M annually.', 'Supported M&A due diligence for 3 acquisitions.'] },
          { role: 'Junior Analyst', company: 'Investment Bank', dates: '2016 – 2018', bullets: ['Prepared pitch books for $100M+ deals.', 'Built DCF models for valuation analysis.', 'Assisted with IPO preparation and roadshow materials.'] }
        ],
        certifications: ['CFA Level II Candidate', 'FMVA® (Financial Modeling & Valuation Analyst)', 'CPA (In Progress)', 'Tableau Desktop Specialist'],
        education: [
          { degree: 'B.Com. Finance', school: 'UT Dallas', dates: '2016 – 2020' },
          { degree: 'Certificate in Financial Modeling', school: 'Wall Street Prep', dates: '2018' },
          { degree: 'Advanced Excel Certification', school: 'Microsoft', dates: '2019' }
        ],
        projects: ['Rolling 13-week cashflow model (used company-wide).', 'Cohort analysis framework (improved retention by 15%).', 'Automated monthly reporting (saved 20 hours/week).', 'Investment thesis for $10M Series A funding round.'],
        awards: ['Analyst of the Year 2023', 'Innovation in Financial Modeling 2022'],
        languages: ['English (Fluent)', 'Hindi (Native)', 'Spanish (Basic)']
      }
    },
    {
      id: 'bold-red', type: 'resume', name: 'Bold Red', category: 'Operations', accent: '#dc2626', layout: 'single-column',
      accentStyle: 'border', headerStyle: 'full', pages: 1, variant: 'boxed',
      content: {
        name: 'Emily Clark', title: 'Operations Manager',
        profilePhoto: 'https://i.pravatar.cc/100?img=16',
        contact: ['emily@example.com', 'Seattle, WA', 'emilyclark.me'],
        profile: 'Ops leader improving throughput and margins.',
        skills: ['Lean', 'Six Sigma', 'Supply Chain', 'SQL', 'Process Improvement', 'Project Management', 'Data Analysis', 'Vendor Management', 'Quality Control', 'Cost Reduction'],
        experience: [ 
          { role: 'Operations Manager', company: 'ShipRight', dates: '2019 – Present', bullets: ['Reduced defect rate 28%.', 'Led team of 15 operations specialists across 3 facilities.', 'Implemented lean manufacturing saving $2M annually.'] },
          { role: 'Senior Operations Analyst', company: 'LogiCorp', dates: '2017 – 2019', bullets: ['Optimized warehouse layout increasing efficiency by 35%.', 'Developed KPI dashboard used by entire operations team.', 'Managed vendor relationships reducing costs by 20%.'] },
          { role: 'Operations Coordinator', company: 'FastTrack', dates: '2015 – 2017', bullets: ['Coordinated daily operations for 5 distribution centers.', 'Implemented quality control processes reducing errors by 40%.', 'Trained 20+ staff on new operational procedures.'] }
        ],
        education: [
          { degree: 'B.Sc. Industrial Engineering', school: 'UW', dates: '2013 – 2017' },
          { degree: 'Certificate in Lean Six Sigma', school: 'ASQ', dates: '2018' },
          { degree: 'Project Management Professional (PMP)', school: 'PMI', dates: '2020' }
        ],
        projects: ['Lean transformation roadmap (saved $2M annually).', 'Supplier performance dashboard (improved on-time delivery by 25%).', 'Quality control automation system (reduced manual checks by 60%).', 'Inventory optimization model (reduced carrying costs by 30%).'],
        certifications: ['Lean Six Sigma Black Belt', 'Certified Supply Chain Professional (CSCP)', 'ISO 9001 Lead Auditor'],
        awards: ['Operations Excellence Award 2023', 'Cost Reduction Champion 2022', 'Process Improvement Leader 2021'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    // Additional templates to reach 20
    {
      id: 'datasci-emerald', type: 'cv', name: 'Data Scientist CV', category: 'Data', accent: '#059669', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'icons',
      content: {
        name: 'Noah Kim', title: 'Senior Data Scientist', profilePhoto: 'https://i.pravatar.cc/100?img=17',
        contact: ['noah@example.com', 'Austin, TX', 'kaggle.com/noah'],
        profile: 'ML practitioner with production experience in forecasting and NLP.',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Airflow', 'Spark', 'SQL', 'Machine Learning', 'Statistics', 'Pandas', 'Scikit-learn', 'Docker'],
        experience: [ 
          { role: 'Senior DS', company: 'Forecastly', dates: '2020 – Present', bullets: ['Deployed LSTM models cutting stockouts 19%.', 'Built MLOps pipelines with Airflow.', 'Led ML team of 5 data scientists and engineers.'] },
          { role: 'Data Scientist', company: 'TechStart', dates: '2018 – 2020', bullets: ['Developed recommendation system increasing engagement by 40%.', 'Built ETL pipelines processing 100GB+ data daily.', 'Created automated reporting dashboard used by C-suite.'] },
          { role: 'Junior Data Scientist', company: 'Analytics Inc', dates: '2016 – 2018', bullets: ['Performed statistical analysis for 10+ client projects.', 'Built predictive models for customer lifetime value.', 'Collaborated with engineering team on model deployment.'] }
        ],
        projects: ['NLP classifier for support tickets (90% F1).', 'Customer segmentation using clustering (K-means).', 'Time series forecasting for demand planning.', 'Real-time fraud detection system (reduced false positives by 30%).', 'A/B testing framework for product experiments.'],
        publications: ['Kim N. (2022) Demand Forecasting at Scale. KDD.', 'Kim N. et al. (2021) Deep Learning for Time Series. ICML.', 'Kim N. et al. (2020) MLOps Best Practices. NeurIPS.'],
        education: [
          { degree: 'M.Sc. Data Science', school: 'CMU', dates: '2018 – 2020' },
          { degree: 'B.Sc. Mathematics', school: 'MIT', dates: '2014 – 2018' },
          { degree: 'Certificate in Deep Learning', school: 'Coursera', dates: '2021' }
        ],
        languages: ['English (Fluent)', 'Korean (Native)', 'Japanese (Basic)'],
        certifications: ['AWS Certified Machine Learning Specialty', 'Google Cloud Professional Data Engineer', 'Certified Analytics Professional (CAP)'],
        awards: ['Data Scientist of the Year 2023', 'Best ML Model Award 2022', 'Innovation in Analytics 2021']
      }
    },
    {
      id: 'sales-gold', type: 'resume', name: 'Sales Manager', category: 'Sales', accent: '#d97706', layout: 'two-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: {
        name: 'Tanya Brooks', title: 'Sales Manager', profilePhoto: 'https://i.pravatar.cc/100?img=18',
        contact: ['tanya@example.com', 'Chicago, IL', 'linkedin.com/in/tanyab'],
        profile: 'Quota-crushing sales leader with team coaching focus.',
        skills: ['Enterprise Sales', 'Forecasting', 'MEDDIC', 'CRM', 'Hiring', 'Negotiation', 'Pipeline Management', 'Team Leadership', 'Customer Success', 'Revenue Growth'],
        experience: [ 
          { role: 'Sales Manager', company: 'PipeWell', dates: '2019 – Present', bullets: ['125% average quota attainment, 12 reps.', 'Expanded to 3 new territories.', 'Built sales process increasing close rate by 35%.'] },
          { role: 'Senior Account Executive', company: 'CloudTech', dates: '2017 – 2019', bullets: ['Exceeded quota by 40% for 2 consecutive years.', 'Closed 15+ enterprise deals worth $2M+ ARR.', 'Mentored 3 junior AEs and improved their performance by 50%.'] },
          { role: 'Account Executive', company: 'SaaS Solutions', dates: '2015 – 2017', bullets: ['Generated $1.5M in new revenue in first year.', 'Built strong relationships with 50+ enterprise clients.', 'Developed territory strategy that became company standard.'] }
        ],
        awards: ["President's Club 2021, 2022", 'Top Performer Q3 2020', 'Rookie of the Year 2015'],
        education: [
          { degree: 'B.A. Communications', school: 'UIUC', dates: '2012 – 2016' },
          { degree: 'Certificate in Sales Management', school: 'Salesforce', dates: '2018' },
          { degree: 'MEDDIC Masterclass', school: 'Force Management', dates: '2019' }
        ],
        projects: ['Sales enablement platform implementation (increased productivity by 25%).', 'Customer success program (reduced churn by 20%).', 'Territory expansion strategy (added $5M in pipeline).', 'Sales training curriculum (improved team performance by 30%).'],
        certifications: ['Certified Sales Professional (CSP)', 'HubSpot Sales Software Certification', 'Salesforce Certified Administrator'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'devops-navy', type: 'resume', name: 'DevOps Engineer', category: 'Technology', accent: '#0ea5e9', layout: 'two-column',
      accentStyle: 'border', headerStyle: 'bar', pages: 1, variant: 'sidebar',
      content: {
        name: 'Lucas Nguyen', title: 'DevOps Engineer',
        contact: ['lucas@example.com', 'Remote', 'github.com/lucasn'],
        profile: 'Automating CI/CD and cloud infra to boost delivery.',
        skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Prometheus', 'Jenkins', 'GitLab CI', 'Ansible', 'Grafana', 'ELK Stack'],
        experience: [ 
          { role: 'DevOps Engineer', company: 'Cloudforge', dates: '2020 – Present', bullets: ['Cut deploy time from 30m to 5m.', 'Reduced infra cost 18%.', 'Led migration to Kubernetes serving 50+ microservices.'] },
          { role: 'Site Reliability Engineer', company: 'TechCorp', dates: '2018 – 2020', bullets: ['Improved system uptime from 99.5% to 99.9%.', 'Built monitoring dashboards used by entire engineering team.', 'Automated incident response reducing MTTR by 40%.'] },
          { role: 'Cloud Engineer', company: 'StartupXYZ', dates: '2016 – 2018', bullets: ['Designed and implemented AWS infrastructure from scratch.', 'Set up CI/CD pipelines for 10+ applications.', 'Mentored 2 junior engineers on cloud best practices.'] }
        ],
        certifications: ['CKA', 'AWS SysOps', 'Terraform Associate', 'Docker Certified Associate', 'Google Cloud Professional DevOps Engineer'],
        education: [
          { degree: 'B.Sc. Information Systems', school: 'UW', dates: '2014 – 2018' },
          { degree: 'Certificate in Cloud Architecture', school: 'AWS Training', dates: '2019' },
          { degree: 'Linux Administration Certification', school: 'Red Hat', dates: '2020' }
        ],
        projects: ['Infrastructure as Code migration (Terraform + Ansible).', 'Kubernetes cluster optimization (reduced costs by 25%).', 'Monitoring and alerting system implementation.', 'Disaster recovery automation (RTO reduced by 60%).', 'Security scanning pipeline integration.'],
        awards: ['DevOps Excellence Award 2023', 'Infrastructure Innovation 2022', 'Reliability Champion 2021'],
        languages: ['English (Fluent)', 'Vietnamese (Native)']
      }
    },
    {
      id: 'nurse-soft', type: 'cv', name: 'Registered Nurse CV', category: 'Healthcare', accent: '#0891b2', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'timeline',
      content: {
        name: 'Ava Thompson', title: 'Registered Nurse', profilePhoto: 'https://i.pravatar.cc/100?img=19',
        contact: ['ava@example.com', 'Denver, CO', 'NPI 1234567890'],
        profile: 'RN with ICU experience and patient-centric care.',
        skills: ['ICU', 'Patient Care', 'EMR', 'Medication Admin', 'Triage', 'Critical Care', 'Ventilator Management', 'IV Therapy', 'Patient Assessment', 'Emergency Response'],
        experience: [ 
          { role: 'ICU Nurse', company: 'St. Mary Hospital', dates: '2019 – Present', bullets: ['Managed 3-4 critical patients per shift.', 'Trained 8 new nurses.', 'Implemented evidence-based protocols reducing infection rates by 30%.'] },
          { role: 'Medical-Surgical Nurse', company: 'Denver General', dates: '2017 – 2019', bullets: ['Cared for 5-6 patients per shift on med-surg unit.', 'Collaborated with interdisciplinary team on patient care plans.', 'Maintained 100% medication administration accuracy.'] },
          { role: 'Nursing Assistant', company: 'Sunrise Care Center', dates: '2015 – 2017', bullets: ['Provided basic patient care and assistance with ADLs.', 'Documented patient status and vital signs.', 'Assisted with patient transfers and mobility exercises.'] }
        ],
        certifications: ['BLS', 'ACLS', 'PALS', 'CCRN', 'NIH Stroke Scale'],
        education: [
          { degree: 'BSN Nursing', school: 'CU Anschutz', dates: '2015 – 2019' },
          { degree: 'Certificate in Critical Care', school: 'AACN', dates: '2020' },
          { degree: 'Associate Degree Nursing', school: 'Community College', dates: '2013 – 2015' }
        ],
        languages: ['English (Fluent)', 'Spanish (Conversational)'],
        projects: ['ICU quality improvement initiative (reduced patient falls by 40%).', 'Nursing education program for new graduates.', 'Patient safety protocol development and implementation.', 'Electronic health record optimization project.'],
        awards: ['Nurse of the Year 2023', 'Excellence in Patient Care 2022', 'Clinical Excellence Award 2021'],
        publications: ['Thompson A. (2022) Evidence-based practices in ICU care. Journal of Critical Care Nursing.']
      }
    },
    {
      id: 'teacher-sky', type: 'cv', name: 'Teacher CV', category: 'Education', accent: '#0284c7', layout: 'single-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: {
        name: 'Grace Allen', title: 'High School Teacher',
        contact: ['grace@example.com', 'Portland, OR', 'grace-allen.edu'],
        profile: 'STEM educator with curriculum design expertise.',
        skills: ['Curriculum', 'Assessment', 'EdTech', 'Differentiation', 'Classroom Management', 'Student Engagement', 'Technology Integration', 'Data Analysis', 'Parent Communication', 'Professional Development'],
        experience: [ 
          { role: 'Teacher', company: 'Lincoln High School', dates: '2017 – Present', bullets: ['Improved AP pass rate from 62% to 82%.', 'Developed innovative STEM curriculum used by 5 schools.', 'Mentored 3 new teachers and improved their classroom effectiveness.'] },
          { role: 'Student Teacher', company: 'Roosevelt Middle School', dates: '2016 – 2017', bullets: ['Taught 6th grade mathematics to 120+ students.', 'Implemented differentiated instruction strategies.', 'Collaborated with mentor teacher on lesson planning and assessment.'] },
          { role: 'Tutor', company: 'Learning Center', dates: '2014 – 2016', bullets: ['Provided one-on-one tutoring in math and science.', 'Helped 50+ students improve their grades by at least one letter.', 'Developed personalized learning plans for struggling students.'] }
        ],
        awards: ['Teacher of the Year 2022', 'Innovation in Education Award 2021', 'Excellence in STEM Teaching 2020'],
        education: [
          { degree: 'M.Ed. Education', school: 'UO', dates: '2015 – 2017' },
          { degree: 'B.S. Mathematics', school: 'UO', dates: '2011 – 2015' },
          { degree: 'Teaching Certificate', school: 'Oregon TSPC', dates: '2017' }
        ],
        projects: ['STEM curriculum development for underserved schools.', 'Digital learning platform implementation (increased engagement by 40%).', 'Student mentorship program (improved graduation rates by 15%).', 'Professional development workshop series for fellow teachers.'],
        certifications: ['Google Certified Educator Level 2', 'Microsoft Innovative Educator', 'National Board Certification (In Progress)'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'lawyer-ink', type: 'cv', name: 'Attorney CV', category: 'Legal', accent: '#334155', layout: 'single-column',
      accentStyle: 'border', headerStyle: 'bar', pages: 1, variant: 'icons',
      content: {
        name: 'Marcus Reed', title: 'Attorney at Law',
        contact: ['marcus@example.com', 'Atlanta, GA', 'State Bar #12345'],
        profile: 'Litigation specialist with trial and arbitration experience.',
        skills: ['Litigation', 'Contracts', 'Negotiation', 'Discovery', 'Trial Advocacy', 'Legal Research', 'Client Counseling', 'Mediation', 'Corporate Law', 'Regulatory Compliance'],
        experience: [ 
          { role: 'Associate Attorney', company: 'Reed & Co', dates: '2018 – Present', bullets: ['Second-chaired 5 jury trials.', 'Won 80% of motions.', 'Managed caseload of 25+ active matters worth $2M+ in damages.'] },
          { role: 'Law Clerk', company: 'Fulton County Superior Court', dates: '2017 – 2018', bullets: ['Researched and drafted judicial opinions for civil cases.', 'Assisted with case management and court proceedings.', 'Analyzed complex legal issues and provided recommendations.'] },
          { role: 'Summer Associate', company: 'BigLaw Firm', dates: '2016 – 2017', bullets: ['Conducted legal research for corporate transactions.', 'Drafted contracts and legal memoranda.', 'Participated in client meetings and case strategy sessions.'] }
        ],
        publications: ['Reed M. (2021) Arbitration Trends. GA Bar Journal.', 'Reed M. (2020) Contract Law Updates. Legal Review.', 'Reed M. (2019) Litigation Strategies in Commercial Disputes. Trial Lawyer.'],
        education: [
          { degree: 'J.D.', school: 'Emory Law', dates: '2015 – 2018' },
          { degree: 'B.A. Political Science', school: 'UGA', dates: '2011 – 2015' },
          { degree: 'Certificate in Alternative Dispute Resolution', school: 'Emory Law', dates: '2018' }
        ],
        projects: ['Pro bono legal clinic for small business owners.', 'Legal education workshop series for community organizations.', 'Contract template library for startup companies.', 'Mediation training program for local attorneys.'],
        certifications: ['State Bar of Georgia (2018)', 'Certified Mediator', 'Notary Public'],
        awards: ['Rising Star Attorney 2023', 'Pro Bono Service Award 2022', 'Excellence in Litigation 2021'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'civil-struct', type: 'cv', name: 'Civil Engineer CV', category: 'Engineering', accent: '#16a34a', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'sidebar',
      content: {
        name: 'Elena Petrova', title: 'Structural Engineer', profilePhoto: 'https://i.pravatar.cc/100?img=20',
        contact: ['elena@example.com', 'Houston, TX', 'PE License'],
        profile: 'Structural design and seismic retrofitting specialist.',
        skills: ['SAP2000', 'AutoCAD', 'ETABS', 'Seismic', 'Revit', 'STAAD.Pro', 'RISA-3D', 'Concrete Design', 'Steel Design', 'Foundation Design'],
        experience: [ 
          { role: 'Structural Engineer', company: 'BuildMax', dates: '2017 – Present', bullets: ['Designed 20+ mid-rise structures.', 'Seismic retrofit for hospital.', 'Led design team for $50M commercial development project.'] },
          { role: 'Junior Structural Engineer', company: 'Design Associates', dates: '2015 – 2017', bullets: ['Designed residential and small commercial structures.', 'Performed structural analysis and calculations.', 'Collaborated with architects on design coordination.'] },
          { role: 'Engineering Intern', company: 'City Public Works', dates: '2014 – 2015', bullets: ['Assisted with bridge inspection and maintenance projects.', 'Drafted engineering drawings and specifications.', 'Participated in field surveys and data collection.'] }
        ],
        certifications: ['PE (Texas)', 'SE (Structural Engineer)', 'LEED Green Associate', 'OSHA 30-Hour Construction Safety'],
        education: [
          { degree: 'M.Eng. Civil Engineering', school: 'UT Austin', dates: '2015 – 2017' },
          { degree: 'B.S. Civil Engineering', school: 'UT Austin', dates: '2011 – 2015' },
          { degree: 'Certificate in Seismic Design', school: 'ASCE', dates: '2018' }
        ],
        projects: ['High-rise office building structural design (40 stories).', 'Seismic retrofit of historic courthouse building.', 'Bridge rehabilitation project (increased load capacity by 50%).', 'Green building certification for LEED Platinum project.'],
        awards: ['Outstanding Young Engineer 2023', 'Excellence in Structural Design 2022', 'Innovation in Engineering 2021'],
        languages: ['English (Fluent)', 'Russian (Native)', 'Spanish (Basic)']
      }
    },
    {
      id: 'marketing-coral', type: 'resume', name: 'Marketing Manager', category: 'Marketing', accent: '#db2777', layout: 'two-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: {
        name: 'Sophia Turner', title: 'Marketing Manager', profilePhoto: 'https://i.pravatar.cc/100?img=21',
        contact: ['sophia@example.com', 'Los Angeles, CA', 'sophiaturner.me'],
        profile: 'Story-driven marketer scaling demand gen programs.',
        skills: ['Demand Gen', 'SEO', 'Content', 'Paid Media', 'HubSpot', 'Marketing Automation', 'Analytics', 'Social Media', 'Email Marketing', 'Campaign Management'],
        experience: [ 
          { role: 'Marketing Manager', company: 'Wave', dates: '2020 – Present', bullets: ['Grew MQLs 45% YoY.', 'Led team of 4 marketing specialists and 2 agencies.', 'Launched 3 successful product campaigns generating $2M+ revenue.'] },
          { role: 'Senior Marketing Coordinator', company: 'TechStart', dates: '2018 – 2020', bullets: ['Managed $500K annual marketing budget across 5 channels.', 'Developed content strategy increasing organic traffic by 60%.', 'Coordinated 12+ industry events and trade shows.'] },
          { role: 'Marketing Coordinator', company: 'Digital Agency', dates: '2016 – 2018', bullets: ['Executed paid media campaigns for 10+ B2B clients.', 'Created social media content reaching 100K+ followers.', 'Analyzed campaign performance and provided optimization recommendations.'] }
        ],
        projects: ['ABM program targeting 200 accounts.', 'Content marketing strategy (increased leads by 80%).', 'Marketing automation workflow (improved conversion by 25%).', 'Brand refresh campaign (increased brand awareness by 40%).', 'Customer advocacy program (generated 50+ case studies).'],
        certifications: ['Google Analytics IQ', 'HubSpot Content Marketing Certification', 'Facebook Blueprint', 'Google Ads Certification'],
        education: [
          { degree: 'B.A. Marketing', school: 'USC', dates: '2012 – 2016' },
          { degree: 'Certificate in Digital Marketing', school: 'Google', dates: '2017' },
          { degree: 'MBA (In Progress)', school: 'UCLA', dates: '2022 – Present' }
        ],
        awards: ['Marketer of the Year 2023', 'Best Campaign Award 2022', 'Innovation in Marketing 2021'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'hr-olive', type: 'resume', name: 'HR Specialist', category: 'HR', accent: '#65a30d', layout: 'two-column',
      accentStyle: 'border', headerStyle: 'bar', pages: 1, variant: 'sidebar',
      content: {
        name: 'Omar Hassan', title: 'HR Specialist',
        contact: ['omar@example.com', 'Remote', 'linkedin.com/in/omarh'],
        profile: 'Partnering with teams to recruit and retain top talent.',
        skills: ['Recruiting', 'Onboarding', 'L&D', 'HRIS', 'Policy', 'Employee Relations', 'Performance Management', 'Compensation', 'Benefits Administration', 'Compliance'],
        experience: [ 
          { role: 'HR Specialist', company: 'PeopleOps', dates: '2019 – Present', bullets: ['Reduced time-to-hire 25%.', 'Managed full-cycle recruitment for 50+ positions annually.', 'Developed onboarding program improving new hire retention by 30%.'] },
          { role: 'HR Coordinator', company: 'TechCorp', dates: '2017 – 2019', bullets: ['Coordinated employee benefits enrollment for 200+ employees.', 'Maintained HRIS database ensuring 99% data accuracy.', 'Assisted with performance review process and documentation.'] },
          { role: 'Recruiting Assistant', company: 'Staffing Agency', dates: '2015 – 2017', bullets: ['Screened 500+ resumes and conducted initial phone interviews.', 'Coordinated interview schedules for hiring managers.', 'Maintained candidate database and tracking system.'] }
        ],
        education: [
          { degree: 'BBA HR Management', school: 'UMN', dates: '2014 – 2018' },
          { degree: 'Certificate in Human Resources', school: 'SHRM', dates: '2019' },
          { degree: 'Certificate in Talent Acquisition', school: 'LinkedIn Learning', dates: '2020' }
        ],
        projects: ['Employee engagement survey implementation (increased satisfaction by 20%).', 'Diversity and inclusion initiative (improved representation by 15%).', 'HR policy manual update and digital transformation.', 'Mentorship program development for new employees.'],
        certifications: ['SHRM-CP', 'PHR (Professional in Human Resources)', 'LinkedIn Recruiter Certification'],
        awards: ['HR Excellence Award 2023', 'Recruiting Champion 2022', 'Employee Relations Leader 2021'],
        languages: ['English (Fluent)', 'Arabic (Native)', 'Spanish (Basic)']
      }
    },
    {
      id: 'ba-steel', type: 'resume', name: 'Business Analyst', category: 'Business', accent: '#1f2937', layout: 'two-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: {
        name: 'Mia Rossi', title: 'Business Analyst', profilePhoto: 'https://i.pravatar.cc/100?img=22',
        contact: ['mia@example.com', 'Boston, MA', 'miarossi.dev'],
        profile: 'Translating business needs into actionable insights.',
        skills: ['SQL', 'Looker', 'A/B Testing', 'Storytelling', 'Python', 'Tableau', 'Excel', 'Requirements Gathering', 'Process Improvement', 'Stakeholder Management'],
        experience: [ 
          { role: 'Business Analyst', company: 'InsightCo', dates: '2018 – Present', bullets: ['Built KPI suite used by exec team.', 'Led 5+ process improvement initiatives saving $500K annually.', 'Collaborated with 3 product teams to define requirements for new features.'] },
          { role: 'Junior Business Analyst', company: 'Consulting Firm', dates: '2016 – 2018', bullets: ['Conducted market research for 10+ client projects.', 'Created financial models and business cases for strategic decisions.', 'Facilitated stakeholder workshops and requirements gathering sessions.'] },
          { role: 'Data Intern', company: 'Analytics Startup', dates: '2015 – 2016', bullets: ['Cleaned and analyzed datasets for client reports.', 'Created visualizations and dashboards using Tableau.', 'Assisted with A/B testing setup and analysis.'] }
        ],
        education: [
          { degree: 'B.Sc. Economics', school: 'BU', dates: '2012 – 2016' },
          { degree: 'Certificate in Business Analysis', school: 'IIBA', dates: '2017' },
          { degree: 'Certificate in Data Visualization', school: 'Tableau', dates: '2018' }
        ],
        projects: ['Customer segmentation analysis (improved targeting by 30%).', 'Process optimization initiative (reduced cycle time by 25%).', 'Executive dashboard development (improved decision-making speed).', 'A/B testing framework implementation (increased conversion by 15%).'],
        certifications: ['Certified Business Analysis Professional (CBAP)', 'Tableau Desktop Specialist', 'Google Analytics Certified'],
        awards: ['Analyst of the Year 2023', 'Process Improvement Champion 2022', 'Data Excellence Award 2021'],
        languages: ['English (Fluent)', 'Italian (Native)', 'French (Basic)']
      }
    },
    {
      id: 'da-ice', type: 'resume', name: 'Data Analyst', category: 'Data', accent: '#06b6d4', layout: 'single-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'icons',
      content: {
        name: 'Yuki Tanaka', title: 'Data Analyst',
        contact: ['yuki@example.com', 'San Jose, CA', 'github.com/yuki'],
        profile: 'Analytics pro turning data into decisions.',
        skills: ['SQL', 'dbt', 'Python', 'Tableau', 'Excel', 'R', 'Power BI', 'Statistics', 'Data Visualization', 'ETL'],
        experience: [ 
          { role: 'Data Analyst', company: 'Measurely', dates: '2020 – Present', bullets: ['Automated reporting saving 10h/week.', 'Built self-service analytics platform used by 50+ stakeholders.', 'Conducted statistical analysis leading to 20% improvement in key metrics.'] },
          { role: 'Junior Data Analyst', company: 'TechStart', dates: '2018 – 2020', bullets: ['Created 20+ interactive dashboards for different business units.', 'Performed ad-hoc analysis for C-suite and product teams.', 'Maintained data quality standards and documentation.'] },
          { role: 'Data Intern', company: 'Consulting Firm', dates: '2017 – 2018', bullets: ['Cleaned and prepared datasets for client analysis.', 'Created visualizations and reports using various BI tools.', 'Assisted senior analysts with complex statistical modeling.'] }
        ],
        projects: ['Churn dashboard for CS.', 'Customer lifetime value prediction model (85% accuracy).', 'A/B testing analysis framework (improved test reliability by 30%).', 'Real-time KPI monitoring system (reduced response time by 50%).', 'Data pipeline optimization (reduced processing time by 40%).'],
        education: [
          { degree: 'B.Sc. Statistics', school: 'UCLA', dates: '2015 – 2019' },
          { degree: 'Certificate in Data Science', school: 'Coursera', dates: '2020' },
          { degree: 'Certificate in Advanced SQL', school: 'DataCamp', dates: '2021' }
        ],
        certifications: ['Tableau Desktop Specialist', 'Google Analytics Certified', 'Microsoft Power BI Data Analyst'],
        awards: ['Data Analyst of the Year 2023', 'Innovation in Analytics 2022', 'Excellence in Reporting 2021'],
        languages: ['English (Fluent)', 'Japanese (Native)', 'Spanish (Basic)']
      }
    },
    {
      id: 'uxr-lilac', type: 'resume', name: 'UX Researcher', category: 'Design', accent: '#8b5cf6', layout: 'single-column',
      accentStyle: 'border', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: {
        name: 'Nora Ahmed', title: 'UX Researcher', profilePhoto: 'https://i.pravatar.cc/100?img=23',
        contact: ['nora@example.com', 'Remote', 'nora-ux.com'],
        profile: 'Mixed-methods researcher driving product decisions.',
        skills: ['Interviews', 'Surveys', 'Usability', 'Synthesis', 'User Testing', 'Personas', 'Journey Mapping', 'A/B Testing', 'Qualtrics', 'Figma'],
        experience: [ 
          { role: 'UX Researcher', company: 'Flow', dates: '2019 – Present', bullets: ['Ran 60+ studies across 5 products.', 'Led research team of 3 researchers and 2 contractors.', 'Presented findings to C-suite influencing $2M+ product decisions.'] },
          { role: 'Junior UX Researcher', company: 'Design Agency', dates: '2017 – 2019', bullets: ['Conducted user interviews and usability testing for 15+ clients.', 'Created personas and journey maps for B2B and B2C products.', 'Collaborated with designers and PMs on research planning and execution.'] },
          { role: 'Research Assistant', company: 'University Lab', dates: '2015 – 2017', bullets: ['Assisted with academic research on human-computer interaction.', 'Collected and analyzed data for 3 published research papers.', 'Managed participant recruitment and study logistics.'] }
        ],
        education: [
          { degree: 'M.A. HCI', school: 'UCL', dates: '2016 – 2018' },
          { degree: 'B.A. Psychology', school: 'UCL', dates: '2012 – 2016' },
          { degree: 'Certificate in UX Research', school: 'Nielsen Norman Group', dates: '2019' }
        ],
        projects: ['User research framework implementation (standardized process across 5 teams).', 'Accessibility research study (improved compliance by 40%).', 'Mobile app usability testing (increased task completion by 25%).', 'Customer journey mapping initiative (identified 3 key improvement opportunities).'],
        certifications: ['Certified Usability Analyst (CUA)', 'Google UX Research Certificate', 'Qualtrics Research Core Certification'],
        awards: ['UX Researcher of the Year 2023', 'Innovation in Research 2022', 'Best Research Impact 2021'],
        languages: ['English (Fluent)', 'Arabic (Native)', 'French (Conversational)']
      }
    },
    {
      id: 'support-mint', type: 'resume', name: 'Customer Support', category: 'Operations', accent: '#10b981', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'timeline',
      content: {
        name: 'Diego Perez', title: 'Customer Support Lead',
        contact: ['diego@example.com', 'Phoenix, AZ', 'linkedin.com/in/diegop'],
        profile: 'Leading CS operations with empathy and metrics.',
        skills: ['Zendesk', 'QA', 'SLA', 'Knowledge Base', 'Customer Success', 'Team Leadership', 'Process Improvement', 'Training', 'Analytics', 'Communication'],
        experience: [ 
          { role: 'Support Lead', company: 'Helply', dates: '2018 – Present', bullets: ['Raised CSAT from 88% to 95%.', 'Managed team of 8 support agents across 3 time zones.', 'Implemented new processes reducing average resolution time by 30%.'] },
          { role: 'Senior Support Agent', company: 'TechCorp', dates: '2016 – 2018', bullets: ['Handled 50+ complex technical issues daily.', 'Mentored 3 junior agents and improved their performance by 40%.', 'Created knowledge base articles reducing repeat inquiries by 25%.'] },
          { role: 'Support Agent', company: 'Customer Service Co', dates: '2014 – 2016', bullets: ['Provided phone and chat support for 200+ customers daily.', 'Maintained 95%+ first-call resolution rate.', 'Escalated complex issues to appropriate technical teams.'] }
        ],
        education: [
          { degree: 'B.A. Sociology', school: 'ASU', dates: '2012 – 2016' },
          { degree: 'Certificate in Customer Service Excellence', school: 'Zendesk', dates: '2017' },
          { degree: 'Certificate in Team Leadership', school: 'LinkedIn Learning', dates: '2019' }
        ],
        projects: ['Customer satisfaction improvement initiative (increased CSAT by 7%).', 'Knowledge base optimization project (reduced ticket volume by 20%).', 'Agent training program development (improved team performance by 35%).', 'Customer feedback analysis system implementation.'],
        certifications: ['Zendesk Administrator Certification', 'Customer Service Professional (CSP)', 'ITIL Foundation'],
        awards: ['Support Leader of the Year 2023', 'Customer Excellence Award 2022', 'Team Performance Champion 2021'],
        languages: ['English (Fluent)', 'Spanish (Native)', 'Portuguese (Conversational)']
      }
    },
    {
      id: 'pm-sand', type: 'resume', name: 'Associate PM', category: 'Product', accent: '#f59e0b', layout: 'two-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: {
        name: 'Ivy Zhao', title: 'Associate Product Manager',
        contact: ['ivy@example.com', 'Remote', 'ivy.pm'],
        profile: 'Early-career PM shipping user value fast.',
        skills: ['Backlog', 'User Stories', 'Analytics', 'Agile', 'Scrum', 'User Research', 'Data Analysis', 'Stakeholder Management', 'Roadmapping', 'A/B Testing'],
        experience: [ 
          { role: 'APM', company: 'Starter', dates: '2022 – Present', bullets: ['Shipped MVP in 3 months.', 'Led cross-functional team of 6 engineers and designers.', 'Conducted user research with 50+ customers to validate product direction.'] },
          { role: 'Product Intern', company: 'TechCorp', dates: '2021 – 2022', bullets: ['Assisted with feature specification and user story writing.', 'Analyzed user behavior data to identify improvement opportunities.', 'Collaborated with engineering team on sprint planning and execution.'] },
          { role: 'Business Analyst Intern', company: 'Consulting Firm', dates: '2020 – 2021', bullets: ['Conducted market research for 5+ client projects.', 'Created business cases and financial models for strategic initiatives.', 'Presented findings to senior leadership and client stakeholders.'] }
        ],
        education: [
          { degree: 'B.Sc. Information Science', school: 'Cornell', dates: '2018 – 2022' },
          { degree: 'Certificate in Product Management', school: 'General Assembly', dates: '2022' },
          { degree: 'Certificate in Data Analysis', school: 'Coursera', dates: '2021' }
        ],
        projects: ['User onboarding flow redesign (increased activation by 30%).', 'Feature flag system implementation (enabled safer deployments).', 'Customer feedback analysis dashboard (improved product decisions).', 'Competitive analysis framework (informed product strategy).'],
        certifications: ['Certified Scrum Product Owner (CSPO)', 'Google Analytics Certified', 'Agile Certified Practitioner (PMI-ACP)'],
        awards: ['Rising Star PM 2023', 'Innovation Award 2022', 'Best Newcomer 2021'],
        languages: ['English (Fluent)', 'Mandarin (Native)', 'Spanish (Basic)']
      }
    },
    {
      id: 'qa-forest', type: 'resume', name: 'QA Engineer', category: 'Technology', accent: '#16a34a', layout: 'two-column',
      accentStyle: 'border', headerStyle: 'bar', pages: 1, variant: 'icons',
      content: {
        name: 'Peter Novak', title: 'QA Engineer',
        contact: ['peter@example.com', 'Prague, CZ', 'github.com/petern'],
        profile: 'Ensuring quality via automation and strategy.',
        skills: ['Cypress', 'Playwright', 'JUnit', 'CI/CD', 'Selenium', 'Test Automation', 'API Testing', 'Performance Testing', 'Bug Tracking', 'Test Planning'],
        experience: [ 
          { role: 'QA Engineer', company: 'QualityHub', dates: '2017 – Present', bullets: ['Cut regressions by 40%.', 'Built automated test suite covering 80% of critical user journeys.', 'Mentored 2 junior QA engineers and improved team efficiency by 50%.'] },
          { role: 'Test Analyst', company: 'Software Corp', dates: '2015 – 2017', bullets: ['Executed manual testing for 10+ web and mobile applications.', 'Created test cases and documentation for complex business logic.', 'Collaborated with development team on bug triage and resolution.'] },
          { role: 'QA Intern', company: 'TechStart', dates: '2014 – 2015', bullets: ['Performed functional testing on new features and bug fixes.', 'Assisted with test data preparation and environment setup.', 'Participated in daily standups and sprint planning sessions.'] }
        ],
        certifications: ['ISTQB Foundation', 'Selenium WebDriver Certification', 'Agile Testing Certification', 'Performance Testing Certification'],
        education: [
          { degree: 'B.Sc. Software Engineering', school: 'CTU', dates: '2011 – 2015' },
          { degree: 'Certificate in Test Automation', school: 'Udemy', dates: '2016' },
          { degree: 'Certificate in Agile Testing', school: 'ISTQB', dates: '2018' }
        ],
        projects: ['Test automation framework development (reduced manual testing by 60%).', 'API testing suite implementation (improved integration reliability).', 'Performance testing strategy (identified and resolved 5 critical bottlenecks).', 'Mobile testing automation (increased coverage by 40%).'],
        awards: ['QA Engineer of the Year 2023', 'Test Automation Excellence 2022', 'Quality Champion 2021'],
        languages: ['English (Fluent)', 'Czech (Native)', 'German (Basic)']
      }
    },
    {
      id: 'secur-onyx', type: 'resume', name: 'Security Engineer', category: 'Security', accent: '#111827', layout: 'two-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'sidebar',
      content: {
        name: 'Aria Cohen', title: 'Security Engineer', profilePhoto: 'https://i.pravatar.cc/100?img=24',
        contact: ['aria@example.com', 'Tel Aviv, IL', 'github.com/ariac'],
        profile: 'Securing systems through proactive testing and hardening.',
        skills: ['Pentest', 'Threat Modeling', 'SIEM', 'IAM', 'Vulnerability Assessment', 'Incident Response', 'Security Architecture', 'Compliance', 'Python', 'Linux'],
        experience: [ 
          { role: 'Security Engineer', company: 'Lockly', dates: '2018 – Present', bullets: ['Eliminated 90% high CVEs.', 'Led security team of 4 engineers and implemented zero-trust architecture.', 'Conducted 50+ penetration tests and security assessments.'] },
          { role: 'Security Analyst', company: 'CyberDefense Inc', dates: '2016 – 2018', bullets: ['Monitored SIEM alerts and investigated security incidents.', 'Performed vulnerability scans and risk assessments for 20+ clients.', 'Developed security policies and procedures for compliance requirements.'] },
          { role: 'Security Intern', company: 'TechCorp', dates: '2015 – 2016', bullets: ['Assisted with security audits and compliance assessments.', 'Analyzed security logs and identified potential threats.', 'Participated in incident response procedures and documentation.'] }
        ],
        certifications: ['OSCP', 'CISSP', 'CEH', 'GSEC', 'AWS Security Specialty'],
        education: [
          { degree: 'B.Sc. Computer Science', school: 'TAU', dates: '2013 – 2017' },
          { degree: 'Certificate in Cybersecurity', school: 'SANS', dates: '2018' },
          { degree: 'Certificate in Cloud Security', school: 'AWS', dates: '2020' }
        ],
        projects: ['Security automation platform (reduced response time by 70%).', 'Threat intelligence integration (improved detection by 60%).', 'Security awareness training program (reduced phishing incidents by 80%).', 'Zero-trust architecture implementation (enhanced security posture).'],
        awards: ['Security Engineer of the Year 2023', 'Innovation in Security 2022', 'Excellence in Incident Response 2021'],
        languages: ['English (Fluent)', 'Hebrew (Native)', 'Arabic (Basic)']
      }
    },
    {
      id: 'chef-saffron', type: 'cv', name: 'Chef CV', category: 'Hospitality', accent: '#b45309', layout: 'single-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: {
        name: 'Paolo Ricci', title: 'Head Chef',
        contact: ['paolo@example.com', 'Boston, MA', 'instagram.com/paolocooks'],
        profile: 'Menu development and kitchen leadership for fine dining.',
        skills: ['Menu Design', 'Costing', 'Food Safety', 'Team Leadership', 'Italian Cuisine', 'French Techniques', 'Pastry', 'Wine Pairing', 'Kitchen Management', 'Inventory Control'],
        experience: [ 
          { role: 'Head Chef', company: 'Trattoria Uno', dates: '2016 – Present', bullets: ['Michelin Bib Gourmand 2022.', 'Led kitchen team of 12 chefs and reduced food costs by 15%.', 'Developed seasonal menu featuring locally-sourced ingredients.'] },
          { role: 'Sous Chef', company: 'Ristorante Bella Vista', dates: '2014 – 2016', bullets: ['Managed daily kitchen operations and staff scheduling.', 'Trained 5 junior chefs in traditional Italian cooking techniques.', 'Maintained 5-star health inspection rating for 2 consecutive years.'] },
          { role: 'Line Cook', company: 'Café Milano', dates: '2012 – 2014', bullets: ['Prepared authentic Italian dishes for 200+ customers daily.', 'Assisted with menu development and special event catering.', 'Maintained high standards of food quality and presentation.'] }
        ],
        awards: ['James Beard nominee', 'Best Italian Restaurant 2023', 'Culinary Excellence Award 2022', 'Chef of the Year 2021'],
        education: [
          { degree: 'Diploma Culinary Arts', school: 'Le Cordon Bleu', dates: '2012 – 2014' },
          { degree: 'Certificate in Wine Studies', school: 'Wine & Spirit Education Trust', dates: '2015' },
          { degree: 'Food Safety Manager Certification', school: 'ServSafe', dates: '2016' }
        ],
        projects: ['Farm-to-table partnership program (increased local sourcing by 40%).', 'Sustainable kitchen practices implementation (reduced waste by 30%).', 'Chef training program for culinary students.', 'Seasonal menu development featuring regional specialties.'],
        certifications: ['ServSafe Manager', 'Wine & Spirit Education Trust Level 2', 'Italian Culinary Institute Certificate'],
        languages: ['English (Fluent)', 'Italian (Native)', 'French (Conversational)']
      }
    },
    {
      id: 'pilot-sky', type: 'cv', name: 'Pilot CV', category: 'Aviation', accent: '#2563eb', layout: 'single-column',
      accentStyle: 'border', headerStyle: 'bar', pages: 1, variant: 'sidebar',
      content: {
        name: 'Jack Miller', title: 'Airline Pilot', profilePhoto: 'https://i.pravatar.cc/100?img=25',
        contact: ['jack@example.com', 'Miami, FL', 'ATPL'],
        profile: '6,000+ flight hours, type-rated A320/B737.',
        skills: ['IFR', 'CRM', 'Safety', 'Emergency Procedures', 'Navigation', 'Weather Analysis', 'Crew Resource Management', 'Aircraft Systems', 'Communication', 'Decision Making'],
        experience: [ 
          { role: 'First Officer', company: 'SkyFly', dates: '2018 – Present', bullets: ['5,000 hours on A320/B737.', 'Maintained 100% safety record with 0 incidents or violations.', 'Mentored 3 new first officers and conducted training sessions.'] },
          { role: 'Second Officer', company: 'Regional Airlines', dates: '2016 – 2018', bullets: ['Accumulated 2,000 flight hours on regional aircraft.', 'Completed advanced training in weather avoidance and emergency procedures.', 'Participated in safety committee and contributed to policy improvements.'] },
          { role: 'Flight Instructor', company: 'Aviation Academy', dates: '2014 – 2016', bullets: ['Trained 20+ student pilots for private and commercial licenses.', 'Developed training curriculum for instrument rating program.', 'Maintained 95% student pass rate on FAA practical exams.'] }
        ],
        certifications: ['ATPL', 'Type Ratings: A320/B737', 'CFI/CFII/MEI', 'First Aid/CPR', 'Dangerous Goods'],
        education: [
          { degree: 'B.Sc. Aeronautics', school: 'ERAU', dates: '2010 – 2014' },
          { degree: 'Certificate in Aviation Safety', school: 'FAA', dates: '2015' },
          { degree: 'Certificate in Crew Resource Management', school: 'Aviation Training Center', dates: '2017' }
        ],
        projects: ['Safety improvement initiative (reduced incidents by 25%).', 'Pilot training program development for new hires.', 'Weather analysis system implementation (improved flight planning).', 'Emergency procedure standardization across fleet.'],
        awards: ['Pilot of the Year 2023', 'Safety Excellence Award 2022', 'Training Excellence 2021'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'journal-ink', type: 'cv', name: 'Journalist CV', category: 'Media', accent: '#4b5563', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'icons',
      content: {
        name: 'Marta Silva', title: 'Investigative Journalist',
        contact: ['marta@example.com', 'Lisbon, PT', 'marta.press'],
        profile: 'Investigations, FOIA, multimedia storytelling.',
        skills: ['FOIA', 'Interviews', 'Editing', 'Data Journalism', 'Research', 'Fact-Checking', 'Multimedia', 'Social Media', 'Video Production', 'Photography'],
        experience: [ 
          { role: 'Staff Writer', company: 'Daily Times', dates: '2015 – Present', bullets: ['Exposed corruption in 2021 series.', 'Published 200+ articles with 5M+ total readership.', 'Led investigative team of 3 reporters on major stories.'] },
          { role: 'Freelance Journalist', company: 'Various Publications', dates: '2013 – 2015', bullets: ['Wrote 50+ articles for national and international publications.', 'Conducted interviews with 100+ sources including government officials.', 'Developed expertise in political and social justice reporting.'] },
          { role: 'Intern Reporter', company: 'Local News', dates: '2012 – 2013', bullets: ['Covered local government meetings and community events.', 'Assisted senior reporters with research and fact-checking.', 'Gained experience in deadline-driven news production.'] }
        ],
        awards: ['Pulitzer finalist 2022', 'Investigative Reporting Award 2021', 'Journalism Excellence 2020', 'Media Freedom Award 2019'],
        education: [
          { degree: 'M.A. Journalism', school: 'Columbia', dates: '2013 – 2015' },
          { degree: 'B.A. Political Science', school: 'University of Lisbon', dates: '2009 – 2013' },
          { degree: 'Certificate in Data Journalism', school: 'Knight Center', dates: '2016' }
        ],
        projects: ['Investigative series on government transparency (led to policy changes).', 'Data journalism project on social inequality (viral on social media).', 'Multimedia documentary on environmental issues.', 'Collaborative investigation with international news organizations.'],
        certifications: ['Digital Journalism Certificate', 'Media Ethics Certification', 'FOIA Specialist'],
        languages: ['English (Fluent)', 'Portuguese (Native)', 'Spanish (Conversational)', 'French (Basic)']
      }
    },
    {
      id: 'arch-stone', type: 'cv', name: 'Architect CV', category: 'Design', accent: '#0ea5e9', layout: 'single-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: {
        name: "Liam O'Connor", title: 'Architect', profilePhoto: 'https://i.pravatar.cc/100?img=26',
        contact: ['liam@example.com', 'Dublin, IE', 'RIAI'],
        profile: 'Sustainable residential and commercial design.',
        skills: ['Revit', 'Rhino', 'LEED', 'Project Mgmt', 'AutoCAD', 'SketchUp', 'Sustainable Design', 'Building Codes', '3D Modeling', 'Client Relations'],
        experience: [ 
          { role: 'Architect', company: 'GreenBuild', dates: '2016 – Present', bullets: ['Delivered 50k sqm mixed-use project.', 'Led design team of 5 architects on sustainable building projects.', 'Achieved LEED Platinum certification for 3 major developments.'] },
          { role: 'Junior Architect', company: 'Design Studio', dates: '2014 – 2016', bullets: ['Designed residential and small commercial projects.', 'Prepared construction documents and coordinated with consultants.', 'Participated in client meetings and design presentations.'] },
          { role: 'Architectural Intern', company: 'Construction Firm', dates: '2013 – 2014', bullets: ['Assisted with site surveys and as-built documentation.', 'Drafted technical drawings and specifications.', 'Gained experience in construction administration and quality control.'] }
        ],
        certifications: ['LEED AP', 'RIAI Registered Architect', 'BREEAM Assessor', 'Passive House Designer'],
        education: [
          { degree: 'M.Arch.', school: 'UCD', dates: '2010 – 2015' },
          { degree: 'B.Arch.', school: 'UCD', dates: '2006 – 2010' },
          { degree: 'Certificate in Sustainable Design', school: 'Green Building Council', dates: '2016' }
        ],
        projects: ['Zero-energy residential development (50 units).', 'Green office building renovation (achieved LEED Platinum).', 'Community center design (award-winning sustainable architecture).', 'Urban planning study for sustainable city development.'],
        awards: ['Architect of the Year 2023', 'Sustainable Design Excellence 2022', 'Innovation in Architecture 2021'],
        languages: ['English (Fluent)', 'Irish (Native)', 'French (Conversational)']
      }
    },
    // --- Newly added diverse templates ---
    {
      id: 'minimalist-ash', type: 'resume', name: 'Minimalist Ash', category: 'General', accent: '#334155', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'default',
      content: { 
        name: 'Taylor Reed', title: 'Professional', 
        contact: ['taylor@example.com','City, Country','portfolio.com/taylor'], 
        profile: 'Concise professional summary with proven track record.', 
        skills: ['Planning','Communication','Leadership','Collaboration','Project Management','Strategic Thinking','Problem Solving','Team Building','Analytics','Presentation'], 
        experience: [ 
          { role: 'Senior Manager', company: 'TechCorp', dates: '2021 – Present', bullets: ['Led cross-functional team of 12 professionals.','Improved operational efficiency by 25%.','Managed $2M annual budget with 15% cost savings.'] },
          { role: 'Manager', company: 'Business Solutions', dates: '2018 – 2021', bullets: ['Implemented new processes reducing delivery time by 30%.','Mentored 5 junior team members.','Achieved 95% client satisfaction rating.'] },
          { role: 'Coordinator', company: 'Startup Inc', dates: '2016 – 2018', bullets: ['Coordinated projects across multiple departments.','Developed reporting system used company-wide.','Assisted with strategic planning and execution.'] }
        ], 
        education: [ 
          { degree: 'B.A. Business Administration', school: 'University', dates: '2016 – 2020' },
          { degree: 'Certificate in Project Management', school: 'PMI', dates: '2019' },
          { degree: 'Certificate in Leadership', school: 'LinkedIn Learning', dates: '2021' }
        ],
        projects: ['Process improvement initiative (saved $500K annually).','Team training program development (improved performance by 40%).','Strategic planning framework implementation.','Client relationship management system optimization.'],
        certifications: ['PMP', 'Certified Professional Manager', 'Agile Certified Practitioner'],
        awards: ['Manager of the Year 2023', 'Excellence in Leadership 2022', 'Innovation Award 2021'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'split-header-steel', type: 'resume', name: 'Split Header Steel', category: 'General', accent: '#1f2937', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'full', pages: 1, variant: 'boxed',
      content: { 
        name: 'Jordan Smith', title: 'Project Manager', profilePhoto: 'https://i.pravatar.cc/100?img=27', 
        contact: ['jordan@example.com','Remote','linkedin.com/in/jordans'], 
        profile: 'Drives delivery across cross-functional teams with proven results.', 
        skills: ['Agile','Scrum','Risk','Budget','Stakeholder Management','Resource Planning','Quality Assurance','Change Management','Communication','Leadership'], 
        experience: [ 
          { role: 'Senior PM', company: 'DeliverX', dates: '2020 – Present', bullets: ['Launched program across 4 teams','Cut delivery time 20%','Managed $5M project portfolio with 98% on-time delivery.'] },
          { role: 'Project Manager', company: 'TechStart', dates: '2018 – 2020', bullets: ['Led 15+ projects from initiation to closure.','Improved team productivity by 35%.','Reduced project risks by implementing new processes.'] },
          { role: 'Project Coordinator', company: 'Consulting Firm', dates: '2016 – 2018', bullets: ['Coordinated project activities across multiple teams.','Maintained project documentation and reporting.','Assisted with budget planning and resource allocation.'] }
        ], 
        education: [ 
          { degree: 'B.Sc. Management', school: 'State U', dates: '2014 – 2018' },
          { degree: 'PMP Certification', school: 'PMI', dates: '2019' },
          { degree: 'Agile Certified Practitioner', school: 'PMI', dates: '2020' }
        ],
        projects: ['Digital transformation initiative (improved efficiency by 40%).','Process automation project (saved 200 hours monthly).','Team restructuring program (increased productivity by 25%).','Quality improvement framework implementation.'],
        certifications: ['PMP', 'Certified Scrum Master (CSM)', 'PRINCE2 Practitioner'],
        awards: ['Project Manager of the Year 2023', 'Excellence in Delivery 2022', 'Innovation in Project Management 2021'],
        languages: ['English (Fluent)', 'French (Basic)']
      }
    },
    {
      id: 'ribbon-emerald', type: 'resume', name: 'Ribbon Emerald', category: 'General', accent: '#059669', layout: 'two-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'icons',
      content: { 
        name: 'Aiden Lee', title: 'Accountant', 
        contact: ['aiden@example.com','London, UK','aidenlee.me'], 
        profile: 'Detail-oriented finance professional with expertise in financial reporting and analysis.', 
        skills: ['Excel','GL','Reporting','Reconciliation','Financial Analysis','Budgeting','Tax Compliance','Audit Support','ERP Systems','Variance Analysis'], 
        experience: [ 
          { role: 'Senior Accountant', company: 'LedgerCo', dates: '2019 – Present', bullets: ['Closed books monthly','Automated reports','Led team of 3 junior accountants and improved efficiency by 30%.'] },
          { role: 'Staff Accountant', company: 'Finance Corp', dates: '2017 – 2019', bullets: ['Prepared monthly financial statements for 5 subsidiaries.','Reconciled 50+ bank accounts monthly with 100% accuracy.','Assisted with annual audit preparation and compliance.'] },
          { role: 'Accounting Assistant', company: 'Small Business', dates: '2015 – 2017', bullets: ['Processed accounts payable and receivable.','Maintained general ledger and prepared journal entries.','Assisted with payroll processing and tax filings.'] }
        ], 
        certifications: ['ACCA', 'CPA (In Progress)', 'QuickBooks Certified'], 
        education: [ 
          { degree: 'B.Com Accounting', school: 'LSE', dates: '2015 – 2019' },
          { degree: 'Certificate in Financial Analysis', school: 'CFA Institute', dates: '2020' },
          { degree: 'Advanced Excel Certification', school: 'Microsoft', dates: '2021' }
        ],
        projects: ['Financial reporting automation (saved 20 hours weekly).','Cost reduction analysis (identified $200K in savings).','Process improvement initiative (reduced closing time by 40%).','Budget variance analysis system implementation.'],
        awards: ['Accountant of the Year 2023', 'Excellence in Financial Reporting 2022', 'Process Improvement Champion 2021'],
        languages: ['English (Fluent)', 'Mandarin (Native)', 'French (Basic)']
      }
    },
    {
      id: 'grid-ocean', type: 'resume', name: 'Grid Ocean', category: 'General', accent: '#0ea5e9', layout: 'single-column',
      accentStyle: 'right', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: { 
        name: 'Sara Park', title: 'Data Analyst', 
        contact: ['sara@example.com','NYC, USA','github.com/sarap'], 
        profile: 'Turns data into actionable insights that drive business decisions.', 
        skills: ['SQL','Tableau','Python','dbt','Excel','R','Power BI','Statistics','Machine Learning','Data Visualization'], 
        experience: [ 
          { role: 'Senior Data Analyst', company: 'Insightly', dates: '2020 – Present', bullets: ['Built dashboards for executives','Automated ETL tasks','Led data analysis team of 4 analysts and improved reporting efficiency by 50%.'] },
          { role: 'Data Analyst', company: 'Analytics Corp', dates: '2018 – 2020', bullets: ['Created 30+ interactive dashboards used by 100+ stakeholders.','Performed statistical analysis for 15+ client projects.','Developed data quality standards and monitoring processes.'] },
          { role: 'Junior Analyst', company: 'Research Institute', dates: '2016 – 2018', bullets: ['Cleaned and prepared datasets for research studies.','Created visualizations and reports using various BI tools.','Assisted senior analysts with complex statistical modeling.'] }
        ], 
        projects: ['KPI dashboard suite','Customer segmentation model (improved targeting by 30%).','Predictive analytics framework (reduced churn by 15%).','Data pipeline optimization (reduced processing time by 40%).','Real-time monitoring system implementation.'], 
        education: [ 
          { degree: 'B.Sc. Statistics', school: 'NYU', dates: '2016 – 2020' },
          { degree: 'Certificate in Data Science', school: 'Coursera', dates: '2021' },
          { degree: 'Advanced SQL Certification', school: 'DataCamp', dates: '2022' }
        ],
        certifications: ['Tableau Desktop Specialist', 'Google Analytics Certified', 'Microsoft Power BI Data Analyst'],
        awards: ['Data Analyst of the Year 2023', 'Innovation in Analytics 2022', 'Excellence in Reporting 2021'],
        languages: ['English (Fluent)', 'Korean (Native)', 'Spanish (Basic)']
      }
    },
    {
      id: 'ats-slate', type: 'resume', name: 'ATS Slate', category: 'General', accent: '#475569', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'bar', pages: 1, variant: 'default',
      content: { 
        name: 'Chris Young', title: 'Software Engineer', 
        contact: ['chris@example.com','Remote','github.com/chrisy'], 
        profile: 'ATS-friendly layout with strong keywords and proven technical expertise.', 
        skills: ['TypeScript','React','Node','AWS','JavaScript','Python','Docker','Kubernetes','SQL','Git'], 
        experience: [ 
          { role: 'Senior Software Engineer', company: 'Buildly', dates: '2021 – Present', bullets: ['Shipped features at scale','Improved reliability','Led development team of 5 engineers and delivered 20+ features.'] },
          { role: 'Software Engineer', company: 'TechStart', dates: '2019 – 2021', bullets: ['Developed full-stack applications serving 100K+ users.','Implemented CI/CD pipelines reducing deployment time by 60%.','Collaborated with product team on feature specifications.'] },
          { role: 'Junior Developer', company: 'Software Corp', dates: '2017 – 2019', bullets: ['Built web applications using modern JavaScript frameworks.','Participated in code reviews and agile development processes.','Mentored 2 junior developers and conducted technical interviews.'] }
        ], 
        education: [ 
          { degree: 'B.Sc. Computer Science', school: 'UCLA', dates: '2016 – 2020' },
          { degree: 'Certificate in Cloud Architecture', school: 'AWS', dates: '2021' },
          { degree: 'Certificate in Full-Stack Development', school: 'FreeCodeCamp', dates: '2019' }
        ],
        projects: ['Microservices architecture implementation (improved scalability by 40%).','Real-time chat application with WebSocket integration.','Open-source contribution to React ecosystem (500+ stars).','API development and documentation system.'],
        certifications: ['AWS Certified Developer', 'Google Cloud Professional Developer', 'Microsoft Azure Fundamentals'],
        awards: ['Engineer of the Year 2023', 'Innovation in Development 2022', 'Best Code Quality 2021'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'executive-ink', type: 'resume', name: 'Executive Ink', category: 'General', accent: '#111827', layout: 'two-column',
      accentStyle: 'border', headerStyle: 'full', pages: 2, variant: 'boxed',
      content: { 
        name: 'Morgan Hale', title: 'VP, Operations', profilePhoto: 'https://i.pravatar.cc/100?img=28', 
        contact: ['morgan@example.com','Chicago, USA','morganhale.io'], 
        profile: 'Executive operator driving scale and operational excellence.', 
        skills: ['Strategy','P&L','Ops','Leadership','Process Improvement','Team Building','Financial Management','Change Management','Stakeholder Relations','Performance Metrics'], 
        experience: [ 
          { role: 'VP Operations', company: 'ScaleCo', dates: '2018 – Present', bullets: ['Scaled org to 400+','Improved margins 8 pts','Led operational transformation saving $10M annually.'] },
          { role: 'Director of Operations', company: 'GrowthCorp', dates: '2015 – 2018', bullets: ['Managed operations across 5 locations.','Implemented lean processes reducing costs by 25%.','Built and led team of 50+ operations professionals.'] },
          { role: 'Operations Manager', company: 'TechStart', dates: '2012 – 2015', bullets: ['Established operational processes from scratch.','Reduced customer acquisition cost by 40%.','Developed KPIs and reporting systems used company-wide.'] }
        ], 
        education: [ 
          { degree: 'MBA', school: 'Booth', dates: '2016 – 2018' },
          { degree: 'B.Sc. Business Administration', school: 'Northwestern', dates: '2008 – 2012' },
          { degree: 'Certificate in Executive Leadership', school: 'Harvard Business School', dates: '2020' }
        ],
        projects: ['Operational efficiency program (saved $15M annually).','Digital transformation initiative (improved productivity by 35%).','Customer experience optimization (increased satisfaction by 30%).','Supply chain optimization (reduced costs by 20%).'],
        certifications: ['Certified Executive (CEx)', 'Lean Six Sigma Black Belt', 'Project Management Professional (PMP)'],
        awards: ['Executive of the Year 2023', 'Operational Excellence Award 2022', 'Leadership Excellence 2021'],
        languages: ['English (Fluent)', 'French (Conversational)']
      }
    },
    {
      id: 'creative-coral', type: 'resume', name: 'Creative Coral', category: 'Design', accent: '#db2777', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'full', pages: 1, variant: 'banded',
      content: { 
        name: 'Zoe Carter', title: 'Creative Director', profilePhoto: 'https://i.pravatar.cc/100?img=29', 
        contact: ['zoe@example.com','LA, USA','dribbble.com/zoe'], 
        profile: 'Creative leader with award-winning campaigns and innovative design solutions.', 
        skills: ['Brand','Art Direction','Campaigns','Motion','Creative Strategy','Team Leadership','Client Relations','Concept Development','Visual Design','Digital Marketing'], 
        experience: [ 
          { role: 'Creative Director', company: 'Bright', dates: '2019 – Present', bullets: ['Led 360 campaigns','Won 3 industry awards','Managed creative team of 12 designers and increased client satisfaction by 40%.'] },
          { role: 'Senior Art Director', company: 'Design Studio', dates: '2016 – 2019', bullets: ['Designed campaigns for Fortune 500 clients.','Mentored 5 junior designers and improved team performance by 50%.','Developed brand guidelines used across multiple product lines.'] },
          { role: 'Art Director', company: 'Advertising Agency', dates: '2014 – 2016', bullets: ['Created visual concepts for print and digital campaigns.','Collaborated with copywriters and account managers on creative briefs.','Presented creative work to clients and stakeholders.'] }
        ], 
        education: [ 
          { degree: 'BFA Design', school: 'CalArts', dates: '2012 – 2016' },
          { degree: 'Certificate in Digital Marketing', school: 'Google', dates: '2017' },
          { degree: 'Certificate in Brand Strategy', school: 'Miami Ad School', dates: '2018' }
        ],
        projects: ['Brand identity redesign (increased brand recognition by 60%).','Digital campaign series (generated 2M+ impressions).','Creative team restructuring (improved efficiency by 35%).','Award-winning print campaign (featured in industry publications).'],
        certifications: ['Adobe Certified Expert', 'Google Analytics Certified', 'HubSpot Content Marketing'],
        awards: ['Creative Director of the Year 2023', 'Best Campaign Award 2022', 'Innovation in Design 2021'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'compact-ivory', type: 'resume', name: 'Compact Ivory', category: 'General', accent: '#e5e7eb', layout: 'two-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'default',
      content: { 
        name: 'Lee Morgan', title: 'Business Analyst', 
        contact: ['lee@example.com','Remote','lee.dev'], 
        profile: 'Compact layout emphasizing results and data-driven decision making.', 
        skills: ['KPI','SQL','Storytelling','Data Analysis','Process Improvement','Requirements Gathering','Stakeholder Management','Visualization','Excel','Python'], 
        experience: [ 
          { role: 'Senior Business Analyst', company: 'OpsIQ', dates: '2020 – Present', bullets: ['Built KPI suite','Optimized process','Led 10+ process improvement initiatives saving $2M annually.'] },
          { role: 'Business Analyst', company: 'Consulting Firm', dates: '2018 – 2020', bullets: ['Analyzed business processes for 15+ client projects.','Created dashboards and reports used by C-suite executives.','Facilitated workshops with 200+ stakeholders across different departments.'] },
          { role: 'Junior Analyst', company: 'Data Corp', dates: '2016 – 2018', bullets: ['Performed data analysis and created visualizations.','Assisted with requirements gathering and documentation.','Supported senior analysts with research and reporting tasks.'] }
        ], 
        education: [ 
          { degree: 'B.Sc. Economics', school: 'LSE', dates: '2014 – 2018' },
          { degree: 'Certificate in Business Analysis', school: 'IIBA', dates: '2019' },
          { degree: 'Certificate in Data Visualization', school: 'Tableau', dates: '2020' }
        ],
        projects: ['Process optimization framework (reduced cycle time by 30%).','KPI dashboard development (improved decision-making speed).','Requirements management system implementation.','Data quality improvement initiative (increased accuracy by 25%).'],
        certifications: ['Certified Business Analysis Professional (CBAP)', 'Tableau Desktop Specialist', 'Google Analytics Certified'],
        awards: ['Analyst of the Year 2023', 'Process Improvement Champion 2022', 'Data Excellence Award 2021'],
        languages: ['English (Fluent)', 'French (Basic)']
      }
    },
    {
      id: 'two-tone-plum', type: 'resume', name: 'Two-Tone Plum', category: 'General', accent: '#7c3aed', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'full', pages: 1, variant: 'boxed',
      content: { 
        name: 'Iris Chen', title: 'Marketing Specialist', profilePhoto: 'https://i.pravatar.cc/100?img=30', 
        contact: ['iris@example.com','Toronto, CA','irischen.me'], 
        profile: 'Two-tone header with clean body and proven marketing expertise.', 
        skills: ['SEO','Content','Email','Analytics','Digital Marketing','Social Media','Campaign Management','Lead Generation','Conversion Optimization','Marketing Automation'], 
        experience: [ 
          { role: 'Senior Marketing Specialist', company: 'Campa', dates: '2019 – Present', bullets: ['Grew leads 35%','Improved CTR 22%','Led digital marketing team of 4 specialists and increased revenue by 50%.'] },
          { role: 'Marketing Coordinator', company: 'TechStart', dates: '2017 – 2019', bullets: ['Executed email marketing campaigns with 25% open rates.','Managed social media accounts growing followers by 200%.','Created content calendar and coordinated with design team.'] },
          { role: 'Marketing Intern', company: 'Agency', dates: '2016 – 2017', bullets: ['Assisted with campaign development and execution.','Conducted market research and competitor analysis.','Supported senior marketers with administrative tasks.'] }
        ], 
        education: [ 
          { degree: 'B.Com Marketing', school: 'UofT', dates: '2015 – 2019' },
          { degree: 'Certificate in Digital Marketing', school: 'Google', dates: '2020' },
          { degree: 'Certificate in Content Marketing', school: 'HubSpot', dates: '2021' }
        ],
        projects: ['SEO optimization campaign (increased organic traffic by 80%).','Email automation workflow (improved conversion by 30%).','Social media strategy implementation (grew engagement by 150%).','Lead nurturing program development (increased qualified leads by 40%).'],
        certifications: ['Google Analytics Certified', 'HubSpot Content Marketing', 'Facebook Blueprint', 'Google Ads Certification'],
        awards: ['Marketing Specialist of the Year 2023', 'Best Campaign Award 2022', 'Digital Marketing Excellence 2021'],
        languages: ['English (Fluent)', 'Mandarin (Native)', 'French (Basic)']
      }
    },
    {
      id: 'pattern-mist', type: 'resume', name: 'Pattern Mist', category: 'General', accent: '#64748b', layout: 'single-column',
      accentStyle: 'right', headerStyle: 'bar', pages: 1, variant: 'banded',
      content: { 
        name: 'Owen Diaz', title: 'Support Lead', 
        contact: ['owen@example.com','Madrid, ES','linkedin.com/in/owend'], 
        profile: 'Soft patterned accents with proven customer success expertise.', 
        skills: ['SLA','QA','KB','Leadership','Customer Success','Team Management','Process Improvement','Training','Analytics','Communication'], 
        experience: [ 
          { role: 'Support Lead', company: 'Assist', dates: '2018 – Present', bullets: ['Raised CSAT to 96%','Built QA program','Led team of 8 support agents and reduced resolution time by 40%.'] },
          { role: 'Senior Support Agent', company: 'TechCorp', dates: '2016 – 2018', bullets: ['Handled 50+ complex technical issues daily.','Mentored 3 junior agents and improved their performance by 50%.','Created knowledge base articles reducing repeat inquiries by 30%.'] },
          { role: 'Support Agent', company: 'Customer Service Co', dates: '2014 – 2016', bullets: ['Provided phone and chat support for 200+ customers daily.','Maintained 95%+ first-call resolution rate.','Escalated complex issues to appropriate technical teams.'] }
        ], 
        education: [ 
          { degree: 'B.A. Sociology', school: 'UCM', dates: '2012 – 2016' },
          { degree: 'Certificate in Customer Service Excellence', school: 'Zendesk', dates: '2017' },
          { degree: 'Certificate in Team Leadership', school: 'LinkedIn Learning', dates: '2019' }
        ],
        projects: ['Customer satisfaction improvement initiative (increased CSAT by 7%).','Knowledge base optimization project (reduced ticket volume by 20%).','Agent training program development (improved team performance by 35%).','Customer feedback analysis system implementation.'],
        certifications: ['Zendesk Administrator Certification', 'Customer Service Professional (CSP)', 'ITIL Foundation'],
        awards: ['Support Leader of the Year 2023', 'Customer Excellence Award 2022', 'Team Performance Champion 2021'],
        languages: ['English (Fluent)', 'Spanish (Native)', 'French (Basic)']
      }
    },
    {
      id: 'left-stripe-navy', type: 'resume', name: 'Left Stripe Navy', category: 'General', accent: '#1e3a8a', layout: 'two-column',
      accentStyle: 'left', headerStyle: 'bar', pages: 1, variant: 'boxed',
      content: { 
        name: 'Ethan Brooks', title: 'Sales Manager', 
        contact: ['ethan@example.com','Sydney, AU','ethanbrooks.io'], 
        profile: 'Left stripe visual anchor with proven sales leadership expertise.', 
        skills: ['MEDDIC','Forecast','Coaching','Enterprise Sales','Pipeline Management','Team Leadership','Customer Success','Revenue Growth','Negotiation','Strategic Planning'], 
        experience: [ 
          { role: 'Sales Manager', company: 'Quota', dates: '2019 – Present', bullets: ['125% attainment','Grew team to 10','Built sales process increasing close rate by 35% and generated $5M+ ARR.'] },
          { role: 'Senior Account Executive', company: 'CloudTech', dates: '2017 – 2019', bullets: ['Exceeded quota by 40% for 2 consecutive years.','Closed 15+ enterprise deals worth $2M+ ARR.','Mentored 3 junior AEs and improved their performance by 50%.'] },
          { role: 'Account Executive', company: 'SaaS Solutions', dates: '2015 – 2017', bullets: ['Generated $1.5M in new revenue in first year.','Built strong relationships with 50+ enterprise clients.','Developed territory strategy that became company standard.'] }
        ], 
        education: [ 
          { degree: 'B.A. Communications', school: 'USYD', dates: '2011 – 2015' },
          { degree: 'Certificate in Sales Management', school: 'Salesforce', dates: '2018' },
          { degree: 'MEDDIC Masterclass', school: 'Force Management', dates: '2019' }
        ],
        projects: ['Sales enablement platform implementation (increased productivity by 25%).','Customer success program (reduced churn by 20%).','Territory expansion strategy (added $5M in pipeline).','Sales training curriculum (improved team performance by 30%).'],
        certifications: ['Certified Sales Professional (CSP)', 'HubSpot Sales Software Certification', 'Salesforce Certified Administrator'],
        awards: ['Sales Manager of the Year 2023', 'Top Performer Q3 2020', 'Rookie of the Year 2015'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
      }
    },
    {
      id: 'right-stripe-teal', type: 'resume', name: 'Right Stripe Teal', category: 'General', accent: '#0d9488', layout: 'two-column',
      accentStyle: 'right', headerStyle: 'bar', pages: 1, variant: 'boxed',
      content: { 
        name: 'Harper Singh', title: 'HR Specialist', 
        contact: ['harper@example.com','Delhi, IN','harpersingh.com'], 
        profile: 'Right stripe for visual balance with comprehensive HR expertise.', 
        skills: ['Recruiting','Onboarding','Policy','Employee Relations','Performance Management','Compensation','Benefits Administration','Compliance','Training','Strategic HR'], 
        experience: [ 
          { role: 'Senior HR Specialist', company: 'TalentCo', dates: '2018 – Present', bullets: ['Reduced TTH 30%','Built onboarding','Managed full-cycle recruitment for 100+ positions annually and improved retention by 25%.'] },
          { role: 'HR Coordinator', company: 'TechCorp', dates: '2016 – 2018', bullets: ['Coordinated employee benefits enrollment for 300+ employees.','Maintained HRIS database ensuring 99% data accuracy.','Assisted with performance review process and documentation.'] },
          { role: 'Recruiting Assistant', company: 'Staffing Agency', dates: '2014 – 2016', bullets: ['Screened 800+ resumes and conducted initial phone interviews.','Coordinated interview schedules for hiring managers.','Maintained candidate database and tracking system.'] }
        ], 
        education: [ 
          { degree: 'BBA HR Management', school: 'DU', dates: '2013 – 2017' },
          { degree: 'Certificate in Human Resources', school: 'SHRM', dates: '2018' },
          { degree: 'Certificate in Talent Acquisition', school: 'LinkedIn Learning', dates: '2019' }
        ],
        projects: ['Employee engagement survey implementation (increased satisfaction by 20%).','Diversity and inclusion initiative (improved representation by 15%).','HR policy manual update and digital transformation.','Mentorship program development for new employees.'],
        certifications: ['SHRM-CP', 'PHR (Professional in Human Resources)', 'LinkedIn Recruiter Certification'],
        awards: ['HR Excellence Award 2023', 'Recruiting Champion 2022', 'Employee Relations Leader 2021'],
        languages: ['English (Fluent)', 'Hindi (Native)', 'Punjabi (Conversational)']
      }
    },
    {
      id: 'badge-olive', type: 'resume', name: 'Badge Olive', category: 'General', accent: '#65a30d', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'full', pages: 1, variant: 'icons',
      content: { 
        name: 'Quinn Park', title: 'Operations Analyst', profilePhoto: 'https://i.pravatar.cc/100?img=31', 
        contact: ['quinn@example.com','Austin, USA','quinnops.io'], 
        profile: 'Badges and icon bullets with proven operational excellence.', 
        skills: ['Ops','SQL','Excel','Lean','Process Improvement','Data Analysis','Project Management','Quality Control','Cost Reduction','Automation'], 
        experience: [ 
          { role: 'Senior Operations Analyst', company: 'FlowOps', dates: '2020 – Present', bullets: ['Reduced waste 12%','Improved throughput','Led 5+ process improvement initiatives saving $1M annually.'] },
          { role: 'Operations Analyst', company: 'Manufacturing Corp', dates: '2018 – 2020', bullets: ['Analyzed operational data and identified efficiency opportunities.','Developed KPI dashboards used by entire operations team.','Collaborated with cross-functional teams on improvement projects.'] },
          { role: 'Junior Analyst', company: 'Consulting Firm', dates: '2016 – 2018', bullets: ['Performed data analysis for 10+ client projects.','Created reports and presentations for senior management.','Assisted with process mapping and documentation.'] }
        ], 
        certifications: ['Lean Six Sigma Green Belt', 'Certified Operations Professional', 'Project Management Professional (PMP)'], 
        education: [ 
          { degree: 'B.Sc. Industrial Engineering', school: 'UT Austin', dates: '2015 – 2019' },
          { degree: 'Certificate in Data Analysis', school: 'Coursera', dates: '2020' },
          { degree: 'Advanced Excel Certification', school: 'Microsoft', dates: '2021' }
        ],
        projects: ['Process optimization framework (reduced cycle time by 30%).','Data visualization dashboard (improved decision-making speed).','Cost reduction initiative (saved $500K annually).','Quality improvement program (reduced defects by 25%).'],
        awards: ['Operations Analyst of the Year 2023', 'Process Improvement Champion 2022', 'Data Excellence Award 2021'],
        languages: ['English (Fluent)', 'Korean (Native)', 'Spanish (Basic)']
      }
    },
    {
      id: 'academic-ivory', type: 'cv', name: 'Academic Ivory', category: 'Academia', accent: '#0f172a', layout: 'single-column',
      accentStyle: 'top', headerStyle: 'full', pages: 2, variant: 'serif',
      content: { 
        name: 'Prof. Ana Silva', title: 'Associate Professor', profilePhoto: 'https://i.pravatar.cc/100?img=32', 
        contact: ['ana@example.com','Lisbon, PT','scholar.google.com/ana'], 
        profile: 'Research and teaching focused on ML with international recognition.', 
        skills: ['ML','Stats','Causal','Machine Learning','Statistics','Causal Inference','Python','R','Research','Teaching'], 
        publications: ['Silva A. (2024) Causal ML. JMLR.','Silva A. (2023) Bias & Fairness. NeurIPS.','Silva A. et al. (2022) Fairness in AI. ICML.','Silva A. et al. (2021) Causal Discovery. JMLR.'], 
        experience: [ 
          { role: 'Associate Professor', company: 'IST', dates: '2020 – Present', bullets: ['Advised 7 PhD students','PI on 3 grants','Published 8 peer-reviewed papers in top-tier venues.'] },
          { role: 'Assistant Professor', company: 'MIT', dates: '2018 – 2020', bullets: ['Taught 4 graduate courses with average rating 4.9/5.','Conducted research on fairness in machine learning.','Collaborated with industry partners on applied research projects.'] },
          { role: 'Postdoctoral Researcher', company: 'Stanford AI Lab', dates: '2016 – 2018', bullets: ['Conducted research on causal inference in ML.','Co-authored 5 papers published in top conferences.','Mentored 3 undergraduate research assistants.'] }
        ], 
        education: [ 
          { degree: 'Ph.D. Computer Science', school: 'CMU', dates: '2012 – 2016' },
          { degree: 'M.Sc. Statistics', school: 'CMU', dates: '2010 – 2012' },
          { degree: 'B.Sc. Mathematics', school: 'University of Lisbon', dates: '2006 – 2010' }
        ], 
        languages: ['English (Fluent)','Portuguese (Native)'],
        projects: ['Fairness in AI research program (funded by NSF).','Causal inference toolkit development (used by 1000+ researchers).','Graduate curriculum redesign for ML ethics.','Industry collaboration on responsible AI practices.'],
        certifications: ['Teaching Excellence Certificate', 'Research Leadership Program'],
        awards: ['Best Paper Award (NeurIPS 2023)', 'Teaching Excellence Award 2022', 'Young Researcher Award 2021']
      }
    }
  ]

  const MiniResumePreview = ({ template, dense = false, fullHeight = false }) => {
    const baseText = {
      color: '#0f172a',
      fontFamily: template.variant === 'serif' ? 'Georgia, Times, serif' : 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal'
    }
    const small = dense ? { name: 12, section: 10, body: 9 } : { name: 17, section: 13, body: 11 }
    const sectionTitleStyle = { fontSize: `${small.section}px`, fontWeight: template.variant === 'serif' ? 700 : 700, color: template.accent, margin: '10px 0 6px 0', letterSpacing: template.variant === 'serif' ? '0.1px' : '0.3px' }
    const bodyText = { fontSize: `${small.body}px`, color: '#334155', lineHeight: 1.6, margin: 0, letterSpacing: template.variant === 'serif' ? '0px' : '0.1px', wordBreak: 'break-word' }
    const accent = template.accentStyle || 'top'
    const header = template.headerStyle || 'bar' // bar | full
    const pageCount = 1
    const variant = template.variant || 'default'

    // Realistic sample catalog (used only to enrich sparse sections, no 'Additional' text)
    const SAMPLE_CATALOG = {
      Technology: {
        projects: ['Feature flag rollout service', 'Zero-downtime deployment pipeline', 'Service-level objectives dashboard'],
        certifications: ['Google Cloud Professional Cloud Developer'],
        awards: ['Quarterly Engineering Excellence Award'],
        publications: []
      },
      Product: {
        projects: ['North-star metric framework', 'Customer journey mapping program', 'Win/loss analysis initiative'],
        certifications: ['Scrum Product Owner (CSPO)'],
        awards: ['Product of the Quarter'],
        publications: []
      },
      Research: {
        projects: ['Clinical NLP pretraining study', 'Bias assessment in EHR models'],
        certifications: [],
        awards: ['Best Poster (AMIA)'],
        publications: ['Kapoor P. (2021) Transfer learning in EHR. AMIA.']
      },
      Academia: {
        projects: ['Curriculum redesign for advanced analytics'],
        certifications: [],
        awards: ["Dean's Teaching Award"],
        publications: ['Wei C. (2023) Privacy-aware MMM. JMR.']
      },
      Finance: {
        projects: ['Rolling 13-week cashflow model', 'Cohort LTV analysis'],
        certifications: ['FMVA®'],
        awards: [],
        publications: []
      },
      Operations: {
        projects: ['Lean transformation roadmap', 'Supplier performance dashboard'],
        certifications: ['Lean Six Sigma Black Belt'],
        awards: ['Operations Excellence Award'],
        publications: []
      },
      Data: {
        projects: ['Data quality framework', 'Customer churn model v2'],
        certifications: ['dbt Analytics Engineer'],
        awards: [],
        publications: []
      },
      Design: {
        projects: ['Accessibility audit and remediation', 'Design token system v2'],
        certifications: [],
        awards: ['AIGA Recognition'],
        publications: []
      },
      Sales: {
        projects: ['ABM motion for strategic accounts'],
        certifications: ['MEDDIC Masterclass'],
        awards: ["President's Club"],
        publications: []
      },
      HR: {
        projects: ['Competency framework rollout'],
        certifications: ['SHRM-CP'],
        awards: [],
        publications: []
      },
      Healthcare: {
        projects: ['Sepsis early warning protocol'],
        certifications: ['PALS'],
        awards: [],
        publications: []
      },
      Education: {
        projects: ['STEM curriculum modernization'],
        certifications: ['State Teaching Certification'],
        awards: ['Teacher of the Year'],
        publications: []
      },
      Legal: {
        projects: ['E-discovery playbook'],
        certifications: [],
        awards: [],
        publications: ['Reed M. (2022) Arbitration update. GA Bar.']
      },
      Engineering: {
        projects: ['Seismic retrofit guidelines'],
        certifications: ['PE (Professional Engineer)'],
        awards: [],
        publications: []
      },
      Marketing: {
        projects: ['Two-tier demand gen engine'],
        certifications: ['Google Ads Certification'],
        awards: ['Effie Bronze'],
        publications: []
      },
      Security: {
        projects: ['Vulnerability management program'],
        certifications: ['OSCP'],
        awards: [],
        publications: []
      },
      Hospitality: {
        projects: ['Seasonal menu optimization'],
        certifications: ['ServSafe Manager'],
        awards: ["Local Chef's Choice"],
        publications: []
      },
      Aviation: {
        projects: ['Fuel efficiency SOP'],
        certifications: ['ATPL'],
        awards: [],
        publications: []
      },
      Media: {
        projects: ['Data journalism toolkit'],
        certifications: [],
        awards: ['Investigative Reporting Shortlist'],
        publications: []
      },
      General: {
        projects: ['OKR rollout'],
        certifications: ['First Aid/CPR'],
        awards: ['Employee of the Quarter'],
        publications: []
      }
    }

    const category = template.category || 'General'
    const cat = SAMPLE_CATALOG[category] || SAMPLE_CATALOG.General

    const enrich = (list, samples, target) => {
      const base = Array.isArray(list) ? [...list] : []
      for (let i = 0; i < samples.length && base.length < target; i++) {
        if (!base.includes(samples[i])) base.push(samples[i])
      }
      return base
    }

    const projectsList = enrich(template.content.projects, cat.projects || [], 3)
    const certsList = enrich(template.content.certifications, cat.certifications || [], 2)
    const awardsList = enrich(template.content.awards, cat.awards || [], 2)
    const pubsList = enrich(template.content.publications, cat.publications || [], 2)
    const educationList = Array.isArray(template.content.education) ? template.content.education : []

    const pageStyle = {
      border: accent === 'border' ? `2px solid ${template.accent}` : '1px solid #e5e7eb',
      borderRadius: variant === 'boxed' ? '10px' : '6px',
      overflow: 'hidden',
      backgroundColor: 'white',
      height: fullHeight ? 'auto' : (dense ? 560 : 900),
      minHeight: fullHeight ? 'auto' : (dense ? 560 : 900),
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }
    const topBarHeight = header === 'bar' && accent === 'top' ? (dense ? 10 : 14) : 0
    const fullHeaderHeight = header === 'full' ? (dense ? 90 : 200) : 0
    const contentPadding = dense ? '10px 12px' : '18px 22px'
    const divider = <div style={{ height: 1, backgroundColor: '#e5e7eb', margin: dense ? '8px 0' : '12px 0' }} />

    const SideAccent = ({ side }) => (
      <div style={{ position: 'absolute', top: 0, bottom: 0, [side]: 0, width: variant === 'sidebar' ? (dense ? 96 : 140) : (dense ? 8 : 12), backgroundColor: template.accent, opacity: 1 }} />
    )

    const MultiPageIndicator = () => (
      pageCount > 1 ? (
        <div style={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Page 1 of {pageCount}</div>
          {[...Array(pageCount)].map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: i === 0 ? template.accent : '#e5e7eb' }} />
          ))}
        </div>
      ) : null
    )

    const renderBullets = (bullets) => {
      if (variant === 'icons') {
        return (bullets || []).slice(0, 6).map((b, bi) => (
          <p key={bi} style={{ ...bodyText, color: '#475569' }}>▪ {b}</p>
        ))
      }
      if (variant === 'timeline') {
        return (bullets || []).slice(0, 6).map((b, bi) => (
          <p key={bi} style={{ ...bodyText, color: '#475569', position: 'relative', paddingLeft: 14 }}>
            <span style={{ position: 'absolute', left: 0, top: 8, width: 8, height: 8, borderRadius: '50%', backgroundColor: template.accent }} />
            {b}
          </p>
        ))
      }
      return (bullets || []).slice(0, 6).map((b, bi) => (
        <p key={bi} style={{ ...bodyText, color: '#475569' }}>• {b}</p>
      ))
    }

    const Section = ({ title, children }) => (
      variant === 'banded'
        ? (
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #eef2f7', borderRadius: 8, padding: dense ? 8 : 12, marginBottom: dense ? 8 : 12 }}>
            <div style={{ ...sectionTitleStyle, margin: 0, marginBottom: 8 }}>{title}</div>
            {children}
          </div>
        ) : (
          <>
            <div style={sectionTitleStyle}>{title}</div>
            {children}
          </>
        )
    )

    if (template.layout === 'two-column') {
      return (
        <div style={pageStyle}>
          {header === 'full' && (
            <div style={{ backgroundColor: template.accent, color: 'white', padding: contentPadding, height: fullHeaderHeight, display: 'flex', alignItems: 'center', gap: 14 }}>
              {template.content.profilePhoto && (
                <img src={template.content.profilePhoto} alt="profile" style={{ width: dense ? 46 : 72, height: dense ? 46 : 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.7)' }} />
              )}
              <div>
                <div style={{ fontSize: header === 'full' ? (dense ? 16 : 22) : small.name, fontWeight: 800 }}>{template.content.name}</div>
                <div style={{ fontSize: dense ? 10 : 13 }}>{template.content.title}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                  {(template.content.contact || []).slice(0, 3).map((c, i) => (
                    <span key={i} style={{ fontSize: dense ? 9 : 11 }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {topBarHeight > 0 && <div style={{ height: topBarHeight, backgroundColor: template.accent }} />}
          {(accent === 'left') && <SideAccent side="left" />}
          {(accent === 'right') && <SideAccent side="right" />}
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ width: variant === 'sidebar' ? '28%' : '32%', borderRight: '1px solid #e5e7eb', padding: contentPadding }}>
              {!fullHeaderHeight && template.content.profilePhoto && (
                <img src={template.content.profilePhoto} alt="profile" style={{ width: dense ? 40 : 64, height: dense ? 40 : 64, borderRadius: '50%', objectFit: 'cover', marginBottom: dense ? 8 : 12 }} />
              )}
              {!fullHeaderHeight && (
                <>
                  <div style={{ ...baseText, fontSize: `${small.name}px`, fontWeight: 800, marginBottom: dense ? '4px' : '6px' }}>{template.content.name}</div>
                  <div style={{ ...bodyText, color: '#64748b', marginBottom: dense ? '8px' : '10px' }}>{template.content.title}</div>
                </>
              )}
              <Section title="Profile"><p style={bodyText}>{template.content.profile}</p></Section>
              <Section title="Skills">
                {(template.content.skills || []).slice(0, 20).map((s, si) => (
                  <p key={si} style={bodyText}>• {typeof s === 'string' ? s : (s.name || s.title || 'Skill')}</p>
                ))}
              </Section>
              <Section title="Contact">{(template.content.contact || []).slice(0, 5).map((c, i) => (<p key={i} style={bodyText}>{c}</p>))}</Section>
            </div>
            <div style={{ flex: 1, padding: contentPadding, overflow: 'hidden', position: 'relative' }}>
              {variant === 'timeline' && (
                <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, backgroundColor: '#e5e7eb' }} />
              )}
              <Section title="Experience">
                {(template.content.experience || []).slice(0, 6).map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: dense ? 8 : 10, position: 'relative', paddingLeft: variant === 'timeline' ? 18 : 0 }}>
                    {variant === 'timeline' && <span style={{ position: 'absolute', left: 2, top: 6, width: 10, height: 10, borderRadius: '50%', backgroundColor: template.accent }} />}
                    <p style={bodyText}><strong>{exp.role}</strong> — {exp.company} ({exp.dates})</p>
                    {renderBullets(exp.bullets)}
                  </div>
                ))}
              </Section>
              {projectsList.length > 0 && (
                <Section title="Projects">
                  {projectsList.slice(0, 6).map((p, pi) => (<p key={pi} style={bodyText}>• {p}</p>))}
                </Section>
              )}
              {certsList.length > 0 && (
                <Section title="Certifications">
                  {certsList.slice(0, 6).map((c, ci) => (<p key={ci} style={bodyText}>• {typeof c === 'string' ? c : (c.name || c.title || 'Certification')}</p>))}
                </Section>
              )}
              {awardsList.length > 0 && (
                <Section title="Awards">
                  {awardsList.slice(0, 6).map((a, ai) => (<p key={ai} style={bodyText}>• {typeof a === 'string' ? a : (a.name || a.title || 'Award')}</p>))}
                </Section>
              )}
              {pubsList.length > 0 && (
                <Section title="Publications">
                  {pubsList.slice(0, 6).map((p, pi) => (<p key={pi} style={bodyText}>• {p}</p>))}
                </Section>
              )}
              <Section title="Education">
                {educationList.slice(0, 6).map((ed, ei) => (<p key={ei} style={bodyText}>• {ed.degree}{ed.school ? ` — ${ed.school}` : ''}</p>))}
              </Section>
            </div>
          </div>
          <MultiPageIndicator />
        </div>
      )
    }

    // single-column
    return (
      <div style={pageStyle}>
        {header === 'full' && (
          <div style={{ backgroundColor: template.accent, color: 'white', padding: contentPadding, height: fullHeaderHeight, display: 'flex', alignItems: 'center', gap: 14 }}>
            {template.content.profilePhoto && (
              <img src={template.content.profilePhoto} alt="profile" style={{ width: dense ? 46 : 72, height: dense ? 46 : 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.7)' }} />
            )}
            <div>
              <div style={{ fontSize: header === 'full' ? (dense ? 16 : 22) : small.name, fontWeight: 800 }}>{template.content.name}</div>
              <div style={{ fontSize: dense ? 10 : 13 }}>{template.content.title}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                {(template.content.contact || []).slice(0, 3).map((c, i) => (
                  <span key={i} style={{ fontSize: dense ? 9 : 11 }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {topBarHeight > 0 && <div style={{ height: topBarHeight, backgroundColor: template.accent }} />}
        {(accent === 'left') && <SideAccent side="left" />}
        {(accent === 'right') && <SideAccent side="right" />}
        <div style={{ padding: contentPadding, overflow: 'hidden', flex: 1 }}>
          {!fullHeaderHeight && (
            <div style={{ display: 'flex', alignItems: 'center', gap: dense ? 10 : 14, marginBottom: dense ? 8 : 12 }}>
              {template.content.profilePhoto && (
                <img src={template.content.profilePhoto} alt="profile" style={{ width: dense ? 40 : 64, height: dense ? 40 : 64, borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div>
                <div style={{ ...baseText, fontSize: `${small.name}px`, fontWeight: 800, marginBottom: '2px' }}>{template.content.name}</div>
                <div style={{ ...bodyText, color: '#64748b' }}>{template.content.title}</div>
              </div>
            </div>
          )}

          <Section title="Profile"><p style={bodyText}>{template.content.profile}</p></Section>

          <Section title="Experience">
            {(template.content.experience || []).slice(0, 8).map((exp, idx) => (
              <div key={idx} style={{ marginBottom: dense ? 8 : 10, position: 'relative', paddingLeft: variant === 'timeline' ? 18 : 0 }}>
                {variant === 'timeline' && <span style={{ position: 'absolute', left: 2, top: 6, width: 10, height: 10, borderRadius: '50%', backgroundColor: template.accent }} />}
                <p style={bodyText}><strong>{exp.role}</strong> — {exp.company} ({exp.dates})</p>
                {renderBullets(exp.bullets)}
              </div>
            ))}
          </Section>

          <Section title="Skills">
            {(template.content.skills || []).slice(0, 24).map((s, si) => (
              <p key={si} style={bodyText}>• {typeof s === 'string' ? s : (s.name || s.title || 'Skill')}</p>
            ))}
          </Section>

          {projectsList.length > 0 && (
            <Section title="Projects">
              {projectsList.slice(0, 8).map((p, pi) => (<p key={pi} style={bodyText}>• {p}</p>))}
            </Section>
          )}
          {pubsList.length > 0 && (
            <Section title="Publications">
              {pubsList.slice(0, 10).map((p, pi) => (<p key={pi} style={bodyText}>• {p}</p>))}
            </Section>
          )}
          {awardsList.length > 0 && (
            <Section title="Awards">
              {awardsList.slice(0, 10).map((a, ai) => (<p key={ai} style={bodyText}>• {typeof a === 'string' ? a : (a.name || a.title || 'Award')}</p>))}
            </Section>
          )}
          {certsList.length > 0 && (
            <Section title="Certifications">
              {certsList.slice(0, 10).map((c, ci) => (<p key={ci} style={bodyText}>• {typeof c === 'string' ? c : (c.name || c.title || 'Certification')}</p>))}
            </Section>
          )}
          <Section title="Education">
            {educationList.slice(0, 8).map((ed, ei) => (<p key={ei} style={bodyText}>• {ed.degree}{ed.school ? ` — ${ed.school}` : ''}</p>))}
          </Section>
          {template.content.languages && (
            <Section title="Languages">
              <p style={bodyText}>{template.content.languages.join(', ')}</p>
            </Section>
          )}
        </div>
        <MultiPageIndicator />
      </div>
    )
  }

  useEffect(() => {
    fetchCareerData()
    fetchUserProfile()
  }, [])

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...')
      const response = await apiService.get('/auth/profile')
      const profile = response.data?.user || response.user
      console.log('User profile response:', response)
      console.log('User profile data:', profile)
      console.log('Profile image field:', profile?.profile_image)
      console.log('Profile image URL:', profile?.profile_image)
      if (profile) {
        setUserProfile(profile)
        console.log('User profile set successfully')
      } else {
        console.log('No profile data found in response')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Advanced data mapping algorithm
  const mapUserDataToTemplate = (template, userData) => {
    console.log('Mapping user data to template:', { userData, template: template.name })
    if (!userData) {
      console.log('No user data available, using template defaults')
      return template
    }

    const mappedContent = {
      ...template.content,
      // Basic info mapping
      name: userData.first_name && userData.last_name 
        ? `${userData.first_name} ${userData.last_name}`.trim()
        : template.content.name,
      title: userData.current_job_title || template.content.title,
      profilePhoto: (() => {
        const profileImg = userData.profile_image || userData.profileImage
        console.log('Profile image mapping:', { 
          userData_profile_image: userData.profile_image, 
          userData_profileImage: userData.profileImage, 
          template_profilePhoto: template.content.profilePhoto,
          final: profileImg || template.content.profilePhoto
        })
        
        // Use the API service's resolveAssetUrl function to convert relative paths to full URLs
        return resolveAssetUrl(profileImg) || template.content.profilePhoto
      })(),
      
      // Contact info mapping
      contact: [
        userData.email || '',
        userData.location || userData.country || '',
        userData.linkedin_url || userData.profile_link1_url || ''
      ].filter(Boolean),
      
      // Profile summary mapping
      profile: userData.bio || template.content.profile,
      
      // Skills mapping
      skills: userData.skills && Array.isArray(userData.skills) 
        ? userData.skills.map(skill => typeof skill === 'string' ? skill : skill.name || skill.title || 'Skill')
        : template.content.skills,
      
      // Experience mapping
      experience: userData.experience && Array.isArray(userData.experience) && userData.experience.length > 0
        ? userData.experience.map(exp => ({
            role: exp.job_title || exp.position || exp.title || 'Position',
            company: exp.company_name || exp.organization || 'Company',
            dates: formatDateRange(exp.start_date, exp.end_date, exp.current),
            bullets: exp.responsibilities && Array.isArray(exp.responsibilities) 
              ? exp.responsibilities 
              : exp.description 
                ? [exp.description]
                : ['Key responsibilities and achievements']
          }))
        : template.content.experience,
      
      // Education mapping
      education: userData.education && Array.isArray(userData.education) && userData.education.length > 0
        ? userData.education.map(edu => ({
            degree: edu.degree || edu.qualification || 'Degree',
            school: edu.institution || edu.school || edu.university || 'Institution',
            dates: formatDateRange(edu.start_date, edu.end_date, edu.current)
          }))
        : template.content.education,
      
      // Certifications mapping
      certifications: userData.certificates && Array.isArray(userData.certificates) && userData.certificates.length > 0
        ? userData.certificates.map(cert => typeof cert === 'string' ? cert : (cert.name || cert.title || cert.certification || 'Certification'))
        : template.content.certifications,
      
      // Languages mapping
      languages: userData.languages 
        ? userData.languages.split(',').map(lang => lang.trim()).filter(Boolean)
        : template.content.languages,
      
      // Keep original template data for sections not in user profile
      projects: template.content.projects || [],
      publications: template.content.publications || [],
      awards: template.content.awards || []
    }

    return {
      ...template,
      content: mappedContent
    }
  }

  // Helper function to format date ranges
  const formatDateRange = (startDate, endDate, isCurrent) => {
    if (!startDate) return 'Present'
    
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
    
    const start = formatDate(startDate)
    const end = isCurrent ? 'Present' : formatDate(endDate)
    
    return end ? `${start} – ${end}` : start
  }

  // Start editing a template with user data
  const startEditingTemplate = (template) => {
    console.log('Starting template edit with user profile:', userProfile)
    const mappedTemplate = mapUserDataToTemplate(template, userProfile)
    console.log('Mapped template content:', mappedTemplate.content)
    setEditingTemplate(template)
    setTemplateData(mappedTemplate.content)
    setActiveTab('cv-builder')
  }

  // Handle profile image upload
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    try {
      setSaving(true)
      
      // Create a FileReader to convert image to base64 for immediate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        console.log('Profile image converted to base64:', imageUrl)
        
        // Update the template data with the new image URL
        setTemplateData({
          ...templateData,
          profilePhoto: imageUrl
        })
        console.log('Profile image updated in template data')
      }
      reader.readAsDataURL(file)
      
    } catch (error) {
      console.error('Error processing profile image:', error)
      alert('Error processing image. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Save edited template data
  const saveTemplateData = async () => {
    if (!editingTemplate || !templateData) return
    
    setSaving(true)
    try {
      console.log('Saving template data:', templateData)
      
      // Create a new document entry
      const newDocument = {
        id: Date.now(), // Simple ID generation
        name: `${templateData.name || 'My'} ${editingTemplate.type === 'CV' ? 'CV' : 'Resume'}`,
        type: editingTemplate.type,
        category: editingTemplate.category,
        templateId: editingTemplate.id,
        templateData: templateData,
        created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: 'Complete'
      }
      
      console.log('Saving document with template ID:', editingTemplate.id)
      console.log('Document structure:', newDocument)
      
      // Add to local myDocuments state
      setMyDocuments(prev => [newDocument, ...prev])
      
      // Save to backend (you can implement this API endpoint)
      try {
        await apiService.post('/user/documents', {
          name: newDocument.name,
          type: newDocument.type,
          category: newDocument.category,
          template_id: editingTemplate.id,
          template_data: templateData,
          status: 'complete'
        })
        console.log('Document saved to backend successfully')
      } catch (backendError) {
        console.warn('Backend save failed, but document saved locally:', backendError)
        // Continue even if backend save fails
      }
      
      alert('Document saved successfully! You can find it in "My Documents" tab.')
      setEditingTemplate(null)
      setTemplateData(null)
      setActiveTab('my-documents') // Switch to My Documents tab
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Error saving template. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Download document as PDF (simple approach using existing component)
  const downloadDocument = async (doc) => {
    try {
      // Find the original template that was used to create this document
      const originalTemplate = professionalTemplates.find(template => template.id === doc.templateId)
      
      if (!originalTemplate) {
        console.error('Original template not found for document:', doc)
        alert('Original template not found. Cannot download this document.')
        return
      }
      
      // Create a temporary template object for rendering using the original template structure
      const templateForDownload = {
        ...originalTemplate,
        content: doc.templateData
      }
      
      // Create a temporary container to render the CV/Resume
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '0'
      tempContainer.style.width = '210mm'
      tempContainer.style.backgroundColor = 'white'
      tempContainer.style.padding = '0'
      tempContainer.style.margin = '0'
      
      // Add to DOM temporarily
      document.body.appendChild(tempContainer)
      
      // Create a React element using MiniResumePreview
      const { createRoot } = await import('react-dom/client')
      const root = createRoot(tempContainer)
      
      // Render the exact MiniResumePreview component
      root.render(React.createElement(MiniResumePreview, { 
        template: templateForDownload, 
        fullHeight: true 
      }))
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      // Clean up
      root.unmount()
      document.body.removeChild(tempContainer)
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Download the PDF
      pdf.save(`${doc.name.replace(/\s+/g, '_')}.pdf`)
      
      console.log('PDF downloaded successfully')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Error downloading PDF. Please try again.')
    }
  }

  // Preview saved document
  const previewSavedDocument = (doc) => {
    console.log('Previewing document:', doc)
    console.log('Looking for template ID:', doc.templateId)
    
    // Find the original template that was used to create this document
    const originalTemplate = professionalTemplates.find(template => template.id === doc.templateId)
    
    console.log('Found original template:', originalTemplate)
    
    if (!originalTemplate) {
      console.error('Original template not found for document:', doc)
      alert('Original template not found. Cannot preview this document.')
      return
    }
    
    // Create a template object for preview using the original template structure
    const templateForPreview = {
      ...originalTemplate,
      content: doc.templateData,
      name: doc.name,
      category: doc.category,
      type: doc.type
    }
    
    console.log('Template for preview:', templateForPreview)
    setPreviewDocument(templateForPreview)
  }

  const fetchCareerData = async () => {
    try {
      setLoading(true)
      // Fetch CV templates from user's documents
      const documentsResponse = await apiService.get('/auth/profile')
      const user = documentsResponse.data.user || {}
      const userDocuments = user.documents || []
      
      // Filter documents by type
      const cvDocs = userDocuments.filter(doc => doc.type === 'CV' || doc.type === 'Resume')
      const coverLetterDocs = userDocuments.filter(doc => doc.type === 'Cover Letter')
      const portfolioDocs = userDocuments.filter(doc => doc.type === 'Portfolio')
      
      // Transform to template format
      const templates = [
        ...cvDocs.map((doc, index) => ({
          id: `cv-${index}`,
          name: doc.name || 'CV Template',
          category: 'Business'
        })),
        ...coverLetterDocs.map((doc, index) => ({
          id: `cover-${index}`,
          name: doc.name || 'Cover Letter Template',
          category: 'Business'
        })),
        ...portfolioDocs.map((doc, index) => ({
          id: `portfolio-${index}`,
          name: doc.name || 'Portfolio Template',
          category: 'Creative'
        }))
      ]
      
      setCvTemplates(templates)
      setMyDocuments(userDocuments.map((doc, index) => ({
        id: index + 1,
        name: doc.name || 'Document',
        type: doc.type || 'Document',
        updated: doc.updated_at ? new Date(doc.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
        status: doc.status || 'Complete'
      })))
    } catch (error) {
      console.error('Error fetching career data:', error)
      // Keep empty arrays as fallback
      setCvTemplates([])
      setMyDocuments([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ 
        padding: screenSize.isDesktop 
          ? '24px 32px 24px 32px' 
          : screenSize.isTablet
            ? '20px 20px 20px 20px'
            : '16px 12px 90px 12px'
      }}>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: screenSize.isMobile ? '2px' : '4px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: screenSize.isMobile ? '6px 8px' : '8px 12px',
                background: activeTab === tab.id ? '#16a34a' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: screenSize.isMobile ? '12px' : '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                minHeight: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              {screenSize.isMobile ? (
                tab.id === 'my-documents' ? 'Documents' : tab.name
              ) : (
                tab.name
              )}
            </button>
          ))}
        </div>



        {/* CV Builder Tab */}
        {activeTab === 'cv-builder' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: getGridGap(screenSize) 
          }}>
            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 12px 0'
              }}>
                Create Your CV
              </h3>
              {selectedTemplate && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Mini preview swatch */}
                    <div style={{ width: '36px', height: '48px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb', position: 'relative' }}>
                      <div style={{ height: '6px', backgroundColor: selectedTemplate.accent, borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '6px', right: '6px', height: '4px', backgroundColor: '#e5e7eb' }} />
                      <div style={{ position: 'absolute', top: '20px', left: '6px', width: '60%', height: '4px', backgroundColor: '#e5e7eb' }} />
                      <div style={{ position: 'absolute', top: '28px', left: '6px', right: '6px', height: '3px', backgroundColor: '#e5e7eb' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{selectedTemplate.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedTemplate.category} • {selectedTemplate.layout.replace('-', ' ')}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setPreviewTemplate(selectedTemplate)}
                      style={{
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => startEditingTemplate(selectedTemplate)}
                      style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Start editing
                    </button>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <Plus size={16} />
                  Create New
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'white',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <Upload size={16} />
                  Upload CV
                </button>
              </div>
            </div>

            {/* Tools Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
              gap: getGridGap(screenSize)
            }}>
            {[
              { title: 'CV Tips', desc: 'Writing guidance', icon: FileText },
              { title: 'Cover Letters', desc: 'Letter templates', icon: Edit3 },
              { title: 'Portfolio', desc: 'Showcase work', icon: Eye }
            ].map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.title} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#16a34a'
                  e.target.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#f0f0f0'
                  e.target.style.transform = 'translateY(0)'
                }}
                >
                  <Icon size={20} color="#16a34a" />
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 2px 0'
                    }}>
                      {tool.title}
                    </h4>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {tool.desc}
                    </p>
                  </div>
                </div>
              )
            })}
            </div>

            {/* Template Editor Interface */}
            {editingTemplate && templateData && (
          <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                marginTop: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                    Editing: {editingTemplate.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={saveTemplateData}
                      disabled={saving}
                      style={{ 
                        backgroundColor: saving ? '#94a3b8' : '#16a34a', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        padding: '10px 16px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save CV'}
                    </button>
                    <button 
                      onClick={() => { setEditingTemplate(null); setTemplateData(null); }}
                      style={{ 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                  borderRadius: '8px',
                        padding: '10px 16px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 400px', gap: '24px' }}>
                  {/* Live Preview */}
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Live Preview</h4>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', maxHeight: '600px', overflowY: 'auto' }}>
                      <MiniResumePreview template={{...editingTemplate, content: templateData}} fullHeight={true} />
                    </div>
                  </div>

                  {/* Editor Form */}
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Edit Content</h4>
                    
                    {!userProfile && (
                      <div style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
                        <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                          ⚠️ No user profile data found. Please complete your profile first to auto-populate this template.
                        </p>
                      </div>
                    )}
                    
                    {/* Basic Info Editor */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Full Name</label>
                      <input
                        type="text"
                        value={templateData.name || ''}
                        onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Job Title</label>
                      <input
                        type="text"
                        value={templateData.title || ''}
                        onChange={(e) => setTemplateData({...templateData, title: e.target.value})}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      />
                    </div>

                    {/* Profile Picture Section */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Profile Picture</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {templateData.profilePhoto ? (
                          <img 
                            src={templateData.profilePhoto} 
                            alt="Profile" 
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              borderRadius: '50%', 
                              objectFit: 'cover',
                              border: '2px solid #e5e7eb'
                            }} 
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              borderRadius: '50%', 
                              backgroundColor: '#f3f4f6',
                              border: '2px solid #e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '500'
                            }}
                          >
                            No Image
                </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            style={{ display: 'none' }}
                            id="profile-image-upload"
                          />
                          <label
                            htmlFor="profile-image-upload"
                            style={{
                              display: 'inline-block',
                    backgroundColor: '#16a34a',
                    color: 'white',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              border: 'none'
                            }}
                          >
                            {templateData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                          </label>
                          {userProfile?.profile_image && !templateData.profilePhoto && (
                            <button
                              onClick={() => {
                                const fullUrl = resolveAssetUrl(userProfile.profile_image)
                                setTemplateData({...templateData, profilePhoto: fullUrl})
                              }}
                              style={{
                                marginLeft: '8px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                border: 'none'
                              }}
                            >
                              Use Profile Photo
                            </button>
                          )}
                          {templateData.profilePhoto && (
                            <button
                              onClick={() => setTemplateData({...templateData, profilePhoto: ''})}
                              style={{
                                marginLeft: '8px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                border: 'none'
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Profile Summary</label>
                      <textarea
                        value={templateData.profile || ''}
                        onChange={(e) => setTemplateData({...templateData, profile: e.target.value})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Skills (one per line)</label>
                      <textarea
                        value={Array.isArray(templateData.skills) ? templateData.skills.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, skills: e.target.value.split('\n').filter(s => s.trim())})}
                        rows={4}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Contact Info (one per line)</label>
                      <textarea
                        value={Array.isArray(templateData.contact) ? templateData.contact.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, contact: e.target.value.split('\n').filter(c => c.trim())})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Languages (one per line)</label>
                      <textarea
                        value={Array.isArray(templateData.languages) ? templateData.languages.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, languages: e.target.value.split('\n').filter(l => l.trim())})}
                        rows={2}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>

                    {/* Experience Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Experience</h5>
                      {Array.isArray(templateData.experience) && templateData.experience.map((exp, expIndex) => (
                        <div key={expIndex} style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Job Title</label>
                              <input
                                type="text"
                                value={exp.role || ''}
                                onChange={(e) => {
                                  const newExp = [...templateData.experience]
                                  newExp[expIndex] = {...newExp[expIndex], role: e.target.value}
                                  setTemplateData({...templateData, experience: newExp})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Company</label>
                              <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => {
                                  const newExp = [...templateData.experience]
                                  newExp[expIndex] = {...newExp[expIndex], company: e.target.value}
                                  setTemplateData({...templateData, experience: newExp})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Dates</label>
                              <input
                                type="text"
                                value={exp.dates || ''}
                                onChange={(e) => {
                                  const newExp = [...templateData.experience]
                                  newExp[expIndex] = {...newExp[expIndex], dates: e.target.value}
                                  setTemplateData({...templateData, experience: newExp})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'end' }}>
                              <button
                                onClick={() => {
                                  const newExp = templateData.experience.filter((_, i) => i !== expIndex)
                                  setTemplateData({...templateData, experience: newExp})
                                }}
                                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Responsibilities (one per line)</label>
                            <textarea
                              value={Array.isArray(exp.bullets) ? exp.bullets.join('\n') : ''}
                              onChange={(e) => {
                                const newExp = [...templateData.experience]
                                newExp[expIndex] = {...newExp[expIndex], bullets: e.target.value.split('\n').filter(b => b.trim())}
                                setTemplateData({...templateData, experience: newExp})
                              }}
                              rows={3}
                              style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', resize: 'vertical' }}
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newExp = [...(templateData.experience || []), { role: '', company: '', dates: '', bullets: [] }]
                          setTemplateData({...templateData, experience: newExp})
                        }}
                        style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Add Experience
                      </button>
                    </div>

                    {/* Education Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Education</h5>
                      {Array.isArray(templateData.education) && templateData.education.map((edu, eduIndex) => (
                        <div key={eduIndex} style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Degree</label>
                              <input
                                type="text"
                                value={edu.degree || ''}
                                onChange={(e) => {
                                  const newEdu = [...templateData.education]
                                  newEdu[eduIndex] = {...newEdu[eduIndex], degree: e.target.value}
                                  setTemplateData({...templateData, education: newEdu})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>School</label>
                              <input
                                type="text"
                                value={edu.school || ''}
                                onChange={(e) => {
                                  const newEdu = [...templateData.education]
                                  newEdu[eduIndex] = {...newEdu[eduIndex], school: e.target.value}
                                  setTemplateData({...templateData, education: newEdu})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Dates</label>
                              <input
                                type="text"
                                value={edu.dates || ''}
                                onChange={(e) => {
                                  const newEdu = [...templateData.education]
                                  newEdu[eduIndex] = {...newEdu[eduIndex], dates: e.target.value}
                                  setTemplateData({...templateData, education: newEdu})
                                }}
                                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  const newEdu = templateData.education.filter((_, i) => i !== eduIndex)
                                  setTemplateData({...templateData, education: newEdu})
                                }}
                                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newEdu = [...(templateData.education || []), { degree: '', school: '', dates: '' }]
                          setTemplateData({...templateData, education: newEdu})
                        }}
                        style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Add Education
                      </button>
                    </div>

                    {/* Projects Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Projects</h5>
                      <textarea
                        value={Array.isArray(templateData.projects) ? templateData.projects.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, projects: e.target.value.split('\n').filter(p => p.trim())})}
                        rows={4}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                        placeholder="Enter projects, one per line..."
                      />
                    </div>

                    {/* Certifications Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Certifications</h5>
                      <textarea
                        value={Array.isArray(templateData.certifications) ? templateData.certifications.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, certifications: e.target.value.split('\n').filter(c => c.trim())})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                        placeholder="Enter certifications, one per line..."
                      />
                    </div>

                    {/* Awards Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Awards</h5>
                      <textarea
                        value={Array.isArray(templateData.awards) ? templateData.awards.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, awards: e.target.value.split('\n').filter(a => a.trim())})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                        placeholder="Enter awards, one per line..."
                      />
                    </div>

                    {/* Publications Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Publications</h5>
                      <textarea
                        value={Array.isArray(templateData.publications) ? templateData.publications.join('\n') : ''}
                        onChange={(e) => setTemplateData({...templateData, publications: e.target.value.split('\n').filter(p => p.trim())})}
                        rows={3}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                        placeholder="Enter publications, one per line..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'resume', label: 'Resumes' },
                { id: 'cv', label: 'CVs' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTemplateFilter(f.id)}
                  style={{
                    backgroundColor: templateFilter === f.id ? '#16a34a' : 'white',
                    color: templateFilter === f.id ? 'white' : '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >{f.label}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`, gap: getGridGap(screenSize) }}>
              {professionalTemplates
                .filter((t) => templateFilter === 'all' ? true : t.type === templateFilter)
                .map((template) => (
                <div key={template.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', transition: 'all 0.2s ease-in-out' }}>
                  <MiniResumePreview template={template} dense />
                  {/* Meta and actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{template.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{template.category} • {template.layout.replace('-', ' ')} • {template.type.toUpperCase()}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => { setSelectedTemplate(template); setActiveTab('cv-builder') }}
                        style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                      >Use</button>
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        style={{ backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer' }}
                      >
                    <Eye size={12} />
                  </button>
                    </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* My Documents Tab */}
        {activeTab === 'my-documents' && (
          <div>
            {myDocuments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <FileText size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 8px 0'
                }}>
                  No Documents Yet
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 20px 0'
                }}>
                  Create and save your first CV or resume to see it here
                </p>
                <button
                  onClick={() => setActiveTab('templates')}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Browse Templates
                </button>
              </div>
            ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
            gap: getGridGap(screenSize)
          }}>
            {myDocuments.map((doc) => (
              <div key={doc.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#16a34a'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#f0f0f0'
                e.target.style.transform = 'translateY(0)'
              }}
              >
                <FileText size={20} color="#64748b" />
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 4px 0'
                  }}>
                    {doc.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {doc.type}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {doc.updated}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: doc.status === 'Complete' ? '#16a34a' : '#f59e0b',
                      backgroundColor: doc.status === 'Complete' ? '#f0fdf4' : '#fef3c7',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {doc.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => previewSavedDocument(doc)}
                    style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '6px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8fafc'
                      e.target.style.borderColor = '#16a34a'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white'
                      e.target.style.borderColor = '#e2e8f0'
                    }}
                    title="Preview Document"
                  >
                    <Eye size={12} />
                  </button>
                  <button 
                    onClick={() => downloadDocument(doc)}
                    style={{
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '6px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8fafc'
                      e.target.style.borderColor = '#16a34a'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white'
                      e.target.style.borderColor = '#e2e8f0'
                    }}
                    title="Download Document"
                  >
                    <Download size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        )}
      </div>
      {/* Preview Modal */}
      {previewTemplate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', width: screenSize.isMobile ? '92%' : '90%', maxWidth: '1000px', maxHeight: '95vh', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{previewTemplate.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{previewTemplate.category} • {previewTemplate.layout.replace('-', ' ')}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { startEditingTemplate(previewTemplate); setPreviewTemplate(null) }} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Use template</button>
                <button onClick={() => setPreviewTemplate(null)} style={{ backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Close</button>
              </div>
            </div>
            <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white' }}>
                <MiniResumePreview template={previewTemplate} fullHeight={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Document Preview Modal */}
      {previewDocument && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', width: screenSize.isMobile ? '92%' : '90%', maxWidth: '1000px', maxHeight: '95vh', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{previewDocument.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{previewDocument.category} • {previewDocument.type}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => downloadDocument({ 
                    name: previewDocument.name, 
                    templateData: previewDocument.content,
                    templateId: previewDocument.id
                  })}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => setPreviewDocument(null)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <X size={14} />
                  Close
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              <MiniResumePreview 
                template={previewDocument} 
                fullHeight={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CareerTools
export const professionalTemplates = [
    {
      id: 'split-royal-blue', type: 'resume', name: 'Royal Blue Split', category: 'Technology', accent: '#1e40af', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-right-modern',
      content: {
        name: 'Lisa Wang', title: 'Product Manager',
        profilePhoto: 'https://i.pravatar.cc/100?img=27',
        contact: ['lisa@example.com', 'Seattle, WA', 'linkedin.com/in/lisawang'],
        profile: 'Strategic product manager driving innovation in enterprise software solutions.',
        skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Roadmapping', 'Stakeholder Management', 'A/B Testing', 'SQL', 'Figma', 'Jira'],
        experience: [
          { role: 'Senior Product Manager', company: 'Microsoft', dates: '2021 – Present', bullets: ['Led product strategy for $50M+ revenue product line.', 'Managed cross-functional team of 15+ engineers and designers.', 'Increased user engagement by 40% through data-driven improvements.'] },
          { role: 'Product Manager', company: 'Amazon', dates: '2019 – 2021', bullets: ['Launched new features used by 1M+ customers.', 'Conducted user research and usability testing sessions.', 'Collaborated with engineering teams on technical requirements.'] },
          { role: 'Associate Product Manager', company: 'Google', dates: '2017 – 2019', bullets: ['Supported product development for mobile applications.', 'Analyzed user metrics and provided actionable insights.', 'Worked with design team on user experience improvements.'] }
        ],
        education: [
          { degree: 'M.S. Computer Science', school: 'Stanford University', dates: '2015 – 2017' },
          { degree: 'B.S. Engineering', school: 'UC Berkeley', dates: '2011 – 2015' },
          { degree: 'Product Management Certificate', school: 'General Assembly', dates: '2018' }
        ],
        projects: ['AI-powered recommendation engine (increased conversion by 25%).', 'Mobile app redesign (improved user retention by 30%).', 'Data analytics dashboard for internal teams.', 'Customer feedback integration system.'],
        certifications: ['Certified Scrum Product Owner (CSPO)', 'Google Analytics Certified', 'AWS Cloud Practitioner'],
        awards: ['Product Innovation Award 2023', 'Customer Impact Award 2022', 'Team Leadership Excellence 2021'],
        languages: ['English (Fluent)', 'Mandarin (Native)', 'Japanese (Basic)']
      }
    },
    {
      id: 'split-burgundy', type: 'resume', name: 'Burgundy Split', category: 'Healthcare', accent: '#7c2d12', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-right-elegant',
      content: {
        name: 'Dr. Robert Kim', title: 'Chief Medical Officer',
        profilePhoto: 'https://i.pravatar.cc/100?img=28',
        contact: ['robert@example.com', 'Boston, MA', 'linkedin.com/in/drrobertkim'],
        profile: 'Experienced physician executive leading clinical operations and quality improvement initiatives.',
        skills: ['Clinical Leadership', 'Healthcare Management', 'Quality Improvement', 'Patient Safety', 'Regulatory Compliance', 'Strategic Planning', 'Team Building', 'Medical Informatics', 'HIPAA', 'ACO Management'],
        experience: [
          { role: 'Chief Medical Officer', company: 'Mass General Hospital', dates: '2020 – Present', bullets: ['Oversaw clinical operations for 1,000+ bed hospital.', 'Implemented quality improvement programs reducing readmissions by 25%.', 'Led medical staff of 500+ physicians and advanced practitioners.'] },
          { role: 'VP of Medical Affairs', company: 'Brigham Health', dates: '2017 – 2020', bullets: ['Developed clinical protocols and best practices.', 'Managed physician recruitment and retention programs.', 'Ensured compliance with regulatory requirements.'] },
          { role: 'Medical Director', company: 'Partners Healthcare', dates: '2014 – 2017', bullets: ['Led clinical quality initiatives across multiple sites.', 'Collaborated with IT teams on EHR implementation.', 'Mentored junior physicians and residents.'] }
        ],
        education: [
          { degree: 'M.D. Medicine', school: 'Harvard Medical School', dates: '2006 – 2010' },
          { degree: 'M.P.H. Health Policy', school: 'Harvard T.H. Chan', dates: '2012 – 2014' },
          { degree: 'Internal Medicine Residency', school: 'Mass General Hospital', dates: '2010 – 2013' }
        ],
        projects: ['Patient safety initiative (reduced medical errors by 40%).', 'Telemedicine program implementation (served 10K+ patients).', 'Clinical decision support system development.', 'Physician wellness and burnout prevention program.'],
        certifications: ['Board Certified Internal Medicine', 'Fellow of American College of Physicians', 'Healthcare Quality Management Certified'],
        awards: ['Physician Leadership Award 2023', 'Patient Safety Excellence Award 2022', 'Innovation in Healthcare Award 2021'],
        languages: ['English (Fluent)', 'Korean (Native)', 'Spanish (Conversational)']
      }
    },
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
      id: 'split-teal', type: 'resume', name: 'Teal Split', category: 'Design', accent: '#0d9488', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-right-creative',
      content: {
        name: 'Elena Rodriguez', title: 'Creative Director',
        profilePhoto: 'https://i.pravatar.cc/100?img=29',
        contact: ['elena@example.com', 'Barcelona, Spain', 'behance.net/elenarodriguez'],
        profile: 'Award-winning creative director with expertise in brand identity and digital experiences.',
        skills: ['Creative Direction', 'Brand Identity', 'Art Direction', 'Adobe Creative Suite', 'Figma', 'Sketch', 'Motion Graphics', 'Photography', 'Team Leadership', 'Client Relations'],
        experience: [
          { role: 'Creative Director', company: 'Wieden+Kennedy', dates: '2021 – Present', bullets: ['Led creative teams for global brands including Nike and Coca-Cola.', 'Developed award-winning campaigns with 500M+ impressions.', 'Managed creative budget of $10M+ annually.'] },
          { role: 'Senior Art Director', company: 'TBWA', dates: '2018 – 2021', bullets: ['Created visual concepts for advertising campaigns.', 'Collaborated with copywriters and strategists on creative briefs.', 'Presented creative work to clients and stakeholders.'] },
          { role: 'Art Director', company: 'Ogilvy', dates: '2016 – 2018', bullets: ['Designed print and digital advertising materials.', 'Worked with photographers and illustrators on projects.', 'Maintained brand consistency across all touchpoints.'] }
        ],
        education: [
          { degree: 'M.F.A. Graphic Design', school: 'Art Center College of Design', dates: '2014 – 2016' },
          { degree: 'B.A. Visual Arts', school: 'Universitat de Barcelona', dates: '2010 – 2014' },
          { degree: 'Digital Marketing Certificate', school: 'Google', dates: '2019' }
        ],
        projects: ['Rebranding campaign for major tech company (increased brand recognition by 60%).', 'Interactive digital experience for luxury brand.', 'Social media campaign with 2M+ engagements.', 'Brand identity system for startup ecosystem.'],
        certifications: ['Adobe Certified Expert (ACE)', 'Google Ads Certified', 'HubSpot Content Marketing Certified'],
        awards: ['Cannes Lions Gold 2023', 'D&AD Yellow Pencil 2022', 'One Show Silver 2021'],
        languages: ['English (Fluent)', 'Spanish (Native)', 'Catalan (Native)', 'French (Conversational)']
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
      id: 'split-rose', type: 'resume', name: 'Rose Split', category: 'Marketing', accent: '#e11d48', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-right-vibrant',
      content: {
        name: 'Sophie Chen', title: 'Brand Marketing Manager',
        profilePhoto: 'https://i.pravatar.cc/100?img=31',
        contact: ['sophie@example.com', 'Los Angeles, CA', 'instagram.com/sophiechen'],
        profile: 'Creative brand marketer driving growth through innovative campaigns and strategic partnerships.',
        skills: ['Brand Strategy', 'Campaign Management', 'Social Media', 'Content Creation', 'Influencer Marketing', 'Event Planning', 'Analytics', 'Creative Direction', 'Adobe Creative Suite', 'HubSpot'],
        experience: [
          { role: 'Brand Marketing Manager', company: 'Nike', dates: '2021 – Present', bullets: ['Led brand campaigns reaching 50M+ consumers globally.', 'Managed $15M+ annual marketing budget across multiple channels.', 'Developed influencer partnerships increasing brand awareness by 40%.'] },
          { role: 'Senior Marketing Specialist', company: 'Adidas', dates: '2019 – 2021', bullets: ['Executed integrated marketing campaigns for product launches.', 'Collaborated with creative teams on campaign development.', 'Analyzed campaign performance and provided optimization recommendations.'] },
          { role: 'Marketing Coordinator', company: 'Puma', dates: '2017 – 2019', bullets: ['Supported brand marketing initiatives and events.', 'Managed social media content and community engagement.', 'Coordinated with external agencies and vendors.'] }
        ],
        education: [
          { degree: 'M.B.A. Marketing', school: 'UCLA Anderson', dates: '2015 – 2017' },
          { degree: 'B.A. Communications', school: 'USC', dates: '2011 – 2015' },
          { degree: 'Digital Marketing Certificate', school: 'Google', dates: '2018' }
        ],
        projects: ['Viral social media campaign (10M+ impressions and 2M+ engagements).', 'Brand partnership with major sports league (increased sales by 30%).', 'Influencer marketing program (500K+ reach and 15% conversion).', 'Event marketing strategy for product launch (attracted 50K+ attendees).'],
        certifications: ['Google Ads Certified', 'Facebook Blueprint Certified', 'HubSpot Content Marketing Certified', 'Google Analytics Certified'],
        awards: ['Marketing Campaign of the Year 2023', 'Best Brand Partnership 2022', 'Innovation in Digital Marketing 2021'],
        languages: ['English (Fluent)', 'Mandarin (Native)', 'Spanish (Conversational)']
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
      id: 'split-indigo', type: 'resume', name: 'Indigo Split', category: 'Consulting', accent: '#4338ca', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-right-professional',
      content: {
        name: 'James Mitchell', title: 'Senior Consultant',
        profilePhoto: 'https://i.pravatar.cc/100?img=30',
        contact: ['james@example.com', 'New York, NY', 'linkedin.com/in/jamesmitchell'],
        profile: 'Management consultant specializing in digital transformation and operational excellence.',
        skills: ['Strategy Consulting', 'Digital Transformation', 'Change Management', 'Process Improvement', 'Data Analytics', 'Project Management', 'Client Relations', 'Business Development', 'PowerPoint', 'Excel'],
        experience: [
          { role: 'Senior Consultant', company: 'Bain & Company', dates: '2020 – Present', bullets: ['Led digital transformation projects for Fortune 500 clients.', 'Developed strategic recommendations saving clients $100M+ annually.', 'Managed project teams of 8-12 consultants and analysts.'] },
          { role: 'Consultant', company: 'McKinsey & Company', dates: '2018 – 2020', bullets: ['Conducted market analysis and competitive intelligence studies.', 'Designed and implemented operational improvement frameworks.', 'Presented findings to C-level executives and board members.'] },
          { role: 'Business Analyst', company: 'Deloitte', dates: '2016 – 2018', bullets: ['Analyzed business processes and identified improvement opportunities.', 'Created detailed project documentation and status reports.', 'Supported senior consultants on client engagements.'] }
        ],
        education: [
          { degree: 'M.B.A. Strategy', school: 'Wharton School', dates: '2014 – 2016' },
          { degree: 'B.S. Engineering', school: 'MIT', dates: '2010 – 2014' },
          { degree: 'PMP Certification', school: 'PMI', dates: '2019' }
        ],
        projects: ['Digital transformation roadmap for retail client (increased efficiency by 35%).', 'Market entry strategy for European expansion.', 'Supply chain optimization project (reduced costs by 20%).', 'Organizational restructuring for manufacturing company.'],
        certifications: ['Project Management Professional (PMP)', 'Certified Management Consultant (CMC)', 'Six Sigma Black Belt'],
        awards: ['Consultant of the Year 2023', 'Best Client Impact Award 2022', 'Innovation in Strategy Award 2021'],
        languages: ['English (Fluent)', 'French (Conversational)', 'German (Basic)']
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
      id: 'split-dark-green', type: 'resume', name: 'Dark Green Split', category: 'Finance', accent: '#065f46', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-left',
      content: {
        name: 'Michael Torres', title: 'Investment Banker',
        profilePhoto: 'https://i.pravatar.cc/100?img=26',
        contact: ['michael@example.com', 'London, UK', 'linkedin.com/in/michaeltorres'],
        profile: 'Senior investment banker specializing in M&A transactions and capital markets.',
        skills: ['M&A', 'Capital Markets', 'Financial Modeling', 'Valuation', 'Due Diligence', 'Client Relations', 'Deal Structuring', 'Risk Assessment', 'Excel', 'Bloomberg'],
        experience: [
          { role: 'Vice President', company: 'Goldman Sachs', dates: '2020 – Present', bullets: ['Led M&A transactions worth $2B+ in total value.', 'Managed client relationships with Fortune 500 companies.', 'Developed financial models for complex deal structures.'] },
          { role: 'Associate', company: 'Morgan Stanley', dates: '2018 – 2020', bullets: ['Executed equity and debt capital market transactions.', 'Conducted due diligence and valuation analysis.', 'Prepared pitch books and client presentations.'] },
          { role: 'Analyst', company: 'JP Morgan', dates: '2016 – 2018', bullets: ['Supported senior bankers on live deal execution.', 'Created financial models and valuation analyses.', 'Assisted with market research and competitive analysis.'] }
        ],
        education: [
          { degree: 'M.B.A. Finance', school: 'London Business School', dates: '2014 – 2016' },
          { degree: 'B.A. Economics', school: 'Oxford University', dates: '2010 – 2014' },
          { degree: 'CFA Charterholder', school: 'CFA Institute', dates: '2018' }
        ],
        projects: ['Cross-border M&A deal valued at $500M (led execution).', 'IPO preparation for tech startup (successful listing).', 'Debt restructuring for distressed company (saved $100M).', 'Private equity fund raising (raised $2B).'],
        certifications: ['Chartered Financial Analyst (CFA)', 'Financial Risk Manager (FRM)', 'Series 7 & 63 Licensed'],
        awards: ['Deal of the Year 2023', 'Top Performer Award 2022', 'Client Excellence Recognition 2021'],
        languages: ['English (Fluent)', 'Spanish (Native)', 'French (Conversational)']
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
      id: 'split-modern-blue', type: 'resume', name: 'Modern Split Blue', category: 'Technology', accent: '#3b82f6', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-left',
      content: {
        name: 'Sarah Chen', title: 'Full Stack Developer',
        profilePhoto: 'https://i.pravatar.cc/100?img=20',
        contact: ['sarah@example.com', 'New York, NY', 'github.com/sarahchen'],
        profile: 'Passionate developer building scalable web applications with modern technologies.',
        skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'Jest', 'Cypress'],
        experience: [
          { role: 'Senior Full Stack Developer', company: 'TechFlow', dates: '2021 – Present', bullets: ['Led development of microservices architecture serving 1M+ users.', 'Implemented CI/CD pipelines reducing deployment time by 60%.', 'Mentored 3 junior developers and conducted code reviews.'] },
          { role: 'Full Stack Developer', company: 'StartupXYZ', dates: '2019 – 2021', bullets: ['Built responsive web applications using React and Node.js.', 'Integrated third-party APIs and payment processing systems.', 'Optimized database queries improving performance by 40%.'] },
          { role: 'Frontend Developer', company: 'WebCraft', dates: '2018 – 2019', bullets: ['Developed user interfaces for e-commerce platforms.', 'Collaborated with UX designers to implement pixel-perfect designs.', 'Implemented responsive design for mobile and desktop devices.'] }
        ],
        education: [
          { degree: 'B.Sc. Computer Science', school: 'NYU', dates: '2014 – 2018' },
          { degree: 'AWS Certified Developer', school: 'Amazon', dates: '2020' },
          { degree: 'React Advanced Patterns', school: 'Frontend Masters', dates: '2021' }
        ],
        projects: ['E-commerce platform with 50K+ products (React, Node.js).', 'Real-time chat application with WebSocket integration.', 'Mobile app for food delivery with React Native.', 'Open-source library for form validation (500+ GitHub stars).'],
        certifications: ['AWS Certified Developer Associate', 'Google Cloud Professional Developer', 'Certified Kubernetes Application Developer'],
        awards: ['Employee of the Year 2022', 'Innovation Award for Microservices Architecture', 'Best Code Quality Award 2021'],
        languages: ['English (Fluent)', 'Mandarin (Native)', 'Spanish (Conversational)']
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
      id: 'split-elegant-purple', type: 'resume', name: 'Elegant Split Purple', category: 'Design', accent: '#8b5cf6', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-left',
      content: {
        name: 'Marcus Johnson', title: 'UX Designer',
        profilePhoto: 'https://i.pravatar.cc/100?img=21',
        contact: ['marcus@example.com', 'Austin, TX', 'dribbble.com/marcusj'],
        profile: 'Creative UX designer focused on user-centered design and digital experiences.',
        skills: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Sketch', 'Adobe XD', 'Usability Testing', 'Design Systems', 'HTML/CSS', 'JavaScript'],
        experience: [
          { role: 'Senior UX Designer', company: 'DesignStudio', dates: '2021 – Present', bullets: ['Led UX design for mobile app with 2M+ users.', 'Conducted user research studies with 500+ participants.', 'Established design system used across 5 product teams.'] },
          { role: 'UX Designer', company: 'TechCorp', dates: '2019 – 2021', bullets: ['Designed user interfaces for web applications.', 'Collaborated with product managers and developers.', 'Improved user satisfaction scores by 35%.'] },
          { role: 'Junior UX Designer', company: 'StartupLab', dates: '2018 – 2019', bullets: ['Created wireframes and prototypes for new features.', 'Conducted usability testing sessions.', 'Assisted with user research and data analysis.'] }
        ],
        education: [
          { degree: 'B.F.A. Graphic Design', school: 'Art Institute', dates: '2014 – 2018' },
          { degree: 'UX Design Certificate', school: 'General Assembly', dates: '2018' },
          { degree: 'User Research Methods', school: 'Nielsen Norman Group', dates: '2020' }
        ],
        projects: ['Mobile banking app redesign (increased user engagement by 40%).', 'E-commerce platform optimization (conversion rate +25%).', 'Design system documentation and component library.', 'Accessibility audit and improvement initiative.'],
        certifications: ['Certified Usability Analyst (CUA)', 'Google UX Design Certificate', 'Adobe Certified Expert'],
        awards: ['Design Excellence Award 2023', 'Best Mobile UX 2022', 'Innovation in Design 2021'],
        languages: ['English (Fluent)', 'Spanish (Conversational)']
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
    {
      id: 'split-professional-green', type: 'resume', name: 'Professional Split Green', category: 'Finance', accent: '#10b981', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-left',
      content: {
        name: 'David Kim', title: 'Financial Advisor',
        profilePhoto: 'https://i.pravatar.cc/100?img=22',
        contact: ['david@example.com', 'Chicago, IL', 'linkedin.com/in/davidkim'],
        profile: 'Certified financial advisor helping clients achieve their financial goals through strategic planning.',
        skills: ['Financial Planning', 'Investment Management', 'Retirement Planning', 'Tax Strategy', 'Risk Management', 'Client Relations', 'Portfolio Analysis', 'CFP', 'Series 7', 'Series 66'],
        experience: [
          { role: 'Senior Financial Advisor', company: 'Merrill Lynch', dates: '2020 – Present', bullets: ['Managed $50M+ in client assets across 200+ households.', 'Developed comprehensive financial plans increasing client satisfaction by 40%.', 'Led team of 3 junior advisors and support staff.'] },
          { role: 'Financial Advisor', company: 'Edward Jones', dates: '2017 – 2020', bullets: ['Built client base from 0 to 150+ households.', 'Achieved top 10% performance in district for 3 consecutive years.', 'Specialized in retirement planning for small business owners.'] },
          { role: 'Associate Financial Advisor', company: 'Fidelity', dates: '2015 – 2017', bullets: ['Supported senior advisors with client meetings and analysis.', 'Conducted market research and investment due diligence.', 'Maintained compliance with FINRA regulations.'] }
        ],
        education: [
          { degree: 'M.B.A. Finance', school: 'Northwestern Kellogg', dates: '2013 – 2015' },
          { degree: 'B.S. Economics', school: 'University of Illinois', dates: '2009 – 2013' },
          { degree: 'Certified Financial Planner (CFP)', school: 'CFP Board', dates: '2016' }
        ],
        projects: ['Retirement planning software implementation (served 500+ clients).', 'Tax optimization strategy for high-net-worth clients.', 'Educational webinar series on financial literacy (1,000+ attendees).', 'Portfolio rebalancing algorithm development.'],
        certifications: ['Certified Financial Planner (CFP)', 'Chartered Financial Analyst (CFA)', 'Series 7 & 66 Licensed'],
        awards: ['Top Performer Award 2023', 'Client Satisfaction Excellence 2022', 'Rising Star Advisor 2021'],
        languages: ['English (Fluent)', 'Korean (Native)', 'Spanish (Basic)']
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
      id: 'split-creative-orange', type: 'resume', name: 'Creative Split Orange', category: 'Marketing', accent: '#f97316', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-left',
      content: {
        name: 'Isabella Rodriguez', title: 'Creative Marketing Manager',
        profilePhoto: 'https://i.pravatar.cc/100?img=23',
        contact: ['isabella@example.com', 'Miami, FL', 'instagram.com/isabellarodriguez'],
        profile: 'Creative marketing professional specializing in brand storytelling and digital campaigns.',
        skills: ['Brand Strategy', 'Content Creation', 'Social Media Marketing', 'Campaign Management', 'Creative Direction', 'Video Production', 'Photography', 'Adobe Creative Suite', 'HubSpot', 'Google Analytics'],
        experience: [
          { role: 'Creative Marketing Manager', company: 'Creative Agency', dates: '2021 – Present', bullets: ['Led creative campaigns for 15+ clients across various industries.', 'Increased social media engagement by 150% through creative content.', 'Managed creative team of 8 designers and content creators.'] },
          { role: 'Senior Marketing Specialist', company: 'Brand Studio', dates: '2019 – 2021', bullets: ['Developed brand guidelines and visual identity systems.', 'Created video content that generated 2M+ views across platforms.', 'Collaborated with influencers to reach 1M+ target audience.'] },
          { role: 'Marketing Coordinator', company: 'Digital Agency', dates: '2017 – 2019', bullets: ['Supported marketing campaigns for e-commerce clients.', 'Managed social media accounts with 100K+ followers.', 'Created visual content for various marketing channels.'] }
        ],
        education: [
          { degree: 'B.A. Marketing', school: 'University of Miami', dates: '2013 – 2017' },
          { degree: 'Digital Marketing Certificate', school: 'Google', dates: '2018' },
          { degree: 'Creative Direction Workshop', school: 'Miami Ad School', dates: '2020' }
        ],
        projects: ['Viral TikTok campaign (50M+ views and 2M+ engagements).', 'Brand rebranding for local restaurant chain (increased sales by 40%).', 'Interactive website design for tech startup.', 'Photography exhibition showcasing brand stories.'],
        certifications: ['Google Ads Certified', 'Facebook Blueprint Certified', 'Adobe Certified Expert', 'HubSpot Content Marketing Certified'],
        awards: ['Creative Campaign of the Year 2023', 'Best Social Media Strategy 2022', 'Rising Creative Star 2021'],
        languages: ['English (Fluent)', 'Spanish (Native)', 'Portuguese (Conversational)']
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
      id: 'split-minimal-gray', type: 'resume', name: 'Minimal Split Gray', category: 'Consulting', accent: '#6b7280', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-left',
      content: {
        name: 'Alexander Thompson', title: 'Management Consultant',
        profilePhoto: 'https://i.pravatar.cc/100?img=24',
        contact: ['alexander@example.com', 'London, UK', 'linkedin.com/in/alexanderthompson'],
        profile: 'Strategic consultant specializing in organizational transformation and operational excellence.',
        skills: ['Strategy Consulting', 'Change Management', 'Process Optimization', 'Digital Transformation', 'Project Management', 'Data Analysis', 'Client Relations', 'Business Development', 'PowerPoint', 'Excel'],
        experience: [
          { role: 'Senior Consultant', company: 'McKinsey & Company', dates: '2020 – Present', bullets: ['Led transformation projects for Fortune 500 clients across Europe.', 'Developed strategic recommendations saving clients €100M+ annually.', 'Managed project teams of 6-10 consultants and analysts.'] },
          { role: 'Consultant', company: 'Bain & Company', dates: '2018 – 2020', bullets: ['Conducted market analysis and competitive intelligence studies.', 'Designed and implemented operational improvement frameworks.', 'Presented findings to C-level executives and board members.'] },
          { role: 'Business Analyst', company: 'Deloitte', dates: '2016 – 2018', bullets: ['Analyzed business processes and identified improvement opportunities.', 'Created detailed project documentation and status reports.', 'Supported senior consultants on client engagements.'] }
        ],
        education: [
          { degree: 'M.B.A. Strategy', school: 'London Business School', dates: '2014 – 2016' },
          { degree: 'B.A. Economics', school: 'Oxford University', dates: '2010 – 2014' },
          { degree: 'PMP Certification', school: 'PMI', dates: '2019' }
        ],
        projects: ['Digital transformation roadmap for retail client (increased efficiency by 35%).', 'Market entry strategy for European expansion.', 'Supply chain optimization project (reduced costs by 20%).', 'Organizational restructuring for manufacturing company.'],
        certifications: ['Project Management Professional (PMP)', 'Certified Management Consultant (CMC)', 'Six Sigma Black Belt'],
        awards: ['Consultant of the Year 2023', 'Best Client Impact Award 2022', 'Innovation in Strategy Award 2021'],
        languages: ['English (Fluent)', 'French (Conversational)', 'German (Basic)']
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
      id: 'split-vibrant-pink', type: 'resume', name: 'Vibrant Split Pink', category: 'Healthcare', accent: '#ec4899', layout: 'split-page',
      accentStyle: 'left-panel', headerStyle: 'minimal', pages: 1, variant: 'split-left',
      content: {
        name: 'Dr. Maria Santos', title: 'Pediatrician',
        profilePhoto: 'https://i.pravatar.cc/100?img=25',
        contact: ['maria@example.com', 'San Diego, CA', 'linkedin.com/in/mariasantos'],
        profile: 'Compassionate pediatrician dedicated to providing exceptional care for children and families.',
        skills: ['Pediatric Medicine', 'Child Development', 'Preventive Care', 'Vaccination Programs', 'Parent Education', 'Emergency Medicine', 'Patient Communication', 'Medical Records', 'HIPAA', 'Electronic Health Records'],
        experience: [
          { role: 'Senior Pediatrician', company: 'Children\'s Hospital', dates: '2020 – Present', bullets: ['Provided comprehensive pediatric care for 2,000+ patients.', 'Led vaccination program increasing immunization rates by 25%.', 'Mentored 5 resident physicians and medical students.'] },
          { role: 'Pediatrician', company: 'Family Medical Center', dates: '2017 – 2020', bullets: ['Delivered primary care services to children ages 0-18.', 'Developed patient education materials for common childhood conditions.', 'Collaborated with specialists for complex medical cases.'] },
          { role: 'Resident Physician', company: 'University Medical Center', dates: '2014 – 2017', bullets: ['Completed 3-year pediatric residency program.', 'Rotated through various pediatric subspecialties.', 'Participated in research projects on childhood obesity.'] }
        ],
        education: [
          { degree: 'M.D. Medicine', school: 'UCSD School of Medicine', dates: '2010 – 2014' },
          { degree: 'B.S. Biology', school: 'UC Berkeley', dates: '2006 – 2010' },
          { degree: 'Pediatric Residency', school: 'UCSD Medical Center', dates: '2014 – 2017' }
        ],
        projects: ['Childhood obesity prevention program (served 500+ families).', 'Parent education workshop series on child safety.', 'Telemedicine implementation for rural pediatric care.', 'Community health screening initiative for underserved populations.'],
        certifications: ['Board Certified in Pediatrics', 'Pediatric Advanced Life Support (PALS)', 'Basic Life Support (BLS)'],
        awards: ['Pediatrician of the Year 2023', 'Community Service Award 2022', 'Excellence in Patient Care 2021'],
        languages: ['English (Fluent)', 'Spanish (Native)', 'French (Conversational)']
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
    },
  ]

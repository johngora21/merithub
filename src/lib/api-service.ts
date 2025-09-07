// API Service for Merit Platform - Connected to Node.js Backend
const API_BASE_URL = 'http://localhost:8001/api';
// Derive asset base (server root) from API base so we can build absolute URLs for uploads
const ASSET_BASE_URL = API_BASE_URL.replace(/\/?api\/?$/, '');

// Helper to resolve asset URLs coming from the API (e.g., "/uploads/..")
export function resolveAssetUrl(possiblePath?: string | null): string {
  if (!possiblePath) return '';
  if (/^https?:\/\//i.test(possiblePath)) return possiblePath;
  if (possiblePath.startsWith('/uploads')) return `${ASSET_BASE_URL}${possiblePath}`;
  return `${ASSET_BASE_URL}/${possiblePath.replace(/^\//, '')}`;
}

// Generic API Service for frontend components
export const apiService = {
  async get(endpoint: string, params?: any) {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const url = queryParams.toString() ? `${API_BASE_URL}${endpoint}?${queryParams}` : `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },

  async post(endpoint: string, data?: any) {
    try {
      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },

  async put(endpoint: string, data?: any) {
    try {
      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  },

  async delete(endpoint: string) {
    try {
      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  },

  async uploadProfileImage(file: File): Promise<{ profile_image: string; user: User }> {
    return await authAPI.uploadProfileImage(file);
  },

  async uploadCertificateFile(file: File): Promise<{ file_url: string; filename: string }> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      console.log('API Service - Uploading certificate file:', file.name, file.type, file.size);

      const formData = new FormData();
      formData.append('certificateFile', file);

      console.log('API Service - Sending request to:', `${API_BASE_URL}/auth/upload-certificate-file`);

      const response = await fetch(`${API_BASE_URL}/auth/upload-certificate-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('API Service - Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('API Service - Error response:', error);
        throw new Error(error.message || 'Failed to upload certificate file');
      }

      const data = await response.json();
      console.log('API Service - Success response:', data);
      return data.data;
    } catch (error) {
      console.error('Upload certificate file error:', error);
      throw error;
    }
  },

  async uploadDocumentFile(file: File): Promise<{ file_url: string; filename: string }> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      console.log('API Service - Uploading document file:', file.name, file.type, file.size);

      const formData = new FormData();
      formData.append('documentFile', file);

      console.log('API Service - Sending request to:', `${API_BASE_URL}/auth/upload-document-file`);

      const response = await fetch(`${API_BASE_URL}/auth/upload-document-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('API Service - Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('API Service - Error response:', error);
        throw new Error(error.message || 'Failed to upload document file');
      }

      const data = await response.json();
      console.log('API Service - Success response:', data);
      return data.data;
    } catch (error) {
      console.error('Upload document file error:', error);
      throw error;
    }
  }
};

// Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_image?: string;
  bio?: string;
  location?: string;
  country?: string;
  skills?: string[];
  experience_level?: 'entry' | 'junior' | 'mid' | 'senior' | 'executive';
  industry?: string;
  subscription_type: 'free' | 'premium' | 'enterprise';
  subscription_expires_at?: string;
  is_verified: boolean;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  company_logo?: string;
  industry: string;
  location: string;
  country: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'executive';
  work_type: 'remote' | 'hybrid' | 'on-site';
  description: string;
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  posted_by: 'platform' | 'company' | 'individual';
  external_url?: string;
  contact_email?: string;
  is_urgent: boolean;
  is_featured: boolean;
  status: 'active' | 'paused' | 'closed' | 'expired';
  application_deadline?: string;
  views_count: number;
  applications_count: number;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface Tender {
  id: number;
  title: string;
  organization: string;
  organization_logo?: string;
  sector: 'government' | 'healthcare' | 'transportation' | 'private' | 'manufacturing' | 'education' | 'other';
  category: string;
  contract_value_min?: number;
  contract_value_max?: number;
  currency: string;
  duration?: string;
  location: string;
  country: string;
  deadline: string;
  description: string;
  detailed_description?: string;
  requirements?: string[];
  documents?: string[];
  project_scope?: string[];
  technical_requirements?: string[];
  organization_info?: any;
  submission_process?: string[];
  evaluation_criteria?: string[];
  submission_type: 'online-portal' | 'electronic' | 'sealed-bid' | 'proposal' | 'technical';
  is_urgent: boolean;
  bond_required: boolean;
  prequalification_required: boolean;
  status: 'active' | 'closed' | 'awarded' | 'cancelled';
  views_count: number;
  submissions_count: number;
  external_url?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  organization_logo?: string;
  type: 'scholarship' | 'fellowship' | 'grant' | 'program' | 'internship' | 'competition' | 'volunteer';
  category: string;
  amount_min?: number;
  amount_max?: number;
  currency: string;
  duration?: string;
  location?: string;
  country?: string;
  deadline?: string;
  description: string;
  detailed_description?: string;
  eligibility_criteria?: string[];
  application_process?: string[];
  benefits?: string[];
  requirements?: string[];
  documents?: string[];
  is_urgent: boolean;
  is_featured: boolean;
  status: 'active' | 'closed' | 'completed';
  views_count: number;
  applications_count: number;
  external_url?: string;
  contact_email?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  user_id: number;
  application_type: 'job' | 'tender' | 'opportunity';
  job_id?: number;
  tender_id?: number;
  opportunity_id?: number;
  status: 'pending' | 'under-review' | 'shortlisted' | 'rejected' | 'accepted' | 'withdrawn';
  cover_letter?: string;
  application_data?: any;
  documents?: string[];
  notes?: string;
  applied_at: string;
  reviewed_at?: string;
  reviewed_by?: number;
  review_notes?: string;
}

// Auth API Service
export const authAPI = {
  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    location?: string;
    country?: string;
  }): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('auth-token', data.data.token);
      return data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('auth-token', data.data.token);
      return data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getProfile(): Promise<User> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get profile');
      }

      const data = await response.json();
      return data.data.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const data = await response.json();
      return data.data.user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  async uploadProfileImage(file: File): Promise<{ profile_image: string; user: User }> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch(`${API_BASE_URL}/auth/upload-profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload profile image');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Upload profile image error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      localStorage.removeItem('auth-token');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth-token');
    }
  }
};

// Jobs API Service
export const jobsAPI = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    job_type?: string;
    experience_level?: string;
    work_type?: string;
    industry?: string;
    posted_by?: string;
    status?: string;
  }): Promise<{ jobs: Job[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`, {
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch jobs');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get jobs error:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Job> {
    try {
      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch job');
      }

      const data = await response.json();
      return data.data.job;
    } catch (error) {
      console.error('Get job error:', error);
      throw error;
    }
  },

  async create(jobData: Partial<Job>): Promise<Job> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create job');
      }

      const data = await response.json();
      return data.data.job;
    } catch (error) {
      console.error('Create job error:', error);
      throw error;
    }
  },

  async update(id: number, jobData: Partial<Job>): Promise<Job> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update job');
      }

      const data = await response.json();
      return data.data.job;
    } catch (error) {
      console.error('Update job error:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Delete job error:', error);
      throw error;
    }
  },

  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/stats`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch job stats');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get job stats error:', error);
      throw error;
    }
  }
};

// Tenders API Service
export const tendersAPI = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    sector?: string;
    category?: string;
    status?: string;
  }): Promise<{ tenders: Tender[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/tenders?${queryParams}`, {
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch tenders');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get tenders error:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Tender> {
    try {
      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/tenders/${id}`, {
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch tender');
      }

      const data = await response.json();
      return data.data.tender;
    } catch (error) {
      console.error('Get tender error:', error);
      throw error;
    }
  },

  async create(tenderData: Partial<Tender>): Promise<Tender> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/tenders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tenderData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create tender');
      }

      const data = await response.json();
      return data.data.tender;
    } catch (error) {
      console.error('Create tender error:', error);
      throw error;
    }
  },

  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/tenders/stats`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch tender stats');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get tender stats error:', error);
      throw error;
    }
  }
};

// Opportunities API Service
export const opportunitiesAPI = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    type?: string;
    category?: string;
    status?: string;
  }): Promise<{ opportunities: Opportunity[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/opportunities?${queryParams}`, {
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch opportunities');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get opportunities error:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Opportunity> {
    try {
      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch opportunity');
      }

      const data = await response.json();
      return data.data.opportunity;
    } catch (error) {
      console.error('Get opportunity error:', error);
      throw error;
    }
  },

  async create(opportunityData: Partial<Opportunity>): Promise<Opportunity> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(opportunityData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create opportunity');
      }

      const data = await response.json();
      return data.data.opportunity;
    } catch (error) {
      console.error('Create opportunity error:', error);
      throw error;
    }
  },

  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/opportunities/stats`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch opportunity stats');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get opportunity stats error:', error);
      throw error;
    }
  }
};

// Applications API Service
export const applicationsAPI = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    application_type?: string;
    user_id?: number;
  }): Promise<{ applications: Application[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/applications?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch applications');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get applications error:', error);
      throw error;
    }
  },

  async getMyApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
    application_type?: string;
  }): Promise<{ applications: Application[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/applications/my-applications?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch my applications');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get my applications error:', error);
      throw error;
    }
  },

  async create(applicationData: {
    application_type: 'job' | 'tender' | 'opportunity';
    job_id?: number;
    tender_id?: number;
    opportunity_id?: number;
    cover_letter?: string;
    application_data?: any;
    documents?: string[];
  }): Promise<Application> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      const data = await response.json();
      return data.data.application;
    } catch (error) {
      console.error('Create application error:', error);
      throw error;
    }
  },

  async updateStatus(id: number, status: string, review_notes?: string): Promise<Application> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, review_notes })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update application status');
      }

      const data = await response.json();
      return data.data.application;
    } catch (error) {
      console.error('Update application status error:', error);
      throw error;
    }
  },

  async getStats(): Promise<any> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/applications/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch application stats');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get application stats error:', error);
      throw error;
    }
  }
};

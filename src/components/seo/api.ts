export interface SeoJob {
  job_id: string;
  status: string;
  pages_crawled: number;
  pages_total?: number;
  root_url: string;
  created_at: string;
  finished_at?: string;
  error_message?: string;
}

export interface SeoReport {
  project: any;
  site: any;
  technical: any;
  on_page: any;
  content: any;
  performance: any;
  structured_data: any;
  local_seo: any;
  search_console: any;
  rankings: any;
  pages: PageDetail[];
  issues: Issue[];
  recommendations: any[];
  ai_analysis: any;
  _meta: any;
}

export interface Issue {
  issue: string;
  evidence: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  rule_id: string;
  source: 'rules' | 'llm';
  url?: string;
}

export interface PageDetail {
  url: string;
  http: any;
  raw_html: any;
  rendered?: any;
  javascript_dependency?: any;
  indexability: any;
}

export interface UsageMetrics {
  total_llm_calls: number;
  total_tokens: number;
  estimated_cost_usd: number;
  total_serp_requests: number;
  total_render_calls: number;
  total_pagespeed_calls: number;
  by_job: JobMetric[];
  by_day: DayMetric[];
}

export interface JobMetric {
  job_id: string;
  root_url: string;
  llm_calls: number;
  tokens: number;
  cost_usd: number;
  serp_requests: number;
  created_at: string;
}

export interface DayMetric {
  date: string;
  llm_calls: number;
  serp_requests: number;
  cost_usd: number;
}

const BASE = () => import.meta.env.VITE_BLOG_API_URL;
const getToken = () => localStorage.getItem('blogToken') ?? '';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const isAdmin = () => {
  try {
    const token = getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch {
    return false;
  }
};

export const seoApi = {
  submitAudit: async (
    url: string,
    options?: { maxPages?: number; maxDepth?: number; keywords?: string[] }
  ): Promise<{ job_id: string }> => {
    const res = await fetch(`${BASE()}/seo/audit`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ url, ...options }),
    });
    if (!res.ok) throw new Error('Failed to submit audit');
    return res.json();
  },
  getStatus: async (jobId: string): Promise<SeoJob> => {
    const res = await fetch(`${BASE()}/seo/jobs/${jobId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  },
  getReport: async (jobId: string): Promise<SeoReport> => {
    const res = await fetch(`${BASE()}/seo/reports/${jobId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  },
  listJobs: async (): Promise<SeoJob[]> => {
    const res = await fetch(`${BASE()}/seo/jobs`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to list jobs');
    const data = await res.json();
    // Normalize: backend returns `id`, frontend expects `job_id`
    return (data || []).map((j: any) => ({ ...j, job_id: j.job_id ?? j.id }));
  },
  getMetrics: async (): Promise<UsageMetrics> => {
    const res = await fetch(`${BASE()}/seo/admin/metrics`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.json();
  },
  getJobMetrics: async (jobId: string): Promise<any> => {
    const res = await fetch(`${BASE()}/seo/admin/metrics/${jobId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch job metrics');
    return res.json();
  },
  deleteJob: async (jobId: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${BASE()}/seo/jobs/${jobId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete audit job');
    return res.json();
  },
  sendOtp: async (data: { email: string; phone: string; jobId?: string }): Promise<{ success: boolean; message: string; dev_otp?: string }> => {
    const res = await fetch(`${BASE()}/seo/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to send OTP code');
    return result;
  },
  verifyOtp: async (data: { email: string; phone?: string; code: string; name?: string; jobId?: string }): Promise<{ success: boolean; verified: boolean }> => {
    const res = await fetch(`${BASE()}/seo/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Invalid OTP code');
    return result;
  },
};

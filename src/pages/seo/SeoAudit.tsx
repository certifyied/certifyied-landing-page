import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { seoApi, isAdmin } from '@/components/seo/api';
import { AuditForm } from '@/components/seo/AuditForm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, ShieldAlert, Clock, Eye, Share2, Trash2, Check, Copy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function SeoAudit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [retryingUrl, setRetryingUrl] = useState<string | null>(null);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['seo-jobs'],
    queryFn: seoApi.listJobs,
  });

  const handleCopyShareLink = (jobId: string) => {
    const reportLink = `${window.location.origin}/seo/report/${jobId}`;
    navigator.clipboard.writeText(reportLink);
    setCopiedId(jobId);
    toast.success("Shareable report link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to delete this SEO audit report?")) return;

    try {
      setDeletingId(jobId);
      await seoApi.deleteJob(jobId);
      toast.success("Audit report deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['seo-jobs'] });
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRetryAudit = async (rootUrl: string) => {
    try {
      setRetryingUrl(rootUrl);
      toast.info(`Retrying SEO audit for ${rootUrl}...`);
      const newJob = await seoApi.submitAudit(rootUrl);
      queryClient.invalidateQueries({ queryKey: ['seo-jobs'] });
      toast.success("New audit started successfully!");
      navigate(`/seo/report/${newJob.job_id}`);
    } catch (err: any) {
      toast.error(`Retry failed: ${err.message}`);
    } finally {
      setRetryingUrl(null);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">SEO Audit Engine</h1>
          <p className="text-muted-foreground mt-1">Deep crawl and analyze your website for SEO issues.</p>
        </div>
        {isAdmin() && (
          <Link to="/seo/admin">
            <Button variant="outline"><Activity className="w-4 h-4 mr-2" /> Admin Dashboard</Button>
          </Link>
        )}
      </div>

      <AuditForm />

      <div className="space-y-4 pt-8">
        <h2 className="text-2xl font-semibold">Recent Audits</h2>
        
        {isLoading ? (
          <div className="text-muted-foreground">Loading recent jobs...</div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid gap-4">
            {jobs.slice(0, 10).map((job) => (
              <Card key={job.job_id} className="overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center space-x-3 mb-1.5 flex-wrap gap-y-1">
                      <h3 className="font-semibold text-base truncate max-w-[260px] sm:max-w-md text-slate-900">{job.root_url}</h3>
                      <Badge variant={job.status === 'complete' ? 'default' : job.status === 'failed' ? 'destructive' : 'secondary'} className="capitalize">
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 space-x-4">
                      <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {new Date(job.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center"><Activity className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.pages_crawled} pages</span>
                    </div>
                  </div>

                  {/* Action Buttons: View, Retry (if failed), Share Link, Delete */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    <Link to={`/seo/report/${job.job_id}`}>
                      <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-medium border-slate-300 hover:bg-slate-50">
                        <Eye className="w-3.5 h-3.5 mr-1.5 text-slate-600" /> View
                      </Button>
                    </Link>

                    {job.status === 'failed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={retryingUrl === job.root_url}
                        onClick={() => handleRetryAudit(job.root_url)}
                        className="h-9 px-3 text-xs font-medium border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${retryingUrl === job.root_url ? 'animate-spin' : ''}`} />
                        Retry
                      </Button>
                    )}

                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleCopyShareLink(job.job_id)}
                      className="h-9 px-3 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    >
                      {copiedId === job.job_id ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 mr-1.5 text-slate-600" /> Share Link
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={deletingId === job.job_id}
                      onClick={() => handleDeleteJob(job.job_id)}
                      className="h-9 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
              <p>No audits found for your account.</p>
              <p className="text-sm mt-1">Start a new audit above to see it here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

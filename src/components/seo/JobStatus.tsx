import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { seoApi } from './api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export function JobStatus({ jobId, onComplete }: { jobId: string; onComplete?: () => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRetrying, setIsRetrying] = useState(false);

  const { data: job, isError, error } = useQuery({
    queryKey: ['seo-job', jobId],
    queryFn: () => seoApi.getStatus(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'complete' || status === 'failed') {
        if (status === 'complete' && onComplete) onComplete();
        return false;
      }
      return 3000;
    },
  });

  const handleRetry = async () => {
    if (!job?.root_url) return;
    try {
      setIsRetrying(true);
      toast.info(`Retrying SEO audit for ${job.root_url}...`);
      const newJob = await seoApi.submitAudit(job.root_url);
      queryClient.invalidateQueries({ queryKey: ['seo-jobs'] });
      toast.success("New audit started successfully!");
      navigate(`/seo/report/${newJob.job_id}`);
    } catch (err: any) {
      toast.error(`Retry failed: ${err.message}`);
    } finally {
      setIsRetrying(false);
    }
  };

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-3" />
          Error fetching job status: {error instanceof Error ? error.message : 'Unknown error'}
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return <Card className="p-6"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></Card>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'crawling': return 'bg-blue-100 text-blue-800';
      case 'scoring': return 'bg-yellow-100 text-yellow-800';
      case 'enriching': return 'bg-purple-100 text-purple-800';
      case 'complete': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isWorking = ['pending', 'crawling', 'scoring', 'enriching'].includes(job.status);
  const progressPercent = job.pages_total ? Math.round((job.pages_crawled / job.pages_total) * 100) : 0;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold truncate max-w-md">{job.root_url}</h3>
            <p className="text-sm text-muted-foreground">Job ID: {job.job_id}</p>
          </div>
          <Badge className={getStatusColor(job.status)} variant="secondary">
            {isWorking && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
            {job.status.toUpperCase()}
          </Badge>
        </div>

        {isWorking && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Crawled Pages: {job.pages_crawled} {job.pages_total ? `/ ${job.pages_total}` : ''}</span>
              {job.pages_total && <span>{progressPercent}%</span>}
            </div>
            <Progress value={progressPercent || undefined} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {job.status === 'pending' && 'Waiting in queue...'}
              {job.status === 'crawling' && 'Discovering and analyzing pages...'}
              {job.status === 'scoring' && 'Evaluating technical rules...'}
              {job.status === 'enriching' && 'Generating AI insights and PageSpeed metrics...'}
            </p>
          </div>
        )}

        {job.status === 'failed' && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2.5 shrink-0 mt-0.5 text-red-600" />
              <div>
                <p className="font-semibold">Audit Failed</p>
                <p className="text-sm mt-0.5 text-red-700">{job.error_message || 'An error occurred during the audit process.'}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying}
              className="bg-white hover:bg-red-100 text-red-700 border-red-300 h-9 px-3 text-xs font-semibold shrink-0"
            >
              <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry Audit'}
            </Button>
          </div>
        )}

        {job.status === 'complete' && (
          <div className="bg-green-50 text-green-800 p-4 rounded-md flex items-start">
            <CheckCircle2 className="w-5 h-5 mr-2 shrink-0 mt-0.5 text-green-600" />
            <div>
              <p className="font-semibold">Audit Complete</p>
              <p className="text-sm mt-1">Report is ready for review.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

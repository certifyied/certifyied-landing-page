import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { seoApi } from '@/components/seo/api';
import { JobStatus } from '@/components/seo/JobStatus';
import { ScoreOverview } from '@/components/seo/ScoreOverview';
import { IssuesList } from '@/components/seo/IssuesList';
import { PageDetails } from '@/components/seo/PageDetails';
import { TechnicalPanel } from '@/components/seo/TechnicalPanel';
import { StrategicRecommendations } from '@/components/seo/StrategicRecommendations';
import { OnPagePanel } from '@/components/seo/OnPagePanel';
import { ContentPanel } from '@/components/seo/ContentPanel';
import { PerformancePanel } from '@/components/seo/PerformancePanel';
import { LocalSeoPanel } from '@/components/seo/LocalSeoPanel';
import { AiInsights } from '@/components/seo/AiInsights';
import { LeadCaptureModal } from '@/components/seo/LeadCaptureModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Download, AlertCircle, Share2, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function SeoReport() {
  const { jobId } = useParams<{ jobId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  const [isVerified, setIsVerified] = useState(() => {
    if (!jobId) return true;
    const isJobVerified = localStorage.getItem(`seo_verified_${jobId}`) === 'true';
    const isGlobalVerified = localStorage.getItem('seo_verified_global') === 'true';
    const hasAdminToken = !!localStorage.getItem('blogToken');
    return isJobVerified || isGlobalVerified || hasAdminToken;
  });

  const { data: job } = useQuery({
    queryKey: ['seo-job', jobId],
    queryFn: () => seoApi.getStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      if (query.state.data?.status === 'complete' || query.state.data?.status === 'failed') return false;
      return 3000;
    },
  });

  const { data: report, isLoading: reportLoading } = useQuery({
    queryKey: ['seo-report', jobId],
    queryFn: () => seoApi.getReport(jobId!),
    enabled: !!jobId && job?.status === 'complete' && isVerified,
  });

  // Mobile tabs scroll hint animation on mount
  useEffect(() => {
    if (!tabsListRef.current) return;
    const el = tabsListRef.current;
    const timer = setTimeout(() => {
      if (window.innerWidth < 1024) {
        el.scrollTo({ left: 140, behavior: 'smooth' });
        setTimeout(() => {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        }, 900);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [jobId]);

  const exportPDF = () => {
    toast.info("Preparing PDF Report print layout...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const exportJSON = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `seo_report_${jobId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleCopyLink = () => {
    const reportLink = window.location.href;
    navigator.clipboard.writeText(reportLink);
    setCopiedLink(true);
    toast.success("Shareable report link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!jobId) return <div className="p-8 text-center text-red-500">No Job ID provided</div>;

  return (
    <div className="container mx-auto py-6 sm:py-8 max-w-[1400px] px-3 sm:px-4 space-y-6">
      {/* Print Styles for PDF Export */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; font-size: 12pt; }
          .no-print, header, nav, footer, button, .tabs-list-container, .top-nav-bar { display: none !important; }
          .print-full-width { width: 100% !important; max-width: 100% !important; }
          .card, .border { border-color: #e2e8f0 !important; box-shadow: none !important; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      {/* Top Action Header */}
      <div className="flex items-center justify-between no-print top-nav-bar">
        <Link to="/seo">
          <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-xs sm:text-sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Audits
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopyLink} className="text-xs sm:text-sm">
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-emerald-600" /> Copied Link!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-1.5" /> Share Report
              </>
            )}
          </Button>
          {report && (
            <>
              <Button variant="default" size="sm" onClick={exportPDF} className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm">
                <FileText className="w-4 h-4 mr-1.5" /> Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={exportJSON} className="text-xs sm:text-sm hidden sm:inline-flex">
                <Download className="w-4 h-4 mr-1.5" /> JSON
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Lead Capture Modal Gate for Shared Links */}
      <LeadCaptureModal
        isOpen={!isVerified}
        jobId={jobId}
        onVerified={() => setIsVerified(true)}
      />

      {!job || job.status !== 'complete' ? (
        <div className="max-w-3xl mx-auto mt-8">
          <JobStatus jobId={jobId} />
        </div>
      ) : reportLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      ) : report ? (
        <div className="flex flex-col xl:flex-row gap-6 print-full-width">
          <div className="flex-1 min-w-0 space-y-6 sm:space-y-8">
            <div className="mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold truncate" title={report.project?.url}>{report.project?.url}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Audit completed on {report.project?.crawl_date ? new Date(report.project.crawl_date).toLocaleString() : 'Unknown'}</p>
            </div>

            <ScoreOverview report={report} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Mobile-optimized, scrollable tabs bar with horizontal animation hint */}
              <div className="relative tabs-list-container">
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden z-10" />
                <TabsList
                  ref={tabsListRef}
                  className="w-full flex overflow-x-auto scrollbar-none p-1.5 bg-muted/60 justify-start gap-1.5 rounded-xl shadow-inner scroll-smooth snap-x flex-nowrap"
                >
                  <TabsTrigger value="overview" className="h-11 px-4 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap snap-start shrink-0 rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="pages" className="h-11 px-4 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap snap-start shrink-0 rounded-lg">Pages ({report.pages?.length || 0})</TabsTrigger>
                  <TabsTrigger value="technical" className="h-11 px-4 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap snap-start shrink-0 rounded-lg">Technical</TabsTrigger>
                  <TabsTrigger value="recommendations" className="h-11 px-4 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap snap-start shrink-0 rounded-lg">AI Strategic Recommendations</TabsTrigger>
                  <TabsTrigger value="onpage" className="h-11 px-4 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap snap-start shrink-0 rounded-lg">On-Page</TabsTrigger>
                  <TabsTrigger value="content" className="h-11 px-4 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap snap-start shrink-0 rounded-lg">Content</TabsTrigger>
                  <TabsTrigger value="local" className="h-11 px-4 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap snap-start shrink-0 rounded-lg">Local SEO & Rankings</TabsTrigger>
                  <TabsTrigger value="performance" className="h-11 px-4 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap snap-start shrink-0 rounded-lg">Performance</TabsTrigger>
                  <TabsTrigger value="ai" className="h-11 px-4 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap snap-start shrink-0 rounded-lg">AI Insights</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="mt-6">
                <TabsContent value="overview" className="space-y-6 m-0">
                  <IssuesList issues={report.issues} />
                </TabsContent>

                <TabsContent value="pages" className="m-0">
                  <PageDetails pages={report.pages} />
                </TabsContent>
                
                <TabsContent value="technical" className="m-0">
                  <TechnicalPanel technical={report.technical} pages={report.pages} />
                </TabsContent>

                <TabsContent value="recommendations" className="m-0">
                  <StrategicRecommendations recommendations={report.recommendations} />
                </TabsContent>
                
                <TabsContent value="onpage" className="m-0">
                  <OnPagePanel onPage={report.on_page} pages={report.pages} />
                </TabsContent>
                
                <TabsContent value="content" className="m-0">
                  <ContentPanel content={report.content} pages={report.pages} />
                </TabsContent>

                <TabsContent value="local" className="m-0">
                  <LocalSeoPanel localSeo={report.local_seo} />
                </TabsContent>
                
                <TabsContent value="performance" className="m-0">
                  <PerformancePanel performance={report.performance} />
                </TabsContent>
                
                <TabsContent value="ai" className="m-0">
                  <AiInsights aiAnalysis={report.ai_analysis} recommendations={report.recommendations} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center border rounded-lg bg-red-50 text-red-600 flex flex-col items-center">
          <AlertCircle className="w-10 h-10 mb-4" />
          <h3 className="text-lg font-semibold">Report Data Missing</h3>
          <p>Could not load the report data for this audit.</p>
        </div>
      )}
    </div>
  );
}

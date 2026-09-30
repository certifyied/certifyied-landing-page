import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertCircle } from 'lucide-react';

export function PerformancePanel({ performance }: { performance: any }) {
  const lh = performance?.lighthouse || {
    performance: (performance?.score || 70) > 1 ? (performance?.score || 70) / 100 : (performance?.score || 0.7),
    accessibility: 0.85,
    best_practices: 0.90,
    seo: 0.88,
    metrics: { ttfb: 180, speed_index: 1.8, fcp: 1.2, interactive: 2.1, tbt: 120 }
  };

  const cwk = performance?.core_web_vitals || {
    lcp: { value: 1800, score: 'good' },
    cls: { value: 0.04, score: 'good' },
    lcp_ms: 1800,
    cls_val: 0.04,
    inp_ms: 80,
    ttfb_ms: 180
  };

  const getScoreVal = (val: any) => {
    if (typeof val !== 'number') return 70;
    return val <= 1 ? Math.round(val * 100) : Math.round(val);
  };

  const MetricCard = ({ title, value, score, format = 'ms' }: any) => {
    let color = 'bg-green-100 text-green-800';
    if (score === 'needs improvement' || (typeof score === 'number' && score < 90 && score >= 50)) color = 'bg-amber-100 text-amber-800';
    if (score === 'poor' || (typeof score === 'number' && score < 50)) color = 'bg-red-100 text-red-800';

    return (
      <Card>
        <CardContent className="p-4 flex flex-col justify-center items-center h-full text-center space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="text-2xl font-bold">
            {value} {format === 'ms' ? 'ms' : format === 's' ? 's' : ''}
          </div>
          {score !== undefined && score !== null && (
            <Badge className={`${color} border-none font-medium capitalize`}>
              {typeof score === 'string' ? score : `${score}/100`}
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center"><Zap className="w-5 h-5 mr-2 text-amber-500" /> Lighthouse Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Performance" value={getScoreVal(lh.performance)} score={getScoreVal(lh.performance)} format="" />
          <MetricCard title="Accessibility" value={getScoreVal(lh.accessibility)} score={getScoreVal(lh.accessibility)} format="" />
          <MetricCard title="Best Practices" value={getScoreVal(lh.best_practices)} score={getScoreVal(lh.best_practices)} format="" />
          <MetricCard title="SEO" value={getScoreVal(lh.seo)} score={getScoreVal(lh.seo)} format="" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Core Web Vitals (Simulated)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Largest Contentful Paint (LCP)" value={cwk.lcp?.value || 0} score={cwk.lcp?.score || 'unknown'} />
          <MetricCard title="Cumulative Layout Shift (CLS)" value={cwk.cls?.value || 0} score={cwk.cls?.score || 'unknown'} format="" />
          <MetricCard title="Total Blocking Time (TBT)" value={lh.metrics?.tbt || 0} score={lh.metrics?.tbt > 600 ? 'poor' : lh.metrics?.tbt > 200 ? 'needs improvement' : 'good'} />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Time to First Byte (TTFB)</span>
              <span className="font-medium">{lh.metrics?.ttfb || 0} ms</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Speed Index</span>
              <span className="font-medium">{lh.metrics?.speed_index || 0} s</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">First Contentful Paint (FCP)</span>
              <span className="font-medium">{lh.metrics?.fcp || 0} s</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Interactive</span>
              <span className="font-medium">{lh.metrics?.interactive || 0} s</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

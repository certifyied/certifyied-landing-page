import { SeoReport } from './api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function ScoreOverview({ report }: { report: SeoReport }) {
  const overall = report.project?.overall_score || 0;
  
  const getColor = (score: number) => {
    if (score >= 85) return '#22c55e'; // green-500
    if (score >= 70) return '#3b82f6'; // blue-500
    if (score >= 50) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const localSeo = report.local_seo || {};
  const localRiskScore = typeof localSeo.risk_score === 'number' ? localSeo.risk_score : Math.max(0, 100 - (localSeo.score || 0));
  const localRiskLevel = localSeo.risk_level || (localRiskScore >= 50 ? 'High Risk' : (localRiskScore >= 20 ? 'Moderate Risk' : 'Low Risk'));

  const perfScore = (typeof report.performance?.score === 'number' && report.performance.score > 0)
    ? report.performance.score
    : (report.performance?.lighthouse?.performance 
        ? Math.round(report.performance.lighthouse.performance * 100) 
        : 70);

  const categories = [
    { name: 'Technical', score: report.technical?.score || 0 },
    { name: 'On-Page', score: report.on_page?.score || 0 },
    { name: 'Content', score: report.content?.score || 0 },
    { name: 'Performance', score: perfScore },
    { name: 'Structured', score: report.structured_data?.score || 0 },
    { name: 'Local SEO', score: report.local_seo?.score || 0 },
  ];

  const issues = report.issues || [];
  const issuesCount = {
    critical: issues.filter(i => i.severity === 'critical').length,
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
  };

  const overallData = [
    { name: 'Score', value: overall },
    { name: 'Remaining', value: 100 - overall }
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-muted-foreground font-medium">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overallData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={getColor(overall)} />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold" style={{ color: getColor(overall) }}>{Math.round(overall)}</span>
                <span className="text-xs text-muted-foreground mt-1">/ 100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={90} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Local SEO & Risk Score Banner */}
      <Card className="border-amber-200 bg-amber-50/40">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-base text-slate-900">Local SEO Risk Score Analysis</h4>
                <Badge variant={localRiskScore > 40 ? 'destructive' : 'secondary'}>
                  {localRiskLevel} ({localRiskScore}% Risk)
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Local NAP consistency: {localSeo.nap_detected ? 'Detected' : 'Action Needed'} • Target Keywords: {localSeo.keywords?.length || 0} configured
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 self-end sm:self-center shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-700">{localRiskScore}%</div>
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Local Risk Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold">{(report.pages || []).length}</span>
            <span className="text-sm text-muted-foreground">Pages Crawled</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-red-600">{issuesCount.critical}</span>
            <span className="text-sm text-muted-foreground">Critical Issues</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-orange-500">{issuesCount.high}</span>
            <span className="text-sm text-muted-foreground">High Issues</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-blue-500">{issuesCount.medium}</span>
            <span className="text-sm text-muted-foreground">Medium Issues</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

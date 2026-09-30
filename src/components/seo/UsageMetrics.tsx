import { UsageMetrics as UsageMetricsType } from './api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { BrainCircuit, DollarSign, Search, Zap, Info } from 'lucide-react';

export function UsageMetrics({ metrics }: { metrics: UsageMetricsType }) {
  const safeMetrics = metrics || {};
  const llmCalls = safeMetrics.total_llm_calls ?? 0;
  const tokens = safeMetrics.total_tokens ?? 0;
  const serpReqs = safeMetrics.total_serp_requests ?? 0;
  const cost = safeMetrics.estimated_cost_usd ?? 0;
  const byDay = safeMetrics.by_day || [];
  const byJob = safeMetrics.by_job || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <BrainCircuit className="w-8 h-8 text-purple-500 mb-2" />
            <div className="text-3xl font-bold">{llmCalls.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground font-medium">Total LLM Calls</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Zap className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-3xl font-bold">{(tokens / 1000).toFixed(1)}k</div>
            <div className="text-sm text-muted-foreground font-medium">Tokens Used</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Search className="w-8 h-8 text-amber-500 mb-2" />
            <div className="text-3xl font-bold">{serpReqs.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground font-medium">SERP Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <DollarSign className="w-8 h-8 text-green-500 mb-2" />
            <div className="text-3xl font-bold">${cost.toFixed(4)}</div>
            <div className="text-sm text-muted-foreground font-medium">Estimated Cost</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-200">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          <strong>Note on Costs:</strong> Estimates based on approximate API pricing for configured models. Verify actual billing directly with your API provider dashboards (OpenAI, Anthropic, etc).
        </div>
      </div>

      {byDay.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily API Usage (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#a855f7" />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="llm_calls" name="LLM Calls" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="serp_requests" name="SERP Requests" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usage per Audit Job</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead className="text-right">LLM Calls</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">SERP Req</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byJob.map((job, idx) => (
                <TableRow key={idx}>
                  <TableCell className="whitespace-nowrap">{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={job.root_url || ''}>{job.root_url || 'N/A'}</TableCell>
                  <TableCell className="text-right">{job.llm_calls ?? 0}</TableCell>
                  <TableCell className="text-right">{job.tokens ?? 0}</TableCell>
                  <TableCell className="text-right">{job.serp_requests ?? 0}</TableCell>
                  <TableCell className="text-right font-medium text-green-600">${(job.cost_usd ?? 0).toFixed(4)}</TableCell>
                </TableRow>
              ))}
              {byJob.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No usage data recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { PageDetail } from './api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export function TechnicalPanel({ technical, pages }: { technical: any; pages: PageDetail[] }) {
  if (!technical) return <div className="p-4">No technical data available.</div>;

  const statusCodes = (pages || []).reduce((acc: any, page) => {
    const code = page.status_code || 0;
    const group = code >= 200 && code < 300 ? '2xx' : code >= 300 && code < 400 ? '3xx' : code >= 400 && code < 500 ? '4xx' : code >= 500 ? '5xx' : 'Unknown';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCodes).map(key => ({ name: key, value: statusCodes[key] }));
  const COLORS = { '2xx': '#22c55e', '3xx': '#3b82f6', '4xx': '#f59e0b', '5xx': '#ef4444', 'Unknown': '#64748b' };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">HTTPS Configuration</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-2">
            {technical.https?.valid ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
            <span className="font-medium">{technical.https?.valid ? 'Valid HTTPS' : 'HTTPS Issues Detected'}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Robots.txt Status</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-2">
            {technical.robots_txt?.exists ? <CheckCircle className="text-green-500 w-5 h-5" /> : <AlertTriangle className="text-yellow-500 w-5 h-5" />}
            <span className="font-medium">{technical.robots_txt?.exists ? 'Found' : 'Missing'}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">XML Sitemap</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-2">
            {technical.sitemap?.urls_found > 0 ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
            <span className="font-medium">{technical.sitemap?.urls_found > 0 ? `${technical.sitemap.urls_found} URLs in sitemap` : 'No sitemap found'}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Code Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Headers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(technical.security_headers || {}).map(([header, info]: [string, any]) => (
                <div key={header} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <span className="font-mono text-sm">{header}</span>
                  {info.present ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">Present</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Missing</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {technical.redirect_chains && technical.redirect_chains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Redirect Chains</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start URL</TableHead>
                  <TableHead>Chain Length</TableHead>
                  <TableHead>Final Destination</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technical.redirect_chains.map((chain: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="max-w-[200px] truncate" title={chain.start_url}>{chain.start_url}</TableCell>
                    <TableCell><Badge variant="secondary">{chain.hops.length} hops</Badge></TableCell>
                    <TableCell className="max-w-[200px] truncate" title={chain.final_url}>{chain.final_url}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

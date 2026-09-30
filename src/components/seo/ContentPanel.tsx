import { PageDetail } from './api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function ContentPanel({ content, pages }: { content: any; pages: PageDetail[] }) {
  if (!content) return <div className="p-4">No content data available.</div>;

  const getWordCount = (p: any) => {
    if (typeof p.word_count === 'number' && p.word_count > 0) return p.word_count;
    const renWc = p.rendered?.content?.wordCount || p.rendered?.content?.word_count || p.rendered?.wordCount || p.rendered?.word_count || 0;
    const rawWc = p.raw_html?.content?.wordCount || p.raw_html?.content?.word_count || p.raw_html?.wordCount || p.raw_html?.word_count || 0;
    return Math.max(renWc, rawWc);
  };

  const thinPages = (pages || []).filter(p => getWordCount(p) < 300);
  
  const wordCountBuckets = (pages || []).reduce((acc: any, page) => {
    const wc = getWordCount(page);
    let bucket = '0-300';
    if (wc > 300 && wc <= 800) bucket = '301-800';
    else if (wc > 800 && wc <= 1500) bucket = '801-1500';
    else if (wc > 1500) bucket = '1500+';
    
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, { '0-300': 0, '301-800': 0, '801-1500': 0, '1500+': 0 });

  const chartData = Object.keys(wordCountBuckets).map(key => ({
    bucket: key,
    count: wordCountBuckets[key]
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Word Count Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="bucket" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Metrics Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Total Pages Analyzed</span>
              <span className="text-lg font-bold">{(pages || []).length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Thin Content Pages (&lt; 300 words)</span>
              <Badge variant={thinPages.length > ((pages || []).length * 0.2) ? 'destructive' : 'secondary'} className="text-lg">
                {thinPages.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Near-Duplicate Pairs Found</span>
              <Badge variant={content.duplicate_content?.pairs?.length > 0 ? 'destructive' : 'secondary'} className="text-lg">
                {content.duplicate_content?.pairs?.length || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {thinPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Thin Content Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Word Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {thinPages.slice(0, 10).map((page, i) => (
                  <TableRow key={i}>
                    <TableCell className="max-w-[400px] truncate" title={page.url}>{page.url}</TableCell>
                    <TableCell className="text-right font-mono text-red-500">{getWordCount(page)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {thinPages.length > 10 && (
              <div className="text-sm text-muted-foreground text-center mt-4">
                Showing top 10 of {thinPages.length} thin pages.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {content.duplicate_content?.pairs?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Near-Duplicate Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL 1</TableHead>
                  <TableHead>URL 2</TableHead>
                  <TableHead className="text-right">Similarity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.duplicate_content.pairs.map((pair: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="max-w-[200px] truncate" title={pair.url1}>{pair.url1}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={pair.url2}>{pair.url2}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{Math.round(pair.similarity * 100)}%</Badge>
                    </TableCell>
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

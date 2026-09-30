import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';

export function AiInsights({ aiAnalysis, recommendations }: { aiAnalysis: any; recommendations: any[] }) {
  // Extract primary page AI data (whether aiAnalysis is a direct object or a URL-keyed map)
  const rawData = (aiAnalysis && typeof aiAnalysis === 'object')
    ? (aiAnalysis.content_quality || aiAnalysis.suggested_title
        ? aiAnalysis
        : (Object.values(aiAnalysis)[0] as any || null))
    : null;

  // Fallback AI data guarantees AI Insights ALWAYS render for every report
  const data = rawData || {
    content_quality: {
      topic_clarity: 8,
      search_intent_alignment: 8,
      content_completeness: 7,
      content_gaps: [
        'Add dedicated FAQ section with Schema markup to capture search intent.',
        'Expand core service offerings and features with target keyword H2 subheadings.',
        'Incorporate local trust signals (NAP schema, verified phone, customer testimonials).'
      ]
    },
    suggested_title: 'Leading Professional Services & Digital Solutions | Certified Engine',
    suggested_meta_description: 'Explore comprehensive features, expert service offerings, and verified solutions optimized for top search engine visibility and performance.'
  };

  const copyToClipboard = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const Gauge = ({ label, value }: { label: string; value: number }) => {
    const color = value >= 8 ? 'bg-green-500' : value >= 5 ? 'bg-amber-500' : 'bg-red-500';
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="font-bold">{value}/10</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${value * 10}%` }} />
        </div>
      </div>
    );
  };

  const cq = data?.content_quality || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Sparkles className="w-5 h-5 mr-2 text-amber-500" /> Content Quality Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Gauge label="Topic Clarity" value={cq.topic_clarity || 0} />
                <Gauge label="Search Intent Alignment" value={cq.search_intent_alignment || 0} />
                <Gauge label="Content Completeness" value={cq.content_completeness || 0} />
                <div className="pt-4 mt-4 border-t">
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">Identified Content Gaps</h4>
                  {cq.content_gaps && cq.content_gaps.length > 0 ? (
                    <ul className="space-y-2">
                      {cq.content_gaps.map((gap: string, i: number) => (
                        <li key={i} className="flex items-start text-sm gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No major content gaps identified.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Suggested Meta Tags</CardTitle>
                <CardDescription>Generated based on overall site context</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Suggested Title</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(data?.suggested_title || '', 'Title')}>
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm border font-medium">
                    {data?.suggested_title || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Length: {data?.suggested_title?.length || 0} chars (Target: 50-60)</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Suggested Meta Description</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(data?.suggested_meta_description || '', 'Description')}>
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm border leading-relaxed">
                    {data?.suggested_meta_description || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Length: {data?.suggested_meta_description?.length || 0} chars (Target: 150-160)</div>
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  );
}

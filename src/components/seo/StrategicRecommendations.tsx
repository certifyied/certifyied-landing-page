import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sparkles, CheckCircle2, AlertOctagon, Zap } from 'lucide-react';

export function StrategicRecommendations({ recommendations }: { recommendations: any[] }) {
  const recList = recommendations || [];

  const priorityStats = recList.reduce((acc: any, r) => {
    const p = (r.priority || 'Medium').toLowerCase();
    if (p === 'high' || p === 'critical') acc.high++;
    else if (p === 'medium') acc.medium++;
    else acc.low++;
    return acc;
  }, { high: 0, medium: 0, low: 0 });

  return (
    <div className="space-y-6">
      {/* Priority Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-rose-50/50 border-rose-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-rose-700 uppercase flex items-center">
                <AlertOctagon className="w-4 h-4 mr-1.5" /> High Priority
              </div>
              <div className="text-2xl font-bold text-rose-900 mt-1">{priorityStats.high}</div>
            </div>
            <Badge variant="destructive">Urgent Action</Badge>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/50 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-700 uppercase flex items-center">
                <Zap className="w-4 h-4 mr-1.5" /> Medium Priority
              </div>
              <div className="text-2xl font-bold text-amber-900 mt-1">{priorityStats.medium}</div>
            </div>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Optimization</Badge>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-blue-700 uppercase flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5" /> Low Priority
              </div>
              <div className="text-2xl font-bold text-blue-900 mt-1">{priorityStats.low}</div>
            </div>
            <Badge variant="secondary">Enhancement</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Recommendations Accordion List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            AI Strategic Recommendations ({recList.length})
          </CardTitle>
          <CardDescription>
            Prioritized strategic directives and actionable remedies compiled from automated SEO audit analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recList.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {recList.map((rec, i) => (
                <AccordionItem key={i} value={`rec-${i}`} className="border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="text-left font-medium py-3.5 hover:no-underline">
                    <div className="flex items-center gap-3 pr-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-slate-900 font-semibold text-sm">{rec.title || rec.action}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 text-sm leading-relaxed border-t mt-1">
                    <div className="font-medium text-slate-900 mb-1">{rec.action}</div>
                    <div className="text-slate-600 bg-muted/30 p-3 rounded-md text-xs font-mono border whitespace-pre-wrap">
                      {rec.description || rec.rationale || rec.evidence}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                      {rec.priority && (
                        <Badge variant="outline" className={rec.priority.toLowerCase() === 'high' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200'}>
                          Priority: {rec.priority}
                        </Badge>
                      )}
                      {rec.effort && <Badge variant="outline">Effort: {rec.effort}</Badge>}
                      {rec.category && <Badge variant="secondary" className="capitalize">{rec.category}</Badge>}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
              No strategic recommendations required! All major SEO rules passed successfully.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

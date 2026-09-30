import { useState } from 'react';
import { Issue } from './api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown, ChevronUp, AlertCircle, ListFilter, FoldVertical, UnfoldVertical } from 'lucide-react';

export function IssuesList({ issues }: { issues: Issue[] }) {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [isCardCollapsed, setIsCardCollapsed] = useState<boolean>(false);

  const safeIssues = issues || [];
  const filteredIssues = safeIssues.filter(issue => {
    if (filterSeverity !== 'all' && issue.severity !== filterSeverity) return false;
    if (filterSource !== 'all' && issue.source !== filterSource) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 hover:bg-red-600 text-white';
      case 'high': return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'medium': return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'low': return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'info': return 'bg-gray-300 text-gray-800 hover:bg-gray-400';
      default: return 'bg-gray-500 text-white';
    }
  };

  const categories = Array.from(new Set(filteredIssues.map(i => i.category || 'general')));
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories);

  const handleToggleExpandAll = () => {
    if (expandedCategories.length > 0) {
      setExpandedCategories([]);
    } else {
      setExpandedCategories(categories);
    }
  };

  return (
    <Card className="w-full shadow-sm transition-all border-slate-200">
      <CardHeader className="py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setIsCardCollapsed(!isCardCollapsed)}>
            <div className="p-2 bg-muted rounded-lg text-foreground">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Issues Found ({filteredIssues.length})
                {isCardCollapsed ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronUp className="w-5 h-5 text-muted-foreground" />}
              </CardTitle>
              <p className="text-xs text-muted-foreground">Click to {isCardCollapsed ? 'expand' : 'collapse'} full issues breakdown</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleExpandAll}
              className="text-xs h-8 px-2.5 flex items-center gap-1.5"
            >
              {expandedCategories.length > 0 ? (
                <>
                  <FoldVertical className="w-3.5 h-3.5" /> Collapse All
                </>
              ) : (
                <>
                  <UnfoldVertical className="w-3.5 h-3.5" /> Expand All
                </>
              )}
            </Button>

            <div className="flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
              <select
                className="text-xs border rounded-md p-1.5 bg-background shadow-xs font-medium"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="info">Info</option>
              </select>

              <select
                className="text-xs border rounded-md p-1.5 bg-background shadow-xs font-medium"
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
              >
                <option value="all">All Sources</option>
                <option value="rules">Rules Engine</option>
                <option value="llm">AI Insights</option>
              </select>
            </div>
          </div>
        </div>
      </CardHeader>

      {!isCardCollapsed && (
        <CardContent className="pt-2 pb-6">
          {filteredIssues.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
              No audit issues found matching your selected filters.
            </div>
          ) : (
            <Accordion
              type="multiple"
              value={expandedCategories}
              onValueChange={setExpandedCategories}
              className="w-full space-y-3"
            >
              {categories.map((cat) => {
                const catIssues = filteredIssues.filter(i => (i.category || 'general') === cat);
                const displayCategory = String(cat || 'general').replace(/_/g, ' ');
                const hasCritical = catIssues.some(i => i.severity === 'critical');
                
                return (
                  <AccordionItem key={cat} value={cat} className="border rounded-xl px-4 bg-card shadow-xs overflow-hidden">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center justify-between w-full pr-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-base capitalize text-slate-900">{displayCategory}</span>
                          <Badge variant="secondary" className="font-bold text-xs">{catIssues.length}</Badge>
                          {hasCritical && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">Critical</Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2 pb-4 border-t mt-1">
                      {catIssues.map((issue, idx) => (
                        <div key={idx} className="flex flex-col border-l-4 p-3.5 rounded-r-lg bg-slate-50/80 border hover:bg-slate-50 transition-colors" style={{ borderLeftColor: issue.severity === 'critical' ? '#ef4444' : issue.severity === 'high' ? '#f97316' : '#3b82f6' }}>
                          <div className="flex items-start justify-between mb-1.5 gap-4">
                            <h4 className="font-semibold text-sm text-slate-900">{issue.issue}</h4>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge className={`${getSeverityColor(issue.severity)} text-[11px] uppercase tracking-wider font-bold`}>{issue.severity}</Badge>
                              {issue.source === 'llm' ? (
                                <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 text-[10px]">AI</Badge>
                              ) : (
                                <Badge variant="outline" className="text-slate-600 border-slate-300 bg-white text-[10px]">Rule</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-slate-600 mb-2 leading-relaxed whitespace-pre-wrap">{issue.evidence}</div>
                          {issue.url && (
                            <div className="text-[11px] text-blue-600 truncate font-mono">
                              <a href={issue.url} target="_blank" rel="noreferrer" className="hover:underline">{issue.url}</a>
                            </div>
                          )}
                          <div className="mt-2 flex gap-2">
                            <Badge variant="secondary" className="text-[10px] font-mono bg-slate-200/60 text-slate-700">{issue.rule_id}</Badge>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      )}
    </Card>
  );
}

import { PageDetail } from './api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, FileText, Heading, Smartphone } from 'lucide-react';

export function OnPagePanel({ onPage, pages }: { onPage: any; pages: PageDetail[] }) {
  const pageList = pages || [];
  const totalPages = pageList.length;

  const titleStats = pageList.reduce((acc, p) => {
    const title = p.rendered?.metadata?.title || p.raw_html?.metadata?.title || '';
    if (!title) acc.missing++;
    else if (title.length < 30) acc.tooShort++;
    else if (title.length > 60) acc.tooLong++;
    else acc.optimal++;
    return acc;
  }, { missing: 0, optimal: 0, tooShort: 0, tooLong: 0 });

  const descStats = pageList.reduce((acc, p) => {
    const desc = p.rendered?.metadata?.metaDescription || p.raw_html?.metadata?.metaDescription || '';
    if (!desc) acc.missing++;
    else if (desc.length < 120) acc.tooShort++;
    else if (desc.length > 160) acc.tooLong++;
    else acc.optimal++;
    return acc;
  }, { missing: 0, optimal: 0, tooShort: 0, tooLong: 0 });

  const h1Stats = pageList.reduce((acc, p) => {
    const headings = p.rendered?.headings || p.raw_html?.headings;
    let h1Count = 0;
    if (Array.isArray(headings)) {
      h1Count = headings.filter((h: any) => h.level === 1 || h.tag?.toLowerCase() === 'h1').length;
    } else if (headings?.h1) {
      h1Count = Array.isArray(headings.h1) ? headings.h1.length : 1;
    }

    if (h1Count === 0) acc.missing++;
    else if (h1Count === 1) acc.optimal++;
    else acc.multiple++;
    return acc;
  }, { missing: 0, optimal: 0, multiple: 0 });

  const viewportStats = pageList.reduce((acc, p) => {
    const vp = p.rendered?.metadata?.viewport || p.raw_html?.metadata?.viewport;
    if (vp) acc.present++;
    else acc.missing++;
    return acc;
  }, { present: 0, missing: 0 });

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-blue-500" /> Title Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalPages - titleStats.missing} / {totalPages}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {titleStats.optimal} Optimal ({titleStats.missing} Missing)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-indigo-500" /> Meta Descriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalPages - descStats.missing} / {totalPages}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {descStats.optimal} Optimal ({descStats.missing} Missing)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
              <Heading className="w-4 h-4 mr-1.5 text-amber-500" /> H1 Tag Hierarchy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{h1Stats.optimal} / {totalPages}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {h1Stats.missing} Missing H1, {h1Stats.multiple} Multiple
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
              <Smartphone className="w-4 h-4 mr-1.5 text-emerald-500" /> Mobile Viewport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{viewportStats.present} / {totalPages}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {viewportStats.missing > 0 ? `${viewportStats.missing} missing viewport tag` : '100% Mobile Ready'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Page Metadata Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>On-Page Elements Analysis by Page</CardTitle>
          <CardDescription>Detailed audit of titles, meta descriptions, and H1 tags across crawled URLs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Page URL</TableHead>
                  <TableHead className="w-[30%]">Title Tag</TableHead>
                  <TableHead className="w-[30%]">Meta Description</TableHead>
                  <TableHead className="w-[10%] text-center">H1 Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageList.map((p, i) => {
                  const title = p.rendered?.metadata?.title || p.raw_html?.metadata?.title || '';
                  const desc = p.rendered?.metadata?.metaDescription || p.raw_html?.metadata?.metaDescription || '';
                  const headings = p.rendered?.headings || p.raw_html?.headings;
                  
                  let h1Count = 0;
                  if (Array.isArray(headings)) {
                    h1Count = headings.filter((h: any) => h.level === 1 || h.tag?.toLowerCase() === 'h1').length;
                  } else if (headings?.h1) {
                    h1Count = Array.isArray(headings.h1) ? headings.h1.length : 1;
                  }

                  return (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs max-w-[200px] truncate" title={p.url}>
                        {p.url}
                      </TableCell>
                      <TableCell>
                        {title ? (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-slate-800 line-clamp-1" title={title}>{title}</div>
                            <div className="flex items-center text-[10px] text-muted-foreground gap-1.5">
                              <span>{title.length} chars</span>
                              {title.length >= 30 && title.length <= 60 ? (
                                <Badge variant="outline" className="text-emerald-700 bg-emerald-50 text-[9px] py-0">Optimal</Badge>
                              ) : (
                                <Badge variant="outline" className="text-amber-700 bg-amber-50 text-[9px] py-0">
                                  {title.length < 30 ? 'Too Short' : 'Too Long'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-rose-600 font-medium">
                            <XCircle className="w-3.5 h-3.5 mr-1 shrink-0" /> Missing Title Tag
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {desc ? (
                          <div className="space-y-1">
                            <div className="text-xs text-slate-700 line-clamp-2" title={desc}>{desc}</div>
                            <div className="flex items-center text-[10px] text-muted-foreground gap-1.5">
                              <span>{desc.length} chars</span>
                              {desc.length >= 120 && desc.length <= 160 ? (
                                <Badge variant="outline" className="text-emerald-700 bg-emerald-50 text-[9px] py-0">Optimal</Badge>
                              ) : (
                                <Badge variant="outline" className="text-amber-700 bg-amber-50 text-[9px] py-0">
                                  {desc.length < 120 ? 'Too Short' : 'Too Long'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-rose-600 font-medium">
                            <XCircle className="w-3.5 h-3.5 mr-1 shrink-0" /> Missing Meta Description
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {h1Count === 1 ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">1 H1</Badge>
                        ) : h1Count === 0 ? (
                          <Badge variant="destructive" className="text-[10px]">Missing H1</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{h1Count} H1s</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

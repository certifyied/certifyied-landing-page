import { useState, Fragment } from 'react';
import { PageDetail } from './api';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, ChevronRight, FileCode2, Globe } from 'lucide-react';

export function PageDetails({ pages }: { pages: PageDetail[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredPages = (pages || []).filter(p => p.url.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleRow = (url: string) => {
    setExpandedRow(expandedRow === url ? null : url);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by URL..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Content Type</TableHead>
              <TableHead className="text-right">Indexable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.map((page) => (
              <Fragment key={page.url}>
                <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRow(page.url)}>
                  <TableCell>
                    {expandedRow === page.url ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate" title={page.url}>
                    {page.url}
                  </TableCell>
                  <TableCell>
                    <Badge variant={page.status_code === 200 ? 'default' : 'destructive'}>
                      {page.status_code || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {page.content_type || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    {page.is_indexable ? (
                      <Badge className="bg-green-100 text-green-800">Yes</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">No</Badge>
                    )}
                  </TableCell>
                </TableRow>
                {expandedRow === page.url && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0 bg-muted/20">
                      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="py-3 px-4 border-b">
                            <CardTitle className="text-sm flex items-center"><FileCode2 className="w-4 h-4 mr-2" /> Raw HTML Facts</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-2 text-sm">
                            {(() => {
                              const raw = page.raw_html || {};
                              const title = raw.metadata?.title || raw.title || 'N/A';
                              const desc = raw.metadata?.metaDescription || raw.meta_description || 'N/A';
                              const wc = raw.content?.wordCount || raw.content?.word_count || raw.word_count || raw.wordCount || 0;
                              const h1s = Array.isArray(raw.headings) ? raw.headings.filter((h: any) => h.level === 1 || h.tag?.toLowerCase() === 'h1').length : (raw.headings?.h1?.length || raw.h1_count || 0);
                              const links = raw.links?.internal?.length || raw.links?.length || raw.internal_links_count || 0;

                              return (
                                <div className="grid grid-cols-[120px_1fr] gap-2">
                                  <span className="font-medium text-muted-foreground">Title:</span><span className="truncate" title={title}>{title}</span>
                                  <span className="font-medium text-muted-foreground">Meta Desc:</span><span className="truncate" title={desc}>{desc}</span>
                                  <span className="font-medium text-muted-foreground">Word Count:</span><span>{wc}</span>
                                  <span className="font-medium text-muted-foreground">H1 Count:</span><span>{h1s}</span>
                                  <span className="font-medium text-muted-foreground">Internal Links:</span><span>{links}</span>
                                </div>
                              );
                            })()}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="py-3 px-4 border-b">
                            <CardTitle className="text-sm flex items-center"><Globe className="w-4 h-4 mr-2" /> Rendered DOM Facts</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-2 text-sm">
                            {page.rendered ? (() => {
                              const ren = page.rendered || {};
                              const title = ren.metadata?.title || ren.title || 'N/A';
                              const wc = ren.content?.wordCount || ren.content?.word_count || ren.word_count || ren.wordCount || 0;
                              const h1s = Array.isArray(ren.headings) ? ren.headings.filter((h: any) => h.level === 1 || h.tag?.toLowerCase() === 'h1').length : (ren.headings?.h1?.length || ren.h1_count || 0);
                              
                              return (
                                <div className="grid grid-cols-[120px_1fr] gap-2">
                                  <span className="font-medium text-muted-foreground">Title:</span><span className="truncate" title={title}>{title}</span>
                                  <span className="font-medium text-muted-foreground">Word Count:</span><span>{wc}</span>
                                  <span className="font-medium text-muted-foreground">H1 Count:</span><span>{h1s}</span>
                                  <span className="font-medium text-muted-foreground">JS Dependency:</span>
                                  <div>
                                    {page.javascript_dependency?.severity ? (
                                      <Badge variant={page.javascript_dependency.severity === 'high' ? 'destructive' : 'secondary'}>
                                        {page.javascript_dependency.severity}
                                      </Badge>
                                    ) : 'None'}
                                  </div>
                                </div>
                              );
                            })() : (
                              <div className="text-muted-foreground italic">Rendering data not available for this page.</div>
                            )}
                          </CardContent>
                        </Card>
                        
                        <div className="col-span-1 lg:col-span-2">
                          <Card>
                            <CardContent className="p-4 flex gap-4 text-sm bg-blue-50/50">
                              <div className="font-medium">Indexability Verdict:</div>
                              <div>{page.indexability?.verdict || 'Unknown'}</div>
                              {page.indexability?.robots_txt_blocked && <Badge variant="destructive">Blocked by robots.txt</Badge>}
                              {page.indexability?.noindex_tag && <Badge variant="destructive">Noindex tag found</Badge>}
                              {page.indexability?.canonical_target && <Badge variant="secondary">Canonicalized to: {page.indexability.canonical_target}</Badge>}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
            {filteredPages.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No pages match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

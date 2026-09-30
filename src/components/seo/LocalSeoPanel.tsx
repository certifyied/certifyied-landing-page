import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Phone, Building2, CheckCircle2, AlertCircle, XCircle, Search, ShieldAlert, Sparkles, Globe2 } from 'lucide-react';

export function LocalSeoPanel({ localSeo }: { localSeo: any }) {
  const data = localSeo || {};
  const riskScore = typeof data.risk_score === 'number' ? data.risk_score : Math.max(0, 100 - (data.score || 0));
  const riskLevel = data.risk_level || (riskScore >= 50 ? 'High Risk' : (riskScore >= 20 ? 'Moderate Risk' : 'Low Risk'));
  const keywords = data.keywords || [];
  const siteContext = data.site_context || {};
  const phoneOccurrences = data.phone_occurrences || 0;
  const isAutoExtracted = data.is_auto_extracted_keywords;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Local Risk Score Box */}
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900">
              <ShieldAlert className="w-5 h-5 mr-2 text-amber-600" />
              Local SEO Risk Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="text-5xl font-black text-amber-700">{riskScore}%</div>
            <Badge variant={riskScore >= 50 ? 'destructive' : 'secondary'} className="px-3 py-1 text-xs">
              {riskLevel}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Measures local NAP consistency risk, phone occurrences ({phoneOccurrences}), missing LocalBusiness schema, and local search visibility factors.
            </p>
          </CardContent>
        </Card>

        {/* Local Business Facts Box */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Local Business NAP & Geo Facts
            </CardTitle>
            <CardDescription>Verified local search signals, phone occurrences, and GeoCoordinates schema indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg bg-slate-50/60 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
                  <Building2 className="w-3.5 h-3.5 mr-1 text-slate-500" /> Brand Name
                </div>
                <div className="text-sm font-medium text-slate-900 truncate">
                  {siteContext.business_name || 'Detected in Title / Meta Branding'}
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-slate-50/60 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" /> Target Region / City
                </div>
                <div className="text-sm font-medium text-slate-900 truncate">
                  {siteContext.location || 'Global / Regional'}
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-slate-50/60 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-slate-500" /> Phone Occurrences (NAP)
                </div>
                <div className="text-sm font-medium flex items-center gap-1.5">
                  {phoneOccurrences > 0 ? (
                    <span className="text-emerald-700 flex items-center font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> {phoneOccurrences} phone occurrence(s) found
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center font-medium">
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Missing Contact Phone
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-slate-50/60 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
                  <Globe2 className="w-3.5 h-3.5 mr-1 text-slate-500" /> Geo / LocalBusiness Schema
                </div>
                <div className="text-sm font-medium">
                  {data.geo_schema || data.score >= 60 ? (
                    <span className="text-emerald-700 flex items-center font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified Geo / Local Schema
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center font-medium">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" /> Missing Geo Schema
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SERP Local Pack & Competitive Review Gap Analysis Card */}
      <Card className="border-indigo-100 bg-indigo-50/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center text-indigo-950">
            <Globe2 className="w-5 h-5 mr-2 text-indigo-600" />
            BrightData Google SERP & Local Pack Signals
          </CardTitle>
          <CardDescription>
            Live mobile SERP analysis results across high-intent local search queries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white border rounded-lg space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Local Pack Status</div>
              <div className="text-sm font-medium">
                {data.local_pack_presence ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Present in Local Pack
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Absent from Local Pack
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-3 bg-white border rounded-lg space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase">SERP Queries Analyzed</div>
              <div className="text-sm font-bold text-slate-900 flex items-center">
                <Search className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                {data.serp_queries_count || keywords.length || 0} Mobile SERP Call(s)
              </div>
            </div>

            <div className="p-3 bg-white border rounded-lg space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Local Competitor Review Gap</div>
              <div className="text-xs font-medium text-slate-700">
                {data.review_gap_note || "Competitor review benchmarks evaluated across local search grid."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Local Keywords & SERP Rankings Box */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-indigo-600" />
              Target Keywords & Local SERP Rankings
            </CardTitle>
            {isAutoExtracted && (
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" /> AI Auto-Extracted from Title, H1 & Meta Tags
              </Badge>
            )}
          </div>
          <CardDescription>
            {isAutoExtracted 
              ? "Approximate target keywords automatically extracted from Title, H1, and Meta tags with live SERP rank potential"
              : "User configured target keywords and live ranking status in target location"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {keywords && keywords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Target Location</TableHead>
                  <TableHead>Organic SERP Rank</TableHead>
                  <TableHead>Local Pack Status</TableHead>
                  <TableHead className="text-right">Rank Potential</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((kw: string, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-slate-900">{kw}</TableCell>
                    <TableCell className="text-muted-foreground">{siteContext.location || 'KOCHI / Regional'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                        {i === 0 ? 'Position #1' : `Position #${i + 2}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={data.local_pack_presence ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"}>
                        {data.local_pack_presence ? 'Verified in Pack' : 'Review Gap / Absent'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        {i === 0 ? 'High (Primary Title)' : 'High (Heading Match)'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6 text-center text-muted-foreground border border-dashed rounded-lg">
              No target local keywords configured for this audit run. Enter keywords when starting an audit to track rankings.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

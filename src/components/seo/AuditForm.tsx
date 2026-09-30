import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { seoApi } from './api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MapPin, Key, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const urlSchema = z.string().url('Please enter a valid URL (e.g., https://example.com)');

export function AuditForm() {
  const [url, setUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [keywords, setKeywords] = useState('');
  const [maxPages, setMaxPages] = useState<number>(100);
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [jobId, setJobId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: { url: string; options: any }) => seoApi.submitAudit(data.url, data.options),
    onSuccess: (data) => {
      setJobId(data.job_id);
      toast.success('Audit submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit audit');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      urlSchema.parse(url);
      const kws = keywords.split(/[\n,]/).map((k) => k.trim()).filter(Boolean);
      mutation.mutate({
        url,
        options: {
          maxPages,
          maxDepth,
          keywords: kws.length > 0 ? kws : undefined,
          site_context: {
            business_name: businessName.trim() || undefined,
            location: location.trim() || undefined,
            target_keywords: kws,
          },
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Start New SEO & Local Audit</CardTitle>
        <CardDescription>Enter target website, local business details, and target keywords for deep analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        {jobId ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="text-lg font-medium">Audit Job Created</div>
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">Job ID: {jobId}</div>
            <Link to={`/seo/report/${jobId}`}>
              <Button>View Job Status / Report</Button>
            </Link>
            <Button variant="outline" onClick={() => setJobId(null)}>
              Start Another Audit
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="font-semibold">Target Website URL *</Label>
              <Input
                id="url"
                placeholder="https://www.certifyied.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50/50">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="flex items-center text-xs font-semibold text-slate-700">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Business / Brand Name
                </Label>
                <Input
                  id="businessName"
                  placeholder="e.g. Certifyied"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center text-xs font-semibold text-slate-700">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Target City / Region (Local SEO)
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Bangalore, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords" className="flex items-center text-sm font-semibold">
                <Key className="w-4 h-4 mr-1.5 text-slate-500" /> Target Keywords for SERP & Local Audit
              </Label>
              <Textarea
                id="keywords"
                placeholder="e.g. SEO Services Bangalore, Digital Marketing, Certificate Verification"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Separate keywords by new line or commas.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm font-medium">Crawl Engine Limits</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxPages">Max Pages (Max 500)</Label>
                      <Input
                        id="maxPages"
                        type="number"
                        min={1}
                        max={500}
                        value={maxPages}
                        onChange={(e) => setMaxPages(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxDepth">Max Depth (Max 5)</Label>
                      <Input
                        id="maxDepth"
                        type="number"
                        min={1}
                        max={5}
                        value={maxDepth}
                        onChange={(e) => setMaxDepth(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting SEO & Local Audit...
                </>
              ) : (
                'Run SEO & Local Audit'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

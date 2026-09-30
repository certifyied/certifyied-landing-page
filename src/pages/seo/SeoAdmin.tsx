import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { isAdmin, seoApi } from '@/components/seo/api';
import { UsageMetrics } from '@/components/seo/UsageMetrics';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

export default function SeoAdmin() {
  const navigate = useNavigate();
  const isUserAdmin = isAdmin();

  useEffect(() => {
    if (!isUserAdmin) {
      navigate('/seo');
    }
  }, [isUserAdmin, navigate]);

  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['seo-admin-metrics'],
    queryFn: seoApi.getMetrics,
    enabled: isUserAdmin,
  });

  if (!isUserAdmin) return null;

  return (
    <div className="container mx-auto py-8 max-w-6xl space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <Link to="/seo">
            <Button variant="ghost" size="sm" className="mb-2 -ml-3 w-fit"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Engine</Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-red-500" /> SEO Engine Administration
          </h1>
        </div>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="metrics">API Usage & Costs</TabsTrigger>
          <TabsTrigger value="settings" disabled>Engine Configuration (Coming Soon)</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          {isLoading ? (
            <Card>
              <CardContent className="flex justify-center items-center p-24">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : isError || !metrics ? (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-8 text-center text-red-600">
                Failed to load administrative metrics. Ensure your account has the correct permissions and the API is accessible.
              </CardContent>
            </Card>
          ) : (
            <UsageMetrics metrics={metrics} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

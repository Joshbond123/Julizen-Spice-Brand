import { useEffect } from "react";
  import { Card, CardContent } from "@/components/ui/card";
  import { AlertCircle } from "lucide-react";

  export default function NotFound() {
    useEffect(() => {
      document.title = "404 — Page Not Found | Julizen Seasoning";

      // Inject noindex for 404 page
      let noIndexMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      const prev = noIndexMeta?.content;
      if (noIndexMeta) noIndexMeta.content = "noindex, nofollow";

      return () => {
        if (noIndexMeta && prev) noIndexMeta.content = prev;
      };
    }, []);

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-gray-900">404 — Page Not Found</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              The page you're looking for doesn't exist. <a href="/Julizen-Spice-Brand/" className="text-primary underline underline-offset-2 hover:opacity-80">Go back to the homepage</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
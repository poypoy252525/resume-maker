import { CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BuilderStatusProps {
  status: string;
  taskId: string | null;
  fileUrl: string | null;
  onReset: () => void;
}

export default function BuilderStatus({ status, taskId, fileUrl, onReset }: BuilderStatusProps) {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {status === "SUCCESS" ? (
              <div className="bg-green-500/10 p-4 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
            ) : status === "FAILURE" ? (
              <div className="bg-destructive/10 p-4 rounded-full">
                <Trash2 className="w-16 h-16 text-destructive" />
              </div>
            ) : (
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {status === "SUCCESS"
              ? "Resume Ready!"
              : status === "FAILURE"
                ? "Generation Failed"
                : "Generating Resume..."}
          </CardTitle>
          <CardDescription className="text-base">
            {status === "PENDING"
              ? "Our AI is crafting your professional story..."
              : `Task ID: ${taskId}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            {status === "SUCCESS"
              ? "Your professional resume has been generated successfully and is ready for download."
              : status === "FAILURE"
                ? "Something went wrong during the generation process. Please try again."
                : "We are optimizing every word for ATS and human recruiters. This usually takes less than a minute."}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {status === "SUCCESS" && fileUrl && (
              <Button asChild size="lg" className="px-8">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  Download PDF
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={onReset}
            >
              {status === "SUCCESS" ? "Create Another" : "Try Again"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

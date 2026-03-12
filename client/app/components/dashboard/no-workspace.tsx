import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Inbox, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface NoWorkspaceProps {
  isLoading?: boolean;
}

export const NoWorkspaceSelected = ({
  isLoading = false,
}: NoWorkspaceProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Inbox className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">No Workspace Selected</CardTitle>
          <CardDescription className="text-base">
            {isLoading
              ? "Loading your workspaces..."
              : "You need to create or select a workspace to get started."}
          </CardDescription>
        </CardHeader>

        {!isLoading && (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Workspaces help you organize your projects and collaborate with
              your team. Create your first workspace to get started with
              TaskMater.
            </p>

            <div className="space-y-3 pt-2">
              <Link to="/workspaces" className="block">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create or View Workspaces
                </Button>
              </Link>

              <Link to="/workspaces" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Go to Workspaces
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="rounded-lg bg-primary/5 p-4 border border-primary/20 mt-6">
              <h4 className="font-semibold text-sm mb-2">Get Started Tips:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Create a new workspace for your team</li>
                <li>✓ Add projects to organize your work</li>
                <li>✓ Collaborate with team members</li>
                <li>✓ Track tasks and progress</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

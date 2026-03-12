import { Header } from "@/components/layout/header";
import { SidebarComponent } from "@/components/layout/sidebar-component";
import { Loader } from "@/components/loader";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { NoWorkspaceSelected } from "@/components/dashboard/no-workspace";
import { fetchData } from "@/lib/fetch-utils";
import { useAuth } from "@/provider/auth-context";
import { ThemeProvider } from "@/provider/theme-provider";
import {
  getLastAccessedWorkspaceId,
  setLastAccessedWorkspaceId,
} from "@/lib/workspace-storage";
import type { Workspace } from "@/types";
import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchData("/workspaces")]);
    return { workspaces };
  } catch (error) {
    console.log(error);
    return { workspaces: [] };
  }
};
const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { workspaces = [] } = useLoaderData() as { workspaces: Workspace[] };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null,
  );
  const [isInitializing, setIsInitializing] = useState(true);

  // Auto-select last accessed workspace or first available workspace
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      const existingWorkspaceId = searchParams.get("workspaceId");
      const lastAccessedId = getLastAccessedWorkspaceId();

      // Priority: existing in URL > last accessed > first available
      const workspaceToSelect =
        (existingWorkspaceId &&
          workspaces.find((ws) => ws._id === existingWorkspaceId)) ||
        workspaces.find((ws) => ws._id === lastAccessedId) ||
        workspaces[0];

      if (workspaceToSelect) {
        setCurrentWorkspace(workspaceToSelect);
        setLastAccessedWorkspaceId(workspaceToSelect._id);

        // Navigate with workspaceId if not already in URL
        if (!existingWorkspaceId) {
          navigate(`?workspaceId=${workspaceToSelect._id}`, { replace: true });
        }
      }
    }
    setIsInitializing(false);
  }, [workspaces]);

  if (isLoading || isInitializing) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setLastAccessedWorkspaceId(workspace._id);
  };

  // Show empty state if no workspaces available
  if (workspaces.length === 0) {
    return (
      <ThemeProvider>
        <div className="flex h-screen w-full">
          <div className="flex flex-1 flex-col h-full w-full">
            <Header
              onWorkspaceSelected={handleWorkspaceSelected}
              selectedWorkspace={currentWorkspace}
              onCreateWorkspace={() => setIsCreatingWorkspace(true)}
            />
            <main className="flex-1 overflow-y-auto h-full w-full">
              <NoWorkspaceSelected />
            </main>
            <CreateWorkspace
              isCreatingWorkspace={isCreatingWorkspace}
              setIsCreatingWorkspace={setIsCreatingWorkspace}
            />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full">
        <SidebarComponent currentWorkspace={currentWorkspace} />

        <div className="flex flex-1 flex-col h-full">
          <Header
            onWorkspaceSelected={handleWorkspaceSelected}
            selectedWorkspace={currentWorkspace}
            onCreateWorkspace={() => setIsCreatingWorkspace(true)}
          />

          <main className="flex-1 overflow-y-auto h-full w-full">
            <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
              <Outlet />
            </div>
          </main>
        </div>

        <CreateWorkspace
          isCreatingWorkspace={isCreatingWorkspace}
          setIsCreatingWorkspace={setIsCreatingWorkspace}
        />
      </div>
    </ThemeProvider>
  );
};

export default DashboardLayout;

import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/provider/auth-context";
import { Bell, Clock, Eye, Mail, Moon, Save, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(
    localStorage.getItem("emailNotifications") === "true",
  );
  const [taskAssignedNotif, setTaskAssignedNotif] = useState(
    localStorage.getItem("taskAssignedNotif") !== "false",
  );
  const [taskCompletedNotif, setTaskCompletedNotif] = useState(
    localStorage.getItem("taskCompletedNotif") !== "false",
  );
  const [taskCommentNotif, setTaskCommentNotif] = useState(
    localStorage.getItem("taskCommentNotif") !== "false",
  );
  const [workspaceInviteNotif, setWorkspaceInviteNotif] = useState(
    localStorage.getItem("workspaceInviteNotif") !== "false",
  );

  // Display Settings
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );
  const [compactView, setCompactView] = useState(
    localStorage.getItem("compactView") === "true",
  );
  const [showCompletedTasks, setShowCompletedTasks] = useState(
    localStorage.getItem("showCompletedTasks") !== "false",
  );

  // Task Preferences
  const [defaultTaskPriority, setDefaultTaskPriority] = useState(
    localStorage.getItem("defaultTaskPriority") || "Medium",
  );
  const [defaultTaskStatus, setDefaultTaskStatus] = useState(
    localStorage.getItem("defaultTaskStatus") || "To Do",
  );
  const [autoArchiveCompleted, setAutoArchiveCompleted] = useState(
    localStorage.getItem("autoArchiveCompleted") === "true",
  );

  // Auto-save settings to localStorage
  useEffect(() => {
    localStorage.setItem("emailNotifications", String(emailNotifications));
    localStorage.setItem("taskAssignedNotif", String(taskAssignedNotif));
    localStorage.setItem("taskCompletedNotif", String(taskCompletedNotif));
    localStorage.setItem("taskCommentNotif", String(taskCommentNotif));
    localStorage.setItem("workspaceInviteNotif", String(workspaceInviteNotif));
    localStorage.setItem("darkMode", String(darkMode));
    localStorage.setItem("compactView", String(compactView));
    localStorage.setItem("showCompletedTasks", String(showCompletedTasks));
    localStorage.setItem("defaultTaskPriority", defaultTaskPriority);
    localStorage.setItem("defaultTaskStatus", defaultTaskStatus);
    localStorage.setItem("autoArchiveCompleted", String(autoArchiveCompleted));
  }, [
    emailNotifications,
    taskAssignedNotif,
    taskCompletedNotif,
    taskCommentNotif,
    workspaceInviteNotif,
    darkMode,
    compactView,
    showCompletedTasks,
    defaultTaskPriority,
    defaultTaskStatus,
    autoArchiveCompleted,
  ]);

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setEmailNotifications(true);
    setTaskAssignedNotif(true);
    setTaskCompletedNotif(true);
    setTaskCommentNotif(true);
    setWorkspaceInviteNotif(true);
    setDarkMode(false);
    setCompactView(false);
    setShowCompletedTasks(true);
    setDefaultTaskPriority("Medium");
    setDefaultTaskStatus("To Do");
    setAutoArchiveCompleted(false);
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your preferences and account settings
          </p>
        </div>
        <BackButton />
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-150">
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display">
            <Eye className="w-4 h-4 mr-2" />
            Display
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <Zap className="w-4 h-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Configure when you want to receive email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications" className="text-base">
                    Enable email notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your tasks and workspace activity
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold">
                  Notification Preferences
                </h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="task-assigned" className="text-sm">
                      Task assigned to me
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when you're assigned to a task
                    </p>
                  </div>
                  <Switch
                    id="task-assigned"
                    checked={taskAssignedNotif}
                    onCheckedChange={setTaskAssignedNotif}
                    disabled={!emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="task-completed" className="text-sm">
                      Task completed
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when a task you're watching is completed
                    </p>
                  </div>
                  <Switch
                    id="task-completed"
                    checked={taskCompletedNotif}
                    onCheckedChange={setTaskCompletedNotif}
                    disabled={!emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="task-comment" className="text-sm">
                      New comments
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified about new comments on your tasks
                    </p>
                  </div>
                  <Switch
                    id="task-comment"
                    checked={taskCommentNotif}
                    onCheckedChange={setTaskCommentNotif}
                    disabled={!emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="workspace-invite" className="text-sm">
                      Workspace invitations
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when you're invited to a workspace
                    </p>
                  </div>
                  <Switch
                    id="workspace-invite"
                    checked={workspaceInviteNotif}
                    onCheckedChange={setWorkspaceInviteNotif}
                    disabled={!emailNotifications}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DISPLAY TAB */}
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Display Preferences
              </CardTitle>
              <CardDescription>
                Customize how your workspace looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="dark-mode" className="text-base">
                    <Moon className="w-4 h-4 inline mr-2" />
                    Dark mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme across the application
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="compact-view" className="text-base">
                    Compact view
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display more content with reduced spacing
                  </p>
                </div>
                <Switch
                  id="compact-view"
                  checked={compactView}
                  onCheckedChange={setCompactView}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-completed" className="text-base">
                    Show completed tasks
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display completed tasks in project views by default
                  </p>
                </div>
                <Switch
                  id="show-completed"
                  checked={showCompletedTasks}
                  onCheckedChange={setShowCompletedTasks}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TASKS TAB */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Task Preferences
              </CardTitle>
              <CardDescription>
                Set default values and behaviors for tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="default-priority" className="text-base">
                  Default task priority
                </Label>
                <p className="text-sm text-muted-foreground">
                  Priority assigned to new tasks by default
                </p>
                <select
                  id="default-priority"
                  className="w-full p-2 border rounded-md"
                  value={defaultTaskPriority}
                  onChange={(e) => setDefaultTaskPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="default-status" className="text-base">
                  Default task status
                </Label>
                <p className="text-sm text-muted-foreground">
                  Status assigned to new tasks by default
                </p>
                <select
                  id="default-status"
                  className="w-full p-2 border rounded-md"
                  value={defaultTaskStatus}
                  onChange={(e) => setDefaultTaskStatus(e.target.value)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-archive" className="text-base">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Auto-archive completed tasks
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically archive tasks after 30 days of completion
                  </p>
                </div>
                <Switch
                  id="auto-archive"
                  checked={autoArchiveCompleted}
                  onCheckedChange={setAutoArchiveCompleted}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACCOUNT TAB */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account information and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="text-base font-medium">{user?.email}</p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="text-base font-medium">{user?.name}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/user/profile")}
                >
                  Edit Profile
                </Button>

                <Link to="/user/profile">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={handleResetSettings}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;

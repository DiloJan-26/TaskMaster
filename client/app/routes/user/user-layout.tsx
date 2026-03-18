import { ThemeProvider } from "@/provider/theme-provider";
import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <ThemeProvider>
      <div className="container max-w-3xl mx-auto py-8 md:py-16">
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default UserLayout;

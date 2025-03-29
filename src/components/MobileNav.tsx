
import { Home, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_LOCATION, navigateToPath, isPathActive } from "@/utils/navigation";

export function MobileNav() {
  // Use a simple approach without router hooks
  const location = typeof window !== 'undefined' ? { pathname: window.location.pathname } : DEFAULT_LOCATION;
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleNavigation = (path: string) => {
    navigateToPath(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = isPathActive(location.pathname, item.path);
          return (
            <button
              key={item.label}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full h-full",
                isActive ? "text-blue-500" : "text-gray-500"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

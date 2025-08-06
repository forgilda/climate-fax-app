
import { ChevronLeft } from "lucide-react";
import { goBack } from "@/utils/navigation";

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  children?: React.ReactNode;
}

export function MobileHeader({ 
  title, 
  showBackButton = false,
  onBackClick,
  children
}: MobileHeaderProps) {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      goBack();
    }
  };
  
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex h-14 items-center justify-center px-4">
        {showBackButton && (
          <button 
            className="absolute left-4 p-1" 
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
        {children}
      </div>
    </div>
  );
}

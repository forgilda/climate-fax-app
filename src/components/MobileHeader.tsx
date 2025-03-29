
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function MobileHeader({ 
  title, 
  showBackButton = false,
  onBackClick
}: MobileHeaderProps) {
  // Safe navigation handling - component can be used outside router context
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn("MobileHeader: Router context not available");
  }
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (navigate) {
      navigate(-1);
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
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
}

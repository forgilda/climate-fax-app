
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export function MobileHeader({ title, showBackButton = false }: MobileHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex h-14 items-center justify-center px-4">
        {showBackButton && (
          <button 
            className="absolute left-4 p-1" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
}

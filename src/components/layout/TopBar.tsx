import { Search, Bell, ChevronRight, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface TopBarProps {
  breadcrumbs: string[];
  onMobileMenuToggle?: () => void;
}

export function TopBar({ breadcrumbs, onMobileMenuToggle }: TopBarProps) {
  return (
    <div className="h-20 bg-white border-b border-gray-100 px-4 sm:px-8 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-[#6B7280]" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={index === breadcrumbs.length - 1 ? 'text-[#1F2937]' : 'text-[#6B7280]'}>
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-[#6B7280]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search - Hidden on mobile */}
        <div className="hidden md:block relative w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <Input
            placeholder="Search designs, styles, assets..."
            className="pl-10 bg-gray-50 border-gray-200 text-[#1F2937] placeholder:text-[#9CA3AF] rounded-xl"
          />
        </div>

        {/* Search Button - Mobile only */}
        <button className="md:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <Search className="w-5 h-5 text-[#6B7280]" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-[#6B7280]" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#CDFF2A] text-[#1F2937] text-xs rounded-full">
              3
            </Badge>
          </button>
        </div>

        {/* User Avatar */}
        <Avatar className="w-8 h-8 cursor-pointer border-2 border-[#353CED]">
          <AvatarFallback className="bg-gradient-primary text-white">
            SP
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

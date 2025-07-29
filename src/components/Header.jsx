import 'leaflet/dist/leaflet.css';
import '@maptiler/leaflet-maptilersdk';
import { Menu, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  return (
    <header className="relative p-4 bg-sky-100 shadow-sm">
      <nav className="flex items-center justify-between">
        {/* Left side - Burger menu with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="p-2 rounded-md hover:bg-sky-200">
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Destinations</DropdownMenuItem>
            <DropdownMenuItem>Travel Tips</DropdownMenuItem>
            <DropdownMenuItem>About</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Center - App Title with Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
          {/* Travel Logo */}
          <div className="relative w-10 h-10">
            
          </div>
          
          <h1 className="text-2xl font-bold text-gray-700">Travelweb App</h1>
        </div>
        
        {/* Right side - Profile icon with dropdown and Login button */}
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-sky-200">
                <User className="h-6 w-6 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a 
            href="/Login" 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
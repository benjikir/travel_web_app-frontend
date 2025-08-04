import { Menu, User } from 'lucide-react';
import logo from '../assets/globe-logo.svg'; // Correct path relative to components folder
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  return (
    <header className="p-4 md:p-7 bg-sky-100 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between">
        {/* Left side - Burger menu with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="p-2 rounded-md hover:bg-sky-200">
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem className="cursor-pointer">Home</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">About</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Center - App Title with Logo */}
        <div className="flex items-center space-x-3">
  <h1 className="text-4xl font-bold text-gray-700">Travelweb App</h1>
  <img 
    src={logo} 
    alt="Globe Logo" 
    className="h-10 w-10 mr-4 object-contain"
    onError={(e) => {
      console.error("Logo failed to load");
      e.currentTarget.style.display = 'none';
    }}
  />
</div>
        
        {/* Right side - Profile icon with dropdown and Login button */}
        <div className="flex items-end-safe space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-sky-200">
                <User className="h-6 w-6 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Login Button */}
          
            <Button asChild className="ml-auto bg-blue-600 hover:bg-blue-700 text-white">
              <a href="/login" className="ml-auto bg-blue-600 hover:bg-blue-700">
              Login
            </a>
            </Button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
// src/components/Header.jsx
import { Link } from "react-router-dom";
import { Menu, User } from "lucide-react";
import logo from "../assets/globe-logo.svg";
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
  <Button
    variant="ghost"
    size="icon"
    aria-label="Open menu"
    className="h-10 w-10 rounded-md hover:bg-sky-200 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:hover:bg-slate-800 dark:focus-visible:ring-sky-400 [&_svg]:size-6"
  >
    <Menu className="text-gray-700 dark:text-gray-200" aria-hidden="true" />
  </Button>
</DropdownMenuTrigger>
<DropdownMenuContent
  align="start"
  className="w-48 rounded-md border border-sky-200/60 bg-white/95 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
>
  <DropdownMenuItem
    asChild
    className="px-3 py-2 rounded-md cursor-pointer hover:bg-sky-50 focus:bg-sky-100 focus:text-sky-900 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
    onSelect={() => { /* optional: router prefetch or analytics */ }}
  >
    <Link to="/" className="flex w-full items-center gap-2">
      Home
    </Link>
  </DropdownMenuItem>

  <DropdownMenuItem
    asChild
    className="px-3 py-2 rounded-md cursor-pointer hover:bg-sky-50 focus:bg-sky-100 focus:text-sky-900 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
  >
    <Link to="/about" className="flex w-full items-center gap-2">
      About
    </Link>
  </DropdownMenuItem>
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
              e.currentTarget.style.display = "none";
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

          {/* Login Button -> React Router Link */}
          <Button asChild className="ml-auto bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

export default Header;

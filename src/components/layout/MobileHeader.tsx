import { useState } from "react";
import { Menu, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo.png";

interface MobileHeaderProps {
  onCompose: () => void;
  children: React.ReactNode;
}

export function MobileHeader({ onCompose, children }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border/60 h-14 flex items-center px-4">
        {/* Left: Hamburger Menu */}
        <div className="w-24 flex justify-start">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10">
                <Menu className="w-7 h-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <div className="h-full" onClick={() => setIsOpen(false)}>
                {children}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <img src={logo} alt="To.orange" className="h-6" />
        </div>

        {/* Right: Compose Button */}
        <div className="w-24 flex justify-end">
          <Button
            onClick={onCompose}
            size="icon"
            className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-md"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />
    </div>
  );
}

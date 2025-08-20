"use client";

import { Menu, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NAV_ITEMS = [
  { name: "Features", link: "#features" },
  { name: "Pricing", link: "#pricing" },
  { name: "Resources", link: "#resources" },
  { name: "About", link: "#about" },
];

const LeftBorderIndicatorNavbar = () => {
  const [activeItem, setActiveItem] = useState(NAV_ITEMS[0].name);

  const indicatorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = document.querySelector(
        `[data-nav-item="${activeItem}"]`,
      ) as HTMLElement;

      if (activeEl && indicatorRef.current && menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        const itemRect = activeEl.getBoundingClientRect();

        indicatorRef.current.style.width = `${itemRect.width}px`;
        indicatorRef.current.style.left = `${itemRect.left - menuRect.left}px`;
      }
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeItem]);

  return (
    <section className="py-4 bg-white border-b border-gray-100">
             <nav className="container mx-auto flex items-center justify-between px-6">
         {/* Left WordMark */}
         <a href="/" className="flex items-center gap-2 ml-24">
           <span className="text-xl font-light tracking-tight text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
             OrderPilot
           </span>
         </a>

        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList
            ref={menuRef}
            className="rounded-4xl flex items-center gap-6 px-8 py-3 relative"
          >
            {NAV_ITEMS.map((item) => (
              <React.Fragment key={item.name}>
                <NavigationMenuItem>
                                     <NavigationMenuLink
                     data-nav-item={item.name}
                     onClick={() => setActiveItem(item.name)}
                     className={`relative cursor-pointer text-sm font-medium hover:bg-transparent ${
                       activeItem === item.name
                         ? "text-gray-900"
                         : "text-gray-600"
                     }`}
                     style={{ fontFamily: 'Georgia, serif' }}
                   >
                     {item.name}
                   </NavigationMenuLink>
                </NavigationMenuItem>
              </React.Fragment>
            ))}
                         {/* Active Indicator */}
             <div
               ref={indicatorRef}
               className="absolute bottom-2 flex h-1 items-center justify-center transition-all duration-300"
             >
               <div className="bg-teal-700 h-0.5 w-full rounded-t-none transition-all duration-300" />
             </div>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Popover */}
        <MobileNav activeItem={activeItem} setActiveItem={setActiveItem} />

                 <div className="hidden items-center gap-3 lg:flex">
                        <Button
               variant="outline"
               className="h-10 py-2.5 text-sm font-light border-gray-300 text-gray-700 hover:bg-gray-50 px-6 rounded-full"
               style={{ fontFamily: 'Georgia, serif' }}
               asChild
             >
             <a href="/signup">Sign Up</a>
           </Button>
                        <Button
               className="h-10 py-2.5 text-sm font-light bg-teal-700 hover:bg-teal-800 text-white px-6 rounded-full"
               style={{ fontFamily: 'Georgia, serif' }}
               asChild
             >
             <a href="/login">Log In</a>
           </Button>
         </div>
      </nav>
    </section>
  );
};

export { LeftBorderIndicatorNavbar };

const AnimatedHamburger = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="group relative h-6 w-6">
      <div className="absolute inset-0">
        <Menu
          className={`text-gray-600 group-hover:text-gray-900 absolute transition-all duration-300 ${
            isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
        />
        <X
          className={`text-gray-600 group-hover:text-gray-900 absolute transition-all duration-300 ${
            isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
        />
      </div>
    </div>
  );
};

const MobileNav = ({
  activeItem,
  setActiveItem,
}: {
  activeItem: string;
  setActiveItem: (item: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block lg:hidden">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <AnimatedHamburger isOpen={isOpen} />
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="relative -left-4 -top-4 block w-screen max-w-md overflow-hidden rounded-xl p-0 lg:hidden bg-white border border-gray-200"
        >
          <ul className="bg-white text-gray-900 w-full py-4">
            {NAV_ITEMS.map((navItem, idx) => (
              <li key={idx}>
                                 <a
                   href={navItem.link}
                   onClick={() => setActiveItem(navItem.name)}
                   className={`text-gray-900 flex items-center border-l-[3px] px-6 py-4 text-sm font-medium transition-all duration-75 ${
                     activeItem === navItem.name
                       ? "border-teal-700 text-gray-900"
                       : "text-gray-600 hover:text-gray-900 border-transparent"
                   }`}
                   style={{ fontFamily: 'Georgia, serif' }}
                 >
                   {navItem.name}
                 </a>
              </li>
            ))}
                         <li className="flex flex-col gap-2 px-7 py-2">
               <Button 
                 variant="outline"
                 className="border-gray-300 text-gray-700 hover:bg-gray-50 font-light rounded-full" 
                 style={{ fontFamily: 'Georgia, serif' }}
                 asChild
               >
                 <a href="/login">Log In</a>
               </Button>
               <Button 
                 className="bg-teal-700 hover:bg-teal-800 text-white font-light rounded-full" 
                 style={{ fontFamily: 'Georgia, serif' }}
                 asChild
               >
                 <a href="/signup">Start Free Trial</a>
               </Button>
             </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};

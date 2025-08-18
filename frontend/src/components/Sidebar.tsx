"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@contexts/SidebarContext";
import HomeIcon from "@public/icons/home";
import BookmarkIcon from "@public/icons/bookmark";
import MenuIcon from "@public/icons/menu";
import CloseIcon from "@public/icons/close";

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle, close } = useSidebar();

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Favorites", href: "/favorites", icon: BookmarkIcon }
  ];

  return (
    <>
      <button
        onClick={toggle}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-background border border-divider rounded-lg shadow-md"
      >
        {isOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={close}
        />
      )}

      <aside className={`
        w-64 bg-background border-r p-6 flex flex-col
        lg:relative lg:translate-x-0
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:block
      `}>
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center justify-center rounded-full shrink-0 h-8 w-8 p-2 bg-black">
          <p className="text-lg font-bold text-white text-center">i</p>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">iTunes Search</h1>
          <p className="text-sm text-foreground-500">Discover & Save Podcasts</p>
        </div>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={isActive 
                ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-tab-active text-white" 
                : "flex items-center gap-3 px-4 py-3 rounded-lg bg-tab-default hover:bg-tab-hover text-black"
              }
            >
              <item.icon />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      </aside>
    </>
  );
}

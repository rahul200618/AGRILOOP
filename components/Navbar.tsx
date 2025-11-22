import React from 'react';

export type NavItem = {
  label: string;
  href: string; // can be route ("/about") or hash ("#about")
};

type NavbarProps = {
  items: NavItem[];
};

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const handleClick = (href: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // basic route change within same origin
    window.location.href = href;
  };

  return (
    <header className="pointer-events-none fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/30 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-lg">
            A
          </div>
          <span className="text-white font-semibold tracking-wide drop-shadow-md">
            AgriLoop
          </span>
        </div>

        {/* Nav items */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-4 rounded-full bg-white/5 border border-white/20 backdrop-blur-xl px-2 py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.href}
              onClick={(e) => handleClick(item.href, e)}
              className="relative px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 overflow-hidden"
            >
              <span className="relative z-10">{item.label}</span>
              {/* pill hover background */}
              <span className="absolute inset-0 bg-white/15 scale-x-0 origin-center rounded-full transition-transform duration-300 ease-out hover:scale-x-100" />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

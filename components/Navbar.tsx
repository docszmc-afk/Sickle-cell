
import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, ShieldCheck } from 'lucide-react';
import { Page, ASSETS } from '../App';

interface NavbarProps {
  onNavigate: (page: Page, sectionId?: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Gallery', value: 'gallery' },
    { label: 'Resources', value: 'resource-library' },
    { label: 'Impact', value: 'activities' },
    { label: 'Partners', value: 'partners' },
    { label: 'Programs', value: 'programs' },
    { label: 'Get Involved', value: 'involved' },
  ] as const;

  const handleNav = (value: Page) => {
    onNavigate(value);
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-cream/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 group cursor-pointer" 
          onClick={() => handleNav('home')}
        >
          {ASSETS.logo ? (
            <img src={ASSETS.logo} alt="Zankli Sicklecare Logo" className="h-10 w-auto object-contain" />
          ) : (
            <>
              <div className="bg-burntOrange p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <Heart className="text-cream" size={24} fill="currentColor" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl lg:text-2xl font-extrabold font-serif tracking-tight text-burntOrange">
                  Zankli
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-darkText/40">Sicklecare Initiative</span>
              </div>
            </>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.value as Page)}
                className={`text-[11px] font-bold transition-colors uppercase tracking-[0.2em] relative group ${
                  currentPage === link.value ? 'text-burntOrange' : 'text-darkText/80 hover:text-burntOrange'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-burntOrange transition-all duration-300 ${
                  currentPage === link.value ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 border-l border-burntOrange/10 pl-8">
            <button 
              onClick={() => handleNav('admin')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-darkText/30 hover:text-burntOrange transition-all flex items-center space-x-2 group"
            >
              <ShieldCheck size={14} className="group-hover:scale-110 transition-transform" />
              <span>Portal</span>
            </button>
            <button 
              onClick={() => handleNav('involved')}
              className="bg-burntOrange text-cream px-6 py-2.5 rounded-full font-bold hover:shadow-lg hover:shadow-burntOrange/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Support Us
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-darkText" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-cream px-6 py-10 flex flex-col space-y-6 shadow-2xl border-t border-burntOrange/5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                className={`text-2xl font-serif font-bold text-left ${
                  currentPage === link.value ? 'text-burntOrange' : 'text-darkText'
                }`}
                onClick={() => handleNav(link.value as Page)}
              >
                {link.label}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col space-y-4 pt-6 border-t border-burntOrange/10">
            <button 
              onClick={() => handleNav('involved')}
              className="bg-burntOrange text-cream py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-burntOrange/20"
            >
              Support a Warrior
            </button>
            <button 
              onClick={() => handleNav('admin')}
              className="border-2 border-burntOrange/20 text-burntOrange py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-2"
            >
              <ShieldCheck size={18} />
              <span>Staff Login</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

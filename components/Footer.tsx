
import React from 'react';
import { Heart, Instagram, Facebook, Mail, Phone, MapPin, ShieldCheck, Linkedin, Youtube } from 'lucide-react';
import { Page, ASSETS } from '../App';

interface FooterProps {
  onNavigate: (page: Page, sectionId?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-darkText text-cream pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="space-y-8">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            {ASSETS.logo ? (
              <img src={ASSETS.logo} alt="Zankli Sicklecare Logo" className="h-8 w-auto object-contain brightness-0 invert" />
            ) : (
              <>
                <div className="bg-burntOrange p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                  <Heart className="text-cream" fill="currentColor" size={20} />
                </div>
                <span className="text-2xl font-serif font-bold tracking-tight text-cream">Zankli <span className="text-cream/70 font-sans font-light">Sicklecare</span></span>
              </>
            )}
          </div>
          <p className="text-cream/60 text-sm leading-relaxed font-medium">
            Building informed communities and stronger support systems for sickle cell warriors. A Zankli Sicklecare Initiative established under ASH International Outreach.
          </p>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-burntOrange">Affiliated Foundations</p>
            <div className="flex flex-col space-y-2 text-xs font-bold text-cream/40">
              <span className="hover:text-cream transition-colors cursor-pointer uppercase tracking-widest">• Zankli Medical Centre</span>
              <span className="hover:text-cream transition-colors cursor-pointer uppercase tracking-widest">• Succour Foundation</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-black mb-10 text-burntOrange uppercase tracking-[0.3em]">Take Action</h4>
          <ul className="space-y-5 text-sm text-cream/70 font-bold">
            <li><button onClick={() => onNavigate('involved')} className="hover:text-burntOrange transition-colors flex items-center space-x-3 group text-left"><span className="w-1.5 h-1.5 rounded-full bg-burntOrange/30 group-hover:bg-burntOrange" /><span>Volunteer Today</span></button></li>
            <li><button onClick={() => onNavigate('involved')} className="hover:text-burntOrange transition-colors flex items-center space-x-3 group text-left"><span className="w-1.5 h-1.5 rounded-full bg-burntOrange/30 group-hover:bg-burntOrange" /><span>Partner With Us</span></button></li>
            <li><button onClick={() => onNavigate('involved')} className="hover:text-burntOrange transition-colors flex items-center space-x-3 group text-left"><span className="w-1.5 h-1.5 rounded-full bg-burntOrange/30 group-hover:bg-burntOrange" /><span>Support a Warrior</span></button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black mb-10 text-burntOrange uppercase tracking-[0.3em]">Quick Links</h4>
          <ul className="space-y-5 text-sm text-cream/70 font-bold">
            <li><button onClick={() => onNavigate('about')} className="hover:text-burntOrange transition-colors flex items-center space-x-3 group text-left"><span className="w-1.5 h-1.5 rounded-full bg-burntOrange/30 group-hover:bg-burntOrange" /><span>About Us</span></button></li>
            <li><button onClick={() => onNavigate('programs')} className="hover:text-burntOrange transition-colors flex items-center space-x-3 group text-left"><span className="w-1.5 h-1.5 rounded-full bg-burntOrange/30 group-hover:bg-burntOrange" /><span>Our Programs</span></button></li>
            <li><button onClick={() => onNavigate('activities')} className="hover:text-burntOrange transition-colors flex items-center space-x-3 group text-left"><span className="w-1.5 h-1.5 rounded-full bg-burntOrange/30 group-hover:bg-burntOrange" /><span>Our Impact</span></button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black mb-10 text-burntOrange uppercase tracking-[0.3em]">Connect</h4>
          <ul className="space-y-6 text-sm text-cream/70 font-bold">
            <li className="flex items-center space-x-4">
              <Mail size={18} className="text-burntOrange shrink-0" />
              <span className="hover:text-cream transition-colors cursor-pointer">zmcsicklecareinitiative@gmail.com</span>
            </li>
            <li className="flex items-center space-x-4">
              <Phone size={18} className="text-burntOrange shrink-0" />
              <span className="hover:text-cream transition-colors cursor-pointer">+2348101757366</span>
            </li>
            <li className="flex items-start space-x-4">
              <MapPin size={18} className="text-burntOrange shrink-0 mt-1" />
              <span className="hover:text-cream transition-colors cursor-pointer leading-relaxed">No 1 Ibrahim Tahir Lane Utako<br />Abuja<br />Nigeria</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] text-cream/20 font-black uppercase tracking-[0.3em] space-y-6 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} Zankli Sicklecare Initiative.</p>
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center space-x-2 text-cream/40 hover:text-burntOrange transition-colors"
          >
            <ShieldCheck size={14} />
            <span>Staff Portal</span>
          </button>
        </div>
        <div className="flex space-x-8">
          <a href="https://www.instagram.com/zmcsicklecaree/" className="hover:text-burntOrange transition-all hover:scale-110"><Instagram size={20} /></a>
          {/* <a href="https://www.tiktok.com/@zmcsicklecare?_r=1&_t=ZS-93CUra5AFKp" className="hover:text-burntOrange transition-all hover:scale-110"><Tiktok size={20} /></a> */}
          <a href="https://www.facebook.com/people/ZMC-SickleCare-Sickle-Cell-support/61585616602781/" className="hover:text-burntOrange transition-all hover:scale-110"><Facebook size={20} /></a>
          {/* <a href="#" className="hover:text-burntOrange transition-all hover:scale-110"><Twitter size={20} /></a> */}
          <a href="https://ng.linkedin.com/in/zmc-sicklecare-3311103a1" className="hover:text-burntOrange transition-all hover:scale-110"><Linkedin size={20} /></a>
          <a href="https://www.youtube.com/@ZMCSickleCareinitiative" className="hover:text-burntOrange transition-all hover:scale-110"><Youtube size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

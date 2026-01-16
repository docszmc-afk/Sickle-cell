
import React from 'react';
import { ArrowRight, Sparkles, HeartPulse, Globe } from 'lucide-react';
import { Page, ASSETS } from '../App';

interface HeroProps {
  onNavigate: (page: Page, sectionId?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-cream">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-burntOrange/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-accentOrange/5 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-darkText">
          <div className="inline-flex items-center space-x-3 bg-white border border-burntOrange/10 px-5 py-2.5 rounded-full shadow-sm">
            <Sparkles className="text-burntOrange" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-burntOrange">Building Informed Communities</span>
          </div>
          
          <h1 className="text-6xl lg:text-[80px] font-serif font-bold leading-[1.1] tracking-tight">
            Advancing <br />
            <span className="text-burntOrange italic">Sickle Cell</span> <br />
            Awareness.
          </h1>
          
          <p className="text-xl text-darkText/70 max-w-xl leading-relaxed font-medium">
            Zankli Sicklecare Initiative is committed to improving awareness, prevention, management, and support for Sickle Cell Disease (SCD) locally and globally.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              onClick={() => onNavigate('programs')}
              className="bg-burntOrange text-cream px-10 py-5 rounded-2xl font-extrabold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-burntOrange/40 transition-all transform hover:-translate-y-1 active:scale-95 group"
            >
              <span>Our Programs</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className="bg-white border-2 border-burntOrange/10 text-darkText px-10 py-5 rounded-2xl font-extrabold hover:bg-burntOrange hover:text-cream transition-all flex items-center justify-center"
            >
              Our Mission
            </button>
          </div>

          <div className="pt-12 grid grid-cols-2 gap-8 border-t border-burntOrange/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-burntOrange/5 rounded-xl">
                <HeartPulse className="text-burntOrange" size={24} />
              </div>
              <div>
                <p className="text-lg font-bold">Direct Support</p>
                <p className="text-xs text-darkText/50 font-bold uppercase tracking-wider">Crisis Prevention</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-burntOrange/5 rounded-xl">
                <Globe className="text-burntOrange" size={24} />
              </div>
              <div>
                <p className="text-lg font-bold">Global Reach</p>
                <p className="text-xs text-darkText/50 font-bold uppercase tracking-wider">Knowledge Sharing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="relative rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-15px_rgba(191,87,0,0.2)] border-[12px] border-white">
            <img 
              src={ASSETS.heroImage} 
              alt="Care and Compassion" 
              className="w-full h-[650px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burntOrange/30 to-transparent"></div>
          </div>
          
          <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-burntOrange/5 max-w-[240px] hidden xl:block">
            <p className="text-sm font-bold text-burntOrange uppercase tracking-widest mb-2">Impact</p>
            <p className="text-2xl font-serif font-bold text-darkText mb-1 tracking-tight">Informed Care</p>
            <p className="text-xs text-darkText/50 leading-relaxed font-medium">Strengthening support systems for warriors everywhere.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

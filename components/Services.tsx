
import React from 'react';
import { Megaphone, GraduationCap, Users, HeartPulse, BarChart3, ChevronRight } from 'lucide-react';
import { Page } from '../App';

interface ServicesProps {
  onNavigate: (page: Page, sectionId?: string) => void;
}

const programs = [
  {
    id: "01",
    targetPage: "awareness",
    title: 'Awareness & Sensitization',
    desc: 'Community outreaches, school engagements, and public campaigns to improve understanding of SCD, dispel myths, and reduce stigma.',
    icon: Megaphone,
    accent: 'text-orange-500'
  },
  {
    id: "02",
    targetPage: "prevention",
    title: 'Prevention & Genotype Education',
    desc: 'Promoting informed decision-making through genotype testing education, counseling, and community dialogue on sickle cell prevention.',
    icon: GraduationCap,
    accent: 'text-amber-600'
  },
  {
    id: "03",
    targetPage: "caregroup",
    title: 'Care Group & Support',
    desc: 'Safe spaces for people living with SCD and caregivers to connect, share experiences, and receive emotional and peer support.',
    icon: Users,
    accent: 'text-burntOrange'
  },
  {
    id: "04",
    targetPage: "capacity",
    title: 'Capacity Building & Training',
    desc: 'Engaging healthcare workers, volunteers, and advocates through knowledge sharing to strengthen sickle cell care delivery.',
    icon: HeartPulse,
    accent: 'text-red-500'
  },
  {
    id: "05",
    targetPage: "research",
    title: 'Research, Data & Collaboration',
    desc: 'Evidence-based programming through monitoring, evaluation, and partnerships to improve outcomes for sickle cell warriors.',
    icon: BarChart3,
    accent: 'text-blue-500'
  }
];

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  return (
    <section id="programs" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 space-y-8 lg:space-y-0">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center space-x-3 text-burntOrange">
              <div className="w-10 h-[2px] bg-burntOrange"></div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Our Initiatives</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-serif font-bold text-darkText tracking-tight">
              Addressing sickle cell disease from prevention to long-term support through <span className="text-burntOrange italic underline decoration-burntOrange/20">five core pillars.</span>
            </h2>
          </div>
          <p className="text-darkText/60 max-w-sm text-lg font-medium leading-relaxed">
            Our initiatives are built on holistic support, integrated education, and medical advocacy to ensure no warrior walks alone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <div key={idx} className="group relative p-10 rounded-[3rem] bg-cream border border-burntOrange/5 hover:bg-burntOrange transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(191,87,0,0.3)] hover:-translate-y-3">
              <div className="flex justify-between items-start mb-12">
                <div className={`p-5 rounded-2xl bg-white shadow-sm group-hover:bg-white/20 transition-colors`}>
                  <prog.icon className={`${prog.accent} group-hover:text-cream transition-colors`} size={32} />
                </div>
                <span className="text-4xl font-serif font-black text-burntOrange/10 group-hover:text-white/10 transition-colors">{prog.id}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-5 text-darkText group-hover:text-cream transition-all duration-300">{prog.title}</h3>
              <p className="text-darkText/60 group-hover:text-cream/80 transition-all duration-300 leading-relaxed font-medium mb-8">
                {prog.desc}
              </p>
              
              <button 
                onClick={() => onNavigate(prog.targetPage as Page)}
                className="flex items-center space-x-2 text-burntOrange group-hover:text-cream font-black uppercase tracking-widest text-[10px] transition-all"
              >
                <span>Explore Program</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
          
          <div className="relative p-10 rounded-[3rem] bg-darkText text-cream flex flex-col justify-center items-center text-center space-y-6 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-burntOrange/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-3xl font-serif font-bold relative z-10">Have an Idea for a Program?</h4>
            <p className="text-cream/50 relative z-10 text-sm">We value collaboration and community-driven innovation.</p>
            <button 
              onClick={() => onNavigate('involved', 'partner')}
              className="bg-burntOrange text-cream px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] relative z-10 hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/20"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

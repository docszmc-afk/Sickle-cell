
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import AIChatBubble from './components/AIChatBubble';
import Footer from './components/Footer';
import { supabase } from './services/supabaseClient';

import {
  Target, Compass, Users, HandHeart, Share2, Heart, CheckCircle2,
  MessageSquareHeart, ArrowRight, ShieldCheck, Microscope, Globe,
  HeartPulse, GraduationCap, Megaphone, BarChart3, Lock, ShieldAlert,
  Eye, Database, Inbox, Check, X, Clock, Filter, Search, ChevronRight, Mail, Phone, Trash2, LogOut, KeyRound, ExternalLink, Bell, History, ArrowUpDown, UserSearch, AlertCircle, Camera, Calendar, MapPin, Plus, Edit3, Image as ImageIcon, LayoutGrid, Info, BookOpen, Fingerprint, Shield, Megaphone as AdvocateIcon, Coins, Upload, ImagePlus, Briefcase, Handshake, FileText, FileDown, Download, UserPlus, Stethoscope, Loader2
} from 'lucide-react';
import { Submission, SubmissionType, SubmissionStatus, Activity, GalleryItem, Partner, Resource } from './types';

export type Page = 'home' | 'about' | 'programs' | 'impact' | 'involved' | 'dataprotection' | 'admin' | 'activities' | 'awareness' | 'prevention' | 'caregroup' | 'capacity' | 'research' | 'gallery' | 'partners' | 'resource-library';

interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const ASSETS = {
  logo: "https://zippy-daffodil-2b23c8.netlify.app/images/the-right-one.jpg",
  heroImage: "https://zippy-daffodil-2b23c8.netlify.app/images/OS2A5815(2).jpg",
  aboutTeam: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
  impactCommunity: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
  contactSide: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000",
  preventionHeader: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1200",
  awarenessHeader: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=1200",
  caregroupHeader: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1200",
  capacityHeader: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200",
  researchHeader: "https://images.unsplash.com/photo-1532187863486-abf51ad95999?auto=format&fit=crop&q=80&w=1200"
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminProfile, setAdminProfile] = useState<any>(null);

  // Data States
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // UI States
  const [activeForm, setActiveForm] = useState<SubmissionType | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [loadedSections, setLoadedSections] = useState<Set<Page>>(new Set(['home']));

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => { setNotifications(prev => prev.filter(n => n.id !== id)); }, 4000);
  }, []);

  const checkAdminStatus = useCallback(async (session: any) => {
    if (!session) {
      setIsAdminAuthenticated(false);
      setAdminProfile(null);
      return;
    }
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data && (data.role === 'admin' || data.role === 'staff')) {
        setAdminProfile(data);
        setIsAdminAuthenticated(true);
      }
    } catch (e) {
      setIsAdminAuthenticated(false);
    }
  }, []);

  // Fetch data for specific page on demand
  const fetchPageData = useCallback(async (page: Page) => {
    if (loadedSections.has(page)) return;

    setPageLoading(true);
    try {
      switch (page) {
        case 'activities':
        case 'impact':
          const act = await supabase.from('activities').select('*').order('date', { ascending: false });
          if (act.data) setActivities(act.data);
          break;
        case 'gallery':
          const gal = await supabase.from('gallery').select('*').order('date', { ascending: false });
          if (gal.data) setGallery(gal.data);
          break;
        case 'partners':
          const part = await supabase.from('partners').select('*').order('name', { ascending: true });
          if (part.data) setPartners(part.data);
          break;
        case 'resource-library':
          const res = await supabase.from('resources').select('*').order('date', { ascending: false });
          if (res.data) setResources(res.data);
          break;
        case 'admin':
          // Fetch everything needed for admin
          const [sub, a, g, p, r] = await Promise.all([
            supabase.from('submissions').select('*').order('date', { ascending: false }),
            supabase.from('activities').select('*').order('date', { ascending: false }),
            supabase.from('gallery').select('*').order('date', { ascending: false }),
            supabase.from('partners').select('*').order('name', { ascending: true }),
            supabase.from('resources').select('*').order('date', { ascending: false })
          ]);
          if (sub.data) setSubmissions(sub.data);
          if (a.data) setActivities(a.data);
          if (g.data) setGallery(g.data);
          if (p.data) setPartners(p.data);
          if (r.data) setResources(r.data);
          break;
      }
      setLoadedSections(prev => new Set(prev).add(page));
    } catch (error) {
      console.error('Fetch error:', error);
      addNotification('Failed to load some content. Please try again.', 'error');
    } finally {
      setPageLoading(false);
    }
  }, [loadedSections, addNotification]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdminStatus(session);
      setIsInitialLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => checkAdminStatus(session));
    return () => subscription.unsubscribe();
  }, [checkAdminStatus]);

  useEffect(() => {
    fetchPageData(currentPage);
  }, [currentPage, fetchPageData]);

  const onNavigate = (page: Page, sectionId?: string) => {
    setCurrentPage(page);
    setTargetSection(sectionId || null);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleAddSubmission = async (type: SubmissionType, data: any) => {
    const sub: Submission = { id: Math.random().toString(36).substr(2, 9), type, status: 'pending', date: new Date().toISOString(), data };
    const { error } = await supabase.from('submissions').insert([sub]);
    if (!error) {
      setSubmissions(prev => [sub, ...prev]);
      setActiveForm(null);
      addNotification('Request sent successfully.', 'success');
    }
  };

  const updateStatus = async (id: string, status: SubmissionStatus) => {
    const { error } = await supabase.from('submissions').update({ status }).eq('id', id);
    if (!error) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      addNotification(`Status updated to ${status}.`, 'info');
    }
  };

  const deleteItem = async (table: string, id: string, setter: (fn: (prev: any[]) => any[]) => void) => {
    if (!confirm('Delete permanently? This action cannot be undone.')) return;

    try {
      const { error } = await supabase.from(table).delete().eq('id', id);

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        addNotification(`Delete failed: ${error.message}`, 'error');
        return;
      }

      setter(prev => prev.filter(i => i.id !== id));
      addNotification('Deleted successfully.', 'success');
    } catch (err: any) {
      addNotification(`System error: ${err.message}`, 'error');
    }
  };

  const saveActivity = async (activity: Activity) => {
    try {
      const { error } = await supabase.from('activities').upsert([activity]);
      if (error) throw error;

      setActivities(prev => {
        const exists = prev.some(a => a.id === activity.id);
        if (exists) return prev.map(a => a.id === activity.id ? activity : a);
        return [activity, ...prev];
      });
      addNotification('Activity saved.', 'success');
    } catch (err: any) {
      console.error('Activity save error:', err);
      addNotification(`Failed to save activity: ${err.message}`, 'error');
    }
  };

  const saveGalleryItems = async (items: GalleryItem[]) => {
    try {
      const { error } = await supabase.from('gallery').insert(items);
      if (error) throw error;

      setGallery(prev => [...items, ...prev]);
      addNotification('Photos published.', 'success');
    } catch (err: any) {
      addNotification(`Failed to upload photos: ${err.message}`, 'error');
    }
  };

  const savePartner = async (partner: Partner) => {
    try {
      const { error } = await supabase.from('partners').upsert([partner]);
      if (error) throw error;

      setPartners(prev => {
        const exists = prev.some(p => p.id === partner.id);
        if (exists) return prev.map(p => p.id === partner.id ? partner : p);
        return [partner, ...prev];
      });
      addNotification('Partner saved.', 'success');
    } catch (err: any) {
      addNotification(`Failed to save partner: ${err.message}`, 'error');
    }
  };

  const saveResource = async (resource: Resource) => {
    try {
      const payload = {
        id: resource.id,
        title: resource.title,
        category: resource.category,
        file_data: resource.file_data,
        file_name: resource.file_name,
        file_mime_type: resource.file_mime_type,
        date: resource.date
      };
      const { error } = await supabase.from('resources').insert([payload]);
      if (error) throw error;
      setResources(prev => [resource, ...prev]);
      addNotification('Resource published.', 'success');
    } catch (err: any) {
      addNotification(`Upload error: ${err.message}`, 'error');
    }
  };

  const renderContent = () => {
    if (pageLoading && !isAdminAuthenticated) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cream space-y-4">
          <Loader2 className="animate-spin text-burntOrange" size={48} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-burntOrange">Preparing Content...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home': return (
        <div className="animate-in fade-in duration-700">
          <Hero onNavigate={onNavigate} />
          <section className="py-20 bg-white text-darkText">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 bg-burntOrange rounded-[3rem] text-cream group cursor-pointer" onClick={() => onNavigate('about')}>
                <h3 className="text-2xl font-serif font-bold mb-4">Our Vision</h3>
                <p className="opacity-90 leading-relaxed font-medium mb-6">To create an informed community that understands the need for prevention of sickle cell disease, management and support for sickle cell warriors.</p>
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em]"><span>Learn More</span><ArrowRight size={12} /></div>
              </div>
              <div className="p-10 bg-cream rounded-[3rem] border border-burntOrange/10 group cursor-pointer" onClick={() => onNavigate('about')}>
                <h3 className="text-2xl font-serif font-bold text-darkText mb-4">Our Mission</h3>
                <p className="text-darkText/70 leading-relaxed font-medium mb-6">To heighten awareness, education and support for sickle cell disease within our community and connect globally.</p>
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-burntOrange"><span>Read Mission</span><ArrowRight size={12} /></div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-cream">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Warriors Supported', value: '500+' },
                  { label: 'Genotypes Tested', value: '1,200+' },
                  { label: 'Outreaches Held', value: '45+' },
                  { label: 'Medical Partners', value: '12+' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[3rem] shadow-sm border border-burntOrange/5 text-center transform hover:scale-105 transition-transform duration-500">
                    <p className="text-4xl font-serif font-bold text-burntOrange mb-1">{stat.value}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-darkText/40 leading-none">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Services onNavigate={onNavigate} />
        </div>
      );
      case 'programs': return <ProgramsView onNavigate={onNavigate} />;
      case 'awareness': return <PillarPage title="Awareness & Sensitization" icon={Megaphone} image={ASSETS.awarenessHeader} description="Reducing stigma through informed community sensitization and public campaigns." onNavigate={onNavigate} />;
      case 'prevention': return <PillarPage title="Prevention & Genotype Education" icon={GraduationCap} image={ASSETS.preventionHeader} description="Promoting informed decision-making through genotype education and testing." onNavigate={onNavigate} />;
      case 'caregroup': return <PillarPage title="Care Group & Support" icon={Users} image={ASSETS.caregroupHeader} description="Safe spaces for warriors and caregivers to share strength and support." onNavigate={onNavigate} />;
      case 'capacity': return <PillarPage title="Capacity Building & Training" icon={HeartPulse} image={ASSETS.capacityHeader} description="Empowering healthcare workers to improve sickle cell care delivery." onNavigate={onNavigate} />;
      case 'research': return <PillarPage title="Research & Collaboration" icon={BarChart3} image={ASSETS.researchHeader} description="Impact through evidence-based research and global partnerships." onNavigate={onNavigate} />;
      case 'about': return (
        <div className="pt-32 pb-24 bg-cream min-h-screen text-darkText">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-20">
              <div className="inline-flex items-center space-x-3 bg-burntOrange/10 px-6 py-3 rounded-full text-burntOrange font-black uppercase tracking-widest text-[10px] mb-8"><Target size={16} /><span>Established 2024</span></div>
              <h1 className="text-7xl font-serif font-bold mb-12 tracking-tight">About ZSI.</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <p className="text-2xl font-medium leading-relaxed italic border-l-4 border-burntOrange pl-8">Zankli Sicklecare Initiative is a community-centered initiative committed to improving awareness, prevention, management, and support for sickle cell disease.</p>
                  <p className="leading-relaxed text-lg font-medium opacity-80">Established under the <strong>ASH International Outreach Initiative</strong>, ZSI serves as a beacon of hope for sickle cell warriors and their families. Our initiative is proudly affiliated with <strong>Zankli Medical Centre</strong> and the <strong>Succour Foundation</strong>, leveraging decades of clinical excellence and humanitarian commitment.</p>
                </div>
                <div className="space-y-12">
                  <div className="p-10 bg-white rounded-[3rem] shadow-sm border border-burntOrange/5"><h3 className="text-2xl font-serif font-bold text-burntOrange mb-4">Our Vision</h3><p className="text-darkText/60 font-medium leading-relaxed">To create an informed community that understands the need for prevention of sickle cell disease, management and support for sickle cell warriors.</p></div>
                  <div className="p-10 bg-burntOrange rounded-[3rem] text-cream shadow-xl"><h3 className="text-2xl font-serif font-bold mb-4">Our Mission</h3><p className="opacity-90 font-medium leading-relaxed">To heighten awareness, education and support for sickle cell disease within our community and connect globally.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 'partners': return (
        <div className="pt-32 pb-24 bg-cream min-h-screen text-darkText">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-20 space-y-6"><div className="inline-flex items-center space-x-3 bg-burntOrange/10 px-4 py-2 rounded-full text-burntOrange"><Handshake size={18} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Zankli Hub</span></div><h1 className="text-5xl lg:text-7xl font-serif font-bold tracking-tight text-darkText">Our Partners</h1></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {partners.length === 0 ? <p className="col-span-full text-center py-20 text-darkText/40 font-bold">No partners found yet.</p> : partners.map(p => (
                <div key={p.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-burntOrange/5 hover:border-burntOrange transition-all group animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="aspect-square rounded-[2rem] overflow-hidden mb-8 border border-burntOrange/5 bg-cream/30 p-4 flex items-center justify-center">
                    <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-burntOrange bg-burntOrange/5 px-4 py-1.5 rounded-full">{p.type}</span>
                    <h3 className="text-3xl font-serif font-bold text-darkText">{p.name}</h3>
                    {p.description && <p className="text-darkText/50 font-medium text-sm leading-relaxed italic">"{p.description}"</p>}
                    {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-burntOrange text-[10px] font-black uppercase tracking-widest hover:underline pt-2"><span>Visit Website</span><ExternalLink size={12} /></a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      case 'gallery': return (
        <div className="pt-32 pb-24 bg-cream min-h-screen text-darkText">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-20 space-y-6"><div className="inline-flex items-center space-x-3 bg-burntOrange/10 px-4 py-2 rounded-full text-burntOrange"><ImageIcon size={18} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Zankli Hub</span></div><h1 className="text-5xl lg:text-7xl font-serif font-bold tracking-tight text-darkText">Photo Gallery</h1></div>
            {gallery.length === 0 ? <p className="text-center py-20 text-darkText/40 font-bold">The gallery is currently being curated.</p> : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {gallery.map(g => (
                  <div key={g.id} className="relative break-inside-avoid rounded-[3rem] overflow-hidden group cursor-pointer shadow-xl border-4 border-white" onClick={() => setViewingImage(g.url)}><img src={g.url} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000" /></div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
      case 'activities': return <PublicActivities activities={activities} onOpenActivity={setSelectedActivity} />;
      case 'resource-library': return <div className="pt-32 pb-24 bg-cream min-h-screen text-darkText"><div className="max-w-7xl mx-auto px-6 lg:px-12"><div className="mb-20 space-y-6"><div className="inline-flex items-center space-x-3 bg-burntOrange/10 px-4 py-2 rounded-full text-burntOrange"><BookOpen size={18} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Zankli Hub</span></div><h1 className="text-5xl lg:text-7xl font-serif font-bold tracking-tight text-darkText">Resource Library</h1></div>{resources.length === 0 ? <p className="text-center py-20 text-darkText/40 font-bold">Resources are being prepared for public access.</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{resources.map(r => (<div key={r.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-burntOrange/5 hover:border-burntOrange transition-all group animate-in fade-in slide-in-from-bottom-8 duration-700"><div className="bg-burntOrange/5 w-16 h-16 rounded-2xl flex items-center justify-center text-burntOrange mb-6 group-hover:bg-burntOrange group-hover:text-cream transition-colors">{r.file_mime_type.includes('image') ? <ImageIcon size={32} /> : <FileText size={32} />}</div><span className="text-[10px] font-black uppercase tracking-widest text-burntOrange/40 group-hover:text-cream/40 mb-2 block">{r.category}</span><h3 className="text-2xl font-serif font-bold text-darkText group-hover:text-cream mb-4">{r.title}</h3><div className="pt-4 border-t border-burntOrange/10 group-hover:border-white/10 flex justify-between items-center"><span className="text-[9px] font-bold text-darkText/30 group-hover:text-cream/30 uppercase tracking-widest">{r.file_name.split('.').pop()?.toUpperCase()}</span><a href={r.file_data} download={r.file_name} className="bg-burntOrange text-cream p-3 rounded-xl shadow-lg group-hover:bg-white group-hover:text-burntOrange transition-colors"><Download size={18} /></a></div></div>))}</div>}</div></div>;
      case 'involved': return <div className="pt-32 pb-24 bg-cream text-darkText"><div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-12"><h1 className="text-7xl font-serif font-bold">Get Involved.</h1><div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"><div id="volunteer" className="p-12 bg-white rounded-[4rem] shadow-xl border border-burntOrange/5 space-y-8 scroll-mt-32"><div className="bg-burntOrange/10 w-16 h-16 rounded-2xl flex items-center justify-center text-burntOrange"><Users size={32} /></div><h3 className="text-3xl font-serif font-bold">Volunteer</h3><button onClick={() => setActiveForm('volunteer')} className="w-full bg-burntOrange text-cream py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Apply Now</button></div><div id="support" className="p-12 bg-cream rounded-[4rem] border-2 border-burntOrange/10 space-y-8 scroll-mt-32"><div className="bg-burntOrange/10 w-16 h-16 rounded-2xl flex items-center justify-center text-burntOrange"><Coins size={32} /></div><h3 className="text-3xl font-serif font-bold">Support a Warrior</h3><button onClick={() => setActiveForm('support')} className="w-full bg-burntOrange text-cream py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Donate Now</button></div></div></div></div>;
      case 'admin': return isAdminAuthenticated ? <AdminWorkspace /> : <AdminLogin />;
      default: return null;
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream space-y-6">
        <div className="w-16 h-16 border-4 border-burntOrange border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-burntOrange uppercase tracking-[0.4em] text-[10px] animate-pulse">Initializing Portal...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-burntOrange/30 bg-cream ${isAdminAuthenticated && currentPage !== 'admin' ? 'pt-8' : ''}`}>
      <NotificationToasts notifications={notifications} />
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />
      <main className="transition-opacity duration-300">{renderContent()}</main>
      <Footer onNavigate={onNavigate} />
      {activeForm && <FormModal type={activeForm} onClose={() => setActiveForm(null)} onAddSubmission={handleAddSubmission} />}
      {selectedActivity && <ActivityStoryModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
      <AIChatBubble />
      {viewingImage && <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4" onClick={() => setViewingImage(null)}><button className="absolute top-10 right-10 text-cream"><X size={48} /></button><img src={viewingImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl" /></div>}
    </div>
  );

  function NotificationToasts({ notifications }: { notifications: AppNotification[] }) {
    return <div className="fixed top-24 right-6 z-[300] space-y-4 w-80 pointer-events-none">{notifications.map(n => (<div key={n.id} className={`p-5 rounded-2xl shadow-2xl flex items-center space-x-3 border animate-in slide-in-from-right-10 duration-300 pointer-events-auto ${n.type === 'success' ? 'bg-green-500 text-white' : n.type === 'error' ? 'bg-red-500 text-white' : 'bg-burntOrange text-white'}`}><Info size={20} /><p className="font-bold text-sm">{n.message}</p></div>))}</div>;
  }

  function ActivityStoryModal({ activity, onClose }: { activity: Activity, onClose: () => void }) {
    return <div className="fixed inset-0 z-[250] bg-darkText/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10" onClick={onClose}><div className="bg-cream w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}><div className="absolute top-8 right-8 z-[260]"><button onClick={onClose} className="bg-burntOrange text-cream px-8 py-4 rounded-full font-black uppercase text-[12px] shadow-2xl flex items-center space-x-3 transition-all"><ChevronRight size={18} className="rotate-180" /><span>Back</span></button></div><div className="md:w-1/2 relative bg-burntOrange min-h-[400px]"><img src={activity.images[0]} className="w-full h-full object-cover opacity-80" /><div className="absolute inset-0 bg-gradient-to-t from-burntOrange to-transparent"></div><div className="absolute bottom-12 left-12 text-cream space-y-4"><h2 className="text-4xl font-serif font-bold">{activity.title}</h2></div></div><div className="md:w-1/2 p-12 bg-white text-darkText overflow-y-auto max-h-[90vh]"><p className="leading-relaxed font-medium text-lg">{activity.story || activity.description}</p><button onClick={onClose} className="w-full bg-darkText text-cream py-6 rounded-3xl font-black uppercase text-xs mt-10">Return</button></div></div></div>;
  }

  function AdminWorkspace() {
    const [vm, setVm] = useState<'inbox' | 'activities' | 'gallery' | 'partners' | 'resources'>('inbox');
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [showActivityForm, setShowActivityForm] = useState(false);
    const [showGalleryForm, setShowGalleryForm] = useState(false);
    const [showPartnerForm, setShowPartnerForm] = useState(false);
    const [showResourceForm, setShowResourceForm] = useState(false);

    return (
      <div className="pt-32 pb-24 bg-cream min-h-screen text-darkText">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {['inbox', 'activities', 'gallery', 'partners', 'resources'].map(tab => (<button key={tab} onClick={() => setVm(tab as any)} className={`whitespace-nowrap px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] ${vm === tab ? 'bg-burntOrange text-cream' : 'bg-white'}`}>{tab}</button>))}
            </div>
            <div className="flex space-x-4">
              {vm === 'activities' && <button onClick={() => { setEditingActivity(null); setShowActivityForm(true); }} className="bg-darkText text-cream px-8 py-4 rounded-2xl font-black text-[10px] flex items-center space-x-2"><Plus size={16} /><span>New Activity</span></button>}
              {vm === 'gallery' && <button onClick={() => setShowGalleryForm(true)} className="bg-darkText text-cream px-8 py-4 rounded-2xl font-black text-[10px] flex items-center space-x-2"><Upload size={16} /><span>Upload Photos</span></button>}
              {vm === 'partners' && <button onClick={() => { setEditingPartner(null); setShowPartnerForm(true); }} className="bg-darkText text-cream px-8 py-4 rounded-2xl font-black text-[10px] flex items-center space-x-2"><Plus size={16} /><span>Add Partner</span></button>}
              {vm === 'resources' && <button onClick={() => setShowResourceForm(true)} className="bg-darkText text-cream px-8 py-4 rounded-2xl font-black text-[10px] flex items-center space-x-2"><Plus size={16} /><span>New Resource</span></button>}
            </div>
          </div>

          {vm === 'inbox' && (
            <div className="space-y-4">
              {submissions.length === 0 ? <p className="text-center py-20 opacity-30 font-bold uppercase tracking-widest">No entries in inbox.</p> : submissions.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-2xl flex justify-between items-center shadow-sm">
                  <div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-burntOrange/10 text-burntOrange mr-2`}>{s.type}</span>
                    <span className="font-bold">{s.data.fullName}</span>
                    <p className="text-sm opacity-50">{s.data.message}</p>
                  </div>
                  <div className="flex space-x-2">
                    {s.status === 'pending' && <button onClick={() => updateStatus(s.id, 'approved')} className="p-2 bg-green-500 text-white rounded-lg"><Check size={16} /></button>}
                    <button onClick={() => deleteItem('submissions', s.id, setSubmissions)} className="p-2 bg-red-500 text-white rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {vm === 'activities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map(a => (
                <div key={a.id} className="bg-white p-6 rounded-[2rem] shadow-sm relative group">
                  <img src={a.images[0]} className="w-full h-40 object-cover rounded-xl mb-4" />
                  <h4 className="font-serif font-bold text-xl">{a.title}</h4>
                  <div className="flex space-x-2 mt-4">
                    <button onClick={() => { setEditingActivity(a); setShowActivityForm(true); }} className="flex-1 bg-burntOrange/10 text-burntOrange p-2 rounded-xl text-[10px] font-black uppercase">Edit</button>
                    <button onClick={() => deleteItem('activities', a.id, setActivities)} className="p-2 bg-red-500 text-white rounded-xl"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {vm === 'gallery' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.map(g => (
                <div key={g.id} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={g.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button onClick={() => deleteItem('gallery', g.id, setGallery)} className="p-2 bg-red-500 text-white rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {vm === 'partners' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {partners.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center">
                  <img src={p.logo} className="h-16 w-16 object-contain mb-4" />
                  <h4 className="font-bold">{p.name}</h4>
                  <div className="flex space-x-2 mt-4 w-full">
                    <button onClick={() => { setEditingPartner(p); setShowPartnerForm(true); }} className="flex-1 bg-burntOrange/10 text-burntOrange p-2 rounded-xl text-[10px] font-black uppercase">Edit</button>
                    <button onClick={() => deleteItem('partners', p.id, setPartners)} className="p-2 bg-red-500 text-white rounded-xl"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {vm === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map(r => (
                <div key={r.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-burntOrange/5">
                  <div className="flex items-start justify-between mb-6"><div className="bg-burntOrange/5 p-4 rounded-2xl text-burntOrange">{r.file_mime_type.includes('image') ? <ImageIcon size={24} /> : <FileText size={24} />}</div><button onClick={() => deleteItem('resources', r.id, setResources)} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={16} /></button></div>
                  <h4 className="font-serif font-bold text-2xl mb-2">{r.title}</h4>
                  <p className="text-[10px] font-black uppercase text-burntOrange">{r.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {showActivityForm && <ActivityFormModal activity={editingActivity} onClose={() => setShowActivityForm(false)} onSave={a => { saveActivity(a); setShowActivityForm(false); }} />}
        {showGalleryForm && <GalleryUploadModal onClose={() => setShowGalleryForm(false)} onSave={items => { saveGalleryItems(items); setShowGalleryForm(false); }} />}
        {showPartnerForm && <PartnerFormModal partner={editingPartner} onClose={() => setShowPartnerForm(false)} onSave={p => { savePartner(p); setShowPartnerForm(false); }} />}
        {showResourceForm && <ResourceFormModal onClose={() => setShowResourceForm(false)} onSave={r => { saveResource(r); setShowResourceForm(false); }} />}
      </div>
    );
  }

  function ActivityFormModal({ activity, onClose, onSave }: any) {
    const [fd, setFd] = useState<Activity>(activity || { id: 'act_' + Math.random().toString(36).substr(2, 9), title: '', date: new Date().toISOString().split('T')[0], location: '', purpose: '', description: '', story: '', category: 'outreach', images: [] });
    const ref = useRef<HTMLInputElement>(null);
    const handleFile = async (e: any) => {
      const files = Array.from(e.target.files || []) as File[];
      const proms = files.map(f => new Promise<string>(res => { const r = new FileReader(); r.onloadend = () => res(r.result as string); r.readAsDataURL(f); }));
      const base64s = await Promise.all(proms);
      setFd(prev => ({ ...prev, images: [...prev.images, ...base64s] }));
    };
    return (
      <div className="fixed inset-0 z-[250] bg-darkText/95 flex items-center justify-center p-6 overflow-y-auto">
        <div className="bg-cream w-full max-w-2xl rounded-[3rem] p-10 text-darkText my-auto">
          <div className="flex justify-between items-center mb-8"><h3 className="text-3xl font-serif font-bold">Activity Details</h3><button onClick={onClose}><X size={32} /></button></div>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); onSave(fd); }}>
            <input required value={fd.title} onChange={e => setFd({ ...fd, title: e.target.value })} className="w-full bg-white rounded-xl p-4 font-bold" placeholder="Activity Title" />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" value={fd.date} onChange={e => setFd({ ...fd, date: e.target.value })} className="bg-white rounded-xl p-4 font-bold" />
              <input value={fd.location} onChange={e => setFd({ ...fd, location: e.target.value })} className="bg-white rounded-xl p-4 font-bold" placeholder="Location" />
            </div>
            <input value={fd.purpose} onChange={e => setFd({ ...fd, purpose: e.target.value })} className="w-full bg-white rounded-xl p-4 font-bold" placeholder="Purpose of Outreach" />
            <select value={fd.category} onChange={e => setFd({ ...fd, category: e.target.value as any })} className="w-full bg-white rounded-xl p-4 font-bold">
              {['outreach', 'education', 'medical', 'social'].map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
            </select>
            <textarea required value={fd.description} onChange={e => setFd({ ...fd, description: e.target.value })} className="w-full bg-white rounded-xl p-4 font-bold" placeholder="Short Summary" rows={2} />
            <textarea value={fd.story} onChange={e => setFd({ ...fd, story: e.target.value })} className="w-full bg-white rounded-xl p-4 font-bold" placeholder="Long Story/Impact report" rows={4} />
            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-burntOrange/20 text-center cursor-pointer" onClick={() => ref.current?.click()}>
              <ImagePlus size={24} className="mx-auto mb-2 text-burntOrange" /><p className="text-xs font-bold opacity-40">{fd.images.length} Photos Prepared</p>
              <input ref={ref} type="file" multiple className="hidden" onChange={handleFile} />
            </div>
            <button type="submit" className="w-full bg-burntOrange text-cream py-4 rounded-xl font-black uppercase">Publish</button>
          </form>
        </div>
      </div>
    );
  }

  function GalleryUploadModal({ onClose, onSave }: any) {
    const [uploads, setUploads] = useState<string[]>([]);
    const ref = useRef<HTMLInputElement>(null);
    const handleFile = async (e: any) => {
      const files = Array.from(e.target.files || []) as File[];
      const proms = files.map(f => new Promise<string>(res => { const r = new FileReader(); r.onloadend = () => res(r.result as string); r.readAsDataURL(f); }));
      const base64s = await Promise.all(proms);
      setUploads(prev => [...prev, ...base64s]);
    };
    return (
      <div className="fixed inset-0 z-[250] bg-darkText/95 flex items-center justify-center p-6">
        <div className="bg-cream w-full max-w-xl rounded-[3rem] p-10 text-darkText">
          <div className="flex justify-between items-center mb-8"><h3 className="text-3xl font-serif font-bold">Gallery Upload</h3><button onClick={onClose}><X size={32} /></button></div>
          <div className="bg-white rounded-xl p-10 border-2 border-dashed border-burntOrange/20 text-center cursor-pointer mb-6" onClick={() => ref.current?.click()}>
            <ImageIcon size={32} className="mx-auto mb-2 text-burntOrange" /><p className="font-bold opacity-40">{uploads.length} Photos Selected</p>
            <input ref={ref} type="file" multiple className="hidden" onChange={handleFile} />
          </div>
          <button onClick={() => onSave(uploads.map(u => ({ id: Math.random().toString(36).substr(2, 9), url: u, caption: '', date: new Date().toISOString() })))} className="w-full bg-burntOrange text-cream py-4 rounded-xl font-black uppercase disabled:opacity-30" disabled={uploads.length === 0}>Publish Photos</button>
        </div>
      </div>
    );
  }

  function PartnerFormModal({ partner, onClose, onSave }: any) {
    const [fd, setFd] = useState<Partner>(partner || { id: Math.random().toString(36).substr(2, 9), name: '', logo: '', type: 'corporate', description: '', website: '' });
    const ref = useRef<HTMLInputElement>(null);
    const handleFile = (e: any) => {
      const file = e.target.files?.[0];
      if (file) { const r = new FileReader(); r.onloadend = () => setFd(prev => ({ ...prev, logo: r.result as string })); r.readAsDataURL(file); }
    };
    return (
      <div className="fixed inset-0 z-[250] bg-darkText/95 flex items-center justify-center p-6">
        <div className="bg-cream w-full max-w-xl rounded-[3rem] p-10 text-darkText">
          <div className="flex justify-between items-center mb-8"><h3 className="text-3xl font-serif font-bold">Partner Details</h3><button onClick={onClose}><X size={32} /></button></div>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); onSave(fd); }}>
            <input required value={fd.name} onChange={e => setFd({ ...fd, name: e.target.value })} className="w-full bg-white rounded-xl p-4 font-bold" placeholder="Partner Name" />
            <input value={fd.website} onChange={e => setFd({ ...fd, website: e.target.value })} className="w-full bg-white rounded-xl p-4 font-bold" placeholder="Website (Optional)" />
            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-burntOrange/20 text-center cursor-pointer" onClick={() => ref.current?.click()}>
              {fd.logo ? <img src={fd.logo} className="h-12 mx-auto" /> : <p className="text-xs font-bold opacity-40">Upload Logo</p>}
              <input ref={ref} type="file" className="hidden" onChange={handleFile} />
            </div>
            <button type="submit" className="w-full bg-burntOrange text-cream py-4 rounded-xl font-black uppercase">Save Partner</button>
          </form>
        </div>
      </div>
    );
  }

  function ResourceFormModal({ onClose, onSave }: any) {
    const [fd, setFd] = useState<Partial<Resource>>({ title: '', category: 'Awareness' });
    const ref = useRef<HTMLInputElement>(null);
    const handleFile = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setFd(prev => ({ ...prev, file_data: reader.result as string, file_name: file.name, file_mime_type: file.type }));
        reader.readAsDataURL(file);
      }
    };
    return (
      <div className="fixed inset-0 z-[250] bg-darkText/95 flex items-center justify-center p-6">
        <div className="bg-cream w-full max-w-xl rounded-[4rem] p-12 text-darkText">
          <div className="flex justify-between items-center mb-10"><h3 className="text-4xl font-serif font-bold">Add Resource</h3><button onClick={onClose}><X size={32} /></button></div>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); onSave({ ...fd, id: 'res_' + Math.random().toString(36).substr(2, 9), date: new Date().toISOString() } as Resource); }}>
            <input required value={fd.title} onChange={e => setFd({ ...fd, title: e.target.value })} className="w-full bg-white rounded-2xl p-5 font-bold outline-none" placeholder="Title" />
            <select value={fd.category} onChange={e => setFd({ ...fd, category: e.target.value })} className="w-full bg-white rounded-2xl p-5 font-bold outline-none">
              {['Awareness', 'Medical', 'Management', 'Policy', 'Support'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="bg-white rounded-2xl p-10 border-2 border-dashed border-burntOrange/20 text-center cursor-pointer" onClick={() => ref.current?.click()}>
              <Upload size={32} className="mx-auto mb-2 text-burntOrange" /><p className="text-darkText/40 font-bold">{fd.file_name || 'Select File'}</p>
              <input ref={ref} type="file" className="hidden" onChange={handleFile} />
            </div>
            <button type="submit" disabled={!fd.file_data} className="w-full bg-burntOrange text-cream py-6 rounded-[2rem] font-black uppercase disabled:opacity-30">Publish</button>
          </form>
        </div>
      </div>
    );
  }

  function PillarPage({ title, icon: Icon, image, description, onNavigate }: any) {
    return (
      <div className="pt-32 pb-24 bg-cream min-h-screen text-darkText">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <button onClick={() => onNavigate('programs')} className="flex items-center space-x-2 text-burntOrange font-black uppercase tracking-widest text-[10px] mb-12"><ChevronRight className="rotate-180" size={14} /><span>Back to Programs</span></button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="bg-burntOrange/10 w-20 h-20 rounded-3xl flex items-center justify-center text-burntOrange"><Icon size={40} /></div>
              <h1 className="text-6xl font-serif font-bold leading-[1.1] text-darkText">{title}</h1>
              <p className="text-xl text-darkText/60 font-medium italic border-l-4 border-burntOrange pl-8">{description}</p>
              <button onClick={() => onNavigate('involved')} className="bg-burntOrange text-cream px-10 py-5 rounded-[2rem] font-black uppercase shadow-xl">Support Pillar</button>
            </div>
            <div className="relative rounded-[5rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/5]"><img src={image} className="w-full h-full object-cover" /></div>
          </div>
        </div>
      </div>
    );
  }

  function ProgramsView({ onNavigate }: { onNavigate: (page: Page) => void }) {
    const progs = [
      { id: 'awareness', title: 'Awareness', icon: Megaphone, desc: 'Sensitization and public outreach to reduce SCD stigma.' },
      { id: 'prevention', title: 'Prevention', icon: GraduationCap, desc: 'Education on genotype and preventive measures.' },
      { id: 'caregroup', title: 'Support', icon: Users, desc: 'Holistic safe spaces for peer and community support.' },
      { id: 'capacity', title: 'Capacity', icon: HeartPulse, desc: 'Training for healthcare providers and advocates.' },
      { id: 'research', title: 'Research', icon: BarChart3, desc: 'Data-driven insights to improve clinical outcomes.' },
    ];
    return (
      <div className="pt-32 pb-24 bg-cream min-h-screen text-darkText">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-24 space-y-8">
            <div className="inline-flex items-center space-x-3 bg-burntOrange/10 px-6 py-3 rounded-full text-burntOrange font-black uppercase tracking-widest text-[10px]"><Compass size={16} /><span>Strategic Pillars</span></div>
            <h1 className="text-7xl font-serif font-bold tracking-tighter text-darkText">Our Programs.</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {progs.map(p => (
              <div key={p.id} className="bg-white p-12 rounded-[4rem] shadow-sm border border-burntOrange/5 hover:border-burntOrange transition-all cursor-pointer group" onClick={() => onNavigate(p.id as Page)}>
                <div className="bg-burntOrange/5 w-20 h-20 rounded-3xl flex items-center justify-center text-burntOrange mb-8 group-hover:bg-burntOrange group-hover:text-cream"><p.icon size={40} /></div>
                <h3 className="text-3xl font-serif font-bold mb-4">{p.title}</h3>
                <p className="text-darkText/60 mb-6 font-medium">{p.desc}</p>
                <div className="flex items-center space-x-2 text-burntOrange font-black uppercase text-[10px]"><span>Explore Pillar</span><ArrowRight size={14} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function PublicActivities({ activities, onOpenActivity }: { activities: Activity[], onOpenActivity: (a: Activity) => void }) {
    return (
      <div className="pt-32 pb-24 bg-cream min-h-screen text-darkText">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-20 space-y-6"><h1 className="text-5xl lg:text-7xl font-serif font-bold text-darkText">Our Impact</h1></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {activities.length === 0 ? <p className="col-span-full text-center py-20 text-darkText/40 font-bold">Activity history is being updated.</p> : activities.map(a => (
              <div key={a.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-burntOrange/5 hover:border-burntOrange transition-all cursor-pointer group flex flex-col h-full" onClick={() => onOpenActivity(a)}>
                <div className="relative overflow-hidden rounded-[2.5rem] mb-8 shadow-xl"><img src={a.images[0] || ''} className="w-full aspect-square object-cover" /></div>
                <h4 className="text-3xl font-serif font-bold mb-4">{a.title}</h4>
                <p className="text-darkText/50 font-medium text-sm line-clamp-3 mb-6 flex-grow">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function FormModal({ type, onClose, onAddSubmission }: any) {
    const [fd, setFd] = useState({ fullName: '', email: '', message: '' });
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-darkText/80 backdrop-blur-md">
        <div className="bg-cream w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden text-darkText">
          <div className="bg-burntOrange p-10 text-cream flex justify-between items-center"><h3 className="text-3xl font-serif font-bold">Register: {type}</h3><button onClick={onClose}><X size={32} /></button></div>
          <form className="p-10 space-y-6" onSubmit={e => { e.preventDefault(); onAddSubmission(type, fd); }}>
            <input required placeholder="Full Name" value={fd.fullName} onChange={e => setFd({ ...fd, fullName: e.target.value })} className="w-full bg-white rounded-xl p-4 font-bold" />
            <input required type="email" placeholder="Email" value={fd.email} onChange={e => setFd({ ...fd, email: e.target.value })} className="w-full bg-white rounded-xl p-4 font-bold" />
            <textarea required placeholder="Message" value={fd.message} onChange={e => setFd({ ...fd, message: e.target.value })} className="w-full bg-white rounded-xl p-4 font-bold" rows={4}></textarea>
            <button type="submit" className="w-full bg-burntOrange text-cream py-5 rounded-2xl font-black uppercase">Submit</button>
          </form>
        </div>
      </div>
    );
  }

  function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) addNotification(error.message, 'error');
      setIsLoggingIn(false);
    };
    return (
      <div className="pt-32 bg-cream min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full border border-burntOrange/5 text-darkText">
          <h2 className="text-3xl font-serif font-bold text-center mb-8">Staff Portal</h2>
          <form onSubmit={handleAuth} className="space-y-6">
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full bg-cream rounded-xl px-4 py-3 font-bold outline-none border border-transparent focus:border-burntOrange/30 transition-all" />
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full bg-cream rounded-xl px-4 py-3 font-bold outline-none border border-transparent focus:border-burntOrange/30 transition-all" />
            <button type="submit" disabled={isLoggingIn} className="w-full bg-burntOrange text-cream py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center space-x-2">
              {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : <span>Login</span>}
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default App;

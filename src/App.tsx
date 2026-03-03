import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Activity, 
  Users, 
  ClipboardCheck, 
  ArrowRight, 
  LayoutDashboard, 
  Map as MapIcon, 
  Bell, 
  HardHat, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Database,
  Eye,
  Settings,
  LogOut,
  Building2,
  Globe,
  Radio,
  Wifi,
  Thermometer,
  Zap,
  Info,
  Search,
  Filter,
  FileText,
  Download,
  Maximize2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import logoImage from '/logo.png';

// --- Theme Constants ---
const COLORS = {
  bg: '#0B0E14',
  card: '#0E1117',
  gold: 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 100%)',
  goldText: '#D4AF37',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  border: 'rgba(212, 175, 55, 0.15)',
};

// --- Mock Data ---
const MOCK_SENSORS = [
  { id: 'SN-001', type: 'Gas', location: 'Mine A - Zone 1', status: 'Active', reading: '0.02%', health: 98, lastUpdate: '2 mins ago' },
  { id: 'SN-002', type: 'Vibration', location: 'Mine A - Zone 3', status: 'Warning', reading: '4.2mm/s', health: 85, lastUpdate: '5 mins ago' },
  { id: 'SN-003', type: 'Temp', location: 'Mine B - Zone 2', status: 'Offline', reading: '--', health: 0, lastUpdate: '1 hour ago' },
  { id: 'SN-004', type: 'Gas', location: 'Mine C - Zone 4', status: 'Active', reading: '0.01%', health: 99, lastUpdate: '10 mins ago' },
  { id: 'SN-005', type: 'Humidity', location: 'Mine A - Zone 1', status: 'Active', reading: '45%', health: 95, lastUpdate: '8 mins ago' },
];

const MOCK_WORKERS = [
  { id: 'W-01', name: 'John Doe', role: 'Driller', status: 'Onsite', zone: 'Zone 1', lastActivity: 'Active now', shift: 'Morning' },
  { id: 'W-02', name: 'Alice Smith', role: 'Engineer', status: 'Onsite', zone: 'Zone 3', lastActivity: 'Moving', shift: 'Morning' },
  { id: 'W-03', name: 'Eric Kagabo', role: 'Safety Officer', status: 'Offsite', zone: 'N/A', lastActivity: 'Shift Ended', shift: 'Night' },
  { id: 'W-04', name: 'Sarah Lee', role: 'Technician', status: 'Onsite', zone: 'Zone 2', lastActivity: 'Active', shift: 'Morning' },
];

const MOCK_REPORTS = [
  { id: 'REP-101', title: 'Daily Safety Audit', type: 'Safety', author: 'John Doe', date: 'Feb 10, 2026', status: 'Approved' },
  { id: 'REP-102', title: 'Gas Leak Incident', type: 'Critical', author: 'Alice Smith', date: 'Feb 09, 2026', status: 'Reviewed' },
  { id: 'REP-103', title: 'Weekly Maintenance', type: 'Maintenance', author: 'Eric Kagabo', date: 'Feb 08, 2026', status: 'Pending' },
];

const RISK_DATA = [
  { time: '00:00', value: 12 }, { time: '04:00', value: 18 }, { time: '08:00', value: 45 },
  { time: '12:00', value: 30 }, { time: '16:00', value: 55 }, { time: '20:00', value: 20 },
  { time: '23:59', value: 15 },
];

// --- Common UI Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer";
  const variants = {
    primary: "bg-[linear-gradient(135deg,#D4AF37_0%,#F5D76E_100%)] text-black hover:opacity-90 shadow-lg shadow-gold-500/20",
    outline: "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10",
    ghost: "text-[#D4AF37] hover:bg-[#D4AF37]/5",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', glow = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#0E1117] border border-[rgba(212,175,55,0.15)] rounded-2xl p-6 relative overflow-hidden ${glow ? 'shadow-[0_0_20px_rgba(212,175,55,0.05)]' : ''} ${onClick ? 'cursor-pointer hover:border-[#D4AF37]/40 transition-colors' : ''} ${className}`}
  >
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0E1117] border border-[#D4AF37]/30 rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden"
        >
          <div className="p-6 border-b border-[#D4AF37]/10 flex justify-between items-center">
            <h3 className="text-2xl font-serif text-[#D4AF37]">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Badge = ({ type, children }) => {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    gold: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20"
  };
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${styles[type] || styles.info}`}>
      {children}
    </span>
  );
};

// --- Landing Page Specific Components ---

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#D4AF37]/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group"
      >
        <span className={`text-lg transition-colors ${isOpen ? 'text-[#D4AF37]' : 'text-white group-hover:text-[#D4AF37]'}`}>{question}</span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="text-[#D4AF37]" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-gray-400 leading-relaxed font-light">
              <div className="h-[1px] w-12 bg-[#D4AF37] mb-4 opacity-30" />
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InnovationCard = ({ icon: Icon, title, desc, onMoreInfo }) => {
  return (
    <Card 
      onClick={onMoreInfo}
      className="group relative h-full flex flex-col items-start"
    >
      <div className="w-14 h-14 rounded-xl bg-[linear-gradient(135deg,#D4AF37,transparent)] p-[1px] mb-6">
        <div className="w-full h-full bg-[#0B0E14] rounded-xl flex items-center justify-center text-[#D4AF37]">
          <Icon size={24} />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-[#D4AF37] transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm mb-6 flex-1">{desc}</p>
      <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
        Learn More <ArrowRight size={14} />
      </div>
      {/* Tooltip on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-[#D4AF37] text-black text-[10px] px-2 py-1 rounded font-bold shadow-lg">
          REAL-TIME DATA ENABLED
        </div>
      </div>
    </Card>
  );
};

// --- Landing Page ---

const LandingPage = ({ onGetStarted }) => {
  const previewRef = useRef(null);
  const [activePreviewTab, setActivePreviewTab] = useState('Dashboard');
  const [activeModal, setActiveModal] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({ name: '', email: '', message: '' });

  const scrollToPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send to API)
    console.log('Contact form submitted:', contactFormData);
    alert('Thank you for reaching out! We will get back to you soon.');
    setShowContactForm(false);
    setContactFormData({ name: '', email: '', message: '' });
  };

  const previewTabs = [
    { name: 'Dashboard', desc: 'Holistic oversight of all safety metrics and alerts.', icon: LayoutDashboard },
    { name: 'Workers', desc: 'Real-time positioning and shift management for underground personnel.', icon: HardHat },
    { name: 'Sensors', desc: 'Granular status of IoT devices across every zone.', icon: Database },
    { name: 'Reports', desc: 'Immutable daily and incident reporting logs.', icon: ClipboardCheck },
    { name: 'Map', desc: 'Precision satellite and architectural overlays of mine sites.', icon: MapIcon },
  ];

  return (
    <div className="bg-[#0B0E14] text-white selection:bg-[#D4AF37]/30">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/80 backdrop-blur-md border-b border-[#D4AF37]/10 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="SmartMine Logo" className="h-8 w-8 object-contain" />
            <div className="text-2xl font-serif">SMART<span className="text-[#D4AF37]">MINE</span></div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">About</a>
            <a href="#innovations" className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">Innovations</a>
            <a href="#preview" className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">Platform</a>
            <a href="#faq" className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">FAQ</a>
            <Button onClick={() => onGetStarted('register')} className="py-2 px-4">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1641926489586-dd5dae881415?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-20"
            alt="Futuristic Circuitry"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14]/50 via-[#0B0E14] to-[#0B0E14]" />
        </div>
        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2 mb-6"><div className="h-[1px] w-12 bg-[#D4AF37]" /><span className="text-[#D4AF37] tracking-[0.3em] uppercase text-sm font-bold">The Future of Mining</span></div>
            <h1 className="text-6xl md:text-8xl font-serif text-white leading-tight mb-8">SMART<span className="text-[#D4AF37]">MINE</span></h1>
            <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">Real-time safety monitoring, AI-powered risk prediction, and national-level mining oversight. Building a safer future for every worker underground.</p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => onGetStarted('register')}>Get Started</Button>
              <Button variant="outline" onClick={scrollToPreview}>View Platform Demo</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-[#0E1117] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-[1px] w-12 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] tracking-[0.3em] uppercase text-sm font-bold">About SmartMine</span>
                <div className="h-[1px] w-12 bg-[#D4AF37]" />
              </div>
              <h2 className="text-5xl font-serif text-white mb-6">Transforming Mining Safety in Rwanda</h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
                Rwanda's pioneering intelligent mining safety platform. Combining IoT sensors, AI, and real-time monitoring to protect lives underground.
              </p>
            </div>

            {/* Challenge & Solution Flow */}
            <div className="relative mb-20">
              <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto">
                <Card className="p-8 group hover:border-[#D4AF37]/40 transition-all w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-xl bg-[linear-gradient(135deg,#D4AF37,transparent)] p-[1px] mb-6">
                      <div className="w-full h-full bg-[#0B0E14] rounded-xl flex items-center justify-center text-[#D4AF37]">
                        <AlertTriangle size={24} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#D4AF37] transition-colors">The Challenge</h3>
                    <p className="text-gray-400 leading-relaxed max-w-lg mx-auto">
                      Traditional mining safety methods are reactive. Gas leaks and structural failures often go undetected until it's too late.
                    </p>
                  </div>
                </Card>

                <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-[#D4AF37] rotate-90"
                >
                  <ArrowRight size={48} />
                </motion.div>

                <Card className="p-8 group hover:border-[#D4AF37]/40 transition-all w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-xl bg-[linear-gradient(135deg,#D4AF37,transparent)] p-[1px] mb-6">
                      <div className="w-full h-full bg-[#0B0E14] rounded-xl flex items-center justify-center text-[#D4AF37]">
                        <Shield size={24} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#D4AF37] transition-colors">Our Solution</h3>
                    <p className="text-gray-400 leading-relaxed max-w-lg mx-auto">
                      AI-powered IoT sensors monitor conditions 24/7. We predict hazards hours before they become critical, saving lives proactively.
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* What SmartMine Offers */}
            <div className="text-center mb-12 mt-32">
              <h3 className="text-3xl font-serif text-[#D4AF37] mb-4">What SmartMine Offers</h3>
              <p className="text-gray-500 max-w-2xl mx-auto">Comprehensive safety solutions designed for the modern mining industry</p>
            </div>

            <div className="space-y-12 max-w-4xl mx-auto">
              {/* First Item - Left Aligned */}
              <div className="flex items-center gap-8">
                <Card className="p-8 group hover:border-[#D4AF37]/40 transition-all flex-1">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl bg-[linear-gradient(135deg,#D4AF37,transparent)] p-[1px] flex-shrink-0">
                      <div className="w-full h-full bg-[#0B0E14] rounded-xl flex items-center justify-center text-[#D4AF37]">
                        <Activity size={28} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-white mb-3 group-hover:text-[#D4AF37] transition-colors">Real-Time Monitoring</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">24/7 surveillance of all critical safety parameters across every mine zone with instant alerts</p>
                    </div>
                  </div>
                </Card>
                <div className="hidden md:block w-px h-24 bg-[#D4AF37]/20"></div>
                <div className="hidden md:block flex-1"></div>
              </div>

              {/* Second Item - Right Aligned */}
              <div className="flex items-center gap-8">
                <div className="hidden md:block flex-1"></div>
                <div className="hidden md:block w-px h-24 bg-[#D4AF37]/20"></div>
                <Card className="p-8 group hover:border-[#D4AF37]/40 transition-all flex-1">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl bg-[linear-gradient(135deg,#D4AF37,transparent)] p-[1px] flex-shrink-0">
                      <div className="w-full h-full bg-[#0B0E14] rounded-xl flex items-center justify-center text-[#D4AF37]">
                        <TrendingUp size={28} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-white mb-3 group-hover:text-[#D4AF37] transition-colors">AI Risk Prediction</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Machine learning models that forecast incidents before they happen, saving lives proactively</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Third Item - Left Aligned */}
              <div className="flex items-center gap-8">
                <Card className="p-8 group hover:border-[#D4AF37]/40 transition-all flex-1">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl bg-[linear-gradient(135deg,#D4AF37,transparent)] p-[1px] flex-shrink-0">
                      <div className="w-full h-full bg-[#0B0E14] rounded-xl flex items-center justify-center text-[#D4AF37]">
                        <Users size={28} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-white mb-3 group-hover:text-[#D4AF37] transition-colors">Worker Safety</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Live tracking and instant emergency alerts for all underground personnel with precision location</p>
                    </div>
                  </div>
                </Card>
                <div className="hidden md:block w-px h-24 bg-[#D4AF37]/20"></div>
                <div className="hidden md:block flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovations Section */}
      <section id="innovations" className="py-24 bg-[#0B0E14]">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-serif text-[#D4AF37] mb-4">Revolutionizing Mining with Embedded Intelligence</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Our ecosystem integrates hardware and software to create an unbreakable safety web.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <InnovationCard 
              icon={Wifi} title="Embedded IoT Sensors" 
              desc="Gas, vibration, and temperature sensors that report real-time data every few seconds."
              onMoreInfo={() => setActiveModal('sensors')}
            />
            <InnovationCard 
              icon={Zap} title="AI-Powered Risk Prediction" 
              desc="Advanced neural networks detect danger patterns before accidents occur using historical data."
              onMoreInfo={() => setActiveModal('ai')}
            />
            <InnovationCard 
              icon={Building2} title="Remote Mine Management" 
              desc="Control and monitor your mine without being physically present. Reducing on-site risks."
              onMoreInfo={() => setActiveModal('remote')}
            />
            <InnovationCard 
              icon={Globe} title="National Oversight" 
              desc="Centralized monitoring for regulatory bodies to ensure national compliance and safety."
              onMoreInfo={() => setActiveModal('national')}
            />
          </div>
        </div>
      </section>

      {/* Platform Preview Section */}
      <section id="preview" ref={previewRef} className="py-24 bg-[#0E1117]">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-serif text-[#D4AF37] mb-4">Platform Intelligence</h2>
            <p className="text-gray-500">Explore the interface that powers national safety oversight.</p>
          </div>
          
          <Card className="p-0 border-[#D4AF37]/30 shadow-2xl shadow-black">
            <div className="flex flex-col lg:flex-row min-h-[500px]">
              <div className="lg:w-64 bg-[#0B0E14] border-r border-[#D4AF37]/10 p-6 flex flex-col gap-2">
                {previewTabs.map(tab => (
                  <button 
                    key={tab.name}
                    onClick={() => setActivePreviewTab(tab.name)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activePreviewTab === tab.name ? 'bg-[#D4AF37] text-black' : 'text-gray-500 hover:text-[#D4AF37]'}`}
                  >
                    <tab.icon size={18} />
                    <span className="font-bold text-sm">{tab.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex-1 p-8 bg-gradient-to-br from-[#0E1117] to-[#0B0E14] flex flex-col items-center justify-center text-center overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activePreviewTab}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg"
                  >
                    <div className="mb-8">
                      <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mx-auto mb-4 border border-[#D4AF37]/20">
                        {React.createElement(previewTabs.find(t => t.name === activePreviewTab).icon, { size: 28 })}
                      </div>
                      <h3 className="text-2xl font-serif text-white mb-2">{activePreviewTab} Interface</h3>
                      <p className="text-gray-400 text-sm max-w-sm mx-auto">{previewTabs.find(t => t.name === activePreviewTab).desc}</p>
                    </div>

                    {/* Mock Content UI */}
                    <div className="bg-black/40 border border-white/5 rounded-3xl p-6 text-left shadow-2xl relative">
                       <div className="flex justify-between items-center mb-6">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                          </div>
                          <div className="text-[8px] text-gray-600 uppercase tracking-widest">Live Feed Access</div>
                       </div>
                       
                       {activePreviewTab === 'Dashboard' && (
                         <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="h-20 bg-white/5 rounded-xl animate-pulse p-3"><div className="w-1/2 h-2 bg-[#D4AF37]/30 rounded mb-2" /><div className="w-3/4 h-4 bg-white/10 rounded" /></div>
                               <div className="h-20 bg-white/5 rounded-xl animate-pulse p-3"><div className="w-1/2 h-2 bg-[#D4AF37]/30 rounded mb-2" /><div className="w-3/4 h-4 bg-white/10 rounded" /></div>
                            </div>
                            <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                         </div>
                       )}
                       {activePreviewTab === 'Workers' && (
                         <div className="space-y-3">
                            {[1,2,3].map(i => (
                              <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                                 <div className="w-8 h-8 rounded bg-[#D4AF37]/10" />
                                 <div className="flex-1 h-2 bg-white/10 rounded" />
                                 <div className="w-12 h-4 bg-emerald-500/20 rounded" />
                              </div>
                            ))}
                         </div>
                       )}
                       {activePreviewTab === 'Sensors' && (
                         <div className="grid grid-cols-2 gap-3">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5">
                                 <div className="w-full h-1 bg-[#D4AF37]/20 rounded mb-3" />
                                 <div className="flex justify-between"><div className="w-8 h-2 bg-white/10 rounded" /><div className="w-4 h-2 bg-emerald-500/20 rounded" /></div>
                              </div>
                            ))}
                         </div>
                       )}
                       {activePreviewTab === 'Reports' && (
                         <div className="space-y-4">
                            <div className="h-4 w-1/3 bg-[#D4AF37]/20 rounded" />
                            <div className="space-y-2">
                               <div className="h-2 w-full bg-white/5 rounded" />
                               <div className="h-2 w-full bg-white/5 rounded" />
                               <div className="h-2 w-3/4 bg-white/5 rounded" />
                            </div>
                            <div className="h-8 w-full bg-[#D4AF37]/10 rounded-xl" />
                         </div>
                       )}
                       {activePreviewTab === 'Map' && (
                         <div className="h-40 bg-[#0B0E14] rounded-2xl relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 opacity-20"><MapIcon size={120} /></div>
                            <motion.div animate={{scale: [1, 1.2, 1]}} transition={{repeat: Infinity, duration: 2}} className="w-4 h-4 bg-red-500 rounded-full border-2 border-white relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                         </div>
                       )}

                       {/* Tooltip Overlay */}
                       <div className="absolute -top-4 -right-4 bg-[#D4AF37] text-black text-[10px] px-3 py-1.5 rounded-lg font-bold shadow-2xl animate-bounce">
                          {activePreviewTab} Active View
                       </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#0B0E14]">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-serif text-[#D4AF37] text-center mb-16">Frequently Asked Questions</h2>
          <div className="bg-[#0E1117] border border-[#D4AF37]/10 rounded-3xl p-8">
            <FAQItem question="How does SmartMine improve safety?" answer="SmartMine uses a combination of real-time sensor data and AI risk models to detect seismic anomalies, gas leaks, and worker fatigue before they lead to accidents." />
            <FAQItem question="Do miners need smartphones?" answer="No. Miners are equipped with ruggedized wearable trackers that communicate directly with site gateways, providing hands-free alerts and location tracking." />
            <FAQItem question="Can inspectors monitor mines remotely?" answer="Yes. The RMB Inspector dashboard allows for 24/7 remote monitoring of every licensed mine in the country with live data feeds." />
            <FAQItem question="What happens if a sensor fails?" answer="The system features a fail-safe diagnostic mode. If a sensor goes offline, an immediate maintenance alert is triggered, and nearby sensors recalibrate to cover the gap." />
            <FAQItem question="Is the system real-time?" answer="Yes. Data latency is sub-second across national fiber and cellular networks, ensuring alerts reach workers instantly." />
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 border-t border-[#D4AF37]/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-serif mb-8">Ready to make mining safer and smarter?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => onGetStarted('register')} className="px-12 py-4 text-lg">Get Started Now</Button>
            <Button variant="outline" className="px-12 py-4 text-lg" onClick={() => setShowContactForm(true)}>Contact SmartMine Team</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#080A0E] border-t border-[#D4AF37]/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImage} alt="SmartMine Logo" className="h-10 w-10 object-contain" />
                <div className="text-2xl font-serif">SMART<span className="text-[#D4AF37]">MINE</span></div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Revolutionizing mining safety through AI-powered monitoring and real-time intelligence.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
                  <Globe size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
                  <Radio size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
                  <Shield size={14} />
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#innovations" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Innovations</a></li>
                <li><a href="#preview" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Partners</a></li>
                <li><a href="#faq" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest mb-4">Get In Touch</h4>
              <ul className="space-y-3 text-sm text-gray-500 mb-8">
                <li className="flex items-start gap-2">
                  <Building2 size={16} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <span>Kigali Innovation City, Rwanda</span>
                </li>
                <li className="flex items-start gap-2">
                  <Globe size={16} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <span>info@smartmine.rw</span>
                </li>
                <li className="flex items-start gap-2">
                  <Radio size={16} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <span>+250 788 000 000</span>
                </li>
              </ul>
              <div>
                <Button variant="outline" className="w-full py-2 text-xs" onClick={() => setShowContactForm(true)}>Request Demo</Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 pb-6 border-t border-[#D4AF37]/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-600">
              © 2026 SmartMine Rwanda. National Mining Intelligence. All rights reserved.
            </div>
            <div className="flex gap-6 text-xs text-gray-600">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals for Innovation Cards */}
      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal?.toUpperCase().replace('_', ' ')}>
        <div className="space-y-8">
          {activeModal === 'sensors' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-8 bg-black/40 rounded-3xl border border-[#D4AF37]/20">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#D4AF37]/20 rounded-full text-[#D4AF37]"><Database size={32} /></div>
                  <ArrowRight className="text-gray-600" />
                  <div className="p-4 bg-[#D4AF37]/20 rounded-full text-[#D4AF37]"><Wifi size={32} /></div>
                  <ArrowRight className="text-gray-600" />
                  <div className="p-4 bg-[#D4AF37]/20 rounded-full text-[#D4AF37]"><LayoutDashboard size={32} /></div>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Data Pipeline: Sensor → Gateway → Dashboard</div>
              </div>
              <p className="text-gray-400 leading-relaxed italic text-center">"Every 5 seconds, our mesh network validates gas levels, seismic waves, and humidity, ensuring no hazard goes undetected."</p>
            </div>
          )}

          {activeModal === 'ai' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-2 py-8 px-4 bg-black/40 rounded-3xl border border-[#D4AF37]/20 relative">
                <div className="text-center p-3">
                  <div className="text-[#D4AF37] mb-2 font-bold text-xs uppercase">1. Ingest</div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden"><motion.div animate={{x: [-100, 100]}} transition={{repeat: Infinity, duration: 2}} className="w-full h-full bg-[#D4AF37]/50" /></div>
                </div>
                <div className="text-center p-3 border-x border-white/10">
                  <div className="text-[#D4AF37] mb-2 font-bold text-xs uppercase">2. Analyze</div>
                  <div className="flex justify-center gap-1">
                    {[1,2,3].map(i => <motion.div key={i} animate={{opacity: [0.2, 1, 0.2]}} transition={{delay: i*0.2, repeat: Infinity}} className="w-2 h-2 rounded-full bg-[#D4AF37]" />)}
                  </div>
                </div>
                <div className="text-center p-3">
                  <div className="text-[#D4AF37] mb-2 font-bold text-xs uppercase">3. Predict</div>
                  <div className="text-emerald-400 font-mono text-[10px]">SAFE (98%)</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Our AI models are trained on over 20 years of mining safety data, allowing us to identify precursors to structural failures up to 6 hours before they occur.</p>
            </div>
          )}

          {activeModal === 'remote' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="font-bold text-[#D4AF37] text-sm mb-1">🏗️ Site Managers</div>
                  <p className="text-xs text-gray-500">Monitor live gas feeds and deploy emergency ventilation remotely via IoT actuators.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="font-bold text-[#D4AF37] text-sm mb-1">🏢 Managing Directors</div>
                  <p className="text-xs text-gray-500">Approve multi-site safety clearances and review incident escalations from a central office.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="font-bold text-[#D4AF37] text-sm mb-1">🏛️ RMB Inspectors</div>
                  <p className="text-xs text-gray-400">Perform digital audits and compliance checks without interrupting site operations.</p>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'national' && (
            <div className="space-y-6">
               <div className="h-48 bg-black/40 rounded-3xl border border-[#D4AF37]/20 flex items-center justify-center p-8 overflow-hidden">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="relative">
                    <Globe size={80} className="text-[#D4AF37]/20" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 flex items-center justify-center">
                      <Shield size={40} className="text-[#D4AF37]" />
                    </motion.div>
                  </motion.div>
               </div>
               <p className="text-gray-400 text-sm text-center">SmartMine creates a 'Sovereign Safety Layer' over the national mining sector, providing unprecedented transparency and accountability.</p>
            </div>
          )}

          <Button className="w-full" onClick={() => setActiveModal(null)}>Dismiss Technical Detail</Button>
        </div>
      </Modal>

      {/* Contact Form Modal */}
      <Modal isOpen={showContactForm} onClose={() => setShowContactForm(false)} title="Get In Touch">
        <form onSubmit={handleContactSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#D4AF37] mb-2 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              required
              value={contactFormData.name}
              onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#0B0E14] border border-[#D4AF37]/20 rounded-xl text-white placeholder-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#D4AF37] mb-2 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              required
              value={contactFormData.email}
              onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
              className="w-full px-4 py-3 bg-[#0B0E14] border border-[#D4AF37]/20 rounded-xl text-white placeholder-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#D4AF37] mb-2 uppercase tracking-widest">Message</label>
            <textarea
              required
              value={contactFormData.message}
              onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-[#0B0E14] border border-[#D4AF37]/20 rounded-xl text-white placeholder-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              placeholder="Tell us about your mining operation or request a demo..."
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">Send Message</Button>
            <Button type="button" variant="outline" onClick={() => setShowContactForm(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// --- Dashboard Tabs ---

const OverviewTab = ({ user }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-bold">AI Risk Score</div>
        <div className="text-4xl font-bold mb-1">12%</div>
        <Badge type="success">Low Risk Environment</Badge>
      </Card>
      <Card>
        <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-bold">Active Alerts</div>
        <div className="text-4xl font-bold mb-1">02</div>
        <Badge type="warning">Requires Attention</Badge>
      </Card>
      <Card>
        <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-bold">Workers Onsite</div>
        <div className="text-4xl font-bold mb-1">142</div>
        <Badge type="info">Shift A active</Badge>
      </Card>
      <Card>
        <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-bold">Sensors Online</div>
        <div className="text-4xl font-bold mb-1">98%</div>
        <Badge type="success">System Healthy</Badge>
      </Card>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-serif text-xl">Historical Risk Trends</h3>
          <div className="flex gap-2">
             <button className="px-3 py-1 bg-[#D4AF37] text-black text-[10px] rounded font-bold">24H</button>
             <button className="px-3 py-1 bg-white/5 text-gray-500 text-[10px] rounded font-bold">7D</button>
          </div>
        </div>
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={RISK_DATA}>
               <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs>
               <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
               <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} />
               <Tooltip contentStyle={{ backgroundColor: '#0E1117', border: '1px solid #D4AF3730' }} />
               <Area type="monotone" dataKey="value" stroke="#D4AF37" fill="url(#g)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="font-serif text-xl mb-6">Recent Alerts</h3>
        <div className="space-y-4">
          {[
            { msg: 'Seismic Spike detected Zone 3', level: 'warning', time: '12:05' },
            { msg: 'CO2 levels rising slightly Sector B', level: 'info', time: '11:45' },
            { msg: 'Sensor Offline: SN-003', level: 'danger', time: '10:30' }
          ].map((a, i) => (
            <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#D4AF37]/20 transition-colors">
              <div className={`w-1 h-full rounded-full ${a.level === 'danger' ? 'bg-red-500' : 'bg-[#D4AF37]'}`} />
              <div>
                <div className="text-sm font-bold">{a.msg}</div>
                <div className="text-[10px] text-gray-500 mt-1">{a.time} • Local Alert</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const WorkersTab = ({ user }) => {
  const [selectedWorker, setSelectedWorker] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-white">Personnel Tracking</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs flex items-center gap-2"><Filter size={14} /> Filter Zones</button>
          <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg text-xs font-bold">Export Logs</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="p-0">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#D4AF37]/10 text-gray-500 text-[10px] uppercase tracking-widest">
                  <th className="px-6 py-4">Worker Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Zone</th>
                  <th className="px-6 py-4">Last Activity</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_WORKERS.map(worker => (
                  <tr 
                    key={worker.id} 
                    onClick={() => setSelectedWorker(worker)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-bold">{worker.name}</td>
                    <td className="px-6 py-4 text-gray-400">{worker.role}</td>
                    <td className="px-6 py-4">
                       <Badge type={worker.status === 'Onsite' ? 'success' : 'info'}>{worker.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{worker.zone}</td>
                    <td className="px-6 py-4 text-[10px]">{worker.lastActivity}</td>
                    <td className="px-6 py-4 text-right">
                       <ChevronRight className="text-gray-600 group-hover:text-[#D4AF37] transition-colors" size={16} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedWorker ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Card className="border-[#D4AF37]/40 bg-gradient-to-br from-[#0E1117] to-[#1a1f29]">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-3xl">👤</div>
                    <button onClick={() => setSelectedWorker(null)}><X size={16} className="text-gray-500" /></button>
                  </div>
                  <h3 className="text-2xl font-serif mb-1">{selectedWorker.name}</h3>
                  <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-6">{selectedWorker.role}</p>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-black/30 rounded-xl">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Current Shift</div>
                      <div className="text-sm">{selectedWorker.shift} (06:00 - 14:00)</div>
                    </div>
                    <div className="p-3 bg-black/30 rounded-xl">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Safety Exposure</div>
                      <div className="text-sm">2.4mSv (Normal)</div>
                    </div>
                    <div className="p-3 bg-black/30 rounded-xl">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Last Report</div>
                      <div className="text-xs italic text-gray-400">"Zone 1 ventilation cleared for drilling."</div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-8" variant="outline">Send Alert Notification</Button>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-white/10 rounded-3xl text-gray-600">
                <Users size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Select a worker to view detailed intelligence profile.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SensorsTab = ({ user }) => {
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const runDiagnostic = () => {
    setIsDiagnosing(true);
    setTimeout(() => setIsDiagnosing(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#0E1117] to-black">
          <div className="text-xs text-gray-500 uppercase font-bold mb-2">Total Sensors</div>
          <div className="text-3xl font-bold">1,240</div>
        </Card>
        <Card>
          <div className="text-xs text-emerald-500 uppercase font-bold mb-2">Active</div>
          <div className="text-3xl font-bold">1,215</div>
        </Card>
        <Card>
          <div className="text-xs text-amber-500 uppercase font-bold mb-2">Warnings</div>
          <div className="text-3xl font-bold">22</div>
        </Card>
        <Card>
          <div className="text-xs text-red-500 uppercase font-bold mb-2">Offline</div>
          <div className="text-3xl font-bold">03</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-0">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
               <h3 className="font-serif text-xl">IoT Device Grid</h3>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                 <input type="text" placeholder="Search Device ID..." className="bg-black/40 border border-[#D4AF37]/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:border-[#D4AF37] outline-none" />
               </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-[10px] uppercase text-gray-600">
                <tr>
                  <th className="px-6 py-4">Sensor ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Reading</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_SENSORS.map(s => (
                  <tr 
                    key={s.id} 
                    onClick={() => setSelectedSensor(s)}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono text-[#D4AF37]">{s.id}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                       {s.type === 'Gas' && <Zap size={14} />}
                       {s.type === 'Vibration' && <Activity size={14} />}
                       {s.type === 'Temp' && <Thermometer size={14} />}
                       {s.type}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{s.location}</td>
                    <td className="px-6 py-4">
                       <Badge type={s.status === 'Active' ? 'success' : s.status === 'Warning' ? 'warning' : 'danger'}>{s.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{s.reading}</td>
                    <td className="px-6 py-4"><ChevronRight size={14} className="text-gray-600" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {selectedSensor ? (
              <motion.div key={selectedSensor.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                <Card className="border-[#D4AF37]/30">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-2xl">Device Intel</h3>
                    <Badge type={selectedSensor.status === 'Active' ? 'success' : 'danger'}>{selectedSensor.id}</Badge>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-black/40 rounded-xl">
                        <div className="text-[10px] text-gray-500 mb-1">Health</div>
                        <div className="text-xl font-bold text-[#D4AF37]">{selectedSensor.health}%</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl">
                        <div className="text-[10px] text-gray-500 mb-1">Latency</div>
                        <div className="text-xl font-bold">14ms</div>
                      </div>
                    </div>

                    <div className="h-32 bg-black/40 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                       <div className="text-[10px] text-gray-500 uppercase mb-2">Live Reading Stream</div>
                       <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={RISK_DATA}>
                           <Line type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} dot={false} />
                         </LineChart>
                       </ResponsiveContainer>
                    </div>

                    <div className="space-y-2">
                       <div className="text-[10px] text-gray-500 uppercase tracking-widest">Recent Activity</div>
                       <div className="text-xs text-gray-400 pb-2 border-b border-white/5 flex justify-between">
                         <span>Status check confirmed</span>
                         <span className="text-[10px]">10:02</span>
                       </div>
                       <div className="text-xs text-gray-400 pb-2 border-b border-white/5 flex justify-between">
                         <span>Internal calibration complete</span>
                         <span className="text-[10px]">09:15</span>
                       </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                      <Button onClick={runDiagnostic} disabled={isDiagnosing} variant="primary" className="w-full">
                        {isDiagnosing ? 'Running Diagnostic...' : 'Run Full Diagnostic'}
                      </Button>
                      <Button variant="danger" className="w-full">Flag for Technical Repair</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-white/10 rounded-3xl text-gray-600">
                <Database size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Select a sensor from the grid to view live data streams and diagnostic tools.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ReportsTab = ({ user }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif">Compliance Reports</h2>
        <Button className="text-sm"><ClipboardCheck size={16} /> Generate New Report</Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-[10px] uppercase text-gray-600">
                <tr>
                  <th className="px-6 py-4">Report Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_REPORTS.map(rep => (
                  <tr 
                    key={rep.id} 
                    onClick={() => setSelectedReport(rep)}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold">{rep.title}</td>
                    <td className="px-6 py-4"><Badge type={rep.type === 'Critical' ? 'danger' : 'gold'}>{rep.type}</Badge></td>
                    <td className="px-6 py-4 text-gray-400">{rep.author}</td>
                    <td className="px-6 py-4 text-gray-400">{rep.date}</td>
                    <td className="px-6 py-4 text-[10px]">{rep.status}</td>
                    <td className="px-6 py-4"><FileText size={16} className="text-gray-600" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {MOCK_REPORTS.length === 0 && (
              <div className="p-20 text-center text-gray-600 italic">No reports submitted yet for this period.</div>
            )}
          </Card>
        </div>

        <div>
           {selectedReport ? (
             <Card className="sticky top-0">
               <div className="flex justify-between mb-6">
                 <h3 className="font-serif text-2xl">{selectedReport.id}</h3>
                 <button onClick={() => setSelectedReport(null)}><X size={16} className="text-gray-500" /></button>
               </div>
               <div className="space-y-6">
                 <div>
                   <label className="text-[10px] text-gray-500 uppercase block mb-2">Internal Note</label>
                   <p className="text-sm text-gray-300 bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed">
                     This report was generated automatically based on daily shift sensor snapshots. All readings within nominal limits.
                   </p>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                       <span className="text-gray-500">Attachment</span>
                       <span className="text-[#D4AF37] flex items-center gap-1 cursor-pointer"><Download size={14} /> Full_Log.pdf</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                       <span className="text-gray-500">Signature</span>
                       <span className="text-white">Encrypted / Digital</span>
                    </div>
                 </div>
                 <Button className="w-full">Sign & Approve</Button>
               </div>
             </Card>
           ) : (
             <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl text-gray-600 text-center p-6">
               <FileText size={32} className="mb-4 opacity-20" />
               <p className="text-sm italic">Click any report in the table to view its full content and approval history.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const MapTab = ({ user }) => {
  const [activePin, setActivePin] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif">Spatial Intelligence Overlay</h2>
        <div className="flex bg-[#0E1117] p-1 rounded-xl border border-white/10">
           <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg text-xs font-bold">Satellite</button>
           <button className="px-4 py-2 text-gray-500 text-xs font-bold">Architectural</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="p-0 h-[600px] relative overflow-hidden border-[#D4AF37]/20 group">
             <ImageWithFallback 
              src="https://images.unsplash.com/photo-1552532148-7d3eb03cc6a3?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-105 transition-transform duration-10000"
              alt="Mining Map"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent opacity-60" />
             
             {/* Map Pins */}
             <div 
               onClick={() => setActivePin({ name: 'Central Pit - Mine A', risk: 'Low', workers: 42 })}
               className="absolute top-[30%] left-[45%] cursor-pointer group/pin"
             >
               <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
               <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-2 py-1 rounded border border-white/10 text-[10px] whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">Mine A-1</div>
             </div>

             <div 
               onClick={() => setActivePin({ name: 'Deep Ridge - Sector 3', risk: 'High', workers: 12 })}
               className="absolute top-[50%] left-[20%] cursor-pointer group/pin"
             >
               <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg" />
               <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-2 py-1 rounded border border-white/10 text-[10px] whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">Sector 3 Alert</div>
             </div>

             {/* Legend */}
             <div className="absolute bottom-6 left-6 bg-[#0E1117]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                <div className="font-bold mb-2 uppercase tracking-tighter text-gray-500">Map Legend</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Safe Zone</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Caution Required</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Immediate Danger</div>
             </div>
          </Card>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {activePin ? (
              <motion.div key={activePin.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border-[#D4AF37]/40 h-full">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-serif text-2xl">{activePin.name}</h3>
                    <button onClick={() => setActivePin(null)}><X size={16} className="text-gray-500" /></button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                       <Badge type={activePin.risk === 'High' ? 'danger' : 'success'}>{activePin.risk} Risk Status</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                        <div className="text-[10px] text-gray-500 mb-1">Workers</div>
                        <div className="text-xl font-bold">{activePin.workers}</div>
                      </div>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                        <div className="text-[10px] text-gray-500 mb-1">Sensors</div>
                        <div className="text-xl font-bold">12</div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl space-y-2">
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Active Alerts</div>
                      <p className="text-xs text-gray-400 italic">No critical alerts for this coordinate.</p>
                    </div>

                    <Button className="w-full">View Site Dashboard</Button>
                    <Button variant="outline" className="w-full">Deploy UAV Inspection</Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-white/10 rounded-3xl text-gray-600">
                <MapIcon size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Click a map pin to access specific site intel and emergency controls.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- Auth Page ---

const AuthPage = ({ mode, onSwitch, onLogin }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'SITE_MANAGER', organization: '' });

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-white mb-2">SMART<span className="text-[#D4AF37]">MINE</span></h1>
          <p className="text-gray-500 text-sm">Secure Portal Access</p>
        </div>
        <Card className="backdrop-blur-xl bg-[#0E1117]/80">
          <div className="flex p-1 bg-[#0B0E14] rounded-full mb-8 border border-[#D4AF37]/10">
            <button onClick={() => onSwitch('login')} className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${mode === 'login' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'}`}>Login</button>
            <button onClick={() => onSwitch('register')} className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${mode === 'register' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'}`}>Register</button>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(formData); }}>
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div key="reg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                  <input type="text" className="w-full bg-black/40 border border-[#D4AF37]/20 text-white placeholder-white rounded-lg px-4 py-3 focus:border-[#D4AF37] outline-none" placeholder="Full Name" onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  <select className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg px-4 py-3 focus:border-[#D4AF37] text-white placeholder-white outline-none appearance-none" onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="SITE_MANAGER">Site Manager</option>
                    <option value="MANAGING_DIRECTOR">Managing Director</option>
                    <option value="RMB_INSPECTOR">RMB Inspector</option>
                  </select>
                  <input type="text" className="w-full bg-black/40 border border-[#D4AF37]/20 text-white placeholder-white rounded-lg px-4 py-3 focus:border-[#D4AF37] outline-none" placeholder="Organization" onChange={e => setFormData({...formData, organization: e.target.value})} />
                </motion.div>
              )}
            </AnimatePresence>
            <input type="email" className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-lg text-white placeholder-white px-4 py-3 focus:border-[#D4AF37] outline-none" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" className="w-full bg-black/40 border border-[#D4AF37]/20 text-white placeholder-white rounded-lg px-4 py-3 focus:border-[#D4AF37] outline-none" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
            <Button type="submit" className="w-full py-4 mt-4">{mode === 'login' ? 'Authorize Access' : 'Create Account'}</Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

// --- App Shell ---

export default function SmartMineApp() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleGetStarted = (mode) => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  const handleLogin = (formData) => {
    setUser({ ...formData, fullName: formData.fullName || 'Authorized User' });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <OverviewTab user={user} />;
      case 'Workers': return <WorkersTab user={user} />;
      case 'Sensors': return <SensorsTab user={user} />;
      case 'Reports': return <ReportsTab user={user} />;
      case 'Map': return <MapTab user={user} />;
      default: return <OverviewTab user={user} />;
    }
  };

  if (currentPage === 'landing') return <LandingPage onGetStarted={handleGetStarted} />;
  if (currentPage === 'auth') return <AuthPage mode={authMode} onSwitch={setAuthMode} onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-[#0E1117] border-r border-[#D4AF37]/10 flex flex-col h-screen fixed left-0 top-0">
        <div className="p-8 border-b border-[#D4AF37]/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#D4AF37] flex items-center justify-center text-black font-serif font-bold">S</div>
          <h1 className="text-xl font-serif">SMART<span className="text-[#D4AF37]">MINE</span></h1>
        </div>
        <div className="p-6 flex-1 space-y-2">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Workers', icon: HardHat },
            { id: 'Sensors', icon: Database },
            { id: 'Reports', icon: ClipboardCheck },
            { id: 'Map', icon: MapIcon },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-[#D4AF37] text-black shadow-lg shadow-gold-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon size={20} />
              <span className="font-bold text-sm">{tab.id}</span>
            </button>
          ))}
        </div>
        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">👤</div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold truncate">{user?.fullName}</div>
              <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest">{user?.role?.replace('_', ' ')}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-xs transition-colors"><LogOut size={16} /> Logout Securely</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen p-10 bg-[#0B0E14]">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-serif text-white mb-2">{activeTab}</h2>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Platform Online • System Core v4.2
              </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="p-3 bg-[#0E1117] border border-white/10 rounded-2xl text-gray-500 hover:text-[#D4AF37] relative">
                 <Bell size={20} />
                 <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0E1117]" />
               </button>
               <div className="h-10 w-[1px] bg-white/10 mx-2" />
               <div className="text-right">
                 <div className="text-xs font-bold text-white">{new Date().toLocaleDateString()}</div>
                 <div className="text-[10px] text-gray-500">10:42 AM CAT</div>
               </div>
            </div>
          </header>
          
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderDashboardContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

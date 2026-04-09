import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, storage } from './firebase';
import { collection, doc, onSnapshot, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  ChefHat, 
  Wrench, 
  ThermometerSnowflake, 
  Flame, 
  Wind, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  ShieldCheck,
  UtensilsCrossed,
  ArrowRight,
  Menu,
  X,
  User,
  Lock,
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  Truck,
  Calculator,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  PenTool,
  Map as MapIcon,
  Upload,
  CheckSquare,
  ChevronRight,
  Plus,
  Camera,
  HardHat,
  Instagram
} from 'lucide-react';

const WHATSAPP_NUMBER = "5511993005333";
const WHATSAPP_MESSAGE = "Olá! Gostaria de solicitar um orçamento para minha cozinha industrial.";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const PHONE_NUMBER = "(11) 3945-0009";
const PHONE_LINK = "tel:+551139450009";

const ADDRESS = "R. Cristóvão Babi, 05 - Jardim Rincão, São Paulo - SP";
const MAPS_LINK = "https://maps.google.com/?q=R.+Cristóvão+Babi,+05+-+Jardim+Rincão,+São+Paulo+-+SP";

function Logo({ className = "", bgClass = "bg-blue-600", text = "CALDEPAN", logoImage = "" }: { className?: string, bgClass?: string, text?: string, logoImage?: string }) {
  if (logoImage) {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        <img src={logoImage || undefined} alt={text} className="max-h-16 object-contain" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Top section: Forks, Flame, EST 2021 */}
      <div className="flex items-center justify-center gap-2 md:gap-3 mb-[-8px] z-10">
        <span className="text-[0.6rem] tracking-widest text-white/90 font-serif">EST.</span>
        
        <div className="relative flex items-center justify-center w-10 h-10">
          <UtensilsCrossed className="w-6 h-6 text-white absolute opacity-90" strokeWidth={2} />
          <div className={`relative z-10 ${bgClass} rounded-full w-7 h-7 border-[1.5px] border-white flex items-center justify-center`}>
            <Flame className="w-4 h-4 text-white fill-white" strokeWidth={1} />
          </div>
        </div>

        <span className="text-[0.6rem] tracking-widest text-white/90 font-serif">2021</span>
      </div>

      {/* Badge section: CALDEPAN */}
      <div className={`relative border-[1.5px] border-white rounded px-4 md:px-5 py-1.5 text-center ${bgClass} shadow-xl`}>
        <div className="absolute inset-[2px] border border-white/30 rounded-sm pointer-events-none"></div>
        
        {/* Corner flourishes */}
        <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-white ${bgClass}`}></div>
        <div className={`absolute -top-1 -right-1 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-white ${bgClass}`}></div>
        <div className={`absolute -bottom-1 -left-1 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-white ${bgClass}`}></div>
        <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-white ${bgClass}`}></div>

        <h1 
          className="text-2xl md:text-3xl font-black text-white leading-none tracking-wide mt-1" 
          style={{ fontFamily: 'Impact, system-ui, sans-serif', transform: 'scaleY(1.15)' }}
        >
          {text}
        </h1>
        <div className="flex items-center justify-center gap-1.5 mt-2 mb-0.5">
          <div className="w-2 h-[1px] bg-white/70"></div>
          <span className="text-[0.5rem] font-bold tracking-[0.15em] text-white uppercase">
            COZINHAS INDUSTRIAIS
          </span>
          <div className="w-2 h-[1px] bg-white/70"></div>
        </div>
      </div>
    </div>
  );
}

function LandingPage({ siteConfig }: { siteConfig: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!siteConfig.carouselImages || siteConfig.carouselImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % siteConfig.carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [siteConfig.carouselImages]);

  const nextSlide = () => {
    if (!siteConfig.carouselImages) return;
    setCurrentSlide((prev) => (prev + 1) % siteConfig.carouselImages.length);
  };

  const prevSlide = () => {
    if (!siteConfig.carouselImages) return;
    setCurrentSlide((prev) => (prev - 1 + siteConfig.carouselImages.length) % siteConfig.carouselImages.length);
  };

  const nextVideoSlide = () => {
    if (!siteConfig.videos || siteConfig.videos.length === 0) return;
    setCurrentVideoSlide((prev) => (prev + 1) % siteConfig.videos.length);
  };

  const prevVideoSlide = () => {
    if (!siteConfig.videos || siteConfig.videos.length === 0) return;
    setCurrentVideoSlide((prev) => (prev - 1 + siteConfig.videos.length) % siteConfig.videos.length);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.email !== 'luis.silva.avarese@gmail.com' && result.user.email !== 'caldepancozinhas@gmail.com') {
        await signOut(auth);
        alert("Acesso negado. Apenas o administrador pode acessar esta área.");
        return;
      }

      setIsLoginModalOpen(false);
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login Error: ", error);
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        alert("Erro ao fazer login. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#2c417d] text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex-shrink-0">
            <Logo text={siteConfig.logoText} logoImage={siteConfig.logoImage} className="scale-100 md:scale-110 origin-left" bgClass="bg-[#2c417d]" />
          </a>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <a href="#solucoes" className="hover:text-blue-400 transition-colors">Soluções</a>
            <a href="#projetos" className="hover:text-blue-400 transition-colors">Fotos</a>
            <a href="#video" className="hover:text-blue-400 transition-colors">Vídeos</a>
            <a href="#beneficios" className="hover:text-blue-400 transition-colors">Benefícios</a>
            <a href="#como-funciona" className="hover:text-blue-400 transition-colors">Como Funciona</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
            <a href="#sobre" className="hover:text-blue-400 transition-colors">Sobre a Caldepan</a>
            <a 
              href="https://www.instagram.com/caldepancozinhas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-400 transition-colors flex items-center gap-2"
              title="Siga-nos no Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-md font-semibold transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Orçamento
            </a>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-slate-300 hover:text-white flex items-center gap-2 font-semibold transition-colors ml-2"
            >
              <User className="w-4 h-4" />
              Área Restrita
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-blue-800 border-t border-blue-700"
            >
              <nav className="flex flex-col p-4 gap-4">
                <a href="#solucoes" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Soluções</a>
                <a href="#projetos" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Fotos</a>
                <a href="#video" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Vídeos</a>
                <a href="#beneficios" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Benefícios</a>
                <a href="#como-funciona" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Como Funciona</a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-white">FAQ</a>
                <a href="#sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Sobre a Caldepan</a>
                <a 
                  href="https://www.instagram.com/caldepancozinhas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-pink-400 flex items-center gap-2"
                >
                  <Instagram className="w-5 h-5" />
                  Siga no Instagram
                </a>
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 text-white px-4 py-3 rounded-md font-semibold text-center flex items-center justify-center gap-2 mt-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Solicitar Orçamento
                </a>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="bg-slate-700 text-white px-4 py-3 rounded-md font-semibold text-center flex items-center justify-center gap-2 mt-2"
                >
                  <User className="w-5 h-5" />
                  Área Restrita
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteConfig.heroImage || undefined} 
            alt="Cozinha Industrial Profissional 100% Inox" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-sm mb-6 border border-blue-500/30">
                Especialistas em Cozinhas Profissionais
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Monte sua Cozinha Industrial Completa com Especialistas
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Projetos sob medida em inox, refrigeração, cocção e exaustão para seu negócio gastronômico. Do projeto à instalação, entregamos a solução ideal para restaurantes, lanchonetes e dark kitchens.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                >
                  <MessageCircle className="w-6 h-6" />
                  Solicitar Orçamento no WhatsApp
                </a>
                <a 
                  href={PHONE_LINK}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-md font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Phone className="w-6 h-6" />
                  Ligar Agora
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problema + Solução */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-slate-900">
                Montar uma cozinha do zero não precisa ser uma dor de cabeça.
              </h2>
              <p className="text-slate-600 text-lg mb-8">
                Sabemos que a falta de planejamento, equipamentos inadequados e atrasos na entrega podem comprometer o início da sua operação.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <X className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Equipamentos que não cabem</h3>
                    <p className="text-slate-600">Comprar sem projeto gera desperdício de espaço e dinheiro.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <X className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Vários fornecedores</h3>
                    <p className="text-slate-600">Dor de cabeça para coordenar entregas e instalações diferentes.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 z-0 opacity-20">
                <img 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
                  alt="Detalhe Inox"
                  className="w-full h-full object-cover mix-blend-luminosity"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-900/40 z-0"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 z-0"></div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-6 relative z-10">
                A Solução Caldepan
              </h2>
              <p className="text-slate-300 text-lg mb-8 relative z-10">
                Entregamos sua cozinha pronta, sob medida e com padrão profissional. Um único parceiro para o seu projeto completo.
              </p>

              <ul className="space-y-4 relative z-10">
                {[
                  "Projetos 100% personalizados",
                  "Fabricação própria em aço inox",
                  "Instalação especializada",
                  "Suporte e garantia"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <span className="font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="solucoes" className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1590846406792-0adc7f138fbc?auto=format&fit=crop&q=80&w=2000"
            alt="Background Cozinha"
            className="w-full h-full object-cover mix-blend-luminosity grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Nossas Soluções</h2>
            <p className="text-lg text-slate-600">
              Tudo o que seu negócio gastronômico precisa para operar com máxima eficiência e segurança.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'inox', icon: Wrench, title: "Equipamentos em Inox", desc: "Bancadas, pias, prateleiras e estantes sob medida com alta durabilidade." },
              { id: 'refrigeracao', icon: ThermometerSnowflake, title: "Refrigeração Industrial", desc: "Câmaras frias, balcões refrigerados e freezers de alta performance." },
              { id: 'coccao', icon: Flame, title: "Equipamentos de Cocção", desc: "Fogões industriais, fornos, chapas e fritadeiras profissionais." },
              { id: 'exaustao', icon: Wind, title: "Sistemas de Exaustão", desc: "Coifas e tubulações projetadas para manter o ambiente limpo e seguro." },
              { id: 'mobiliario', icon: UtensilsCrossed, title: "Mobiliário Profissional", desc: "Estruturas completas para organização e fluxo de trabalho." },
              { id: 'projetos', icon: ChefHat, title: "Projetos Completos", desc: "Do desenho da planta até a instalação final dos equipamentos." },
            ].map((servico, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-6">
                  <servico.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{servico.title}</h3>
                <p className="text-slate-600 leading-relaxed">{servico.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <img 
                src={siteConfig.featureImage || undefined} 
                alt="Equipamento Inox" 
                className="rounded-2xl shadow-2xl w-full h-[400px] md:h-[500px] object-cover" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-xl hidden md:block border border-blue-500">
                <p className="text-3xl font-bold text-emerald-400 mb-1">100%</p>
                <p className="text-sm font-medium text-slate-300">Aço Inox<br/>Profissional</p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Por que escolher a Caldepan?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Nossa experiência garante que sua cozinha seja projetada para durar e otimizar o trabalho da sua equipe.
              </p>

              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, title: "Equipamentos Duráveis", desc: "Aço inox de alta qualidade, resistente e fácil de higienizar." },
                  { icon: Clock, title: "Otimização de Espaço", desc: "Projetos inteligentes que melhoram o fluxo de trabalho e economizam tempo." },
                  { icon: Star, title: "Atendimento Especializado", desc: "Equipe técnica pronta para entender e resolver sua necessidade." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Fotos (Carrossel) */}
      {siteConfig.carouselImages && siteConfig.carouselImages.length > 0 && (
        <section id="projetos" className="py-20 bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Fotos</h2>
              <p className="text-lg text-slate-600">
                Confira algumas das cozinhas industriais que já entregamos.
              </p>
            </div>
            
            <div className="relative max-w-lg mx-auto">
              <div className="overflow-hidden rounded-2xl shadow-lg aspect-[4/5] relative bg-slate-200">
                {siteConfig.carouselImages.map((img: string, idx: number) => (
                  <div 
                    key={idx} 
                    className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <img src={img || undefined} alt={`Projeto ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              
              {siteConfig.carouselImages.length > 1 && (
                <>
                  <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-blue-900 p-2 rounded-full shadow-lg transition-all">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-blue-900 p-2 rounded-full shadow-lg transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  <div className="flex justify-center gap-2 mt-6">
                    {siteConfig.carouselImages.map((_: any, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-blue-600 w-6' : 'bg-slate-300'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Galeria de Vídeos */}
      {siteConfig.videos && siteConfig.videos.length > 0 && (
        <section id="video" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Vídeos</h2>
              <p className="text-lg text-slate-600">
                Veja nossos equipamentos funcionando na prática.
              </p>
            </div>
            
            <div className={`mx-auto relative group transition-all duration-500 ${siteConfig.videos[currentVideoSlide].includes('instagram.com') ? 'max-w-md' : 'max-w-4xl'}`}>
              <div className={`rounded-2xl overflow-hidden shadow-xl bg-slate-900 transition-all duration-500 ${siteConfig.videos[currentVideoSlide].includes('instagram.com') ? 'aspect-[9/16]' : 'aspect-video'}`}>
                {siteConfig.videos[currentVideoSlide].includes('youtube.com') || siteConfig.videos[currentVideoSlide].includes('youtu.be') ? (
                  <iframe 
                    src={siteConfig.videos[currentVideoSlide].replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : siteConfig.videos[currentVideoSlide].includes('vimeo.com') ? (
                  <iframe 
                    src={siteConfig.videos[currentVideoSlide].replace('vimeo.com/', 'player.vimeo.com/video/')} 
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : siteConfig.videos[currentVideoSlide].includes('instagram.com') ? (
                  <iframe 
                    src={siteConfig.videos[currentVideoSlide].split('?')[0].replace(/\/$/, '').replace(/\/embed$/, '') + '/embed'} 
                    className="w-full h-full bg-white"
                    allowtransparency="true"
                    allowFullScreen
                    frameBorder="0"
                    scrolling="no"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                ) : (
                  <video 
                    src={siteConfig.videos[currentVideoSlide]} 
                    controls 
                    className="w-full h-full object-contain"
                    preload="metadata"
                  />
                )}
              </div>

              {siteConfig.videos.length > 1 && (
                <>
                  <button 
                    onClick={prevVideoSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg transition-all md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 z-10"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180" />
                  </button>
                  <button 
                    onClick={nextVideoSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg transition-all md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {siteConfig.videos.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentVideoSlide(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentVideoSlide ? 'bg-blue-600 w-8' : 'bg-slate-300 hover:bg-blue-400'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Nossos Clientes */}
      {siteConfig.ourClients && siteConfig.ourClients.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Nossos Clientes</h2>
              <p className="text-lg text-slate-600">
                Empresas que confiam em nossas soluções para suas cozinhas industriais.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {siteConfig.ourClients.map((client: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Users className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{client.name}</h3>
                  <p className="text-slate-500 text-sm">{client.service}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Como Funciona</h2>
            <p className="text-lg text-slate-600">
              Um processo simples e transparente para tirar sua cozinha do papel.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 relative">
            {/* Linha conectora (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>

            {[
              { step: "1", title: "Contato", desc: "Você fala com nossa equipe via WhatsApp ou telefone." },
              { step: "2", title: "Análise", desc: "Avaliamos seu espaço e necessidades específicas." },
              { step: "3", title: "Projeto", desc: "Criamos o desenho e orçamento sob medida." },
              { step: "4", title: "Instalação", desc: "Entregamos e instalamos tudo pronto para uso." },
              { step: "5", title: "Garantia", desc: "Oferecemos garantia personalizada conforme o projeto, assegurando qualidade e tranquilidade para o seu negócio." }
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-slate-50">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-2 mb-6">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />)}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900">
            Centenas de clientes satisfeitos em São Paulo
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Carlos M.", role: "Dono de Restaurante", text: "A Caldepan projetou nossa cozinha do zero. O fluxo de trabalho melhorou 100% e os equipamentos em inox são de primeira." },
              { name: "Ana P.", role: "Chef de Cozinha", text: "Atendimento impecável. Entenderam exatamente o que eu precisava para a minha hamburgueria e entregaram no prazo." },
              { name: "Roberto S.", role: "Empreendedor", text: "A opção da cozinha compartilhada foi fundamental para eu começar meu negócio de delivery com baixo custo." }
            ].map((depoimento, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl text-left border border-slate-100">
                <p className="text-slate-600 italic mb-6">"{depoimento.text}"</p>
                <div>
                  <p className="font-bold text-slate-900">{depoimento.name}</p>
                  <p className="text-sm text-slate-500">{depoimento.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Dúvidas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Vocês fazem projetos personalizados?", a: "Sim! Todos os nossos projetos são feitos sob medida para aproveitar ao máximo o seu espaço e atender às necessidades do seu cardápio." },
              { q: "Atendem pequenas empresas?", a: "Com certeza. Atendemos desde pequenos deliveries e lanchonetes até grandes restaurantes e cozinhas industriais." },
              { q: "Qual o prazo de entrega?", a: "O prazo varia de acordo com a complexidade do projeto. Após a aprovação, estabelecemos um cronograma rigoroso para garantir que sua operação inicie no tempo certo." },
              { q: "Trabalham com instalação?", a: "Sim, oferecemos a solução completa. Nossa equipe técnica realiza a instalação de todos os equipamentos e sistemas de exaustão." }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Sobre a Caldepan */}
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">Sobre a Caldepan</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              A CALDEPAN foi fundada em 2020 como consultoria de vendas de equipamentos, nossa empresa destaca-se pelo alto nível de aproveitamento de seus colaboradores e emprego de tecnologia de ponta, na fabricação de equipamentos para cozinhas profissionais.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Oferecemos o que há de melhor e mais moderno no setor de equipamentos em aço inox para cozinhas industriais e profissionais, disponibilizando completa infraestrutura para restaurantes, bares, grandes redes de fast-food, catering, equipamentos hospitalares e órgãos governamentais.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Agradeceríamos poder agendar um contato pessoal, oportunidade em que poderemos melhor esclarecer sobre nossa empresa, bem como nossos produtos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1625631980783-0246eb8248c8?auto=format&fit=crop&q=80&w=2000"
            alt="Equipamentos Industriais"
            className="w-full h-full object-cover mix-blend-luminosity opacity-40"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-900/70 z-0"></div>
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para montar a cozinha dos seus sonhos?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Fale com um especialista agora mesmo e solicite um orçamento sem compromisso.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              <MessageCircle className="w-6 h-6" />
              Falar no WhatsApp
            </a>
            <a 
              href={PHONE_LINK}
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-md font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-6 h-6" />
              {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-200 py-12 border-t border-blue-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="mb-6">
                <Logo text={siteConfig.logoText} logoImage={siteConfig.logoImage} className="scale-100 origin-left" bgClass="bg-blue-950" />
              </div>
              <p className="text-sm">
                Especialistas em cozinhas profissionais, equipamentos em inox e soluções completas para o setor gastronômico.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={PHONE_LINK} className="hover:text-white transition-colors">{PHONE_NUMBER}</a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
                </li>
                <li className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  <a href="https://www.instagram.com/caldepancozinhas/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Endereço</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    {ADDRESS}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-sm pt-8 border-t border-blue-900">
            <p>&copy; {new Date().getFullYear()} Caldepan Cozinhas Industriais. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-600 transition-transform hover:scale-110 flex items-center justify-center group"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Fale conosco!
        </span>
      </a>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm"
              onClick={() => setIsLoginModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="bg-blue-600 p-6 text-center relative">
                <button 
                  onClick={() => setIsLoginModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <Logo text={siteConfig.logoText} logoImage={siteConfig.logoImage} className="scale-75 origin-center mx-auto mb-2" bgClass="bg-blue-600" />
                <h3 className="text-white font-semibold mt-2">Acesso Restrito</h3>
              </div>
              <div className="p-6 md:p-8 flex flex-col items-center">
                <p className="text-slate-600 text-center mb-6">
                  Faça login com sua conta Google para acessar o painel administrativo.
                </p>
                <button 
                  onClick={handleLogin}
                  className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Entrar com Google
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-slate-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 text-slate-600">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const initialOrders = [
  { 
    id: "ORC-1045", client: "Pizzaria Napoli", contact: "(11) 98888-1111", date: "02/04/2026", deadline: "10/04/2026", status: "novo", value: 25000, responsible: "Carlos", address: "Rua das Flores, 123 - São Paulo, SP",
    phases: {
      novo: { startDate: '2026-04-02', endDate: '2026-04-04' },
      em_analise: { startDate: null, endDate: null },
      em_producao: { startDate: null, endDate: null },
      em_instalacao: { startDate: null, endDate: null },
      em_garantia: { startDate: null, endDate: null }
    }
  },
  { 
    id: "ORC-1044", client: "Restaurante Sabor & Arte", contact: "(11) 99999-0000", date: "02/04/2026", deadline: "15/04/2026", status: "novo", value: 45000, responsible: "Ana", address: "Av Paulista, 1000 - São Paulo, SP",
    phases: {
      novo: { startDate: '2026-04-02', endDate: '2026-04-02' },
      em_analise: { startDate: null, endDate: null },
      em_producao: { startDate: null, endDate: null },
      em_instalacao: { startDate: null, endDate: null },
      em_garantia: { startDate: null, endDate: null }
    }
  },
  { 
    id: "ORC-1041", client: "Hamburgueria Bull", contact: "(11) 97777-2222", date: "01/04/2026", deadline: "20/04/2026", status: "em_analise", value: 12500, responsible: "Carlos", address: "Rua Augusta, 500 - São Paulo, SP",
    phases: {
      novo: { startDate: '2026-04-01', endDate: '2026-04-02' },
      em_analise: { startDate: '2026-04-02', endDate: '2026-04-07' },
      em_producao: { startDate: null, endDate: null },
      em_instalacao: { startDate: null, endDate: null },
      em_garantia: { startDate: null, endDate: null }
    }
  },
  { 
    id: "ORC-1039", client: "Dark Kitchen Express", contact: "(11) 96666-3333", date: "25/03/2026", deadline: "05/05/2026", status: "em_producao", value: 120000, responsible: "Roberto", address: "Av Faria Lima, 200 - São Paulo, SP",
    phases: {
      novo: { startDate: '2026-03-25', endDate: '2026-03-26' },
      em_analise: { startDate: '2026-03-26', endDate: '2026-03-30' },
      em_producao: { startDate: '2026-03-30', endDate: '2026-04-15' },
      em_instalacao: { startDate: null, endDate: null },
      em_garantia: { startDate: null, endDate: null }
    }
  },
  { 
    id: "ORC-1035", client: "Bistrô Francês", contact: "(11) 95555-4444", date: "15/03/2026", deadline: "03/04/2026", status: "em_instalacao", value: 85000, responsible: "Ana", address: "Rua Oscar Freire, 100 - São Paulo, SP",
    phases: {
      novo: { startDate: '2026-03-15', endDate: '2026-03-16' },
      em_analise: { startDate: '2026-03-16', endDate: '2026-03-20' },
      em_producao: { startDate: '2026-03-20', endDate: '2026-04-01' },
      em_instalacao: { startDate: '2026-04-01', endDate: '2026-04-04' },
      em_garantia: { startDate: null, endDate: null }
    }
  },
  { 
    id: "ORC-1020", client: "Café Central", contact: "(11) 94444-5555", date: "10/01/2026", deadline: "15/02/2026", status: "em_garantia", value: 34200, responsible: "Roberto", address: "Centro Histórico - São Paulo, SP",
    phases: {
      novo: { startDate: '2026-01-10', endDate: '2026-01-11' },
      em_analise: { startDate: '2026-01-11', endDate: '2026-01-15' },
      em_producao: { startDate: '2026-01-15', endDate: '2026-02-10' },
      em_instalacao: { startDate: '2026-02-10', endDate: '2026-02-14' },
      em_garantia: { startDate: '2026-02-14', endDate: '2027-02-14' }
    }
  },
];

const mockClients = [
  { id: "CLI-001", name: "Pizzaria Napoli", contact: "(11) 98888-1111", email: "contato@napoli.com", address: "Rua das Flores, 123 - São Paulo, SP", ticketMedio: 35000, tempoFechamento: 12, obras: 2, lastOrder: "02/04/2026" },
  { id: "CLI-002", name: "Restaurante Sabor & Arte", contact: "(11) 99999-0000", email: "gerencia@saborearte.com", address: "Av Paulista, 1000 - São Paulo, SP", ticketMedio: 45000, tempoFechamento: 8, obras: 1, lastOrder: "02/04/2026" },
  { id: "CLI-003", name: "Dark Kitchen Express", contact: "(11) 96666-3333", email: "ops@darkkitchen.com", address: "Av Faria Lima, 200 - São Paulo, SP", ticketMedio: 120000, tempoFechamento: 25, obras: 3, lastOrder: "25/03/2026" },
  { id: "CLI-004", name: "Bistrô Francês", contact: "(11) 95555-4444", email: "contato@bistro.com", address: "Rua Oscar Freire, 100 - São Paulo, SP", ticketMedio: 85000, tempoFechamento: 15, obras: 1, lastOrder: "15/03/2026" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const getPhaseStatus = (endDateStr: string | null) => {
  if (!endDateStr) return { text: 'Sem prazo', color: 'text-slate-500', bg: 'bg-slate-100 border-slate-200', status: 'none' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = endDateStr.split('-').map(Number);
  const endDate = new Date(year, month - 1, day);
  
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { text: `Atrasado ${Math.abs(diffDays)} dia(s)`, color: 'text-red-700', bg: 'bg-red-100 border-red-200', status: 'late' };
  } else if (diffDays <= 2) {
    return { text: `Vence em ${diffDays} dia(s)`, color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200', status: 'warning' };
  } else {
    return { text: `${diffDays} dias restantes`, color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200', status: 'ok' };
  }
};

const statusConfig: Record<string, { label: string, color: string, icon: React.ElementType, description: string }> = {
  novo: { label: "Novos Orçamentos", color: "bg-blue-100 text-blue-700 border-blue-200", icon: AlertCircle, description: "Aguardando contato" },
  em_analise: { label: "Em Análise", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, description: "Projeto/Orçamento" },
  em_producao: { label: "Em Produção", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Wrench, description: "Fabricação" },
  em_instalacao: { label: "Em Instalação", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Truck, description: "No cliente" },
  em_garantia: { label: "Em Garantia", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: ShieldCheck, description: "Pós-venda" },
};

// --- Sub-components for Dashboard Tabs ---

function TabGeral({ orders, updateOrderStatus, updateOrderPhases }: { orders: any[], updateOrderStatus: (id: string, status: string) => void, updateOrderPhases: (id: string, phases: any) => void }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPhasesOrder, setEditingPhasesOrder] = useState<any>(null);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter ? order.status === activeFilter : true;
    const matchesSearch = order.client.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const isActive = activeFilter === key;
          const count = counts[key] || 0;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(isActive ? null : key)}
              className={`text-left bg-white p-4 rounded-xl border transition-all ${isActive ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md transform scale-[1.02]' : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">{config.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{count}</h3>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color.split(' ')[0]} ${config.color.split(' ')[1]}`}>
                  <config.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">{config.description}</p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">
            {activeFilter ? `Orçamentos: ${statusConfig[activeFilter].label}` : 'Todos os Orçamentos'}
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar cliente ou ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            <button 
              onClick={() => { setActiveFilter(null); setSearchTerm(""); }}
              className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
              title="Limpar Filtros"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Previsão</th>
                <th className="px-6 py-4 font-medium">Valor Est.</th>
                <th className="px-6 py-4 font-medium">Status (Esteira)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Nenhum orçamento encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {order.client}
                        <div className="text-xs text-slate-500 font-normal mt-0.5">{order.contact}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{order.deadline}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatCurrency(order.value)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-bold rounded-full px-3 py-1.5 border outline-none cursor-pointer appearance-none pr-8 relative ${status.color} bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em]`}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                          >
                            {Object.entries(statusConfig).map(([k, v]) => (
                              <option key={k} value={k} className="bg-white text-slate-900 font-medium">
                                {v.label}
                              </option>
                            ))}
                          </select>
                          
                          {(() => {
                            const currentPhase = order.phases?.[order.status];
                            const phaseStatus = getPhaseStatus(currentPhase?.endDate);
                            return (
                              <button 
                                onClick={() => setEditingPhasesOrder(order)}
                                className={`text-[10px] px-2 py-1 rounded border font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity ${phaseStatus.bg} ${phaseStatus.color}`}
                                title="Clique para editar os prazos das fases"
                              >
                                <Clock className="w-3 h-3" />
                                {phaseStatus.text}
                              </button>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingPhasesOrder && (
        <div className="fixed inset-0 bg-blue-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Prazos e Fases</h3>
                <p className="text-sm text-slate-500">Pedido: {editingPhasesOrder.id} - {editingPhasesOrder.client}</p>
              </div>
              <button onClick={() => setEditingPhasesOrder(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {Object.entries(statusConfig).map(([phaseKey, config]) => {
                  const phaseData = editingPhasesOrder.phases?.[phaseKey] || { startDate: '', endDate: '' };
                  const isCurrent = editingPhasesOrder.status === phaseKey;
                  
                  return (
                    <div key={phaseKey} className={`p-4 rounded-lg border ${isCurrent ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <config.icon className={`w-4 h-4 ${isCurrent ? 'text-blue-600' : 'text-slate-500'}`} />
                        <h4 className={`font-bold ${isCurrent ? 'text-blue-900' : 'text-slate-700'}`}>
                          {config.label} {isCurrent && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">Fase Atual</span>}
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Data de Início</label>
                          <input 
                            type="date" 
                            value={phaseData.startDate || ''}
                            onChange={(e) => {
                              const newPhases = { ...editingPhasesOrder.phases };
                              newPhases[phaseKey] = { ...newPhases[phaseKey], startDate: e.target.value };
                              updateOrderPhases(editingPhasesOrder.id, newPhases);
                              setEditingPhasesOrder({ ...editingPhasesOrder, phases: newPhases });
                            }}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Data de Fim (Prazo)</label>
                          <input 
                            type="date" 
                            value={phaseData.endDate || ''}
                            onChange={(e) => {
                              const newPhases = { ...editingPhasesOrder.phases };
                              newPhases[phaseKey] = { ...newPhases[phaseKey], endDate: e.target.value };
                              updateOrderPhases(editingPhasesOrder.id, newPhases);
                              setEditingPhasesOrder({ ...editingPhasesOrder, phases: newPhases });
                            }}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end flex-shrink-0">
              <button onClick={() => setEditingPhasesOrder(null)} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabOrcamentosList({ orders, addOrder, clients }: { orders: any[], addOrder: (order: any) => void, clients: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ clientId: '', client: '', contact: '', date: new Date().toLocaleDateString('pt-BR'), deadline: '', value: 0, responsible: '', address: '' });

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setNewOrder({
        ...newOrder,
        clientId,
        client: selectedClient.name,
        contact: selectedClient.contact,
        address: selectedClient.address || ''
      });
    } else {
      setNewOrder({
        ...newOrder,
        clientId: '',
        client: '',
        contact: '',
        address: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({
      id: `ORC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'novo',
      ...newOrder
    });
    setIsModalOpen(false);
    setNewOrder({ clientId: '', client: '', contact: '', date: new Date().toLocaleDateString('pt-BR'), deadline: '', value: 0, responsible: '', address: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Orçamentos</h2>
          <p className="text-slate-500">Gerencie e crie novos orçamentos para a esteira de produção</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Novo Orçamento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Previsão</th>
                <th className="px-6 py-4 font-medium">Valor Est.</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {order.client}
                      <div className="text-xs text-slate-500 font-normal mt-0.5">{order.contact}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.deadline}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatCurrency(order.value)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span className="whitespace-nowrap">{status.label}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Novo Orçamento</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                  <select required value={newOrder.clientId} onChange={handleClientChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Selecione um cliente...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contato</label>
                  <input required type="text" value={newOrder.contact} onChange={e => setNewOrder({...newOrder, contact: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(00) 00000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Previsão de Entrega</label>
                  <input required type="text" value={newOrder.deadline} onChange={e => setNewOrder({...newOrder, deadline: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="DD/MM/AAAA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor Estimado (R$)</label>
                  <input required type="number" value={newOrder.value || ''} onChange={e => setNewOrder({...newOrder, value: Number(e.target.value)})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
                  <input required type="text" value={newOrder.responsible} onChange={e => setNewOrder({...newOrder, responsible: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nome do vendedor/técnico" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label>
                  <input required type="text" value={newOrder.address} onChange={e => setNewOrder({...newOrder, address: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Rua, Número - Cidade, UF" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Criar Orçamento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TabSimulador() {
  const [material, setMaterial] = useState(15000);
  const [labor, setLabor] = useState(8000);
  const [margin, setMargin] = useState(35);

  const totalCost = material + labor;
  const finalPrice = totalCost / (1 - (margin / 100));
  const profit = finalPrice - totalCost;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Simulador de Orçamentos</h2>
          <p className="text-slate-500">Calcule custos e margem de lucro em tempo real</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <FileText className="w-4 h-4" />
          Gerar Proposta PDF
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Calculator className="w-5 h-5 text-blue-500" />
            Parâmetros do Projeto
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Custo de Matéria-Prima (R$)</label>
              <input 
                type="number" 
                value={material}
                onChange={(e) => setMaterial(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Custo de Mão de Obra (R$)</label>
              <input 
                type="number" 
                value={labor}
                onChange={(e) => setLabor(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Margem de Lucro Desejada (%)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="10" max="80" step="5"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="font-bold text-lg text-blue-600 w-16 text-right">{margin}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2 relative z-10">
            <TrendingUp className="w-5 h-5" />
            Resultado da Simulação
          </h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-sm text-slate-400 mb-1">Custo Total (Material + Mão de Obra)</p>
              <p className="text-2xl font-semibold text-slate-200">{formatCurrency(totalCost)}</p>
            </div>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Lucro Líquido Projetado</p>
              <p className="text-2xl font-semibold text-emerald-400">{formatCurrency(profit)}</p>
            </div>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Preço Final Sugerido</p>
              <p className="text-4xl font-black text-white">{formatCurrency(finalPrice)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabClientes({ clients, setClients }: { clients: any[], setClients: any }) {
  const [selectedClient, setSelectedClient] = useState<any>(clients[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', contact: '', email: '', address: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      const updated = clients.map(c => c.id === editingClient.id ? { ...c, ...formData } : c);
      setClients(updated);
      setSelectedClient({ ...editingClient, ...formData });
    } else {
      const newClient = {
        id: `CLI-${Math.floor(100 + Math.random() * 900)}`,
        ...formData,
        ticketMedio: 0,
        tempoFechamento: 0,
        obras: 0,
        lastOrder: '-'
      };
      setClients([...clients, newClient]);
      setSelectedClient(newClient);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const updated = clients.filter(c => c.id !== id);
      setClients(updated);
      if (selectedClient?.id === id) {
        setSelectedClient(updated[0] || null);
      }
    }
  };

  const openNew = () => {
    setEditingClient(null);
    setFormData({ name: '', contact: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const openEdit = (client: any) => {
    setEditingClient(client);
    setFormData({ name: client.name, contact: client.contact, email: client.email, address: client.address || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Lista de Clientes */}
      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Clientes</h3>
            <button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors" title="Novo Cliente">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredClients.map(client => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${selectedClient?.id === client.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
            >
              <h4 className="font-bold text-slate-900">{client.name}</h4>
              <p className="text-sm text-slate-500">{client.contact}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detalhes do Cliente */}
      {selectedClient ? (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-y-auto relative">
          <div className="absolute top-6 right-6 flex gap-2">
            <button onClick={() => openEdit(selectedClient)} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
              <PenTool className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(selectedClient.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-start mb-8 pr-24">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedClient.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1"><Phone className="w-4 h-4"/> {selectedClient.contact}</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4"/> {selectedClient.email}</span>
              </div>
              {selectedClient.address && (
                <div className="flex items-center gap-1 text-sm text-slate-600 mt-2">
                  <MapPin className="w-4 h-4"/> {selectedClient.address}
                </div>
              )}
            </div>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
              ID: {selectedClient.id}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Histórico e Métricas</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Ticket Médio</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedClient.ticketMedio)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Tempo Médio Fechamento</p>
              <p className="text-2xl font-bold text-amber-600">{selectedClient.tempoFechamento} dias</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Total de Obras</p>
              <p className="text-2xl font-bold text-emerald-600">{selectedClient.obras} projetos</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Obras Anteriores</h3>
          <div className="space-y-4">
            {selectedClient.obras > 0 ? [...Array(selectedClient.obras)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Projeto Cozinha Completa #{i+1}</h4>
                    <p className="text-sm text-slate-500">Concluído em: {selectedClient.lastOrder}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{formatCurrency(selectedClient.ticketMedio)}</p>
                  <button className="text-sm text-blue-600 hover:underline">Ver detalhes</button>
                </div>
              </div>
            )) : (
              <p className="text-slate-500">Nenhuma obra registrada para este cliente.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Selecione um cliente para ver o histórico
        </div>
      )}

      {/* Modal de Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contato</label>
                <input required type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TabInstalacoes({ orders }: { orders: any[] }) {
  const instalacoes = orders.filter(o => o.status === 'em_instalacao');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão de Obras e Instalações</h2>
          <p className="text-slate-500">Acompanhe as equipes em campo e o progresso das montagens</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {instalacoes.length === 0 ? (
          <div className="col-span-2 bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
            Nenhuma obra em instalação no momento.
          </div>
        ) : instalacoes.map(obra => (
          <div key={obra.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-start">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700 mb-2">
                  <HardHat className="w-3.5 h-3.5" /> Equipe: {obra.responsible}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{obra.client}</h3>
                <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                  <Calendar className="w-4 h-4" /> Previsão: {obra.deadline}
                </p>
              </div>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(obra.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg shadow-sm text-blue-600 hover:bg-blue-50 transition-colors"
                title="Abrir no Google Maps"
              >
                <MapIcon className="w-5 h-5" />
              </a>
            </div>
            
            <div className="p-5 flex-1 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" /> Checklist de Instalação
                </h4>
                <div className="space-y-2">
                  {["Medição do local", "Entrega dos equipamentos", "Montagem das bancadas", "Instalação da exaustão", "Teste de funcionamento"].map((item, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked={i < 2} />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Documentação da Obra
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-slate-500 hover:text-blue-600">
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-medium">Fotos Antes/Depois</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-slate-500 hover:text-blue-600">
                    <PenTool className="w-5 h-5" />
                    <span className="text-xs font-medium">Assinatura Cliente</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabConfiguracoes({ siteConfig, setSiteConfig }: { siteConfig: any, setSiteConfig: any }) {
  const [config, setConfig] = useState(siteConfig);
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newClient, setNewClient] = useState({ name: '', service: '', logo: '' });
  const [isUploadingClientLogo, setIsUploadingClientLogo] = useState(false);

  const handleSave = () => {
    setSiteConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isMultiple = false, limit?: number) => {
    let files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (limit) {
      const currentCount = config[field]?.length || 0;
      if (currentCount + files.length > limit) {
        alert(`Você só pode adicionar até ${limit} itens aqui.`);
        files = files.slice(0, limit - currentCount);
        if (files.length === 0) return;
      }
    }

    setIsUploading(true);
    try {
      const processAndUploadImage = async (file: File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const isLogo = field === 'logoImage';
              const MAX_DIMENSION = isLogo ? 300 : 800;

              if (width > height && width > MAX_DIMENSION) {
                height *= MAX_DIMENSION / width;
                width = MAX_DIMENSION;
              } else if (height > MAX_DIMENSION) {
                width *= MAX_DIMENSION / height;
                height = MAX_DIMENSION;
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              resolve(canvas.toDataURL(isLogo ? 'image/webp' : 'image/jpeg', 0.6));
            };
            img.onerror = reject;
            img.src = reader.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      const urls = await Promise.all(files.map(processAndUploadImage));

      setConfig((prev: any) => {
        if (isMultiple) {
          return { ...prev, [field]: [...(prev[field] || []), ...urls] };
        } else {
          return { ...prev, [field]: urls[0] };
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erro ao processar a imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClientLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingClientLogo(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_DIMENSION = 300;

            if (width > height && width > MAX_DIMENSION) {
              height *= MAX_DIMENSION / width;
              width = MAX_DIMENSION;
            } else if (height > MAX_DIMENSION) {
              width *= MAX_DIMENSION / height;
              height = MAX_DIMENSION;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            resolve(canvas.toDataURL('image/webp', 0.6));
          };
          img.onerror = reject;
          img.src = reader.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      setNewClient(prev => ({ ...prev, logo: dataUrl }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erro ao processar logo. Tente novamente.");
    } finally {
      setIsUploadingClientLogo(false);
    }
  };

  const addClient = () => {
    if (!newClient.name) {
      alert("O nome do cliente é obrigatório.");
      return;
    }
    setConfig((prev: any) => ({
      ...prev,
      ourClients: [...(prev.ourClients || []), newClient]
    }));
    setNewClient({ name: '', service: '', logo: '' });
  };

  const removeClient = (idx: number) => {
    setConfig((prev: any) => ({
      ...prev,
      ourClients: prev.ourClients.filter((_: any, i: number) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configurações do Site</h2>
          <p className="text-slate-500">Ajuste a identidade visual e imagens da Landing Page</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Texto da Logo</label>
          <input 
            type="text" 
            value={config.logoText} 
            onChange={e => setConfig({...config, logoText: e.target.value})} 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Ex: CALDEPAN"
          />
          <p className="text-xs text-slate-500 mt-1">Este texto aparecerá na logo do cabeçalho e rodapé.</p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Imagem da Logo (Upload)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={e => handleFileUpload(e, 'logoImage', false)} 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            disabled={isUploading}
          />
          {config.logoImage && (
            <div className="mt-3 w-48 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-2">
              <img src={config.logoImage} alt="Preview Logo" className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>
        
        <div className="border-t border-slate-100 pt-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Imagem Principal (Hero) - Upload</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={e => handleFileUpload(e, 'heroImage', false)} 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            disabled={isUploading}
          />
          <div className="mt-3 aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
            {config.heroImage && <img src={config.heroImage} alt="Preview Hero" className="w-full h-full object-cover" />}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Imagem de Destaque (Benefícios) - Upload</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={e => handleFileUpload(e, 'featureImage', false)} 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            disabled={isUploading}
          />
          <div className="mt-3 aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
            {config.featureImage && <img src={config.featureImage} alt="Preview Feature" className="w-full h-full object-cover" />}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Imagens do Carrossel (Upload)</label>
          <input 
            type="file" 
            accept="image/*"
            multiple
            onChange={e => handleFileUpload(e, 'carouselImages', true, 10)} 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            disabled={isUploading}
          />
          <p className="text-xs text-slate-500 mt-1">Selecione até 10 imagens para o carrossel. Formato 4:5 recomendado.</p>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {config.carouselImages?.map((img: string, idx: number) => (
              <div key={idx} className="relative aspect-[4/5] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                <img src={img || undefined} alt={`Carousel ${idx}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setConfig((prev: any) => ({
                    ...prev,
                    carouselImages: prev.carouselImages.filter((_: any, i: number) => i !== idx)
                  }))}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Vídeos em Destaque (YouTube/Vimeo/Instagram)</label>
          <p className="text-xs text-slate-500 mb-4">Adicione até 10 links de vídeos (YouTube, Vimeo ou Reels/Posts do Instagram) para exibir em um carrossel na página inicial.</p>
          
          <div className="space-y-3">
            {(config.videos || []).map((video: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input 
                  type="url" 
                  value={video}
                  onChange={e => {
                    const newVideos = [...(config.videos || [])];
                    newVideos[idx] = e.target.value;
                    setConfig((prev: any) => ({ ...prev, videos: newVideos }));
                  }} 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
                <button 
                  onClick={() => {
                    const newVideos = [...(config.videos || [])];
                    newVideos.splice(idx, 1);
                    setConfig((prev: any) => ({ ...prev, videos: newVideos }));
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  title="Remover Vídeo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {(!config.videos || config.videos.length < 10) && (
              <div className="flex gap-2">
                <input 
                  type="url" 
                  placeholder="https://www.youtube.com/watch?v=... ou https://www.instagram.com/reel/..."
                  id="new-video-input"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        setConfig((prev: any) => ({ ...prev, videos: [...(prev.videos || []), val] }));
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('new-video-input') as HTMLInputElement;
                    if (input && input.value) {
                      setConfig((prev: any) => ({ ...prev, videos: [...(prev.videos || []), input.value] }));
                      input.value = '';
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" /> Adicionar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <label className="block text-sm font-bold text-slate-700 mb-4">Nossos Clientes</label>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <h4 className="font-medium text-sm text-slate-700 mb-3">Adicionar Novo Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nome da Empresa</label>
                <input 
                  type="text" 
                  value={newClient.name}
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Restaurante Sabor"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Serviço Prestado</label>
                <input 
                  type="text" 
                  value={newClient.service}
                  onChange={e => setNewClient({...newClient, service: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Cozinha Industrial Completa"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Logo do Cliente (Upload)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleClientLogoUpload}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  disabled={isUploadingClientLogo}
                />
                {isUploadingClientLogo && <p className="text-xs text-blue-600 mt-1">Enviando logo...</p>}
                {newClient.logo && (
                  <div className="mt-2 w-16 h-16 rounded-md overflow-hidden border border-slate-200 bg-white flex items-center justify-center p-1">
                    <img src={newClient.logo} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={addClient}
              disabled={isUploadingClientLogo || !newClient.name}
              className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Adicionar à Lista
            </button>
          </div>

          <div className="space-y-3">
            {config.ourClients?.map((client: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center p-1">
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Users className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{client.name}</h4>
                    <p className="text-xs text-slate-500">{client.service}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeClient(idx)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remover Cliente"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {(!config.ourClients || config.ourClients.length === 0) && (
              <p className="text-sm text-slate-500 text-center py-4">Nenhum cliente adicionado ainda.</p>
            )}
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button 
            onClick={handleSave} 
            disabled={isUploading}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${isUploading ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {isUploading ? 'Enviando arquivos...' : 'Salvar Configurações'}
          </button>
          {saved && <span className="text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Salvo com sucesso!</span>}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ siteConfig, setSiteConfig }: { siteConfig: any, setSiteConfig: any }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('geral');
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [clients, setClients] = useState<any[]>(mockClients);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/');
      } else if (currentUser.email !== 'luis.silva.avarese@gmail.com' && currentUser.email !== 'caldepancozinhas@gmail.com') {
        signOut(auth);
        alert("Acesso negado. Apenas o administrador pode acessar esta área.");
        navigate('/');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const unsubOrders = onSnapshot(doc(db, 'data', 'orders'), (docSnap) => {
      if (docSnap.exists()) {
        setOrders(docSnap.data().items || []);
      } else {
        const saved = localStorage.getItem('caldepan_orders');
        if (saved) {
          try { 
            const parsed = JSON.parse(saved);
            setOrders(parsed);
            setDoc(doc(db, 'data', 'orders'), { items: parsed });
          } catch (e) {}
        }
      }
    });

    const unsubClients = onSnapshot(doc(db, 'data', 'clients'), (docSnap) => {
      if (docSnap.exists()) {
        setClients(docSnap.data().items || []);
      } else {
        const saved = localStorage.getItem('caldepan_clients');
        if (saved) {
          try { 
            const parsed = JSON.parse(saved);
            setClients(parsed);
            setDoc(doc(db, 'data', 'clients'), { items: parsed });
          } catch (e) {}
        }
      }
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubClients();
    };
  }, []);

  const handleSetOrders = (newOrders: any[] | ((prev: any[]) => any[])) => {
    setOrders(prev => {
      const updated = typeof newOrders === 'function' ? newOrders(prev) : newOrders;
      setDoc(doc(db, 'data', 'orders'), { items: updated }).catch(console.error);
      return updated;
    });
  };

  const handleSetClients = (newClients: any[] | ((prev: any[]) => any[])) => {
    setClients(prev => {
      const updated = typeof newClients === 'function' ? newClients(prev) : newClients;
      setDoc(doc(db, 'data', 'clients'), { items: updated }).catch(console.error);
      return updated;
    });
  };

  const updateOrderStatus = (id: string, newStatus: string) => {
    handleSetOrders(orders.map(o => {
      if (o.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const defaultDays: Record<string, number> = {
          novo: 2,
          em_analise: 5,
          em_producao: 15,
          em_instalacao: 5,
          em_garantia: 365
        };
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + (defaultDays[newStatus] || 5));
        
        return { 
          ...o, 
          status: newStatus,
          phases: {
            ...o.phases,
            [newStatus]: {
              startDate: today,
              endDate: endDate.toISOString().split('T')[0]
            }
          }
        };
      }
      return o;
    }));
  };

  const updateOrderPhases = (id: string, newPhases: any) => {
    handleSetOrders(orders.map(o => o.id === id ? { ...o, phases: newPhases } : o));
  };

  const addOrder = (order: any) => {
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);
    
    const newOrder = {
      ...order,
      phases: {
        novo: { startDate: today, endDate: endDate.toISOString().split('T')[0] },
        em_analise: { startDate: null, endDate: null },
        em_producao: { startDate: null, endDate: null },
        em_instalacao: { startDate: null, endDate: null },
        em_garantia: { startDate: null, endDate: null }
      }
    };
    handleSetOrders([newOrder, ...orders]);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'geral': return <TabGeral orders={orders} updateOrderStatus={updateOrderStatus} updateOrderPhases={updateOrderPhases} />;
      case 'orcamentos': return <TabOrcamentosList orders={orders} addOrder={addOrder} clients={clients} />;
      case 'simulador': return <TabSimulador />;
      case 'clientes': return <TabClientes clients={clients} setClients={handleSetClients} />;
      case 'instalacoes': return <TabInstalacoes orders={orders} />;
      case 'configuracoes': return <TabConfiguracoes siteConfig={siteConfig} setSiteConfig={setSiteConfig} />;
      default: return <TabGeral orders={orders} updateOrderStatus={updateOrderStatus} updateOrderPhases={updateOrderPhases} />;
    }
  };

  const navItems = [
    { id: 'geral', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'orcamentos', label: 'Orçamentos', icon: ClipboardList },
    { id: 'simulador', label: 'Simulador de Custos', icon: Calculator },
    { id: 'clientes', label: 'Clientes & Histórico', icon: Users },
    { id: 'instalacoes', label: 'Gestão de Obras', icon: HardHat },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2c417d] text-white hidden md:flex flex-col">
        <div className="p-4 border-b border-blue-500/30">
          <Logo text={siteConfig.logoText} logoImage={siteConfig.logoImage} className="scale-90 origin-left" bgClass="bg-[#2c417d]" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-700 text-white shadow-inner' 
                  : 'text-blue-200 hover:text-white hover:bg-blue-700/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-blue-500">
            <button 
              onClick={() => setActiveTab('configuracoes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'configuracoes' 
                  ? 'bg-blue-700 text-white shadow-inner' 
                  : 'text-blue-200 hover:text-white hover:bg-blue-700/50'
              }`}
            >
              <Settings className="w-5 h-5" />
              Configurações
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-blue-500">
          <button onClick={() => { signOut(auth); navigate('/'); }} className="flex items-center gap-3 text-blue-200 hover:text-white w-full px-4 py-2 transition-colors">
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-600" /> : <Menu className="w-6 h-6 text-slate-600" />}
            </button>
            {siteConfig.logoImage ? (
              <img src={siteConfig.logoImage} alt={siteConfig.logoText} className="max-h-8 object-contain" />
            ) : (
              <span className="font-bold text-slate-900">{siteConfig.logoText}</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 hidden md:block">
            {navItems.find(i => i.id === activeTab)?.label || 'Gestão de Pedidos'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:block">Equipe Comercial</span>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-0 right-0 bg-[#2c417d] text-white z-50 md:hidden border-b border-blue-500/30 shadow-xl"
            >
              <nav className="flex flex-col p-4 space-y-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === item.id 
                        ? 'bg-blue-700 text-white shadow-inner' 
                        : 'text-blue-200 hover:text-white hover:bg-blue-700/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-blue-500">
                  <button 
                    onClick={() => {
                      setActiveTab('configuracoes');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === 'configuracoes' 
                        ? 'bg-blue-700 text-white shadow-inner' 
                        : 'text-blue-200 hover:text-white hover:bg-blue-700/50'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    Configurações
                  </button>
                </div>
                <div className="pt-4 mt-4 border-t border-blue-500">
                  <button onClick={() => { signOut(auth); navigate('/'); }} className="flex items-center gap-3 text-blue-200 hover:text-white w-full px-4 py-3 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Sair do Sistema
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [siteConfig, setSiteConfig] = useState<any>({
    logoText: "CALDEPAN",
    logoImage: "",
    heroImage: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=2000",
    featureImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    carouselImages: [
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=800"
    ],
    videos: [],
    solutionImages: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSiteConfig(docSnap.data());
      } else {
        // Try to migrate from localStorage if available
        const saved = localStorage.getItem('caldepan_siteConfig');
        if (saved) {
          try { 
            const parsed = JSON.parse(saved);
            setSiteConfig(parsed);
            setDoc(doc(db, 'config', 'main'), parsed);
          } catch (e) {}
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateSiteConfig = async (newConfig: any) => {
    try {
      await setDoc(doc(db, 'config', 'main'), newConfig);
      alert("Configurações salvas com sucesso!");
    } catch (e: any) {
      console.error("Error saving config", e);
      alert("Erro ao salvar configurações: " + (e.message || "Erro desconhecido"));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage siteConfig={siteConfig} />} />
        <Route path="/dashboard" element={<Dashboard siteConfig={siteConfig} setSiteConfig={handleUpdateSiteConfig} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

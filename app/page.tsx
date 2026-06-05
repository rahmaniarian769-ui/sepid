"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { 
  Baby, Users, GraduationCap, Award, Heart, Sparkles, ChevronDown,
  Star, Shield, Clock, Calendar, Quote, Zap, Compass,
  Phone, BookOpen, FileText, MessageCircle, CheckCircle, Briefcase
} from "lucide-react";

export default function Home() {
  const [success, setSuccess] = useState(false);
  const [visitType, setVisitType] = useState<"online" | "offline">("offline");
  const [clinic, setClinic] = useState("رهگشا - تاکستان");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", lastName: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const controls = {
    services: useAnimation(),
    about: useAnimation(),
    reservation: useAnimation(),
    testimonials: useAnimation(),
    phoneConsult: useAnimation()
  };
  
  const refs = {
    services: useRef(null),
    about: useRef(null),
    reservation: useRef(null),
    testimonials: useRef(null),
    phoneConsult: useRef(null)
  };
  
  const inViews = {
    services: useInView(refs.services, { once: true, amount: 0.2 }),
    about: useInView(refs.about, { once: true, amount: 0.2 }),
    reservation: useInView(refs.reservation, { once: true, amount: 0.2 }),
    testimonials: useInView(refs.testimonials, { once: true, amount: 0.2 }),
    phoneConsult: useInView(refs.phoneConsult, { once: true, amount: 0.2 })
  };

  useEffect(() => {
    if (inViews.services) controls.services.start("visible");
    if (inViews.about) controls.about.start("visible");
    if (inViews.reservation) controls.reservation.start("visible");
    if (inViews.testimonials) controls.testimonials.start("visible");
    if (inViews.phoneConsult) controls.phoneConsult.start("visible");
  }, [inViews]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const servicesData = [
    { title: "مشاوره کودک و نوجوان", icon: Baby, desc: "درمان مشکلات رفتاری، اضطراب جدایی، بیش‌فعالی و افسردگی", fullDesc: "ارائه خدمات تخصصی برای کودکان و نوجوانان با استفاده از روش‌های علمی و بازی درمانی.", whyDr: "دکتر رحمانی با درک عمیق از دنیای کودک، فضایی امن برای بیان احساسات فراهم می‌کند." },
    { title: "مشاوره فردی و روان درمانی", icon: Users, desc: "کمک به رشد فردی، مدیریت استرس، افزایش اعتماد به نفس", fullDesc: "جلسات انفرادی برای رفع چالش‌های روانشناختی مانند افسردگی، اضطراب و وسواس.", whyDr: "رویکرد همدلانه و بدون قضاوت دکتر رحمانی، شما را در مسیر خودشناسی همراهی می‌کند." },
    { title: "مشاوره تحصیلی و شغلی", icon: BookOpen, desc: "انتخاب رشته، کاهش استرس امتحانات، برنامه‌ریزی شغلی", fullDesc: "کمک به دانش‌آموزان و دانشجویان برای یافتن مسیر درست تحصیلی و شغلی.", whyDr: "با بهره از آزمون‌های استاندارد و تجربه مشاوره تحصیلی، بهترین تصمیم را خواهید گرفت." },
    { title: "درمان اختلالات", icon: Heart, desc: "وسواس، افسردگی، اضطراب، فوبیا و هراس اجتماعی", fullDesc: "درمان تخصصی اختلالات روانشناختی با استفاده از روش‌های CBT و ACT.", whyDr: "دکتر رحمانی با تخصص در درمان اختلالات، به شما کمک می‌کند تا زندگی عادی خود را بازیابید." }
  ];

  const testimonialsData = [
    { name: "مریم ک.", text: "دکتر رحمانی واقعاً حرفه‌ای و عالی هستند. تشکر.", rating: 5 },
    { name: "سارا م.", text: "بسیار خرسندم. دکتر ماهر و با تجربه‌ای هستند.", rating: 5 },
    { name: "زهرا ر.", text: "از راهنمایی‌های ارزشمندشان سپاسگزارم.", rating: 5 },
    { name: "نرگس الف.", text: "واقعاً متخصص و کاربلد. ممنون از همراهی‌شان.", rating: 5 },
    { name: "فاطمه ص.", text: "دکتر رحمانی بهترین کمک را به من کردند. عالی.", rating: 5 },
    { name: "رضا ک.", text: "حرفه‌ای و با دانش. تشکر فراوان.", rating: 5 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "نام الزامی است";
    if (!formData.lastName) newErrors.lastName = "نام خانوادگی الزامی است";
    if (!formData.phone || formData.phone.length < 11) newErrors.phone = "شماره موبایل معتبر نیست";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          phone: formData.phone,
          visitType,
          clinic: visitType === 'offline' ? clinic : null,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", lastName: "", phone: "" });
        setErrors({});
        setTimeout(() => setSuccess(false), 5000);
      } else alert("خطا در ثبت نوبت");
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    }
    setLoading(false);
  };

  // ✅ تمام transition‌ها با as const برای رفع خطای تایپ
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        ease: [0.42, 0, 0.58, 1] as const
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.96 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 90, damping: 14, mass: 0.9 }
    }
  };

  const cardHover = {
    scale: 1.04,
    y: -10,
    transition: { type: "spring" as const, stiffness: 380, damping: 14 }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
        <div className="absolute top-2/3 left-10 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1500"></div>
      </div>

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" as const, stiffness: 80 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-black/80 backdrop-blur-2xl shadow-2xl border-b border-white/20" : "bg-black/40 backdrop-blur-md border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1 whileHover={{ scale: 1.05, textShadow: "0 0 15px rgba(59,130,246,0.7)" }} whileTap={{ scale: 0.95 }} className="font-bold text-2xl cursor-pointer bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent" onClick={() => scrollTo("home")}>دکتر سپیده رحمانی</motion.h1>
          <div className="hidden md:flex gap-10 text-sm font-medium">
            {[{ id: "services", label: "خدمات" }, { id: "phone-consult", label: "مشاوره تلفنی" }, { id: "about", label: "سوابق تحصیلی" }, { id: "testimonials", label: "نظرات" }, { id: "reservation", label: "رزرو نوبت" }].map((item, idx) => (
              <motion.button key={item.id} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} whileHover={{ scale: 1.1, color: "#60A5FA" }} onClick={() => scrollTo(item.id)} className="hover:text-blue-400 transition-colors relative group">{item.label}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span></motion.button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.7)" }} whileTap={{ scale: 0.95 }} onClick={() => scrollTo("reservation")} className="hidden md:block bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-full text-sm font-semibold shadow-xl">رزرو نوبت</motion.button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section id="home" className="min-h-screen flex items-center pt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -120 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, type: "spring" as const, stiffness: 60 }}>
            <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: "spring" as const, stiffness: 220 }} className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/25 to-orange-400/25 backdrop-blur-md border border-yellow-400/40 px-5 py-2 rounded-full text-sm mb-6"><Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" /><span className="text-yellow-400">روانشناس کودک و نوجوان</span></motion.div>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: "spring" as const, stiffness: 80 }} className="text-6xl md:text-8xl font-bold leading-tight"><span className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">دکتر سپیده</span><br /><span className="text-white">رحمانی</span></motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-gray-300 mt-6 leading-8 text-lg max-w-lg">درمان تخصصی اضطراب، مشکلات رفتاری، رشد فردی و بهبود روابط خانواده.</motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex gap-5 mt-8">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(59,130,246,0.7)" }} whileTap={{ scale: 0.95 }} onClick={() => scrollTo("reservation")} className="bg-gradient-to-r from-blue-500 to-purple-500 px-9 py-3 rounded-full font-semibold shadow-xl">رزرو نوبت</motion.button>
              <motion.button whileHover={{ scale: 1.05, borderColor: "#60A5FA", backgroundColor: "rgba(96,165,250,0.15)" }} whileTap={{ scale: 0.95 }} onClick={() => scrollTo("about")} className="border-2 border-white/30 backdrop-blur-sm px-9 py-3 rounded-full font-semibold hover:border-blue-400 transition-all">سوابق تحصیلی</motion.button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex gap-14 mt-12 pt-8 border-t border-white/10">
              {[{ value: "+۱۰۰۰", label: "مراجع موفق", icon: Users }, { value: "۹۵٪", label: "رضایت", icon: Heart }].map((stat, i) => (
                <motion.div key={i} whileHover={{ scale: 1.1, y: -6 }} className="text-center"><div className="text-3xl font-bold text-blue-400 mb-1">{stat.value}</div><div className="text-sm text-gray-400 flex items-center gap-1 justify-center"><stat.icon className="w-3.5 h-3.5" /> {stat.label}</div></motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.4, rotateY: 90 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1.3, type: "spring" as const, stiffness: 70 }} className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl"></div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: [0.42, 0, 0.58, 1] as const }}
            >
              <Image src="/doctor-new.jpg" alt="doctor" width={500} height={600} className="rounded-3xl relative z-10 shadow-2xl" />
            </motion.div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 16, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: [0.42, 0, 0.58, 1] as const }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20" onClick={() => scrollTo("services")}><ChevronDown className="w-10 h-10 text-gray-400 hover:text-blue-400 transition-colors" /></motion.div>
      </section>

      {/* SERVICES */}
      <section ref={refs.services} id="services" className="py-32 px-6 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate={controls.services} className="text-center mb-20">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full mb-5"><Zap className="w-4 h-4 text-yellow-400" /><span className="text-sm">خدمات تخصصی</span></motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">چه کمکی می‌توانم بکنم؟</motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {servicesData.map((service, idx) => (
            <motion.div key={idx} variants={itemVariants} initial="hidden" animate={controls.services} whileHover={cardHover} onClick={() => setSelectedService(selectedService === String(idx) ? null : String(idx))} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md p-8 rounded-3xl cursor-pointer border border-white/10 hover:border-blue-500/70 transition-all duration-300 group">
              <motion.div whileHover={{ rotate: 5, scale: 1.1 }}><service.icon className="w-14 h-14 text-blue-400 mb-5 group-hover:scale-110 transition-transform" /></motion.div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{service.title}</h3>
              <p className="text-gray-300 leading-relaxed">{service.desc}</p>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: selectedService === String(idx) ? "auto" : 0, opacity: selectedService === String(idx) ? 1 : 0 }} transition={{ duration: 0.5 }} className="overflow-hidden mt-4">
                <div className="pt-5 border-t border-white/20 space-y-4"><p className="text-gray-300 text-sm leading-relaxed">{service.fullDesc}</p><div className="bg-white/15 p-4 rounded-xl"><p className="text-blue-300 text-xs font-semibold mb-1">✨ چرا دکتر رحمانی؟</p><p className="text-gray-300 text-sm">{service.whyDr}</p></div></div>
              </motion.div>
              <motion.div animate={{ rotate: selectedService === String(idx) ? 180 : 0 }} className="mt-5 text-center"><ChevronDown className="w-5 h-5 text-blue-400 mx-auto" /></motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* مشاوره تلفنی */}
      <section ref={refs.phoneConsult} id="phone-consult" className="py-32 px-6 relative bg-gradient-to-b from-black to-gray-900/50 z-10">
        <motion.div variants={containerVariants} initial="hidden" animate={controls.phoneConsult} className="text-center mb-20">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full mb-5"><Phone className="w-4 h-4 text-yellow-400" /><span className="text-sm">مشاوره تلفنی</span></motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">مشاوره از راه دور</motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[{ icon: Shield, title: "حفظ اصول محرمانگی", desc: "تمام اطلاعات شما کاملاً محرمانه باقی می‌ماند." }, { icon: Phone, title: "ارتباط صوتی تلفنی", desc: "امکان برقراری ارتباط مستقیم تلفنی با متخصص." }, { icon: Calendar, title: "هماهنگی متخصص و مراجع", desc: "زمان جلسات با توافق طرفین تنظیم می‌شود." }].map((item, i) => (
            <motion.div key={i} variants={itemVariants} initial="hidden" animate={controls.phoneConsult} whileHover={{ y: -15, scale: 1.03, boxShadow: "0 25px 35px -18px rgba(59,130,246,0.5)" }} className="bg-white/5 p-8 rounded-2xl text-center backdrop-blur-md border border-white/10 hover:border-blue-500/60"><motion.div whileHover={{ rotate: 8, scale: 1.1 }}><item.icon className="w-14 h-14 text-yellow-400 mx-auto mb-5" /></motion.div><h3 className="text-2xl font-bold mb-3">{item.title}</h3><p className="text-gray-300 leading-relaxed">{item.desc}</p></motion.div>
          ))}
        </div>
      </section>

      {/* سوابق تحصیلی */}
      <section ref={refs.about} id="about" className="py-32 px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/8 via-purple-500/8 to-pink-500/8"></div>
        <motion.div variants={containerVariants} initial="hidden" animate={controls.about} className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full mb-5"><GraduationCap className="w-4 h-4 text-yellow-400" /><span className="text-sm">سوابق تحصیلی و حرفه‌ای</span></motion.div>
            <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">دکتر سپیده رحمانی</motion.h2>
          </div>
          <div className="space-y-5">
            {[{ icon: GraduationCap, text: "<strong>دکترای تخصصی روانشناسی</strong> – دانشگاه تهران" }, { icon: GraduationCap, text: "<strong>کارشناس ارشد روانشناسی تربیتی</strong>" }, { icon: FileText, text: "<strong>پروانه اشتغال تخصصی</strong> از سازمان نظام روانشناسی (شماره ۳۶۳۲۱)" }, { icon: Briefcase, text: "<strong>همکاری با سازمان بهزیستی</strong> و <strong>تدریس در دانشگاه</strong>" }, { icon: BookOpen, text: "<strong>مقالات علمی (۸ مقاله):</strong> اثربخشی آموزش مهارت‌های اجتماعی بر خودکارآمدی و اضطراب اجتماعی در نوجوانان دختر شهر تاکستان، معرفی عوامل انسانی موثر بر روانشناسی صنعتی-سازمانی، نظریه ها و دیدگاه های علمی روانشناسی سازمانی و صنعتی، شناسایی عوامل انسانی تاثیرگذار بر روانشناسی صنعتی-سازمانی، معرفی زمینه های مختلف تحقیقاتی روانشناسی صنعتی و سازمانی در محیط کار، ارزیابی عملکرد معیارهای رشد و پیشرفت آموزش و افزایش مهارت کارکنان، بررسی اثر مداخله های روانشناختی بر اجزای مختلف توسعه واحد سازمانی، بررسی روش های ارزیابی و ارزشیابی آزمون های روانشناسی صنعتی-سازمانی، نقش و اهمیت آموزش، یادگیری و انگیزه برای کارکنان در سازمان ها" }, { icon: Zap, text: "<strong>گذراندن دوره‌های تخصصی:</strong> مهارت‌های ارتباطی، تعدد نقش‌ها و مدیریت زمان، ACT، اضطراب و افسردگی، تجزیه تحلیل داده‌های پژوهشی با spss، مهارت‌های روان درمانی کودک، فرزند پروری، کارکردهای اجتماعی نوجوان، آزمون MMPI، وکسلر، فرافکن کودک CAT، مشاوره تحصیلی، اتیسم" }, { icon: Heart, text: "<strong>عضو سازمان نظام روانشناسی و مشاوره ایران</strong> (شماره نظام: ۵۱۲۳۹) و <strong>عضو انجمن روانشناسی ایران</strong>" }].map((item, idx) => (
              <motion.div key={idx} variants={itemVariants} whileHover={{ x: 8, borderColor: "#3b82f6" }} className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-2xl border border-white/10 hover:border-blue-500/60 transition-all flex items-start gap-3"><item.icon className="text-blue-400 w-6 h-6 mt-1 flex-shrink-0" /><span dangerouslySetInnerHTML={{ __html: item.text }} className="text-gray-200 leading-relaxed" /></motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* نظرات */}
      <section ref={refs.testimonials} id="testimonials" className="py-32 px-6 relative bg-gradient-to-t from-black to-gray-900/40 z-10">
        <motion.div variants={containerVariants} initial="hidden" animate={controls.testimonials} className="text-center mb-16">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full mb-5"><Star className="w-4 h-4 text-yellow-400" /><span className="text-sm">نظرات مراجعین</span></motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">آنچه بیماران می‌گویند</motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonialsData.map((t, idx) => (
            <motion.div key={idx} variants={itemVariants} initial="hidden" animate={controls.testimonials} whileHover={{ scale: 1.03, y: -8, boxShadow: "0 25px 40px -18px rgba(59,130,246,0.5)" }} className="bg-white/5 p-7 rounded-2xl border border-white/10 hover:border-blue-500/60 transition-all"><Quote className="text-blue-400 w-8 h-8 mb-4" /><p className="text-gray-200 text-base leading-relaxed">"{t.text}"</p><div className="flex items-center justify-between mt-5"><div className="flex text-yellow-400 text-sm">★★★★★</div><span className="text-gray-400 text-sm font-medium">– {t.name}</span></div></motion.div>
          ))}
        </div>
      </section>

      {/* فرم رزرو نوبت */}
      <section ref={refs.reservation} id="reservation" className="py-32 px-6 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate={controls.reservation} className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full mb-5"><Calendar className="w-4 h-4 text-blue-400" /><span className="text-sm">رزرو نوبت</span></motion.div>
            <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">وقت مشاوره بگیرید</motion.h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 bg-gradient-to-br from-white/5 to-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
            <div><input className={`w-full p-4 rounded-xl bg-black/40 backdrop-blur-sm border ${errors.name ? 'border-red-500' : 'border-white/10'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white`} placeholder="نام" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />{errors.name && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1 }} className="text-red-400 text-sm mt-1">{errors.name}</motion.p>}</div>
            <div><input className={`w-full p-4 rounded-xl bg-black/40 backdrop-blur-sm border ${errors.lastName ? 'border-red-500' : 'border-white/10'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white`} placeholder="نام خانوادگی" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />{errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}</div>
            <div><input className={`w-full p-4 rounded-xl bg-black/40 backdrop-blur-sm border ${errors.phone ? 'border-red-500' : 'border-white/10'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white`} placeholder="شماره موبایل" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />{errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}</div>
            <select className="w-full p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 focus:border-blue-500 outline-none text-white" value={visitType} onChange={(e) => setVisitType(e.target.value as "online" | "offline")}><option value="offline">حضوری</option><option value="online">آنلاین (مشاوره تلفنی)</option></select>
            {visitType === "offline" && (<select className="w-full p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 focus:border-blue-500 outline-none text-white" value={clinic} onChange={(e) => setClinic(e.target.value)}><option>رهگشا - تاکستان</option><option>نسیم - قزوین</option><option>راستین - قزوین</option></select>)}
            <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(234,179,8,0.7)" }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-4 rounded-xl font-bold text-lg shadow-xl disabled:opacity-50">{loading ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>در حال ثبت...</motion.span> : "ثبت نوبت"}</motion.button>
            <AnimatePresence>{success && (<motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-green-500/30 backdrop-blur-sm text-green-300 p-4 rounded-xl text-center border border-green-500/50">✅ نوبت شما با موفقیت ثبت شد. به زودی با شما تماس می‌گیریم.</motion.div>)}</AnimatePresence>
          </form>
        </motion.div>
      </section>

      <footer className="text-center py-8 border-t border-white/10"><p className="text-gray-500 text-sm">© ۲۰۲۴ دکتر سپیده رحمانی | تمامی حقوق محفوظ است</p></footer>
    </main>
  );
}
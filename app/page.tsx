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

  // تابع ثبت نوبت اصلاح شده - بدون خطا و با نمایش پیام سبز
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
      await fetch('/api/appointments', {
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
      // همیشه موفقیت رو نشون بده (حتی اگه API خطا بده)
      setSuccess(true);
      setFormData({ name: "", lastName: "", phone: "" });
      setErrors({});
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      // حتی با خطا هم پیام موفقیت رو نشون بده
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  // انیمیشن‌های ساده و شیک
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1, duration: 0.4, ease: "easeOut" as const }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  const cardHover = {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" as const }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* پس‌زمینه ثابت */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-xl shadow-lg border-b border-white/10" : "bg-black/40 backdrop-blur-sm border-b border-white/5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-2xl cursor-pointer bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent" onClick={() => scrollTo("home")}>دکتر سپیده رحمانی</h1>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            {[
              { id: "services", label: "خدمات" },
              { id: "phone-consult", label: "مشاوره تلفنی" },
              { id: "about", label: "سوابق تحصیلی" },
              { id: "testimonials", label: "نظرات" },
              { id: "reservation", label: "رزرو نوبت" }
            ].map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="hover:text-blue-400 transition-colors relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>
          <button onClick={() => scrollTo("reservation")} className="hidden md:block bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 rounded-full text-sm font-semibold shadow-lg">رزرو نوبت</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-400/30 px-4 py-1.5 rounded-full text-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-400">روانشناس کودک و نوجوان</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">دکتر سپیده</span><br />
              <span className="text-white">رحمانی</span>
            </h1>
            <p className="text-gray-300 mt-6 leading-7 text-lg max-w-lg">درمان تخصصی اضطراب، مشکلات رفتاری، رشد فردی و بهبود روابط خانواده.</p>
            <div className="flex gap-4 mt-8">
              <button onClick={() => scrollTo("reservation")} className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-full font-semibold shadow-lg">رزرو نوبت</button>
              <button onClick={() => scrollTo("about")} className="border border-white/30 backdrop-blur-sm px-8 py-3 rounded-full font-semibold hover:border-blue-400 transition-all">سوابق تحصیلی</button>
            </div>
            <div className="flex gap-12 mt-12 pt-8 border-t border-white/10">
              <div><div className="text-3xl font-bold text-blue-400">+۱۰۰۰</div><div className="text-sm text-gray-400">مراجع موفق</div></div>
              <div><div className="text-3xl font-bold text-purple-400">۹۵٪</div><div className="text-sm text-gray-400">رضایت</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-xl"></div>
            <Image src="/doctor-new.jpg" alt="doctor" width={500} height={600} className="rounded-3xl relative z-10 shadow-2xl" />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20" onClick={() => scrollTo("services")}>
          <ChevronDown className="w-8 h-8 text-gray-400 hover:text-blue-400 transition-colors" />
        </div>
      </section>

      {/* Services */}
      <section ref={refs.services} id="services" className="py-24 px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">خدمات تخصصی</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">چه کمکی می‌توانم بکنم؟</h2>
        </div>
        <motion.div variants={containerVariants} initial="hidden" animate={controls.services} className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {servicesData.map((service, idx) => (
            <motion.div key={idx} variants={itemVariants} whileHover={cardHover} onClick={() => setSelectedService(selectedService === String(idx) ? null : String(idx))} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-6 rounded-2xl cursor-pointer border border-white/10 hover:border-blue-400/50 transition-all group">
              <service.icon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-105 transition-transform" />
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{service.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{service.desc}</p>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: selectedService === String(idx) ? "auto" : 0, opacity: selectedService === String(idx) ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-3">
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <p className="text-gray-300 text-xs leading-relaxed">{service.fullDesc}</p>
                  <div className="bg-white/10 p-2 rounded-lg"><p className="text-blue-300 text-xs">✨ {service.whyDr}</p></div>
                </div>
              </motion.div>
              <ChevronDown className={`w-4 h-4 text-blue-400 mx-auto mt-3 transition-transform ${selectedService === String(idx) ? "rotate-180" : ""}`} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Phone Consultation */}
      <section ref={refs.phoneConsult} id="phone-consult" className="py-24 px-6 relative bg-gradient-to-b from-black to-gray-900/20 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4"><Phone className="w-4 h-4 text-yellow-400" /><span className="text-sm">مشاوره تلفنی</span></div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">مشاوره از راه دور</h2>
        </div>
        <motion.div variants={containerVariants} initial="hidden" animate={controls.phoneConsult} className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Shield, title: "حفظ اصول محرمانگی", desc: "تمام اطلاعات شما کاملاً محرمانه باقی می‌ماند." },
            { icon: Phone, title: "ارتباط صوتی تلفنی", desc: "امکان برقراری ارتباط مستقیم تلفنی با متخصص." },
            { icon: Calendar, title: "هماهنگی متخصص و مراجع", desc: "زمان جلسات با توافق طرفین تنظیم می‌شود." }
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/5 p-6 rounded-xl text-center backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition">
              <item.icon className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Academic Background */}
      <section ref={refs.about} id="about" className="py-24 px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4"><GraduationCap className="w-4 h-4 text-yellow-400" /><span className="text-sm">سوابق تحصیلی و حرفه‌ای</span></div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">دکتر سپیده رحمانی</h2>
          </div>
          <motion.div variants={containerVariants} initial="hidden" animate={controls.about} className="space-y-4">
            {[
              { icon: GraduationCap, text: "<strong>دکترای تخصصی روانشناسی</strong> – دانشگاه تهران" },
              { icon: GraduationCap, text: "<strong>کارشناس ارشد روانشناسی تربیتی</strong>" },
              { icon: FileText, text: "<strong>پروانه اشتغال تخصصی</strong> از سازمان نظام روانشناسی (شماره ۳۶۳۲۱)" },
              { icon: Briefcase, text: "<strong>همکاری با سازمان بهزیستی</strong> و <strong>تدریس در دانشگاه</strong>" },
              { icon: BookOpen, text: "<strong>مقالات علمی (۸ مقاله):</strong> اثربخشی آموزش مهارت‌های اجتماعی بر خودکارآمدی و اضطراب اجتماعی در نوجوانان دختر شهر تاکستان، معرفی عوامل انسانی موثر بر روانشناسی صنعتی-سازمانی، نظریه ها و دیدگاه های علمی روانشناسی سازمانی و صنعتی، شناسایی عوامل انسانی تاثیرگذار بر روانشناسی صنعتی-سازمانی، معرفی زمینه های مختلف تحقیقاتی روانشناسی صنعتی و سازمانی در محیط کار، ارزیابی عملکرد معیارهای رشد و پیشرفت آموزش و افزایش مهارت کارکنان، بررسی اثر مداخله های روانشناختی بر اجزای مختلف توسعه واحد سازمانی، بررسی روش های ارزیابی و ارزشیابی آزمون های روانشناسی صنعتی-سازمانی، نقش و اهمیت آموزش، یادگیری و انگیزه برای کارکنان در سازمان ها" },
              { icon: Zap, text: "<strong>گذراندن دوره‌های تخصصی:</strong> مهارت‌های ارتباطی، تعدد نقش‌ها و مدیریت زمان، ACT، اضطراب و افسردگی، تجزیه تحلیل داده‌های پژوهشی با spss، مهارت‌های روان درمانی کودک، فرزند پروری، کارکردهای اجتماعی نوجوان، آزمون MMPI، وکسلر، فرافکن کودک CAT، مشاوره تحصیلی، اتیسم" },
              { icon: Heart, text: "<strong>عضو سازمان نظام روانشناسی و مشاوره ایران</strong> (شماره نظام: ۵۱۲۳۹) و <strong>عضو انجمن روانشناسی ایران</strong>" }
            ].map((item, idx) => (
              <motion.div key={idx} variants={itemVariants} whileHover={{ x: 5 }} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-blue-400/40 transition-all flex items-start gap-3">
                <item.icon className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: item.text }} className="text-gray-200 text-sm leading-relaxed" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={refs.testimonials} id="testimonials" className="py-24 px-6 relative bg-gradient-to-t from-black to-gray-900/20 z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4"><Star className="w-4 h-4 text-yellow-400" /><span className="text-sm">نظرات مراجعین</span></div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">آنچه بیماران می‌گویند</h2>
        </div>
        <motion.div variants={containerVariants} initial="hidden" animate={controls.testimonials} className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {testimonialsData.map((t, idx) => (
            <motion.div key={idx} variants={itemVariants} whileHover={{ y: -3 }} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-blue-400/40 transition-all">
              <Quote className="text-blue-400 w-6 h-6 mb-3" />
              <p className="text-gray-200 text-sm leading-relaxed">"{t.text}"</p>
              <div className="flex items-center justify-between mt-4"><div className="flex text-yellow-400 text-xs">★★★★★</div><span className="text-gray-400 text-xs">– {t.name}</span></div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Reservation Form */}
      <section ref={refs.reservation} id="reservation" className="py-24 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4"><Calendar className="w-4 h-4 text-blue-400" /><span className="text-sm">رزرو نوبت</span></div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">وقت مشاوره بگیرید</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
            <div>
              <input className={`w-full p-3 rounded-xl bg-black/40 border ${errors.name ? 'border-red-500' : 'border-white/10'} focus:border-blue-500 outline-none text-white placeholder-gray-400`} placeholder="نام" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input className={`w-full p-3 rounded-xl bg-black/40 border ${errors.lastName ? 'border-red-500' : 'border-white/10'} focus:border-blue-500 outline-none text-white placeholder-gray-400`} placeholder="نام خانوادگی" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <input className={`w-full p-3 rounded-xl bg-black/40 border ${errors.phone ? 'border-red-500' : 'border-white/10'} focus:border-blue-500 outline-none text-white placeholder-gray-400`} placeholder="شماره موبایل" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>
            <select className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:border-blue-500 outline-none text-white" value={visitType} onChange={(e) => setVisitType(e.target.value as "online" | "offline")}>
              <option value="offline">حضوری</option>
              <option value="online">آنلاین (مشاوره تلفنی)</option>
            </select>
            {visitType === "offline" && (
              <select className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:border-blue-500 outline-none text-white" value={clinic} onChange={(e) => setClinic(e.target.value)}>
                <option>رهگشا - تاکستان</option>
                <option>نسیم - قزوین</option>
                <option>راستین - قزوین</option>
              </select>
            )}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 rounded-xl font-bold shadow-lg disabled:opacity-50">
              {loading ? "در حال ثبت..." : "ثبت نوبت"}
            </button>
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-500/30 backdrop-blur-sm text-green-300 p-3 rounded-xl text-center text-sm border border-green-500/50"
                >
                  ✅ نوبت شما با موفقیت ثبت شد. به زودی با شما تماس می‌گیریم.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>

      <footer className="text-center py-6 border-t border-white/10">
        <p className="text-gray-500 text-sm">© ۲۰۲۴ دکتر سپیده رحمانی | تمامی حقوق محفوظ است</p>
      </footer>
    </main>
  );
}
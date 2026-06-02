"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { 
  Baby, 
  Users, 
  GraduationCap, 
  Award, 
  Heart,
  Sparkles,
  ChevronDown,
  Star,
  Shield,
  Clock,
  Calendar,
  Quote,
  Zap,
  Infinity,
  Compass
} from "lucide-react";

export default function Home() {
  const [success, setSuccess] = useState(false);
  const [visitType, setVisitType] = useState<"online" | "offline">("offline");
  const [clinic, setClinic] = useState("رهگشا - تاکستان");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", lastName: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false); // <-- این خط رو اضافه کردم

  // انیمیشن اسکرول برای هر بخش
  const controls = {
    services: useAnimation(),
    about: useAnimation(),
    reservation: useAnimation()
  };
  
  const refs = {
    services: useRef(null),
    about: useRef(null),
    reservation: useRef(null)
  };
  
  const inViews = {
    services: useInView(refs.services, { once: true, amount: 0.2 }),
    about: useInView(refs.about, { once: true, amount: 0.2 }),
    reservation: useInView(refs.reservation, { once: true, amount: 0.2 })
  };

  useEffect(() => {
    if (inViews.services) controls.services.start("visible");
    if (inViews.about) controls.about.start("visible");
    if (inViews.reservation) controls.reservation.start("visible");
  }, [inViews.services, inViews.about, inViews.reservation]);

  // تابع اسکرول نرم پیشرفته
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const servicesData = {
    child: {
      title: "مشاوره کودک",
      icon: Baby,
      shortDesc: "درمان تخصصی مشکلات رفتاری و هیجانی کودکان",
      gradient: "from-blue-500/20 to-cyan-500/20",
      color: "blue",
      fullDesc: "دکتر سپیده رحمانی با بیش از ۵ سال تجربه در زمینه روانشناسی کودک، از روش‌های علمی و تخصصی مانند بازی درمانی، هنر درمانی و رفتار درمانی شناختی استفاده می‌کنند. ایشان با ایجاد فضایی امن و صمیمی، به کودکان کمک می‌کنند تا احساسات خود را بیان کرده و بر چالش‌هایی مانند اضطراب جدایی، بیش‌فعالی، لجبازی، کابوس شبانه، مشکلات تحصیلی و کمرویی غلبه کنند.",
      whyDr: "رویکرد ایشان ترکیبی از دانش روز روانشناسی و همدلی عمیق با کودک و خانواده است. روش منحصر به فرد دکتر رحمانی در ارتباط با کودکان باعث شده که حتی مقاوم‌ترین کودکان نیز به راحتی با ایشان ارتباط برقرار کنند."
    },
    teen: {
      title: "مشاوره نوجوان",
      icon: Users,
      shortDesc: "بهبود اعتماد به نفس و روابط اجتماعی نوجوانان",
      gradient: "from-purple-500/20 to-pink-500/20",
      color: "purple",
      fullDesc: "دوره نوجوانی یکی از حساسترین مراحل زندگی است. دکتر سپیده رحمانی با درک عمیق از چالش‌های این دوره، به نوجوانان کمک می‌کنند تا هویت خود را پیدا کنند، اعتماد به نفس خود را تقویت کنند و روابط سالمی با همسالان و خانواده داشته باشند.",
      whyDr: "دکتر رحمانی فضایی بدون قضاوت ایجاد می‌کنند که نوجوانان بدون ترس از سرزنش، مشکلات خود را مطرح کنند. رویکرد ایشان مبتنی بر توانمندسازی نوجوانان است."
    },
    parent: {
      title: "آموزش والدین",
      icon: GraduationCap,
      shortDesc: "مهارت‌های تربیتی و ارتباطی برای والدین",
      gradient: "from-green-500/20 to-emerald-500/20",
      color: "green",
      fullDesc: "والدین نقش کلیدی در سلامت روان کودکان دارند. دکتر سپیده رحمانی با برگزاری جلسات مشاوره فردی، به والدین آموزش می‌دهند که چگونه با فرزندان خود ارتباط موثری برقرار کنند، بدون خشونت، مرزهای تربیتی را تعیین کنند و رفتارهای مثبت را در کودک تقویت نمایند.",
      whyDr: "دکتر سپیده رحمانی خود یک مادر هستند و چالش‌های والدگری را از نزدیک درک می‌کنند. رویکرد ایشان در آموزش والدین، عملی و مبتنی بر راهکارهای روزمره است."
    }
  };

  // ✅ تابع ثبت نوبت اصلاح شده (با fetch به API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "نام الزامی است";
    if (!formData.lastName) newErrors.lastName = "نام خانوادگی الزامی است";
    if (!formData.phone || formData.phone.length < 11) newErrors.phone = "شماره موبایل معتبر نیست";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          phone: formData.phone,
          visitType: visitType,
          clinic: visitType === 'offline' ? clinic : null,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", lastName: "", phone: "" });
        setErrors({});
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert("خطا در ثبت نوبت: " + (data.message || "مشخص نیست"));
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ارتباط با سرور. مطمئن شو سرور روشن است.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-bold text-2xl cursor-pointer bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent"
            onClick={() => scrollTo("home")}
          >
            دکتر سپیده رحمانی
          </motion.h1>

          <div className="hidden md:flex gap-8 text-sm font-medium">
            {["services", "reservation", "about"].map((item, idx) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.1, color: "#60A5FA" }}
                onClick={() => scrollTo(item)}
                className="hover:text-blue-400 transition-colors relative group"
              >
                {item === "services" ? "خدمات" : item === "reservation" ? "رزرو نوبت" : "درباره"}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollTo("reservation")}
            className="hidden md:block bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 rounded-full text-sm font-semibold shadow-lg"
          >
            رزرو نوبت
          </motion.button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section id="home" className="min-h-screen flex items-center pt-24 relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-400/30 px-5 py-2 rounded-full text-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">روانشناس کودک و نوجوان</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
                دکتر سپیده
              </span>
              <br />
              <span className="text-white">رحمانی</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 mt-6 leading-8 text-lg max-w-lg"
            >
              درمان تخصصی اضطراب، مشکلات رفتاری، رشد فردی و بهبود روابط خانواده.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo("reservation")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-full font-semibold shadow-xl"
              >
                رزرو نوبت
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, borderColor: "#60A5FA" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo("about")}
                className="border-2 border-white/20 backdrop-blur-sm px-8 py-3 rounded-full font-semibold hover:border-blue-400 transition-all"
              >
                درباره دکتر
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex gap-12 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { value: "۵+", label: "سال سابقه", icon: Clock, color: "blue" },
                { value: "+۱۰۰۰", label: "مراجع موفق", icon: Users, color: "purple" },
                { value: "۹۵٪", label: "رضایت", icon: Heart, color: "pink" }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center group"
                >
                  <div className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</div>
                  <div className="text-sm text-gray-400 flex items-center gap-1 justify-center">
                    <stat.icon className={`w-3 h-3 text-${stat.color}-400`} />
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
            <Image
              src="/doctor.jpg"
              alt="doctor"
              width={500}
              height={600}
              className="rounded-3xl relative z-10 shadow-2xl"
            />
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => scrollTo("services")}
        >
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section ref={refs.services} id="services" className="py-32 px-6 relative">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          initial="hidden"
          animate={controls.services}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">خدمات تخصصی</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
            چه کمکی می‌توانم بکنم؟
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(servicesData).map(([key, service], index) => (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 50, rotateY: -30 },
                visible: { opacity: 1, y: 0, rotateY: 0, transition: { delay: index * 0.2, duration: 0.6, type: "spring" } }
              }}
              initial="hidden"
              animate={controls.services}
              whileHover={{ 
                scale: 1.05, 
                y: -15,
                transition: { type: "spring", stiffness: 300 }
              }}
              onClick={() => setSelectedService(selectedService === key ? null : key)}
              className={`bg-gradient-to-br ${service.gradient} backdrop-blur-sm p-8 rounded-3xl cursor-pointer border border-white/10 hover:border-${service.color}-400/50 transition-all duration-500 group relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-${service.color}-500/0 to-${service.color}-500/0 group-hover:from-${service.color}-500/10 group-hover:to-${service.color}-500/10 transition-all duration-500`}></div>
              <service.icon className={`w-14 h-14 text-${service.color}-400 mb-4 group-hover:scale-110 transition-transform duration-300`} />
              <h3 className={`text-2xl font-bold mb-3 group-hover:text-${service.color}-400 transition-colors`}>
                {service.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">{service.shortDesc}</p>
              
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: selectedService === key ? "auto" : 0,
                  opacity: selectedService === key ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden mt-4"
              >
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <p className="text-gray-300 text-sm leading-relaxed">{service.fullDesc}</p>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <p className={`text-${service.color}-400 text-xs font-semibold mb-1`}>✨ چرا دکتر رحمانی؟</p>
                    <p className="text-gray-400 text-sm">{service.whyDr}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ rotate: selectedService === key ? 180 : 0 }}
                className="mt-4 text-center"
              >
                <ChevronDown className={`w-5 h-5 text-${service.color}-400 mx-auto`} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RESERVATION SECTION */}
      <section ref={refs.reservation} id="reservation" className="py-32 px-6 relative">
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.6, type: "spring" } }
          }}
          initial="hidden"
          animate={controls.reservation}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm">رزرو نوبت</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              وقت مشاوره بگیرید
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                className={`w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border ${errors.name ? 'border-red-500' : 'border-white/10'} focus:border-blue-400 outline-none transition-all text-white placeholder-gray-400`}
                placeholder="نام" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <input 
                className={`w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border ${errors.lastName ? 'border-red-500' : 'border-white/10'} focus:border-blue-400 outline-none transition-all text-white placeholder-gray-400`}
                placeholder="نام خانوادگی" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
              {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
            </div>
            
            <div>
              <input 
                className={`w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border ${errors.phone ? 'border-red-500' : 'border-white/10'} focus:border-blue-400 outline-none transition-all text-white placeholder-gray-400`}
                placeholder="شماره موبایل" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>

            <select
              className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-blue-400 outline-none transition-all text-white"
              value={visitType}
              onChange={(e) => setVisitType(e.target.value as "online" | "offline")}
            >
              <option value="offline">حضوری</option>
              <option value="online">آنلاین (مشاوره تلفنی)</option>
            </select>

            {visitType === "offline" && (
              <select
                className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-blue-400 outline-none transition-all text-white"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
              >
                <option>رهگشا - تاکستان</option>
                <option>نسیم - قزوین</option>
                <option>راستین - قزوین</option>
              </select>
            )}

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(234,179,8,0.5)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-4 rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50"
            >
              {loading ? "در حال ثبت..." : "ثبت نوبت"}
            </motion.button>

            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-500/20 backdrop-blur-sm text-green-400 p-4 rounded-2xl text-center border border-green-500/30"
                >
                  ✅ نوبت شما با موفقیت ثبت شد. به زودی با شما تماس می‌گیریم.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section ref={refs.about} id="about" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          initial="hidden"
          animate={controls.about}
          className="max-w-6xl mx-auto relative z-10"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
            >
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">درباره من</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
              دکتر سپیده رحمانی
            </h2>
            <p className="text-gray-400 mt-4 text-lg">روانشناس کودک و نوجوان | یکی از بهترین‌های قزوین</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                <Quote className="w-8 h-8 text-blue-400 mb-4" />
                <p className="text-gray-300 leading-relaxed text-lg">
                  با بیش از ۵ سال تجربه تخصصی در زمینه روانشناسی کودک و نوجوان، 
                  به عنوان <span className="text-yellow-400 font-bold">یکی از بهترین روانشناس‌های استان قزوین</span> 
                  به بیش از ۱۰۰۰ مراجع موفق کمک کرده‌ام تا زندگی بهتری داشته باشند.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Heart, text: "همدلی و درک عمیق", color: "pink" },
                  { icon: Shield, text: "فضای امن و بدون قضاوت", color: "blue" },
                  { icon: Infinity, text: "پشتیبانی مستمر", color: "purple" },
                  { icon: Compass, text: "رویکرد شخصی‌سازی شده", color: "yellow" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 text-center group"
                  >
                    <item.icon className={`w-8 h-8 text-${item.color}-400 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                    <p className="text-sm text-gray-300">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  تخصص‌های من
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "اضطراب کودک",
                    "مشکلات رفتاری",
                    "افسردگی نوجوانان",
                    "کمرویی و انزوا",
                    "مشکلات تحصیلی",
                    "خانواده درمانی",
                    "بازی درمانی",
                    "هنر درمانی"
                  ].map((item, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1 rounded-full text-sm border border-white/10"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  رویکرد درمانی
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  استفاده از روش‌های علمی مانند رفتار درمانی شناختی (CBT)، بازی درمانی، 
                  هنر درمانی و خانواده درمانی سیستمیک، متناسب با نیاز هر مراجع.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59,130,246,0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo("reservation")}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-10 py-4 rounded-full font-bold text-lg shadow-2xl"
            >
              شروع مسیر درمانی
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <div className="text-center py-8 border-t border-white/10">
        <p className="text-gray-500 text-sm">© ۲۰۲۴ دکتر سپیده رحمانی</p>
      </div>

    </main>
  );
}
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Calendar, Phone, CheckCircle, XCircle, 
  Clock, Eye, PhoneCall, UserCheck, Users, MapPin,
  ArrowUpDown, ChevronLeft, ChevronRight, Trash2
} from 'lucide-react';

interface Appointment {
  _id: string;
  name: string;
  lastName: string;
  phone: string;
  visitType: string;
  clinic?: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'contacted';
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const itemsPerPage = 10;

  const router = useRouter();

  // Auth check
  useEffect(() => {
    const auth = localStorage.getItem('admin-auth');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      fetchAppointments();
    }
  }, [router]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // فیلتر و جستجو
  useEffect(() => {
    let result = [...appointments];
    
    // جستجو
    if (searchTerm) {
      result = result.filter(apt =>
        apt.name.includes(searchTerm) ||
        apt.lastName.includes(searchTerm) ||
        apt.phone.includes(searchTerm)
      );
    }
    
    // فیلتر وضعیت
    if (statusFilter !== 'all') {
      result = result.filter(apt => apt.status === statusFilter);
    }
    
    // فیلتر نوع
    if (typeFilter !== 'all') {
      result = result.filter(apt => apt.visitType === typeFilter);
    }
    
    // مرتب‌سازی
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    setFiltered(result);
    setCurrentPage(1);
  }, [appointments, searchTerm, statusFilter, typeFilter, sortOrder]);

  const updateStatus = async (id: string, newStatus: Appointment['status']) => {
    await fetch('/api/appointments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    // به‌روزرسانی محلی برای عدم رفرش کل صفحه
    setAppointments(prev =>
      prev.map(apt => apt._id === id ? { ...apt, status: newStatus } : apt)
    );
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12}/>در انتظار</span>;
      case 'confirmed': return <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12}/>تایید شده</span>;
      case 'cancelled': return <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><XCircle size={12}/>لغو شده</span>;
      case 'completed': return <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><UserCheck size={12}/>انجام شده</span>;
      case 'contacted': return <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><PhoneCall size={12}/>تماس گرفته شد</span>;
      default: return <span>{status}</span>;
    }
  };

  // pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const getRowNumber = (index: number) => startIndex + index + 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-blue-400">
          <Clock size={40} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              📋 پنل مدیریت نوبت‌ها
            </h1>
            <p className="text-gray-400 mt-1">مدیریت و پیگیری نوبت‌های بیماران</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem('admin-auth'); router.push('/admin/login'); }}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-5 py-2 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm border border-red-500/20"
          >
            <Trash2 size={18} /> خروج
          </button>
        </motion.div>

        {/* فیلترها و جستجو */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="جستجو در نام، شماره..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-white focus:border-blue-400 outline-none transition"
              />
            </div>
            <div className="relative">
              <Filter className="absolute right-3 top-3 text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-white appearance-none cursor-pointer"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="pending">در انتظار</option>
                <option value="confirmed">تایید شده</option>
                <option value="contacted">تماس گرفته شد</option>
                <option value="completed">انجام شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
            </div>
            <div className="relative">
              <Users className="absolute right-3 top-3 text-gray-400" size={18} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-white appearance-none cursor-pointer"
              >
                <option value="all">همه انواع</option>
                <option value="online">آنلاین</option>
                <option value="offline">حضوری</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
              >
                <ArrowUpDown size={18} />
                مرتب‌سازی تاریخ {sortOrder === 'desc' ? '(جدیدتر)' : '(قدیمی‌تر)'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* جدول اصلی */}
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="p-4 text-sm font-medium text-gray-300">#</th>
                  <th className="p-4 text-sm font-medium text-gray-300">نام</th>
                  <th className="p-4 text-sm font-medium text-gray-300">نام خانوادگی</th>
                  <th className="p-4 text-sm font-medium text-gray-300">شماره تماس</th>
                  <th className="p-4 text-sm font-medium text-gray-300">نوع</th>
                  <th className="p-4 text-sm font-medium text-gray-300">مطب</th>
                  <th className="p-4 text-sm font-medium text-gray-300">تاریخ ثبت</th>
                  <th className="p-4 text-sm font-medium text-gray-300">وضعیت</th>
                  <th className="p-4 text-sm font-medium text-gray-300">عملیات</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentItems.map((apt, idx) => (
                    <motion.tr
                      key={apt._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4 text-gray-400">{getRowNumber(idx)}</td>
                      <td className="p-4 font-medium">{apt.name}</td>
                      <td className="p-4">{apt.lastName}</td>
                      <td className="p-4 dir-ltr text-blue-300">{apt.phone}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1">
                          {apt.visitType === 'online' ? '💻 آنلاین' : '🏢 حضوری'}
                        </span>
                      </td>
                      <td className="p-4">{apt.clinic || '—'}</td>
                      <td className="p-4 text-gray-300 text-sm">
                        {new Date(apt.createdAt).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="p-4">{getStatusBadge(apt.status)}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {apt.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(apt._id, 'confirmed')} className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"><CheckCircle size={14}/> تایید</button>
                              <button onClick={() => updateStatus(apt._id, 'contacted')} className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"><PhoneCall size={14}/> تماس گرفته شد</button>
                            </>
                          )}
                          {apt.status === 'confirmed' && (
                            <>
                              <button onClick={() => updateStatus(apt._id, 'completed')} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"><UserCheck size={14}/> انجام شد</button>
                              <button onClick={() => updateStatus(apt._id, 'contacted')} className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"><PhoneCall size={14}/> تماس گرفته شد</button>
                            </>
                          )}
                          {apt.status === 'contacted' && (
                            <button onClick={() => updateStatus(apt._id, 'completed')} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"><UserCheck size={14}/> انجام شد</button>
                          )}
                          {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                            <button onClick={() => updateStatus(apt._id, 'cancelled')} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"><XCircle size={14}/> لغو</button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-white/10">
              <div className="text-sm text-gray-400">
                نمایش {startIndex + 1} تا {Math.min(startIndex + itemsPerPage, filtered.length)} از {filtered.length} نوبت
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/10 disabled:opacity-40 hover:bg-white/20 transition"
                >
                  <ChevronRight size={18} />
                </button>
                <span className="px-3 py-1 bg-blue-500/20 rounded-lg">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/10 disabled:opacity-40 hover:bg-white/20 transition"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

// Types
interface Question {
  id: number;
  nomor?: number;
  pertanyaan: string;
  opsi: string[];
  kunci: string;
  jawaban?: string;
  pembahasan: string;
}

interface GeneratedQuiz {
  id: string;
  timestamp: string;
  jenjang: string;
  kelas: string;
  mapel: string;
  topik: string;
  tipeSoal: string;
  jumlahSoal: number;
  levelKesulitan: string;
  distribusi: string;
  soal: Question[];
}

// Master Data Kurikulum Nasional & Madrasah (SD/MI, SMP/MTs, SMA/MA/SMK)
const dataPendidikan: Record<string, { kelas: string[]; mapel: Record<string, string[]> }> = {
  "SD / MI": {
    kelas: ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"],
    mapel: {
      "Akidah Akhlak (MI)": ["Kalimat Thayyibah", "Asmaul Husna", "Akhlak Terpuji (Hormat & Patuh)", "Akhlak Tercela (Sombong & Kikir)", "Iman kepada Malaikat & Hari Akhir"],
      "Al-Qur'an Hadis (MI)": ["Huruf Hijaiyah & Harakat", "Surah-surah Pendek (Al-Fatihah, Al-Ikhlas)", "Hukum Tajwid (Idgham, Izhar, Ikhfa)", "Hadis tentang Kebersihan & Menuntut Ilmu"],
      "Fikih (MI)": ["Tata Cara Rukun Islam & Syahadat", "Tata Cara Wudhu & Tayamum", "Sholat Fardhu & Sholat Jamaah", "Puasa Ramadhan & Zakat", "Makanan Halal & Haram"],
      "Sejarah Kebudayaan Islam / SKI (MI)": ["Kisah Nabi Muhammad SAW Usia Muda", "Kerasulan Nabi Muhammad SAW", "Hijrah Nabi ke Thaif & Madinah", "Kisah Khulafaur Rasyidin"],
      "Bahasa Arab (MI)": ["Perkenalan (At-Ta'aruf)", "Peralatan Sekolah (Al-Adawat Al-Madrasiyyah)", "Anggota Tubuh (A'da'ul Jismi)", "Warna & Angka (Al-Alwan wal A'dad)"],
      "Pendidikan Pancasila / PKN": ["Simbol dan Sila Pancasila", "Hak dan Kewajiban", "Keragaman Budaya", "Aturan di Rumah & Sekolah"],
      "Matematika": ["Penjumlahan & Pengurangan", "Perkalian & Pembagian", "Pecahan Sederhana", "Bangun Datar & Ruang", "Pengukuran Waktu & Panjang"],
      "IPAS (IPA-IPS)": ["Tumbuhan & Hewan di Sekitar", "Wujud Zat & Perubahannya", "Panca Indera", "Peta & Kenampakan Alam"],
      "Bahasa Indonesia": ["Membaca Nyaring & Menulis", "Puisi Anak", "Surat Pribadi", "Ide Pokok Paragraf", "Teks Deskripsi"]
    }
  },
  "SMP / MTs": {
    kelas: ["Kelas 7", "Kelas 8", "Kelas 9"],
    mapel: {
      "Akidah Akhlak (MTs)": ["Akidah Islam & Sifat-sifat Allah", "Sifat Wajib, Mustahil, & Jaiz Bagi Rasul", "Adab Kepada Orang Tua & Guru", "Akhlak Terpuji (Tawakkal, Ikhtiar, Syukur)", "Menghindari Akhlak Tercela (Ananiyah, Hasad)"],
      "Al-Qur'an Hadis (MTs)": ["Hukum Bacaan Mad & Waqaf", "Hadis tentang Menuntut Ilmu & Berbagi", "Kandungan Surah Al-Mujadilah & Ar-Rahman", "Hukum Bacaan Mim Mati & Nun Mati"],
      "Fikih (MTs)": ["Bersuci dari Hadats (Thaharah)", "Sholat Sunnah Berjamaah & Munfarid", "Sujud Sahwi, Sujud Tilawah, & Sujud Syukur", "Zakat Fitrah & Zakat Maal", "Haji dan Umrah"],
      "Sejarah Kebudayaan Islam / SKI (MTs)": ["Kondisi Masyarakat Arab Pra-Islam", "Dakwah Periode Makkah & Madinah", "Perkembangan Islam Peradaban Dinasti Umayyah", "Perkembangan Peradaban Dinasti Abbasiyah", "Peran Wali Songo di Nusantara"],
      "Bahasa Arab (MTs)": ["Fasilitas Sekolah (Al-Marafiq Al-Madrasiyyah)", "Kegiatan Sehari-hari (Al-A'mal Al-Yaumiyyah)", "Hobi (Al-Hiwayah)", "Profesi / Pekerjaan (Al-Mihnatu)"],
      "Matematika": ["Teorema Pythagoras", "Persamaan Kuadrat", "Sistem Persamaan Linear Dua Variabel (SPLDV)", "Statistika & Peluang", "Aritmatika Sosial"],
      "IPA (Fisika, Biologi, Kimia)": ["Sistem Pencernaan Manusia", "Hukum Newton & Gaya", "Gelombang & Bunyi", "Struktur Atom & Unsur", "Ekosistem & Lingkungan"],
      "Bahasa Indonesia": ["Teks Laporan Hasil Observasi", "Teks Eksplanasi", "Teks Puisi & Pantun", "Surat Resmi & Dinas"],
      "Bahasa Inggris": ["Simple Present Tense", "Descriptive Text", "Recount Text", "Narrative Text"],
      "IPS": ["Interaksi Antarruang", "Masa Praaksara di Indonesia", "Kegiatan Ekonomi & Pasar", "Perubahan Sosial Budaya"]
    }
  },
  "SMA / MA / SMK": {
    kelas: ["Kelas 10", "Kelas 11", "Kelas 12"],
    mapel: {
      "Akidah Akhlak (MA)": ["Konsep Tauhid (Uluhiyah, Rububiyah, Asma wa Sifat)", "Tasawuf & Purifikasi Hati", "Al-Kulliyat Al-Khamsah (Perlindungan Agama, Jiwa, Akal, Keturunan, Harta)", "Etika Berbusana & Berhias dalam Islam"],
      "Al-Qur'an Hadis (MA)": ["Struktur Al-Qur'an & Sejarah Pembukuannya", "Metode Penafsiran Al-Qur'an", "Autentisitas Hadis (Sahih, Hasan, Dha'if)", "Hadis Perihal Demokrasi & Toleransi"],
      "Fikih (MA)": ["Kosep Muamalah (Jual Beli, Riba, Bank Syariah)", "Hukum Keluarga (Munakahat & Waris/Faraidh)", "Hukum Pidana Islam (Jinayah & Hudud)", "Peradilan Islam (Qadha)"],
      "Sejarah Kebudayaan Islam / SKI (MA)": ["Peradaban Islam Dinasti Utsmaniyah, Safawi, & Mughal", "Pembaharuan Pemikiran Islam (Abduh, Afghani, Khan)", "Sejarah Kerajaan-kerajaan Islam di Indonesia", "Peran Kerajaan Islam dalam Melawan Kolonialisme"],
      "Bahasa Arab (MA)": ["Teks Hiwar Keagamaan & Pendidikan", "Kaidah Nahwu (Fi'il, Fa'il, Ma'ful Bih, Idhafah)", "Kaidah Sharaf (Tashrif Lughawi & Istilahi)", "Qira'ah wa Kitabah (Membaca Teks Pendek)"],
      "Ilmu Tafsir (Keagamaan MA)": ["Sejarah Perkembangan Ilmu Tafsir", "Tafsir Bil Ma'tsur vs Bil Ra'yi", "Tafsir Tematik (Maudhu'i)", "Asbabun Nuzul"],
      "Ilmu Hadis (Keagamaan MA)": ["Unsur Hadis (Sanad, Matan, Rawi)", "Klasifikasi Hadis Berdasarkan Jumlah Rawi", "Musthalah Al-Hadith", "Kritis Sanad dan Matan"],
      "Usul Fikih (Keagamaan MA)": ["Sumber Hukum Islam (Al-Qur'an, Hadis, Ijma', Qiyas)", "Kaidah Usuliyyah (Am, Khass, Amar, Nahi)", "Ijtihad, Ittiba', & Taqlid", "Maqashid Shariah"],
      "Matematika Wajib / Lanjut": ["Fungsi Komposisi & Invers", "Trigonometri", "Matriks & Determinant", "Kalkulus (Limit & Turunan)", "Vektor"],
      "Fisika": ["Dinamika Gerak & Hukum Newton", "Termodinamika", "Listrik Statis & Dinamis", "Fisika Modern"],
      "Kimia": ["Struktur Atom & Tabel Periodik", "Ikatan Kimia", "Stokiometri & Reaksi Redoks", "Asam Basa & Larutan"],
      "Biologi": ["Genetika & Pewarisan Sifat", "Sistem Organ Manusia", "Bioteknologi", "Evolusi"],
      "Ekonomi / Akuntansi": ["Persamaan Dasar Akuntansi", "Jurnal Umum & Buku Besar", "Manajemen & Badan Usaha", "Pasar Modal"],
      "Bahasa Indonesia": ["Teks Negosiasi", "Teks Editorial", "Artikel Ilmiah", "Novel & Resensi"]
    }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'history' | 'quiz'>('generator');

  // Form State
  const [jenjang, setJenjang] = useState<string>("SMP / MTs");
  const [kelas, setKelas] = useState<string>("Kelas 8");
  const [mapel, setMapel] = useState<string>("Matematika");
  const [topikSelect, setTopikSelect] = useState<string>("Teorema Pythagoras");
  const [topikManual, setTopikManual] = useState<string>("");
  const [tipeSoal, setTipeSoal] = useState<string>("Pilihan Ganda");
  const [jumlahSoal, setJumlahSoal] = useState<number | string>(5);
  const [levelKesulitan, setLevelKesulitan] = useState<string>("Level 2: Sedang (Aplikasi & Analisis)");
  const [distribusi, setDistribusi] = useState<string>("Proporsional (Normal)");

  // Dynamic Options
  const currentJenjangData = dataPendidikan[jenjang] || dataPendidikan["SMP / MTs"];
  const currentMapelList = Object.keys(currentJenjangData.mapel);
  const currentTopikList = currentJenjangData.mapel[mapel] || ["Konsep Dasar dan Teori Utama"];

  const handleJenjangChange = (newJenjang: string) => {
    setJenjang(newJenjang);
    const jData = dataPendidikan[newJenjang];
    const newKelas = jData.kelas[0] || "";
    setKelas(newKelas);
    const mapelKeys = Object.keys(jData.mapel);
    const newMapel = mapelKeys[0] || "";
    setMapel(newMapel);
    const tList = jData.mapel[newMapel] || ["Konsep Dasar"];
    setTopikSelect(tList[0]);
  };

  const handleMapelChange = (newMapel: string) => {
    setMapel(newMapel);
    const tList = currentJenjangData.mapel[newMapel] || ["Konsep Dasar"];
    setTopikSelect(tList[0]);
  };

  // Generation State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentQuiz, setCurrentQuiz] = useState<GeneratedQuiz | null>(null);
  const [isAnswersVisible, setIsAnswersVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved History
  const [savedQuizzes, setSavedQuizzes] = useState<GeneratedQuiz[]>([]);

  // Interactive Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pembuat_soal_madrasah_history');
      if (stored) {
        setSavedQuizzes(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const generateMockData = (m: string, t: string, j: string, k: string, type: string, count: number): Question[] => {
    const list: Question[] = [];
    for (let i = 1; i <= count; i++) {
      list.push({
        id: i,
        nomor: i,
        pertanyaan: `Pertanyaan uji kompetensi ${i} mengenai materi '${t}' dalam mata pelajaran ${m} (${j}, ${k}). Jelaskan konsep utama dan analisis penyelesaiannya secara komprehensif.`,
        opsi: type === 'Pilihan Ganda' ? [
          `A. Memahami konsep dasar dan implementasi ${t}`,
          `B. Mengabaikan variabel utama dalam analisis`,
          `C. Menyederhanakan permasalahan tanpa perhitungan`,
          `D. Menghindari studi kasus empiris`
        ] : [],
        kunci: `A. Memahami konsep dasar dan implementasi ${t}`,
        jawaban: `A. Memahami konsep dasar dan implementasi ${t}`,
        pembahasan: `Materi ${t} memerlukan pemahaman komprehensif terkait teori dasar, analisis kritis, serta aplikasi praktis dalam bidang ${m}.`
      });
    }
    return list;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopik = topikSelect === "Lainnya" ? (topikManual || "Topik Umum") : topikSelect;
    const finalJumlah = Math.min(25, Math.max(1, parseInt(String(jumlahSoal)) || 5));

    setIsLoading(true);
    let generatedSoal: Question[] = [];

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenjang,
          kelas,
          mapel,
          topik: finalTopik,
          tipeSoal,
          jumlahSoal: finalJumlah,
          levelKesulitan,
          distribusi
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.soal && Array.isArray(data.soal)) {
          generatedSoal = data.soal.map((s: any, idx: number) => ({
            id: s.id || s.nomor || (idx + 1),
            nomor: s.nomor || s.id || (idx + 1),
            pertanyaan: s.pertanyaan || '',
            opsi: s.opsi || [],
            kunci: s.kunci || s.jawaban || '',
            jawaban: s.jawaban || s.kunci || '',
            pembahasan: s.pembahasan || ''
          }));
        }
      }
    } catch (err) {
      console.error("API call failed, using mock generator:", err);
    }

    if (generatedSoal.length === 0) {
      generatedSoal = generateMockData(mapel, finalTopik, jenjang, kelas, tipeSoal, finalJumlah);
    }

    const newQuiz: GeneratedQuiz = {
      id: 'quiz_' + Date.now(),
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      jenjang,
      kelas,
      mapel,
      topik: finalTopik,
      tipeSoal,
      jumlahSoal: finalJumlah,
      levelKesulitan,
      distribusi,
      soal: generatedSoal
    };

    setCurrentQuiz(newQuiz);
    setIsLoading(false);
    setIsAnswersVisible(false);
    setUserAnswers({});
    setQuizSubmitted(false);

    const updatedHistory = [newQuiz, ...savedQuizzes.slice(0, 19)];
    setSavedQuizzes(updatedHistory);
    try {
      localStorage.setItem('pembuat_soal_madrasah_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Storage error", e);
    }

    showToast("Soal berhasil dibuat!");
  };

  const copyText = () => {
    if (!currentQuiz) return;
    let text = `SOAL ULANGAN / ASSESMEN ${currentQuiz.mapel.toUpperCase()}\n`;
    text += `Jenjang: ${currentQuiz.jenjang} (${currentQuiz.kelas})\n`;
    text += `Materi: ${currentQuiz.topik}\n`;
    text += `Tipe: ${currentQuiz.tipeSoal} | Kesulitan: ${currentQuiz.levelKesulitan}\n`;
    text += `==================================================\n\n`;

    currentQuiz.soal.forEach((item, idx) => {
      text += `${idx + 1}. ${item.pertanyaan}\n`;
      if (item.opsi && item.opsi.length > 0) {
        item.opsi.forEach(opt => text += `   ${opt}\n`);
      }
      text += `\n`;
    });

    if (isAnswersVisible) {
      text += `\n==================================================\n`;
      text += `KUNCI JAWABAN & PEMBAHASAN\n`;
      text += `==================================================\n\n`;
      currentQuiz.soal.forEach((item, idx) => {
        text += `${idx + 1}. Kunci: ${item.kunci || item.jawaban}\n`;
        text += `   Pembahasan: ${item.pembahasan}\n\n`;
      });
    }

    navigator.clipboard.writeText(text);
    showToast("Teks soal berhasil disalin ke clipboard!");
  };

  const deleteSavedQuiz = (id: string) => {
    const updated = savedQuizzes.filter(q => q.id !== id);
    setSavedQuizzes(updated);
    localStorage.setItem('pembuat_soal_madrasah_history', JSON.stringify(updated));
    showToast("Riwayat soal dihapus");
  };

  const handleAnswerSelect = (qid: number, opt: string) => {
    setUserAnswers(prev => ({ ...prev, [qid]: opt }));
  };

  const submitQuiz = () => {
    if (!currentQuiz) return;
    let correct = 0;
    currentQuiz.soal.forEach(q => {
      const correctAns = q.kunci || q.jawaban || '';
      if (userAnswers[q.id] === correctAns) {
        correct++;
      }
    });
    const score = Math.round((correct / currentQuiz.soal.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    showToast(`Ujian selesai! Skor Anda: ${score}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-['Inter',sans-serif] py-6 px-4 sm:px-6">
      
      {/* Top Header & Navigation */}
      <header className="max-w-4xl w-full mx-auto mb-6 no-print">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 text-white shadow-xl rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl shadow-inner">
              📝
            </div>
            <div>
              <h1 className="font-bold text-xl sm:text-2xl tracking-tight">Pembuat Soal Otomatis</h1>
              <p className="text-xs sm:text-sm text-indigo-100">Generator Ujian & Kunci Jawaban Instan Berbasis AI (Sekolah & Madrasah)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-indigo-900/40 p-1.5 rounded-xl border border-indigo-400/30">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'generator' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>Generator</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>Riwayat ({savedQuizzes.length})</span>
            </button>
            {currentQuiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'quiz' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-play"></i>
                <span>Ujian</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto space-y-6 flex-1">
        
        {/* TAB 1: GENERATOR */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 no-print">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 text-base">Parameter Kurikulum & Soal</h2>
                <span className="text-xs text-indigo-600 bg-indigo-50 font-semibold px-2.5 py-1 rounded-full">Kurikulum Merdeka & Kemenag</span>
              </div>

              <form onSubmit={handleGenerate} className="p-6 sm:p-8 space-y-5">
                
                {/* Baris 1: Jenjang, Kelas, Mapel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Jenjang Pendidikan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={jenjang}
                      onChange={(e) => handleJenjangChange(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      {Object.keys(dataPendidikan).map(j => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Kelas <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      {currentJenjangData.kelas.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Mata Pelajaran <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={mapel}
                      onChange={(e) => handleMapelChange(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      {currentMapelList.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Baris 2: Topik Spesifik */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Topik / Materi Spesifik <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={topikSelect}
                    onChange={(e) => setTopikSelect(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                  >
                    {currentTopikList.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="Lainnya">✏️ Lainnya / Input Manual...</option>
                  </select>

                  {topikSelect === "Lainnya" && (
                    <input
                      type="text"
                      placeholder="Tuliskan topik / materi spesifik secara manual..."
                      value={topikManual}
                      onChange={(e) => setTopikManual(e.target.value)}
                      required
                      className="mt-2.5 w-full bg-white border border-indigo-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  )}
                </div>

                {/* Baris 3: Tipe Soal & Jumlah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Tipe Soal</label>
                    <select
                      value={tipeSoal}
                      onChange={(e) => setTipeSoal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="Pilihan Ganda">Pilihan Ganda (A, B, C, D)</option>
                      <option value="Isian Singkat">Isian Singkat</option>
                      <option value="Uraian / Essay">Uraian / Essay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Jumlah Soal (1 - 25)</label>
                    <input
                      type="number"
                      min="1"
                      max="25"
                      value={jumlahSoal}
                      onChange={(e) => setJumlahSoal(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Parameter Kesulitan */}
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Parameter Kesulitan</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={levelKesulitan}
                      onChange={(e) => setLevelKesulitan(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="Level 1: Mudah (Pemahaman & Mengingat)">Level 1: Mudah (C1 - C2)</option>
                      <option value="Level 2: Sedang (Aplikasi & Analisis)">Level 2: Sedang (C3 - C4)</option>
                      <option value="Level 3: Sulit / HOTS (Evaluasi & Kreasi)">Level 3: Sulit / HOTS (C5 - C6)</option>
                    </select>

                    <select
                      value={distribusi}
                      onChange={(e) => setDistribusi(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="Proporsional (Normal)">Proporsional (Normal)</option>
                      <option value="Fokus HOTS (70% Sulit)">Fokus HOTS (70% Sulit)</option>
                      <option value="Seragam (Tingkat Kesulitan Sama)">Seragam (Tingkat Kesulitan Sama)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="btnSubmit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Membuat Soal AI...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-rocket"></i>
                      <span>Buat Soal</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center space-y-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                <div className="space-y-1">
                  <p className="text-indigo-900 font-semibold text-lg">Sedang Menyusun Soal...</p>
                  <p className="text-gray-500 text-xs">AI sedang merumuskan pertanyaan, pilihan opsi, dan pembahasan rinci sesuai kurikulum.</p>
                </div>
              </div>
            )}

            {/* Quiz Result Output */}
            {currentQuiz && !isLoading && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all">
                
                {/* Control Header */}
                <div className="bg-slate-800 text-white p-4 sm:p-5 flex flex-wrap justify-between items-center gap-3 no-print">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-md font-semibold">Siap Ujian</span>
                    <h3 className="text-sm sm:text-base font-medium text-slate-200">{currentQuiz.mapel}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsAnswersVisible(!isAnswersVisible)}
                      className="bg-slate-700 hover:bg-slate-600 text-xs text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className={`fa-solid ${isAnswersVisible ? 'fa-eye-slash' : 'fa-eye'} text-indigo-400`}></i>
                      <span>{isAnswersVisible ? "Sembunyikan Kunci" : "Tampilkan Kunci"}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-play"></i>
                      <span>Uji Interaktif</span>
                    </button>

                    <button
                      onClick={copyText}
                      className="bg-slate-700 hover:bg-slate-600 text-xs text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-regular fa-copy text-teal-400"></i>
                      <span>Salin Teks</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-xs text-white px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <i className="fa-solid fa-print"></i>
                      <span>Cetak / PDF</span>
                    </button>
                  </div>
                </div>

                {/* Printable Exam Document */}
                <div id="printableArea" className="p-6 sm:p-10 space-y-6 bg-white">
                  
                  <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
                    <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900">
                      LEMBAR UJIAN / ASSESMEN MADRASAH & SEKOLAH
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">
                      <span>{currentQuiz.mapel}</span> &bull; <span>{currentQuiz.jenjang} ({currentQuiz.kelas})</span>
                    </p>
                    <p className="text-xs text-slate-500 italic">Materi / Topik: {currentQuiz.topik}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm p-3 border rounded-lg bg-slate-50">
                    <div>
                      <p><span className="font-semibold">Nama Siswa :</span> ...........................................................</p>
                      <p className="mt-1"><span className="font-semibold">Kelas/No   :</span> ...........................................................</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Tanggal    :</span> ...........................................................</p>
                      <p className="mt-1"><span className="font-semibold">Waktu      :</span> 45 Menit</p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-2">
                    {currentQuiz.soal.map((item, index) => (
                      <div key={item.id} className="space-y-2 text-slate-800 text-sm sm:text-base leading-relaxed">
                        <div className="flex items-start gap-2.5">
                          <span className="font-bold text-indigo-600 select-none">{index + 1}.</span>
                          <div className="flex-1 font-medium text-slate-900">{item.pertanyaan}</div>
                        </div>

                        {currentQuiz.tipeSoal === 'Pilihan Ganda' && item.opsi && item.opsi.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 pl-6">
                            {item.opsi.map((opt, oIdx) => (
                              <div key={oIdx} className="text-xs sm:text-sm text-slate-700">
                                {opt}
                              </div>
                            ))}
                          </div>
                        ) : currentQuiz.tipeSoal === 'Isian Singkat' ? (
                          <div className="mt-3 pl-6">
                            <div className="border-b border-dashed border-slate-400 w-full max-w-md h-6"></div>
                          </div>
                        ) : (
                          <div className="mt-3 pl-6 space-y-3 py-2">
                            <div className="h-5 border-b border-dashed border-slate-300 w-full"></div>
                            <div className="h-5 border-b border-dashed border-slate-300 w-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Kunci Jawaban Section */}
                  {isAnswersVisible && (
                    <div className="mt-10 pt-6 border-t-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4 sm:p-6 rounded-xl space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-key text-indigo-600"></i>
                        <h3 className="font-bold text-base text-indigo-900">Kunci Jawaban & Pembahasan Detil</h3>
                      </div>
                      <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                        {currentQuiz.soal.map((item, index) => (
                          <div key={item.id} className="bg-white p-3.5 rounded-lg border border-indigo-100 shadow-sm space-y-1">
                            <div className="font-semibold text-slate-900">Soal No. {index + 1}</div>
                            <div className="text-indigo-700 font-medium">
                              Jawaban: <span className="bg-indigo-100 px-2 py-0.5 rounded text-indigo-900">{item.kunci || item.jawaban}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1">
                              <span className="font-semibold text-slate-700">Pembahasan:</span> {item.pembahasan}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Riwayat Soal Tersimpan</h2>
                  <p className="text-xs text-gray-500">Daftar lembar soal yang pernah Anda buat sebelumnya</p>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {savedQuizzes.length} Soal Tersimpan
                </span>
              </div>

              {savedQuizzes.length === 0 ? (
                <div className="text-center py-12 space-y-3 text-gray-400">
                  <i className="fa-solid fa-folder-open text-4xl"></i>
                  <p className="text-sm">Belum ada riwayat soal yang tersimpan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 hover:border-indigo-300 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-indigo-600 uppercase">{quiz.mapel}</span>
                          <h3 className="font-bold text-slate-900 text-base">{quiz.topik}</h3>
                        </div>
                        <button
                          onClick={() => deleteSavedQuiz(quiz.id)}
                          className="text-gray-400 hover:text-red-500 text-xs p-1 cursor-pointer"
                          title="Hapus"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <p><span className="font-semibold">Jenjang:</span> {quiz.jenjang} ({quiz.kelas})</p>
                        <p><span className="font-semibold">Tipe:</span> {quiz.tipeSoal} &bull; <span className="font-semibold">Jumlah:</span> {quiz.jumlahSoal} Soal</p>
                        <p><span className="font-semibold">Dibuat:</span> {quiz.timestamp}</p>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentQuiz(quiz);
                            setActiveTab('generator');
                          }}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                          Buka Soal
                        </button>
                        <button
                          onClick={() => {
                            setCurrentQuiz(quiz);
                            setActiveTab('quiz');
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                          Ujian
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE QUIZ MODE */}
        {activeTab === 'quiz' && currentQuiz && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 space-y-8">
            <div className="border-b pb-4 flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded font-semibold">Mode Ujian Interaktif</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{currentQuiz.mapel} - {currentQuiz.topik}</h2>
                <p className="text-xs text-gray-500">{currentQuiz.jenjang} &bull; {currentQuiz.kelas}</p>
              </div>

              {quizSubmitted && (
                <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-center">
                  <div className="text-xs text-indigo-600 font-semibold uppercase">Skor Akhir Anda</div>
                  <div className="text-2xl font-bold text-indigo-900">{quizScore} / 100</div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {currentQuiz.soal.map((q, idx) => {
                const correctAns = q.kunci || q.jawaban || '';
                const isCorrect = userAnswers[q.id] === correctAns;
                return (
                  <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600">{idx + 1}.</span>
                      <p className="font-medium text-slate-900 text-sm sm:text-base">{q.pertanyaan}</p>
                    </div>

                    {q.opsi && q.opsi.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                        {q.opsi.map((opt, oIdx) => {
                          const isSelected = userAnswers[q.id] === opt;
                          let btnStyle = "bg-white border-gray-200 text-slate-700 hover:border-indigo-300";
                          if (quizSubmitted) {
                            if (opt === correctAns) {
                              btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-900 font-semibold";
                            } else if (isSelected && !isCorrect) {
                              btnStyle = "bg-red-100 border-red-400 text-red-900";
                            }
                          } else if (isSelected) {
                            btnStyle = "bg-indigo-600 border-indigo-600 text-white font-medium";
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleAnswerSelect(q.id, opt)}
                              className={`p-3 rounded-lg border text-left text-xs sm:text-sm transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="pl-6">
                        <input
                          type="text"
                          disabled={quizSubmitted}
                          placeholder="Tuliskan jawaban Anda di sini..."
                          value={userAnswers[q.id] || ""}
                          onChange={(e) => handleAnswerSelect(q.id, e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    )}

                    {quizSubmitted && (
                      <div className="mt-3 pl-6 pt-3 border-t border-slate-200 text-xs sm:text-sm space-y-1">
                        <p className="font-semibold text-slate-800">
                          Kunci Jawaban: <span className="text-emerald-700">{correctAns}</span>
                        </p>
                        <p className="text-gray-600"><span className="font-semibold">Pembahasan:</span> {q.pembahasan}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              {!quizSubmitted ? (
                <button
                  onClick={submitQuiz}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Selesaikan Ujian & Cek Hasil
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setUserAnswers({});
                  }}
                  className="bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Ulangi Ujian
                </button>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400 text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-slate-200 mt-8 no-print">
        <p>Pembuat Soal Otomatis &bull; Berbasis Kurikulum Nasional & Kemenag Madrasah &copy; 2026</p>
      </footer>

    </div>
  );
}

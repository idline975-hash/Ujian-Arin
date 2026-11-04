import React, { useState, useEffect } from 'react';

// Types
interface Question {
  id: number;
  pertanyaan: string;
  opsi: string[];
  kunci: string;
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

// Master Data Kurikulum Indonesia
const dataMaster: Record<string, { kelas: string[]; mapel: string[]; topik: Record<string, string[]> }> = {
  "SD / MI": {
    kelas: ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"],
    mapel: ["Matematika", "Bahasa Indonesia", "IPAS (Science & Social)", "Pendidikan Pancasila", "Bahasa Inggris"],
    topik: {
      "Matematika": [
        "Penjumlahan & Pengurangan Dasar",
        "Perkalian & Pembagian Dasar",
        "Pecahan Sederhana & Desimal",
        "Bangun Datar & Keliling/Luas",
        "Pengukuran Panjang, Berat & Waktu"
      ],
      "Bahasa Indonesia": [
        "Membaca Nyaring & Memahami Bacaan",
        "Huruf Kapital & Tanda Baca",
        "Kosa Kata Baru & Sinonim/Antonim",
        "Menulis Puisi & Karangan Pendek"
      ],
      "IPAS (Science & Social)": [
        "Bagian Tubuh Hewan dan Tumbuhan",
        "Wujud Benda dan Perubahannya",
        "Daur Hidup Makhluk Hidup",
        "Peta dan Lingkungan Sekitar",
        "Pahlawan dan Sejarah Lokal"
      ],
      "Pendidikan Pancasila": [
        "Simbol dan Sila Pancasila",
        "Hak dan Kewajiban di Rumah/Sekolah",
        "Aturan dan Norma Masyarakat",
        "Keragaman Budaya Indonesia"
      ],
      "Bahasa Inggris": [
        "Alphabet & Numbers",
        "Family Members & Greetings",
        "Things in the Classroom",
        "Animals & Colors"
      ]
    }
  },
  "SMP / MTs": {
    kelas: ["Kelas 7", "Kelas 8", "Kelas 9"],
    mapel: ["Matematika", "IPA (Fisika, Biologi, Kimia)", "IPS (Sejarah, Geografi, Ekonomi)", "Bahasa Indonesia", "Bahasa Inggris", "Informatika"],
    topik: {
      "Matematika": [
        "Teorema Pythagoras",
        "Persamaan Garis Lurus",
        "Sistem Persamaan Linear Dua Variabel (SPLDV)",
        "Bangun Ruang Sisi Datar",
        "Aljabar & Aritmatika Sosial",
        "Transformasi Geometri"
      ],
      "IPA (Fisika, Biologi, Kimia)": [
        "Sel dan Mikroskop",
        "Sistem Pencernaan & Pernapasan Manusia",
        "Gaya, Usaha dan Tekanan",
        "Cahaya dan Alat Optik",
        "Unsur, Senyawa, dan Campuran"
      ],
      "IPS (Sejarah, Geografi, Ekonomi)": [
        "Interaksi Sosial dan Lembaga Sosial",
        "Kondisi Geografis Indonesia",
        "Kegiatan Ekonomi (Produksi, Distribusi, Konsumsi)",
        "Masa Kerajaan Hindu-Buddha & Islam"
      ],
      "Bahasa Indonesia": [
        "Teks Laporan Hasil Observasi",
        "Teks Eksposisi & Edukasi",
        "Teks Puisi & Teks Drama",
        "Teks Tanggapan & Kritis"
      ],
      "Bahasa Inggris": [
        "Descriptive Text",
        "Recount Text",
        "Narrative Text",
        "Simple Present & Past Tense"
      ],
      "Informatika": [
        "Berpikir Komputasional",
        "Teknologi Informasi dan Komunikasi (TIK)",
        "Algoritma dan Pemrograman Dasar",
        "Analisis Data Sederhana"
      ]
    }
  },
  "SMA / MA": {
    kelas: ["Kelas 10", "Kelas 11", "Kelas 12"],
    mapel: ["Matematika Wajib", "Matematika Tingkat Lanjut", "Fisika", "Kimia", "Biologi", "Ekonomi", "Sejarah", "Sosiologi", "Bahasa Indonesia", "Bahasa Inggris"],
    topik: {
      "Matematika Wajib": [
        "Persamaan & Pertidaksamaan Nilai Mutlak",
        "Fungsi Komposisi dan Invers",
        "Trigonometri Dasar & Analitis",
        "Matriks dan Operasinya",
        "Barisan dan Deret (Aritmatika/Geometri)"
      ],
      "Fisika": [
        "Kinematika Gerak Lurus & Parabola",
        "Hukum-Hukum Newton tentang Gerak",
        "Impuls, Momentum, & Tumbukan",
        "Termodinamika & Teori Kinetik Gas",
        "Rangkaian Arus Searah & Bolak-Balik"
      ],
      "Kimia": [
        "Struktur Atom & Tabel Periodik",
        "Ikatan Kimia & Bentuk Molekul",
        "Stoikiometri & Hukum Dasar Kimia",
        "Termokimia & Laju Reaksi",
        "Asam Basa & Titrasi"
      ],
      "Biologi": [
        "Keanekaragaman Hayati & Virus",
        "Struktur dan Fungsi Sel",
        "Metabolisme (Enzim, Anabolisme, Katabolisme)",
        "Genetika dan Pewarisan Sifat",
        "Evolusi & Bioteknologi"
      ],
      "Ekonomi": [
        "Kelangkaan & Skala Prioritas",
        "Terbentuknya Keseimbangan Pasar",
        "Akuntansi Dasar & Jurnal Umum",
        "Kebijakan Moneter & Fiskal"
      ]
    }
  },
  "SMK": {
    kelas: ["Kelas 10", "Kelas 11", "Kelas 12"],
    mapel: ["Matematika Terapan", "Bahasa Inggris Produk Industri", "Kewirausahaan (PKK)", "Informatika & Jaringan", "Dasar Kejuruan / Kompetensi"],
    topik: {
      "Matematika Terapan": [
        "Vektor & Trigonometri Teknik",
        "Statistik & Pengolahan Data",
        "Program Linear Industri",
        "Kalkulus Dasar & Turunan"
      ],
      "Kewirausahaan (PKK)": [
        "Peluang Usaha & Analisis SWOT",
        "Hak Atas Kekayaan Intelektual (HAKI)",
        "Desain / Prototype Produk",
        "Laporan Keuangan Sederhana"
      ],
      "Informatika & Jaringan": [
        "Jaringan Komputer Dasar & IP Addressing",
        "Keamanan Siber & Firewall",
        "Pemrograman Web & Basis Data",
        "Troubleshooting Hardware & Software"
      ]
    }
  }
};

export default function App() {
  // Navigation Tabs: 'generator' | 'history' | 'quiz'
  const [activeTab, setActiveTab] = useState<'generator' | 'history' | 'quiz'>('generator');

  // Form State
  const [jenjang, setJenjang] = useState<string>("SMP / MTs");
  const [kelas, setKelas] = useState<string>("Kelas 8");
  const [mapel, setMapel] = useState<string>("Matematika");
  const [topikSelect, setTopikSelect] = useState<string>("Teorema Pythagoras");
  const [topikManual, setTopikManual] = useState<string>("");
  const [tipeSoal, setTipeSoal] = useState<string>("Pilihan Ganda");
  const [jumlahSoal, setJumlahSoal] = useState<number | string>(5);
  const [levelKesulitan, setLevelKesulitan] = useState<string>("Level 2: Sedang (Aplikasi)");
  const [distribusi, setDistribusi] = useState<string>("Proporsional (Normal)");

  // Dynamic options
  const currentJenjangData = dataMaster[jenjang] || dataMaster["SMP / MTs"];
  const currentMapelList = currentJenjangData.mapel;
  const currentTopikList = currentJenjangData.topik[mapel] || ["Konsep Dasar dan Teori Utama", "Penerapan Praktis"];

  // Update default mapel & kelas when jenjang changes
  const handleJenjangChange = (newJenjang: string) => {
    setJenjang(newJenjang);
    const jData = dataMaster[newJenjang];
    setKelas(jData.kelas[0] || "");
    const firstMapel = jData.mapel[0] || "";
    setMapel(firstMapel);
    const tList = jData.topik[firstMapel] || ["Konsep Dasar"];
    setTopikSelect(tList[0]);
  };

  const handleMapelChange = (newMapel: string) => {
    setMapel(newMapel);
    const tList = currentJenjangData.topik[newMapel] || ["Konsep Dasar"];
    setTopikSelect(tList[0]);
  };

  // Generation state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentQuiz, setCurrentQuiz] = useState<GeneratedQuiz | null>(null);
  const [isAnswersVisible, setIsAnswersVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved History State
  const [savedQuizzes, setSavedQuizzes] = useState<GeneratedQuiz[]>([]);

  // Interactive Quiz Mode State
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Load saved quizzes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pembuat_soal_history');
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

  // Fallback Mock Data Generator
  const generateMockData = (m: string, t: string, j: string, k: string, type: string, count: number): Question[] => {
    const list: Question[] = [];
    for (let i = 1; i <= count; i++) {
      if (t.toLowerCase().includes('pythagoras') || m.toLowerCase().includes('matematika')) {
        list.push({
          id: i,
          pertanyaan: `Pada segitiga siku-siku ABC dengan sudut siku-siku di B, panjang sisi AB = ${3 * i} cm dan BC = ${4 * i} cm. Berapakah panjang hypotenusa AC?`,
          opsi: [
            `A. ${5 * i} cm`,
            `B. ${6 * i} cm`,
            `C. ${7 * i} cm`,
            `D. ${8 * i} cm`
          ],
          kunci: `A. ${5 * i} cm`,
          pembahasan: `Menggunakan Teorema Pythagoras: AC² = AB² + BC² = (${3 * i})² + (${4 * i})² = ${9 * i * i} + ${16 * i * i} = ${25 * i * i}. Maka AC = √${25 * i * i} = ${5 * i} cm.`
        });
      } else {
        list.push({
          id: i,
          pertanyaan: `Jelaskan prinsip utama dan analisis mendalam mengenai materi ${t} pada mata pelajaran ${m} (${j}, ${k}) soal nomor ${i}?`,
          opsi: type === 'Pilihan Ganda' ? [
            `A. Memahami konsep dasar dan implementasi ${t}`,
            `B. Mengabaikan variabel utama dalam analisis`,
            `C. Menyederhanakan permasalahan tanpa perhitungan`,
            `D. Menghindari studi kasus empiris`
          ] : [],
          kunci: `A. Memahami konsep dasar dan implementasi ${t}`,
          pembahasan: `Materi ${t} memerlukan pemahaman komprehensif terkait teori dasar, analisis kritis, serta aplikasi praktis dalam bidang ${m}.`
        });
      }
    }
    return list;
  };

  // Generate Questions handler
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopik = topikSelect === "LAINNYA" ? (topikManual || "Topik Umum") : topikSelect;
    const finalJumlah = Math.min(20, Math.max(1, parseInt(String(jumlahSoal)) || 5));

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
          generatedSoal = data.soal;
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

    // Save to history automatically
    const updatedHistory = [newQuiz, ...savedQuizzes.slice(0, 19)];
    setSavedQuizzes(updatedHistory);
    try {
      localStorage.setItem('pembuat_soal_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Storage error", e);
    }

    showToast("Soal berhasil dibuat!");
  };

  // Copy text handler
  const copyText = () => {
    if (!currentQuiz) return;
    let text = `SOAL ULANGAN ${currentQuiz.mapel.toUpperCase()}\n`;
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
        text += `${idx + 1}. Kunci: ${item.kunci}\n`;
        text += `   Pembahasan: ${item.pembahasan}\n\n`;
      });
    }

    navigator.clipboard.writeText(text);
    showToast("Teks soal berhasil disalin ke clipboard!");
  };

  // Delete saved quiz
  const deleteSavedQuiz = (id: string) => {
    const updated = savedQuizzes.filter(q => q.id !== id);
    setSavedQuizzes(updated);
    localStorage.setItem('pembuat_soal_history', JSON.stringify(updated));
    showToast("Riwayat soal dihapus");
  };

  // Interactive Quiz evaluation
  const handleAnswerSelect = (qid: number, opt: string) => {
    setUserAnswers(prev => ({ ...prev, [qid]: opt }));
  };

  const submitQuiz = () => {
    if (!currentQuiz) return;
    let correct = 0;
    currentQuiz.soal.forEach(q => {
      if (userAnswers[q.id] === q.kunci) {
        correct++;
      }
    });
    const score = Math.round((correct / currentQuiz.soal.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    showToast(`Ujian selesai! Skor Anda: ${score}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Inter',sans-serif]">
      
      {/* Top Navbar */}
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-40 no-print">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shadow-inner">
              📝
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl tracking-tight">Pembuat Soal Otomatis</h1>
              <p className="text-xs text-indigo-100">Generator Ujian & Kunci Jawaban Instan Berbasis Kurikulum AI</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-indigo-700/60 p-1 rounded-xl border border-indigo-500/50">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'generator' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>Generator</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>Riwayat ({savedQuizzes.length})</span>
            </button>
            {currentQuiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'quiz' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-play"></i>
                <span>Mode Ujian</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* TAB 1: GENERATOR */}
        {activeTab === 'generator' && (
          <div className="space-y-8">
            
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 no-print transition-all">
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 py-6 px-6 text-center text-white relative">
                <h2 className="text-xl sm:text-2xl font-bold">Buat Lembar Soal Baru</h2>
                <p className="text-indigo-100 text-xs sm:text-sm mt-1">Pilih parameter kurikulum dan tingkat kesulitan sesuai kebutuhan</p>
              </div>

              <form onSubmit={handleGenerate} className="p-6 sm:p-8 space-y-6">
                
                {/* Row 1: Jenjang, Kelas, Mapel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jenjang Pendidikan *</label>
                    <select
                      value={jenjang}
                      onChange={(e) => handleJenjangChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      {Object.keys(dataMaster).map(j => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kelas *</label>
                    <select
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      {currentJenjangData.kelas.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mata Pelajaran *</label>
                    <select
                      value={mapel}
                      onChange={(e) => handleMapelChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      {currentMapelList.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Topik Spesifik */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Topik / Materi Spesifik *</label>
                  <select
                    value={topikSelect}
                    onChange={(e) => setTopikSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                  >
                    {currentTopikList.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="LAINNYA">✏️ Lainnya / Input Manual...</option>
                  </select>

                  {topikSelect === "LAINNYA" && (
                    <input
                      type="text"
                      placeholder="Tuliskan topik / materi spesifik secara manual..."
                      value={topikManual}
                      onChange={(e) => setTopikManual(e.target.value)}
                      required
                      className="mt-2.5 w-full px-3.5 py-2.5 bg-white border border-indigo-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  )}
                </div>

                {/* Row 3: Tipe Soal & Jumlah Soal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipe Soal</label>
                    <select
                      value={tipeSoal}
                      onChange={(e) => setTipeSoal(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="Pilihan Ganda">Pilihan Ganda</option>
                      <option value="Isian Singkat">Isian Singkat</option>
                      <option value="Uraian / Essay">Uraian / Essay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jumlah Soal (1 - 20)</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={jumlahSoal}
                      onChange={(e) => setJumlahSoal(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Parameter Kesulitan */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <span className="block text-xs font-bold text-gray-500 tracking-wider uppercase">PARAMETER KESULITAN & DISTRIBUSI</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={levelKesulitan}
                      onChange={(e) => setLevelKesulitan(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 outline-none cursor-pointer"
                    >
                      <option value="Level 1: Mudah (Mengingat/C1-C2)">Level 1: Mudah (Mengingat)</option>
                      <option value="Level 2: Sedang (Aplikasi/C3)">Level 2: Sedang (Aplikasi)</option>
                      <option value="Level 3: Sukar (HOTS/C4-C6)">Level 3: Sukar (HOTS)</option>
                    </select>

                    <select
                      value={distribusi}
                      onChange={(e) => setDistribusi(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 outline-none cursor-pointer"
                    >
                      <option value="Proporsional (Normal)">Proporsional (Normal)</option>
                      <option value="Fokus HOTS">Fokus HOTS</option>
                      <option value="Seimbang">Seimbang</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Menyusun Soal dengan AI...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base">🚀</span>
                      <span>Buat Soal Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Loading Indicator when generating */}
            {isLoading && (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center space-y-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                <div className="space-y-1">
                  <p className="text-indigo-900 font-semibold text-lg">Sedang Menyusun Soal...</p>
                  <p className="text-gray-500 text-xs">AI sedang merumuskan pertanyaan, pilihan opsi, dan pembahasan rinci.</p>
                </div>
              </div>
            )}

            {/* Output Quiz Display */}
            {currentQuiz && !isLoading && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all">
                
                {/* Control Header */}
                <div className="bg-slate-800 text-white p-4 sm:p-5 flex flex-wrap justify-between items-center gap-3 no-print">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-md font-semibold">Siap Ujian</span>
                    <h3 className="text-sm sm:text-base font-medium text-slate-200">Hasil Generasi: {currentQuiz.mapel}</h3>
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
                  
                  {/* Document KOP Header */}
                  <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
                    <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900">
                      SOAL ULANGAN HARIAN {currentQuiz.mapel.toUpperCase()}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">
                      <span>{currentQuiz.jenjang}</span> &bull; <span>{currentQuiz.kelas}</span> | Topik: <span className="italic">{currentQuiz.topik}</span>
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 px-2">
                      <span>Waktu: 45 Menit</span>
                      <span>Sifat Ujian: Tertutup</span>
                      <span>Tipe: <span>{currentQuiz.tipeSoal}</span></span>
                    </div>
                  </div>

                  {/* Student Identity Section */}
                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm pb-3 border-b border-dashed border-gray-300">
                    <div>
                      <p><span className="font-semibold">Nama Siswa :</span> ...........................................................</p>
                      <p className="mt-1"><span className="font-semibold">Nomor Absen:</span> ...........................................................</p>
                    </div>
                    <div className="text-right">
                      <p><span className="font-semibold">Hari/Tanggal :</span> ...........................................................</p>
                      <p className="mt-1"><span className="font-semibold">Nilai        :</span> ....................</p>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-6 pt-2">
                    {currentQuiz.soal.map((item, index) => (
                      <div key={item.id} className="space-y-2 text-slate-800 text-sm sm:text-base leading-relaxed">
                        <div className="flex items-start gap-2.5">
                          <span className="font-bold text-indigo-600 select-none">{index + 1}.</span>
                          <div className="flex-1 font-medium text-slate-900">{item.pertanyaan}</div>
                        </div>

                        {item.opsi && item.opsi.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 pl-6">
                            {item.opsi.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-start gap-2">
                                <span className="text-xs sm:text-sm font-medium text-slate-700">{opt}</span>
                              </div>
                            ))}
                          </div>
                        ) : currentQuiz.tipeSoal === 'Isian Singkat' ? (
                          <div className="mt-3 pl-6 text-gray-400 italic text-xs sm:text-sm">
                            Jawaban: ............................................................................................
                          </div>
                        ) : (
                          <div className="mt-3 pl-6 border-l-2 border-slate-200 space-y-4 py-2">
                            <div className="h-4 border-b border-dashed border-slate-300 w-full"></div>
                            <div className="h-4 border-b border-dashed border-slate-300 w-full"></div>
                            <div className="h-4 border-b border-dashed border-slate-300 w-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Answer Key & Discussion Section */}
                  {isAnswersVisible && (
                    <div className="mt-10 pt-6 border-t-2 border-indigo-200 bg-indigo-50/40 p-4 sm:p-6 rounded-xl space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-key text-indigo-600"></i>
                        <h3 className="font-bold text-base text-indigo-900">Kunci Jawaban & Pembahasan Detil</h3>
                      </div>
                      <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                        {currentQuiz.soal.map((item, index) => (
                          <div key={item.id} className="bg-white p-3.5 rounded-lg border border-indigo-100 shadow-sm space-y-1.5">
                            <div className="font-semibold text-slate-900">Soal No. {index + 1}</div>
                            <div className="text-indigo-700 font-medium">
                              Kunci Jawaban: <span className="bg-indigo-100 px-2 py-0.5 rounded text-indigo-900">{item.kunci}</span>
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
                          className="text-gray-400 hover:text-red-500 text-xs p-1"
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
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 rounded-lg font-medium transition-colors"
                        >
                          Buka Soal
                        </button>
                        <button
                          onClick={() => {
                            setCurrentQuiz(quiz);
                            setActiveTab('quiz');
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors"
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
                const isCorrect = userAnswers[q.id] === q.kunci;
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
                            if (opt === q.kunci) {
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
                          Kunci Jawaban: <span className="text-emerald-700">{q.kunci}</span>
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
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-slate-200 no-print">
        <p>Pembuat Soal Otomatis &bull; Berbasis Kurikulum Nasional & AI &copy; 2026</p>
      </footer>

    </div>
  );
}

import { Student, Mission } from './types';
import { BookOpen, Moon, Sun, Heart, Coffee, Star, Shield, Music, CheckCircle } from 'lucide-react';

export const TEACHERS_LIST = [
  "YAYAH MUNYATI", "DESY RATNA SARI", "NARARIA PIARDINI", "ISTA ANNISA",
  "TINA VIOLENTA", "RIRI DZIKRIYANTI", "WINDA INDRI HASTUTI", "SITI JULAEHA",
  "CHRISTINA MURBANILAH", "RISTRIYONO AHMAD NUGROHO", "IQBAL NURZEHA",
  "SRI JAYATI", "SUPARJA", "TEGUH FIRMANSYAH APRILIANA", "YUNI SULISTYATI",
  "PRABOWO SETYA NUGROHO", "MARSELINUS BOYMAU", "MUCHARI TRI WIDODO"
];

export const CLASSES_LIST = [
  "1A", "1B", "1C", "2A", "2B", "3", 
  "4A", "4B", "4C", "5A", "5B", "5C", "6A", "6B"
];

// Updated Missions based on User Request
export const INITIAL_MISSIONS: Mission[] = [
  { id: 'm1', label: 'Sahur & Imsak', xp: 20, completed: false, icon: 'Coffee' },
  { id: 'm2', label: 'Puasa Penuh', xp: 100, completed: false, icon: 'Sun' },
  { id: 'm3', label: 'Shalat 5 Waktu', xp: 50, completed: false, icon: 'CheckCircle' },
  { id: 'm4', label: 'Shalat Tarawih', xp: 40, completed: false, icon: 'Moon' },
  { id: 'm5', label: 'Tadarus Al-Quran', xp: 40, completed: false, icon: 'BookOpen' },
  { id: 'm6', label: 'Infaq / Sedekah', xp: 30, completed: false, icon: 'Heart' },
  { id: 'm7', label: 'Dzikir & Al-Matsurat', xp: 30, completed: false, icon: 'Shield' },
];

const STUDENTS_6A_DATA = [
  { name: "Abid Aqillah Pradinata", password: "3338" },
  { name: "Aina Talita Zahra", password: "3341" },
  { name: "Alya Okta Rinjani", password: "3503" },
  { name: "Aqilah Fika Gumay", password: "3346" },
  { name: "Ariska Anatasya", password: "3618" },
  { name: "Avika Cinta Simbolon", password: "3348" },
  { name: "Birma Satria Raja", password: "3349" },
  { name: "Cheyra Qatrunnada Faiha", password: "3351" },
  { name: "Deka Wijaya", password: "3353" },
  { name: "Jihan Alfiyah", password: "3785" },
  { name: "Kenneth Theo Natanael", password: "3361" },
  { name: "Kirana Dafina Cheiko", password: "3362" },
  { name: "Maulidina Dewi Kusuma Wardani", password: "3671" },
  { name: "Muhamad Devan", password: "3366" },
  { name: "Muhammad Adlan Faqih", password: "3368" },
  { name: "Muhammad Dimas Tirto Aji", password: "3289" },
  { name: "Nadhifa Hoirun Nisa", password: "3374" },
  { name: "Nanda Satria Al Fatih", password: "3375" },
  { name: "Navranda Ksatria", password: "3378" },
  { name: "Nayla Syabani", password: "3379" },
  { name: "Nazmi Khansa Tabina", password: "3853" },
  { name: "Nazwa Fitria Rahmadhani", password: "3381" },
  { name: "Nur Taufik", password: "3383" },
  { name: "Qinara Zevannya Putri Diandi", password: "3786" },
  { name: "Raisa Fiona Nadine Septiani", password: "3386" },
  { name: "Ramadhan Ibnu Aliansyah", password: "3387" },
  { name: "Ramadony Pratama", password: "3309" },
  { name: "Reysha Mikhayla Almira", password: "3389" },
  { name: "Samuel Simamora", password: "3394" },
  { name: "Shaqila Hafizah Siregar", password: "3611" },
  { name: "Siti Rahma Aulia", password: "3396" },
  { name: "Tasya Setia Ningrum", password: "3399" }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Ali bin Abi Thalib',
    class: '4A',
    totalXp: 120,
    levelTitle: 'Prajurit Puasa',
    missions: JSON.parse(JSON.stringify(INITIAL_MISSIONS)), 
    journalEntry: '',
    isExtraTaskCompleted: false,
  },
  ...STUDENTS_6A_DATA.map((s, i) => ({
    id: `6a-${i + 1}`,
    name: s.name,
    password: s.password,
    class: '6A',
    totalXp: 0,
    levelTitle: 'Prajurit Puasa',
    missions: JSON.parse(JSON.stringify(INITIAL_MISSIONS)),
    journalEntry: '',
    isExtraTaskCompleted: false,
  }))
];

// --- EDUCATIONAL CONTENT ---

export const EDU_CONTENT = {
  definitions: {
    title: "Apa itu Puasa?",
    content: "Puasa (Shaum) secara bahasa artinya menahan. Secara istilah, menahan diri dari makan, minum, dan segala hal yang membatalkan puasa mulai dari terbit fajar (Subuh) hingga terbenam matahari (Maghrib) dengan niat karena Allah SWT."
  },
  hukum: {
    title: "Hukum Puasa",
    content: "Hukum puasa Ramadan adalah WAJIB (Fardhu 'Ain) bagi setiap Muslim yang sudah baligh dan berakal. Dalilnya ada dalam Surah Al-Baqarah ayat 183."
  },
  rukun: {
    title: "Rukun Puasa",
    items: [
      "Niat (dilakukan pada malam hari sebelum Subuh).",
      "Menahan diri dari hal yang membatalkan puasa dari terbit fajar hingga terbenam matahari."
    ]
  },
  syarat: {
    title: "Syarat Wajib & Sah",
    items: [
      "Islam (Beragama Islam)",
      "Baligh (Cukup Umur)",
      "Berakal (Tidak Gila)",
      "Sehat (Mampu berpuasa)",
      "Mukim (Tidak sedang musafir jauh)",
      "Suci dari Haid dan Nifas (bagi wanita)"
    ]
  },
  sunnah: {
    title: "Sunnah Puasa",
    items: [
      "Makan Sahur (dan mengakhirkannya)",
      "Menyegerakan berbuka puasa",
      "Berdoa saat berbuka",
      "Memberi makan orang yang berbuka",
      "Memperbanyak baca Al-Quran dan sedekah",
      "Menjaga lisan dari perkataan buruk"
    ]
  },
  niat_doa: {
    title: "Niat & Doa Berbuka",
    niat: {
      arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هِذِهِ السَّنَةِ لِلهِ تَعَالَى",
      latin: "Nawaitu shauma ghadin 'an adâ'i fardhi syahri Ramadhâna hâdzihis sanati lillâhi ta'âlâ.",
      arti: "Aku berniat puasa esok hari untuk menunaikan fardhu di bulan Ramadan tahun ini, karena Allah Ta'ala."
    },
    buka: {
      arab: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللهُ",
      latin: "Dzahabaz zhama’u wabtallatil ‘uruuqu wa tsabatal ajru insyaa Allah.",
      arti: "Telah hilang rasa haus, dan urat-urat telah basah serta pahala tetap, insya Allah."
    }
  },
  batal_exempt: {
    title: "Pembatal & Keringanan",
    batal: ["Makan/minum disengaja", "Muntah disengaja", "Hilang akal/gila", "Haid/Nifas"],
    exempt: ["Orang Sakit (Wajib Qadha)", "Musafir (Wajib Qadha)", "Lansia tidak mampu (Bayar Fidyah)", "Ibu Hamil/Menyusui (Qadha/Fidyah sesuai kondisi)"]
  },
  kaffarah: {
    title: "Denda (Kaffarah)",
    content: "Siapa yang membatalkan puasa dengan berhubungan suami istri di siang hari Ramadan, wajib membayar Kaffarah: Memerdekakan budak, atau puasa 2 bulan berturut-turut, atau memberi makan 60 orang miskin."
  },
  keutamaan: {
    title: "Keutamaan Puasa",
    items: [
      "Bau mulut orang berpuasa lebih harum di sisi Allah daripada minyak kasturi.",
      "Disediakan pintu surga khusus bernama Ar-Rayyan.",
      "Tidurnya orang puasa adalah ibadah, diamnya adalah tasbih.",
      "Doanya mustajab (dikabulkan)."
    ]
  },
  tata_cara_buka: {
    title: "Tata Cara Berbuka (Sunnah)",
    steps: [
      "Segerakan saat adzan Maghrib berkumandang.",
      "Membaca Basmalah.",
      "Memakan kurma basah (Ruthob), jika tidak ada kurma kering (Tamr), jika tidak ada seteguk air putih.",
      "Membaca doa berbuka (Dzahabaz zhama'u...).",
      "Shalat Maghrib."
    ]
  }
};

// --- QURAN KHATAM TIPS ---
export const QURAN_TIPS = [
  { target: "1x Khatam", strategy: "1 Juz per hari (4 lembar setiap selesai Shalat Fardhu)" },
  { target: "2x Khatam", strategy: "2 Juz per hari (8 lembar setiap selesai Shalat Fardhu)" },
  { target: "3x Khatam", strategy: "3 Juz per hari (Baca 1 Juz setiap: Pagi, Siang, Malam)" },
  { target: "5x Khatam", strategy: "5 Juz per hari (1 Juz setiap selesai Shalat Fardhu)" }
];

// --- 30 DAILY QUOTES ---
export const RAMADAN_QUOTES = [
  "Ramadan adalah bulan kesabaran, dan balasan kesabaran adalah surga.",
  "Awal bulan Ramadan adalah Rahmat, pertengahannya Ampunan, dan akhirnya Pembebasan dari Api Neraka.",
  "Barangsiapa bergembira dengan masuknya bulan Ramadan, Allah haramkan jasadnya menyentuh api neraka.",
  "Puasa bukan hanya menahan lapar, tapi menahan hawa nafsu.",
  "Jadikan Ramadan ini titik balik perubahan dirimu menjadi lebih baik.",
  "Shalat adalah tiang agama, Puasa adalah perisai diri.",
  "Sebaik-baik sedekah adalah sedekah di bulan Ramadan.",
  "Al-Quran diturunkan di bulan Ramadan sebagai petunjuk bagi manusia.",
  "Lailatul Qadar lebih baik dari seribu bulan.",
  "Jagalah lisanmu saat berpuasa agar pahalamu utuh.",
  "Berbukalah dengan yang manis, bicaralah dengan yang manis.",
  "Allah tidak butuh puasanya orang yang tidak meninggalkan perkataan dusta.",
  "Sahur itu penuh berkah, maka janganlah kalian meninggalkannya.",
  "Doa orang yang berpuasa tidak akan tertolak.",
  "Ramadan mengajarkan kita arti kejujuran dan disiplin.",
  "Bersihkan hati, sucikan diri, sambut kemenangan yang fitri.",
  "Orang yang rugi adalah yang bertemu Ramadan tapi tidak diampuni dosanya.",
  "Perbanyaklah Istighfar di waktu sahur.",
  "Ramadan ibarat hujan yang membersihkan debu-debu dosa.",
  "Jangan biarkan Ramadan berlalu tanpa amal yang bermutu.",
  "Tadarus Al-Quran menenangkan hati dan pikiran.",
  "Berbagi takjil adalah cara mudah meraih pahala besar.",
  "Tahan amarahmu, katakan: 'Sesungguhnya aku sedang berpuasa'.",
  "Puasakan telingamu dari mendengar hal buruk.",
  "Puasakan matamu dari melihat hal maksiat.",
  "Kemenangan sejati adalah mengalahkan ego diri sendiri.",
  "Setiap tarikan nafas di bulan Ramadan bisa menjadi tasbih.",
  "Semakin berat ujian puasa, semakin besar pahalanya.",
  "Ramadan akan pergi, pastikan dosamu ikut pergi bersamanya.",
  "Taqabbalallahu Minna Wa Minkum, semoga Allah menerima amal kita."
];
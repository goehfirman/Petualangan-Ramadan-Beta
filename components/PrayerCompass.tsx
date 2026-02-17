import React, { useEffect, useState } from 'react';
import { Compass, Clock, MapPin, Navigation } from 'lucide-react';

interface PrayerTimes {
  Imsak: string;
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export const PrayerCompass: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string} | null>(null);
  const [qiblaHeading, setQiblaHeading] = useState<number>(0); // Direction to Kaaba from North
  const [deviceHeading, setDeviceHeading] = useState<number>(0); // Device compass heading
  const [locationName, setLocationName] = useState("Mencari Lokasi...");
  const [error, setError] = useState<string | null>(null);

  // Calculate Qibla Direction (Mecca: 21.4225° N, 39.8262° E)
  const calculateQibla = (latitude: number, longitude: number) => {
    const KAABA_LAT = 21.422487;
    const KAABA_LONG = 39.826206;

    const phiK = KAABA_LAT * Math.PI / 180.0;
    const lambdaK = KAABA_LONG * Math.PI / 180.0;
    const phi = latitude * Math.PI / 180.0;
    const lambda = longitude * Math.PI / 180.0;

    const y = Math.sin(lambdaK - lambda);
    const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
    let qibla = Math.atan2(y, x) * 180.0 / Math.PI;
    
    setQiblaHeading((qibla + 360) % 360);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung lokasi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        calculateQibla(latitude, longitude);

        // Fetch Prayer Times
        try {
          // Get today's date in DD-MM-YYYY format
          const date = new Date();
          const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
          
          const response = await fetch(
            `https://api.aladhan.com/v1/timings/${dateString}?latitude=${latitude}&longitude=${longitude}&method=20` // Method 20: Kemenag RI approximation
          );
          const data = await response.json();
          if (data.code === 200) {
            setPrayers(data.data.timings);
            setLocationName(data.data.meta.timezone);
            determineNextPrayer(data.data.timings);
          }
        } catch (err) {
          setError("Gagal mengambil jadwal shalat.");
        }
      },
      (err) => {
        setError("Izin lokasi diperlukan untuk jadwal & kiblat.");
        setLocationName("Lokasi tidak terdeteksi");
      }
    );

    // Handle Device Orientation for Compass
    const handleOrientation = (event: DeviceOrientationEvent) => {
        // alpha: rotation around z-axis (0-360)
        // webkitCompassHeading: for iOS
        let heading = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((event as any).webkitCompassHeading) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
            heading = (event as any).webkitCompassHeading;
        } else if (event.alpha !== null) {
            heading = 360 - event.alpha;
        }
        setDeviceHeading(heading);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation);

  }, []);

  const determineNextPrayer = (times: PrayerTimes) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const schedule = [
      { name: 'Imsak', time: times.Imsak },
      { name: 'Subuh', time: times.Fajr },
      { name: 'Dzuhur', time: times.Dhuhr },
      { name: 'Ashar', time: times.Asr },
      { name: 'Maghrib', time: times.Maghrib },
      { name: 'Isya', time: times.Isha },
    ];

    for (const p of schedule) {
      if (timeToMinutes(p.time) > currentTime) {
        setNextPrayer(p);
        return;
      }
    }
    // If passed Isya, next is Imsak tomorrow
    setNextPrayer({ name: 'Imsak (Besok)', time: times.Imsak });
  };

  // The arrow needs to point to Qibla relative to North
  // If Device is pointing North (0deg), Qibla is at qiblaHeading
  // If Device is pointing East (90deg), Qibla visual needs to rotate -90deg
  const needleRotation = qiblaHeading - deviceHeading;

  return (
    <div className="glass-panel rounded-3xl p-6 mb-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <h3 className="text-cyan-300 font-bold flex items-center gap-2">
                    <Clock size={18} /> Sinkronisasi Waktu
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {locationName}
                </p>
            </div>
            {nextPrayer && (
                <div className="text-right">
                    <p className="text-xs text-amber-400 font-bold uppercase">Selanjutnya</p>
                    <p className="text-2xl font-extrabold text-white">{nextPrayer.time}</p>
                    <p className="text-sm text-white/70">{nextPrayer.name}</p>
                </div>
            )}
        </div>

        {/* Content Grid */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
            
            {/* Prayer Times List */}
            <div className="w-full md:w-1/2 grid grid-cols-3 gap-2 text-center">
                {prayers && Object.entries({
                    Imsak: prayers.Imsak,
                    Subuh: prayers.Fajr,
                    Dzuhur: prayers.Dhuhr,
                    Ashar: prayers.Asr,
                    Maghrib: prayers.Maghrib,
                    Isya: prayers.Isha
                }).map(([name, time]) => (
                    <div key={name} className={`rounded-xl p-2 border ${name === nextPrayer?.name ? 'bg-cyan-900/40 border-cyan-500' : 'bg-black/20 border-white/10'}`}>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{name}</p>
                        <p className="text-sm font-bold text-white">{time}</p>
                    </div>
                ))}
                {!prayers && !error && <div className="col-span-3 text-center text-xs animate-pulse text-cyan-400">Menghubungi Satelit...</div>}
                {error && <div className="col-span-3 text-center text-xs text-red-400">{error}</div>}
            </div>

            {/* Qibla Compass */}
            <div className="w-full md:w-1/2 flex flex-col items-center relative">
                 <div className="relative w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-900 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                    {/* Compass Rose */}
                    <div className="absolute inset-0 rounded-full border border-white/10" style={{ transform: `rotate(${-deviceHeading}deg)`, transition: 'transform 0.2s ease-out' }}>
                        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-red-500">N</span>
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">S</span>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">E</span>
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">W</span>
                    </div>

                    {/* Qibla Needle */}
                    <div 
                        className="absolute w-1 h-14 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-full origin-bottom z-10 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                        style={{ 
                            top: '50%', 
                            left: '50%', 
                            transform: `translate(-50%, -100%) rotate(${needleRotation}deg)`,
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                         {/* Kaaba Icon at tip */}
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border border-amber-400 rounded-sm"></div>
                    </div>
                    
                    {/* Center Point */}
                    <div className="w-2 h-2 bg-white rounded-full z-20"></div>
                 </div>
                 <div className="mt-2 text-center">
                    <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                        <Navigation size={12} /> Arah Kiblat
                    </p>
                    <p className="text-[10px] text-slate-500 max-w-[150px]">
                        Putar perangkat hingga panah Hijau lurus ke atas.
                    </p>
                 </div>
            </div>
        </div>
    </div>
  );
};
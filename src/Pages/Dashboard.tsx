import { useState, useEffect } from 'react';
import type { Workout } from '../Interfaces/Workout';
import { WorkoutForm } from '../Components/WorkoutForm';
import { WorkoutList } from '../Components/WorkoutList';
import { Activity, Dumbbell, Flame, Droplets, Timer, Play, Pause, RotateCcw, Zap, Target, Download, Upload, FileText, Filter, BookOpen, PlusCircle } from 'lucide-react';

// Kas Gruplarına Göre Örnek Hareketler Kütüphanesi
const EXERCISE_LIBRARY: Record<string, { name: string; category: Workout['category']; defaultWeight: number; sets: number; reps: number }[]> = {
  Göğüs: [
    { name: 'Bench Press', category: 'Kuvvet', defaultWeight: 60, sets: 4, reps: 10 },
    { name: 'Incline Dumbbell Press', category: 'Kuvvet', defaultWeight: 22, sets: 3, reps: 12 },
    { name: 'Cable Crossover', category: 'Kuvvet', defaultWeight: 15, sets: 3, reps: 15 },
    { name: 'Chest Dip', category: 'Kuvvet', defaultWeight: 0, sets: 3, reps: 10 },
  ],
  Sırt: [
    { name: 'Lat Pulldown', category: 'Kuvvet', defaultWeight: 50, sets: 4, reps: 12 },
    { name: 'Barbell Row', category: 'Kuvvet', defaultWeight: 50, sets: 4, reps: 10 },
    { name: 'Seated Cable Row', category: 'Kuvvet', defaultWeight: 45, sets: 3, reps: 12 },
    { name: 'Barfiks (Pull-up)', category: 'Kuvvet', defaultWeight: 0, sets: 3, reps: 8 },
  ],
  Bacak: [
    { name: 'Barbell Squat', category: 'Kuvvet', defaultWeight: 70, sets: 4, reps: 8 },
    { name: 'Leg Press', category: 'Kuvvet', defaultWeight: 120, sets: 3, reps: 10 },
    { name: 'Leg Extension', category: 'Dayanıklılık', defaultWeight: 40, sets: 3, reps: 12 },
    { name: 'Romanian Deadlift', category: 'Kuvvet', defaultWeight: 60, sets: 3, reps: 10 },
  ],
  Biceps: [
    { name: 'Barbell Curl', category: 'Kuvvet', defaultWeight: 25, sets: 3, reps: 12 },
    { name: 'Dumbbell Hammer Curl', category: 'Kuvvet', defaultWeight: 14, sets: 3, reps: 12 },
    { name: 'Preacher Curl', category: 'Kuvvet', defaultWeight: 20, sets: 3, reps: 10 },
    { name: 'Incline Dumbbell Curl', category: 'Kuvvet', defaultWeight: 12, sets: 3, reps: 12 },
  ],
  Triceps: [
    { name: 'Triceps Pushdown (Halat)', category: 'Kuvvet', defaultWeight: 30, sets: 4, reps: 12 },
    { name: 'Skull Crusher', category: 'Kuvvet', defaultWeight: 25, sets: 3, reps: 10 },
    { name: 'Dumbbell Overhead Extension', category: 'Kuvvet', defaultWeight: 18, sets: 3, reps: 12 },
    { name: 'Bench Dips', category: 'Kuvvet', defaultWeight: 0, sets: 3, reps: 15 },
  ],
};

export const Dashboard = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('fitness_workouts');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [selectedSplit, setSelectedSplit] = useState<string>('Tümü');
  const [activeMuscleGroup, setActiveMuscleGroup] = useState<string>('Göğüs');
  const [dailyNote, setDailyNote] = useState<string>(() => {
    return localStorage.getItem('fitness_daily_note') || '';
  });

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    const saved = localStorage.getItem('fitness_water');
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('fitness_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fitness_water', JSON.stringify(waterGlasses));
  }, [waterGlasses]);

  useEffect(() => {
    localStorage.setItem('fitness_daily_note', dailyNote);
  }, [dailyNote]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleAddWorkout = (newWorkoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...newWorkoutData,
      id: crypto.randomUUID(),
    };
    setWorkouts([newWorkout, ...workouts]);
  };

  const handleAddFromLibrary = (item: { name: string; category: Workout['category']; defaultWeight: number; sets: number; reps: number }) => {
    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      title: item.name,
      date: new Date().toLocaleDateString('tr-TR'),
      category: item.category,
      weight: item.defaultWeight,
      sets: item.sets,
      reps: item.reps,
    };
    setWorkouts([newWorkout, ...workouts]);
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    setWorkouts(workouts.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w)));
    setEditingWorkout(null);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workouts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fitflow_yedek_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsedData)) {
            setWorkouts(parsedData);
            alert("Antrenman geçmişi başarıyla yüklendi!");
          }
        } catch (error) {
          alert("Geçersiz dosya formatı!");
        }
      };
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((acc, curr) => acc + (curr.weight * curr.sets * curr.reps), 0);
  const totalSets = workouts.reduce((acc, curr) => acc + curr.sets, 0);
  const estimatedCalories = totalSets * 6;

  const filteredWorkouts = selectedSplit === 'Tümü' 
    ? workouts 
    : workouts.filter(w => w.category.toLowerCase() === selectedSplit.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 text-base">
      <div className="max-w-[1550px] mx-auto space-y-8">
        
        {/* Üst Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/5">
              <Activity size={44} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
                FitFlow Pro Stüdyosu
              </h1>
              <p className="text-slate-300 text-base mt-1">Gelişmiş antrenman, hacim, kalori ve performans yönetim merkezi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-200 transition shadow"
            >
              <Download size={18} className="text-emerald-400" /> Yedek İndir
            </button>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-200 cursor-pointer transition shadow">
              <Upload size={18} className="text-sky-400" /> Yükle
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
        </header>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
            <Dumbbell className="text-emerald-400" size={32} />
            <div>
              <p className="text-sm text-slate-400 font-medium">Toplam Hareket</p>
              <p className="text-2xl font-black text-white">{totalWorkouts}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
            <Flame className="text-amber-400" size={32} />
            <div>
              <p className="text-sm text-slate-400 font-medium">Toplam Tonaj</p>
              <p className="text-2xl font-black text-white">{totalVolume} kg</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
            <Target className="text-cyan-400" size={32} />
            <div>
              <p className="text-sm text-slate-400 font-medium">Toplam Set</p>
              <p className="text-2xl font-black text-white">{totalSets}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
            <Zap className="text-rose-400" size={32} />
            <div>
              <p className="text-sm text-slate-400 font-medium">Tahmini Kalori</p>
              <p className="text-2xl font-black text-white">{estimatedCalories} kcal</p>
            </div>
          </div>
        </div>

        {/* Araçlar: Kronometre & Su Takibi */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Timer size={28} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Dinlenme Kronometresi</p>
                <p className="text-3xl font-mono font-black text-white">{formatTime(seconds)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition text-sm ${
                  isActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isActive ? <Pause size={18} /> : <Play size={18} />}
                <span>{isActive ? 'Durdur' : 'Başlat'}</span>
              </button>
              <button
                onClick={() => { setIsActive(false); setSeconds(0); }}
                className="p-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
                <Droplets size={28} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Günlük Su Hedefi (8 Bardak)</p>
                <p className="text-xl font-black text-sky-400">{waterGlasses} / 8 Bardak ({waterGlasses * 250} ml)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-xl transition text-lg"
              >
                -
              </button>
              <button
                onClick={() => setWaterGlasses((prev) => prev + 1)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl shadow transition text-sm"
              >
                +1 Bardak
              </button>
            </div>
          </div>
        </section>

        {/* Ana İçerik: Sol Kolon (Kütüphane + Form + Notlar) & Sağ Kolon (Liste) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sol Kolon */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Egzersiz Kütüphanesi & Rehberi */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base border-b border-slate-800 pb-3">
                <BookOpen size={20} /> Egzersiz Kütüphanesi & Örnek Hareketler
              </div>

              {/* Kas Grubu Butonları */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {Object.keys(EXERCISE_LIBRARY).map((group) => (
                  <button
                    key={group}
                    onClick={() => setActiveMuscleGroup(group)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      activeMuscleGroup === group
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>

              {/* Seçili Kas Grubunun Hareket Listesi */}
              <div className="space-y-2 pt-1">
                {EXERCISE_LIBRARY[activeMuscleGroup].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
                  >
                    <div>
                      <p className="font-bold text-sm text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">
                        {item.sets} Set × {item.reps} Tekrar {item.defaultWeight > 0 ? `| ${item.defaultWeight} kg` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddFromLibrary(item)}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold rounded-lg flex items-center gap-1 transition"
                    >
                      <PlusCircle size={14} /> Ekle
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Manuel Egzersiz Ekleme Formu */}
            <WorkoutForm
              onAdd={handleAddWorkout}
              onUpdate={handleUpdateWorkout}
              editingWorkout={editingWorkout}
              onCancelEdit={() => setEditingWorkout(null)}
            />

            {/* Antrenman Günlüğü Notu */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <FileText size={18} /> Antrenman Notu / Günlük
              </div>
              <textarea
                value={dailyNote}
                onChange={(e) => setDailyNote(e.target.value)}
                placeholder="Bugün nasıl hissettin? Antrenman notlarını buraya yaz..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
              />
            </div>
          </div>

          {/* Sağ Kolon (Egzersiz Listesi ve Filtre) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 overflow-x-auto shadow-md">
              <span className="text-sm text-slate-400 flex items-center gap-1 font-bold px-2">
                <Filter size={16} /> Filtre:
              </span>
              {['Tümü', 'Kuvvet', 'Kardiyo', 'Dayanıklılık', 'Esneklik'].map((split) => (
                <button
                  key={split}
                  onClick={() => setSelectedSplit(split)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                    selectedSplit === split
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {split}
                </button>
              ))}
            </div>

            <WorkoutList
              workouts={filteredWorkouts}
              onDelete={handleDeleteWorkout}
              onEdit={(workout) => setEditingWorkout(workout)}
            />
          </div>

        </main>

      </div>
    </div>
  );
};
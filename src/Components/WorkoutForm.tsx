import React, { useState, useEffect } from 'react';
import type { Workout } from '../Interfaces/Workout';
import { PlusCircle, Save, X } from 'lucide-react';

interface Props {
  onAdd: (workout: Omit<Workout, 'id'>) => void;
  onUpdate: (workout: Workout) => void;
  editingWorkout: Workout | null;
  onCancelEdit: () => void;
}

export const WorkoutForm: React.FC<Props> = ({ onAdd, onUpdate, editingWorkout, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Workout['category']>('Kuvvet');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    if (editingWorkout) {
      setTitle(editingWorkout.title);
      setCategory(editingWorkout.category);
      setSets(editingWorkout.sets);
      setReps(editingWorkout.reps);
      setWeight(editingWorkout.weight);
    } else {
      resetForm();
    }
  }, [editingWorkout]);

  const resetForm = () => {
    setTitle('');
    setCategory('Kuvvet');
    setSets(3);
    setReps(10);
    setWeight(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingWorkout) {
      onUpdate({
        ...editingWorkout,
        title,
        category,
        sets,
        reps,
        weight,
      });
    } else {
      onAdd({
        title,
        category,
        sets,
        reps,
        weight,
        date: new Date().toLocaleDateString('tr-TR'),
      });
    }
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md space-y-4">
      <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
        {editingWorkout ? 'Antrenmanı Güncelle' : 'Yeni Egzersiz Ekle'}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-300">Hareket / Egzersiz Adı</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Örn: Bench Press, Squat"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Workout['category'])}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Kuvvet">Kuvvet</option>
            <option value="Hipertrofi">Hipertrofi</option>
            <option value="Kardiyo">Kardiyo</option>
            <option value="Dayanıklılık">Dayanıklılık</option>
            <option value="Esneklik">Esneklik</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Ağırlık (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Set</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Tekrar</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            min="1"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          {editingWorkout ? <Save size={18} /> : <PlusCircle size={18} />}
          {editingWorkout ? 'Kaydet' : 'Ekle'}
        </button>

        {editingWorkout && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg flex items-center gap-1 transition"
          >
            <X size={18} /> İptal
          </button>
        )}
      </div>
    </form>
  );
};
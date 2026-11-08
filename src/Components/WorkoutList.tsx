import React from 'react';
import type { Workout } from '../Interfaces/Workout';
import { Trash2, Edit2, Dumbbell } from 'lucide-react';

interface Props {
  workouts: Workout[];
  onDelete: (id: string) => void;
  onEdit: (workout: Workout) => void;
}

export const WorkoutList: React.FC<Props> = ({ workouts, onDelete, onEdit }) => {
  if (workouts.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-400">
        <Dumbbell className="mx-auto mb-2 opacity-50" size={40} />
        <p>Henüz kaydedilmiş bir egzersiz bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-slate-200 mb-4">Egzersiz Listesi ({workouts.length})</h2>
      {workouts.map((item) => (
        <div
          key={item.id}
          className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between shadow-sm hover:border-slate-600 transition"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-white">{item.title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                {item.category}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              {item.sets} Set × {item.reps} Tekrar {item.weight > 0 && `| ${item.weight} kg`}
            </p>
            <p className="text-xs text-slate-500">Tarih: {item.date}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition"
              title="Düzenle"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition"
              title="Sil"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
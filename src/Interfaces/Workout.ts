export interface Workout {
  id: string;
  title: string;
  category: 'Kardiyo' | 'Kuvvet' | 'Hipertrofi' | 'Dayanıklılık' | 'Esneklik';
  sets: number;
  reps: number;
  weight: number;
  date: string;
}
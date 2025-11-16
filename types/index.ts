export interface User {
  email: string;
  nickname: string;
  avatar: string;
  subgroup: 1 | 2;
  groupName: string; // наприклад, "ПП-15"
  currentWeekType: 'numerator' | 'denominator'; // поточний тиждень
  lastWeekChange: string; // дата останньої зміни тижня
  theme: 'light' | 'dark'; // тема інтерфейсу
  customBackground?: string; // URL кастомного фону або ID градієнта
  backgroundId?: string; // ID вибраного preset-градієнта
}
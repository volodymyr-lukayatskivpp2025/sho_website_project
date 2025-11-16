import { useState } from 'react';
import { Moon, Sun, Image as ImageIcon, X, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../types';
import { DEFAULT_BACKGROUNDS } from '../utils/backgrounds';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export function SettingsView({ user, onUpdateUser }: SettingsViewProps) {
  const [customBgUrl, setCustomBgUrl] = useState('');

  const handleThemeChange = (theme: 'light' | 'dark') => {
    onUpdateUser({ ...user, theme });
  };

  const handleBackgroundChange = (backgroundId: string) => {
    onUpdateUser({ ...user, backgroundId, customBackground: undefined });
  };

  const handleCustomBackground = () => {
    if (customBgUrl.trim()) {
      onUpdateUser({ ...user, customBackground: `url(${customBgUrl})`, backgroundId: undefined });
      setCustomBgUrl('');
    }
  };

  const removeCustomBackground = () => {
    onUpdateUser({ ...user, customBackground: undefined, backgroundId: undefined });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-400 rounded-lg flex items-center justify-center">
            {user.theme === 'dark' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-gray-100">Тема інтерфейсу</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Вибери світлу або темну тему</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-xl border-2 transition-all ${
              user.theme === 'light'
                ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-teal-100 rounded-lg flex items-center justify-center">
                <Sun className="w-6 h-6 text-violet-600" />
              </div>
              <div className="text-left">
                <p className="text-gray-900 dark:text-gray-100">Світла</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Класична тема</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-xl border-2 transition-all ${
              user.theme === 'dark'
                ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-gray-900 dark:text-gray-100">Темна</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Для роботи вночі</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Background Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-gray-100">Задній фон</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Обери готовий градієнт або додай свій</p>
          </div>
        </div>

        {/* Preset Backgrounds */}
        <div className="grid grid-cols-3 gap-3">
          {DEFAULT_BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => handleBackgroundChange(bg.id)}
              className={`relative h-24 rounded-xl border-2 transition-all overflow-hidden ${
                user.backgroundId === bg.id
                  ? 'border-violet-400 ring-2 ring-violet-200'
                  : 'border-gray-200 dark:border-gray-700 hover:border-violet-200'
              }`}
              style={{ background: bg[user.theme] }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-all">
                <span className="text-xs text-gray-700 dark:text-gray-300 px-2 py-1 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                  {bg.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Background URL */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Label htmlFor="customBg" className="text-gray-900 dark:text-gray-100">
            Кастомний фон (URL зображення)
          </Label>
          <div className="flex gap-2">
            <Input
              id="customBg"
              type="url"
              value={customBgUrl}
              onChange={(e) => setCustomBgUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
            <Button
              onClick={handleCustomBackground}
              disabled={!customBgUrl.trim()}
              className="bg-violet-400 hover:bg-violet-500 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Додати
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Підказка: Використовуй посилання на зображення з Unsplash, Pexels або інших безкоштовних джерел
          </p>
        </div>

        {/* Current Custom Background */}
        {user.customBackground && !DEFAULT_BACKGROUNDS.find(bg => bg[user.theme] === user.customBackground) && (
          <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-16 h-16 rounded-lg border-2 border-white dark:border-gray-700 shadow-sm"
                style={{ background: user.customBackground, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div>
                <p className="text-sm text-gray-900 dark:text-gray-100">Поточний кастомний фон</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Застосовано до додатку</p>
              </div>
            </div>
            <Button
              onClick={removeCustomBackground}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="w-4 h-4 mr-1" />
              Видалити
            </Button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          ℹ️ <span>Усі налаштування зберігаються локально на твоєму пристрої</span>
        </p>
      </div>
    </div>
  );
}
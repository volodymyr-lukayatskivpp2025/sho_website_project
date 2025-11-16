import { useState } from 'react';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import logo from 'figma:asset/1c48c0d0410a0300d245194d4d6c84495a6138c4.png';

interface LoginScreenProps {
  onLogin: (email: string, showProfileSetup: boolean) => void;
}

interface FieldError {
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreement?: string;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [generalError, setGeneralError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');
    const errors: FieldError = {};

    // Валідація полів
    if (!email.trim()) {
      errors.email = 'Це поле не може бути порожнім';
    } else {
      // Перевірка формату email
      const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\.pp\.2025@lpnu\.ua$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Введіть дійсну адресу пошти у форматі: ім\'я.прізвище.pp.2025@lpnu.ua';
      }
    }

    if (!password.trim()) {
      errors.password = 'Це поле не може бути порожнім';
    } else if (password.length < 6) {
      errors.password = 'Пароль занадто короткий (мінімум 6 символів)';
    }

    if (isRegistering) {
      if (!confirmPassword.trim()) {
        errors.confirmPassword = 'Це поле не може бути порожнім';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Паролі не співпадають';
      }
    }

    if (!agreed) {
      errors.agreement = 'Ви маєте погодитись з умовами';
    }

    // Якщо є помилки, показуємо їх
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Симуляція відповіді сервера
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      if (isRegistering) {
        // РЕЄСТРАЦІЯ через Email → завжди показати екран "Оберіть нікнейм"
        setRegistrationSuccess(true);
        setTimeout(() => {
          onLogin(email, true); // true = показати ProfileSetup
        }, 1500);
      } else {
        // ЛОГІН через Email → завжди пропустити налаштування
        onLogin(email, false); // false = пропустити ProfileSetup
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // Перевірка чи користувач погодився
    if (!agreed) {
      setFieldErrors({ agreement: 'Підтвердіть, будь ласка, щоб продовжити' });
      return;
    }

    // Симуляція Google OAuth
    const names = ['Олександр', 'Марія', 'Іван', 'Анна', 'Максим', 'Софія'];
    const surnames = ['Коваленко', 'Шевченко', 'Бойко', 'Мельник', 'Петренко', 'Іваненко'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
    const generatedEmail = `${randomName}.${randomSurname}.pp.2025@lpnu.ua`;
    
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      
      if (isRegistering) {
        // РЕЄСТРАЦІЯ через Google → завжди показати екран "Оберіть нікнейм"
        onLogin(generatedEmail, true); // true = показати ProfileSetup
      } else {
        // ЛОГІН через Google → завжди пропустити налаштування
        onLogin(generatedEmail, false); // false = пропустити ProfileSetup
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="ШО Logo" className="w-40 h-40 object-contain" />
          </div>
          <p className="text-gray-700 mb-2">Слава Ісусу Христу🙏</p>
          <p className="text-gray-600">
            Вас вітає <span className="text-violet-500">ШО</span> - Шикарне Оповіщення
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full mb-6 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Вхід через Google
        </button>

        {googleError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {googleError}
          </div>
        )}

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">або</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">Увійдіть через корпоративну пошту LPNU</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Електронна пошта"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.email 
                    ? 'border-red-300 focus:ring-red-300' 
                    : 'border-violet-200 focus:ring-violet-300'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введіть пароль"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.password 
                    ? 'border-red-300 focus:ring-red-300' 
                    : 'border-violet-200 focus:ring-violet-300'
                }`}
              />
            </div>
            {fieldErrors.password && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.password}
              </div>
            )}
          </div>

          {isRegistering && (
            <div>
              <label className="block text-gray-700 mb-2">Підтвердження пароля</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Підтвердіть пароль"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.confirmPassword 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-violet-200 focus:ring-violet-300'
                  }`}
                />
              </div>
              {fieldErrors.confirmPassword && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.confirmPassword}
                </div>
              )}
            </div>
          )}

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="w-5 h-5 appearance-none border-2 border-violet-300 rounded checked:bg-violet-400 checked:border-violet-400 focus:ring-2 focus:ring-violet-300 cursor-pointer"
              />
              {agreed && (
                <svg
                  className="absolute w-5 h-5 text-white pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <label htmlFor="agreement" className="text-sm text-gray-700 cursor-pointer">
              Слава Навіки Богу🙌🕊️
            </label>
          </div>

          {fieldErrors.agreement && (
            <div className="text-red-500 text-sm mt-1">
              {fieldErrors.agreement}
            </div>
          )}

          {generalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {generalError}
            </div>
          )}

          {registrationSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Реєстрація успішна!
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-400 text-white py-3 rounded-lg hover:bg-violet-500 transition-colors text-center flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isRegistering ? 'Зареєструватися' : 'Увійти'}
          </button>

          {/* Toggle between login and register */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setFieldErrors({});
                setGeneralError('');
                setConfirmPassword('');
                setRegistrationSuccess(false);
              }}
              className="text-sm text-violet-600 hover:text-violet-700 transition-colors"
            >
              {isRegistering ? (
                <>Вже є акаунт? <span className="underline">Увійти</span></>
              ) : (
                <>Ще не з нами? <span className="underline">Приєднатися</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
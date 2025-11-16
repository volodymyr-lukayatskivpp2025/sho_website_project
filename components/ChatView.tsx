import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Sparkles, Calendar, BookOpen, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { 
  numeratorSubgroup1, 
  numeratorSubgroup2, 
  denominatorSubgroup1, 
  denominatorSubgroup2 
} from '../data/mockData';
import { Homework } from '../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatViewProps {
  currentUser: string;
  userAvatar: string;
  userSubgroup: 1 | 2;
  weekType: 'numerator' | 'denominator';
}

export function ChatView({ currentUser, userAvatar, userSubgroup, weekType }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Завантажити повідомлення з localStorage
    const saved = localStorage.getItem('chatMessages');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      // Вітальне повідомлення
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: 'Привіт! 👋 Я ШО ШІ - твій AI-помічник для навчання. Наразі я перебуваю в режимі очікування підключення до AI-сервісу. Незабаром я зможу допомогти тобі з навчальними питаннями, розкладом та домашніми завданнями! 🎓✨',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('chatMessages', JSON.stringify([welcomeMessage]));
    }
  }, []);

  useEffect(() => {
    // Прокрутка до низу при нових повідомленнях
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: '🤖 Дякую за повідомлення! Наразі AI-функціонал ще не підключено, але я вже записав твоє питання. Незабаром я зможу надати тобі повноцінну допомогу! ✨',
      sender: 'bot',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage, botResponse];
    setMessages(newMessages);
    localStorage.setItem('chatMessages', JSON.stringify(newMessages));
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getScheduleForTomorrow = () => {
    const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = days[tomorrow.getDay()];

    // Вибрати правильний розклад базуючись на типі тижня
    let allSchedule = [];
    if (weekType === 'numerator') {
      allSchedule = [...numeratorSubgroup1];
      if (userSubgroup === 2) {
        allSchedule.push(...numeratorSubgroup2);
      }
    } else {
      allSchedule = [...denominatorSubgroup1];
      if (userSubgroup === 2) {
        allSchedule.push(...denominatorSubgroup2);
      }
    }

    const tomorrowClasses = allSchedule
      .filter(c => c.day === tomorrowDay && (c.subgroup === null || c.subgroup === userSubgroup))
      .sort((a, b) => a.time.localeCompare(b.time));

    if (tomorrowClasses.length === 0) {
      return `📅 На ${tomorrowDay.toLowerCase()} у тебе немає пар! Можеш відпочити 😊`;
    }

    let response = `📅 Розклад на ${tomorrowDay.toLowerCase()}:\n\n`;
    tomorrowClasses.forEach((cls, index) => {
      const typeEmoji = cls.type === 'lecture' ? '📖' : cls.type === 'practice' ? '✍️' : '🔬';
      response += `${index + 1}. ${typeEmoji} ${cls.time}\n${cls.subject}\n${cls.teacher}\n📍 ${cls.room}\n\n`;
    });

    return response.trim();
  };

  const getHomeworkForWeek = () => {
    const savedHomework = localStorage.getItem('homework');
    if (!savedHomework) {
      return '📚 На цей тиждень у тебе немає записаних домашніх завдань! Можливо, варто щось додати? 😊';
    }

    const homework: Homework[] = JSON.parse(savedHomework);
    if (homework.length === 0) {
      return '📚 На цей тиждень у тебе немає записаних домашніх завдань! Можливо, варто щось додати? 😊';
    }

    let response = '📚 Домашні завдання на цей тиждень:\n\n';
    homework.forEach((hw, index) => {
      const status = hw.completed ? '✅' : '⏳';
      response += `${index + 1}. ${status} ${hw.subject}\n${hw.description}\n📅 До: ${new Date(hw.dueDate).toLocaleDateString('uk-UA')}\n`;
      if (hw.subgroup) {
        response += `👥 Підгрупа ${hw.subgroup}\n`;
      }
      response += '\n';
    });

    return response.trim();
  };

  const getFAQ = () => {
    return `❓ Часто запитувані питання (ЧЗП):\n\n1. Як змінити тип тижня (чисельник/знаменник)?\n   → Перейди в розділ "Розклад" і натисни на кнопку з поточним типом тижня\n\n2. Як додати домашнє завдання?\n   → Розділ "ДЗ" → кнопка "+" → заповни форму\n\n3. Як створити пост на форумі?\n   → Розділ "ШО там?" → кнопка "Створити пост"\n\n4. Де знайти розклад для моєї підгрупи?\n   → Розклад автоматично показує пари для твоєї підгрупи (підгрупа ${userSubgroup})\n\n5. Як змінити свій аватар або нікнейм?\n   → Наразі це можна зробити лише при новій реєстрації. Функція редагування профілю буде додана пізніше!\n\n6. Чи можу я видалити повідомлення в чаті?\n   → Наразі ця функція недоступна, але буде додана в наступних оновленнях\n\n7. Коли буде підключено AI?\n   → AI-функціонал знаходиться в розробці і буде доступний незабаром! 🚀`;
  };

  const handleQuickAction = (action: 'schedule' | 'homework' | 'faq' | 'vns') => {
    let botText = '';
    
    if (action === 'schedule') {
      botText = getScheduleForTomorrow();
    } else if (action === 'homework') {
      botText = getHomeworkForWeek();
    } else if (action === 'faq') {
      botText = getFAQ();
    } else if (action === 'vns') {
      window.open('https://vns.lpnu.ua/', '_blank');
      botText = '🌐 Відкриваю ВНС (Віртуальне навчальне середовище ЛПНУ)...\n\nПосилання відкрито в новій вкладці! 📖';
    }

    const actionNames = {
      'schedule': 'Які пари завтра?',
      'homework': 'Перелік дз на цей тиждень',
      'faq': 'ЧЗП',
      'vns': 'ВНС'
    };

    const userMessage: Message = {
      id: Date.now().toString(),
      text: actionNames[action],
      sender: 'user',
      timestamp: new Date(),
    };

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: botText,
      sender: 'bot',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage, botResponse];
    setMessages(newMessages);
    localStorage.setItem('chatMessages', JSON.stringify(newMessages));
  };

  return (
    <div className="h-[600px] flex flex-col bg-white dark:bg-gray-700 rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-violet-100 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-teal-50 dark:from-violet-900/30 dark:to-teal-900/30 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 dark:from-violet-600 dark:to-purple-700 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 dark:bg-green-500 border-2 border-white dark:border-gray-700 rounded-full"></div>
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              ШО ШІ
              <span className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 px-2 py-0.5 rounded-full">Beta</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Твій розумний помічник</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'bot'
                  ? 'bg-gradient-to-br from-violet-400 to-teal-400'
                  : 'bg-violet-200'
              }`}>
                {message.sender === 'bot' ? (
                  <Sparkles className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-sm">{userAvatar}</span>
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`flex flex-col max-w-[70%] ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-violet-400 dark:bg-violet-600 text-white rounded-tr-sm'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-2">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-violet-100 bg-gray-50 dark:bg-gray-800 rounded-b-xl space-y-3">
        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleQuickAction('schedule')}
            variant="outline"
            className="flex items-center gap-2 text-xs border-violet-200 hover:bg-violet-50 hover:border-violet-400"
          >
            <Calendar className="w-4 h-4" />
            Які пари завтра?
          </Button>
          <Button
            onClick={() => handleQuickAction('homework')}
            variant="outline"
            className="flex items-center gap-2 text-xs border-teal-200 hover:bg-teal-50 hover:border-teal-400"
          >
            <BookOpen className="w-4 h-4" />
            Перелік дз на тиждень
          </Button>
          <Button
            onClick={() => handleQuickAction('faq')}
            variant="outline"
            className="flex items-center gap-2 text-xs border-blue-200 hover:bg-blue-50 hover:border-blue-400"
          >
            <HelpCircle className="w-4 h-4" />
            ЧЗП
          </Button>
          <Button
            onClick={() => handleQuickAction('vns')}
            variant="outline"
            className="flex items-center gap-2 text-xs border-purple-200 hover:bg-purple-50 hover:border-purple-400"
          >
            <ExternalLink className="w-4 h-4" />
            ВНС
          </Button>
        </div>

        {/* Input field */}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Напиши своє питання..."
            className="min-h-[60px] max-h-[120px] resize-none border-violet-200 focus:border-violet-400"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-violet-400 to-teal-400 hover:from-violet-500 hover:to-teal-500 text-white px-6 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          💡 Підказка: Натисни Enter для відправки, Shift+Enter для нового рядка
        </p>
      </div>
    </div>
  );
}
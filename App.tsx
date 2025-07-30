
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Message, Destination } from './types';
import { getSystemInstruction, EXAMPLE_PROMPTS, LANGUAGES } from './constants';
import { geminiService } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './WelcomeScreen';
import MapComponent from './components/MapComponent';
import RwandaIcon from './components/icons/RwandaIcon';
import PlusIcon from './components/icons/PlusIcon';
import LoginScreen from './components/LoginScreen';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';

const UI_TEXT: Record<string, Record<string, string>> = {
  title: { en: "Rwanda Travel Buddy", fr: "Copain de Voyage au Rwanda", rw: "Inshuti y'Urugendo mu Rwanda", sw: "Rafiki wa Kusafiri Rwanda", es: "Compañero de Viaje de Ruanda", de: "Ruanda Reise-Kumpel", zh: "卢旺达旅行伙伴", hi: "रवांडा यात्रा बडी", ar: "رفيق السفر في رواندا", pt: "Amigo de Viagem para Ruanda", ja: "ルワンダ旅行の相棒", ru: "Помощник в путешествии по Руанде" },
  newChat: { en: "New Chat", fr: "Nouveau Chat", rw: "Ikiganiro Gishya", sw: "Gumzo Jipya", es: "Nuevo Chat", de: "Neuer Chat", zh: "新聊天", hi: "नई चैट", ar: "دردشة جديدة", pt: "Novo Chat", ja: "新しいチャット", ru: "Новый чат" },
  back: { en: "Back", fr: "Retour", rw: "Subira", sw: "Rudi", es: "Atrás", de: "Zurück", zh: "返回", hi: "वापस", ar: "رجوع", pt: "Voltar", ja: "戻る", ru: "Назад" },
  login: { en: "Login", fr: "Connexion", rw: "Injira", sw: "Ingia", es: "Iniciar Sesión", de: "Anmelden", zh: "登录", hi: "लॉग इन करें", ar: "تسجيل الدخول", pt: "Entrar", ja: "ログイン", ru: "Войти" },
  logout: { en: "Logout", fr: "Déconnexion", rw: "Sohoka", sw: "Toka", es: "Cerrar Sesión", de: "Abmelden", zh: "登出", hi: "लॉग आउट", ar: "تسجيل الخروج", pt: "Sair", ja: "ログアウト", ru: "Выйти" },
  loginTitle: { en: "Welcome Back", fr: "Content de vous revoir", rw: "Ikaze Garuka", sw: "Karibu Tena", es: "Bienvenido de Nuevo", de: "Willkommen zurück", zh: "欢迎回来", hi: "वापसी पर स्वागत है", ar: "مرحبا بعودتك", pt: "Bem-vindo de Volta", ja: "おかえりなさい", ru: "С возвращением" },
  loginSubtitle: { en: "Sign in to continue your journey.", fr: "Connectez-vous pour continuer votre voyage.", rw: "Injira kugirango ukomeze urugendo rwawe.", sw: "Ingia ili kuendelea na safari yako.", es: "Inicia sesión para continuar tu viaje.", de: "Melden Sie sich an, um Ihre Reise fortzusetzen.", zh: "登录以继续您的旅程。", hi: "अपनी यात्रा जारी रखने के लिए साइन इन करें।", ar: "سجل الدخول لمواصلة رحلتك.", pt: "Faça login para continuar sua jornada.", ja: "旅を続けるにはサインインしてください。", ru: "Войдите, чтобы продолжить свое путешествие." },
  signInGoogle: { en: "Sign in with Google", fr: "Se connecter avec Google", rw: "Injira na Google", sw: "Ingia na Google", es: "Iniciar sesión con Google", de: "Mit Google anmelden", zh: "使用谷歌登录", hi: "Google के साथ साइन इन करें", ar: "تسجيل الدخول باستخدام جوجل", pt: "Entrar com o Google", ja: "Googleでサインイン", ru: "Войти через Google" },
  signInFacebook: { en: "Sign in with Facebook", fr: "Se connecter avec Facebook", rw: "Injira na Facebook", sw: "Ingia na Facebook", es: "Iniciar sesión con Facebook", de: "Mit Facebook anmelden", zh: "使用Facebook登录", hi: "फेसबुक के साथ साइन इन करें", ar: "تسجيل الدخول باستخدام فيسبوك", pt: "Entrar com o Facebook", ja: "Facebookでサインイン", ru: "Войти через Facebook" },
  signInApple: { en: "Sign in with Apple", fr: "Se connecter avec Apple", rw: "Injira na Apple", sw: "Ingia na Apple", es: "Iniciar sesión con Apple", de: "Mit Apple anmelden", zh: "使用Apple登录", hi: "Apple के साथ साइन इन करें", ar: "تسجيل الدخول باستخدام أبل", pt: "Entrar com a Apple", ja: "Appleでサインイン", ru: "Войти через Apple" },
  signInLinkedin: { en: "Sign in with LinkedIn", fr: "Se connecter avec LinkedIn", rw: "Injira na LinkedIn", sw: "Ingia na LinkedIn", es: "Iniciar sesión con LinkedIn", de: "Mit LinkedIn anmelden", zh: "使用领英登录", hi: "लिंक्डइन के साथ साइन इन करें", ar: "تسجيل الدخول باستخدام لينكد إن", pt: "Entrar com o LinkedIn", ja: "LinkedInでサインイン", ru: "Войти через LinkedIn" },
  signInInstagram: { en: "Sign in with Instagram", fr: "Se connecter avec Instagram", rw: "Injira na Instagram", sw: "Ingia na Instagram", es: "Iniciar sesión con Instagram", de: "Mit Instagram anmelden", zh: "使用Instagram登录", hi: "इंस्टाग्राम के साथ साइन इन करें", ar: "تسجيل الدخول باستخدام انستجرام", pt: "Entrar com o Instagram", ja: "Instagramでサインイン", ru: "Войти через Instagram" },
  signInX: { en: "Sign in with X", fr: "Se connecter avec X", rw: "Injira na X", sw: "Ingia na X", es: "Iniciar sesión con X", de: "Mit X anmelden", zh: "使用X登录", hi: "X के साथ साइन इन करें", ar: "تسجيل الدخول باستخدام إكس", pt: "Entrar com o X", ja: "Xでサインイン", ru: "Войти через X" },
  signInEmail: { en: "Sign in with Email", fr: "Se connecter avec Email", rw: "Injira na imeri", sw: "Ingia na Barua pepe", es: "Iniciar sesión con Email", de: "Mit E-Mail anmelden", zh: "使用电子邮件登录", hi: "ईमेल के साथ साइन इन करें", ar: "تسجيل الدخول باستخدام البريد الإلكتروني", pt: "Entrar com o Email", ja: "メールでサインイン", ru: "Войти по электронной почте" },
  or: { en: "OR", fr: "OU", rw: "CYANGWA", sw: "AU", es: "O", de: "ODER", zh: "或", hi: "या", ar: "أو", pt: "OU", ja: "または", ru: "ИЛИ" },
  welcomeTitle: { en: "Welcome to your Rwanda Travel Buddy!", fr: "Bienvenue chez votre Copain de Voyage au Rwanda!", rw: "Ikaze ku Nshuti y'Urugendo yawe mu Rwanda!", sw: "Karibu kwa Rafiki yako wa Kusafiri Rwanda!", es: "¡Bienvenido a tu Compañero de Viaje de Ruanda!", de: "Willkommen bei deinem Ruanda Reise-Kumpel!", zh: "欢迎使用您的卢旺达旅行伙伴！", hi: "आपके रवांडा यात्रा बडी में आपका स्वागत है!", ar: "أهلاً بك في رفيق سفرك في رواندا!", pt: "Bem-vindo ao seu Amigo de Viagem para Ruanda!", ja: "あなたのルワンダ旅行の相棒へようこそ！", ru: "Добро пожаловать в ваш Помощник в путешествии по Руанде!" },
  welcomeSubtitle: { en: "I can help you plan your trip. Ask me anything about Rwanda!", fr: "Je peux vous aider à planifier votre voyage. Demandez-moi n'importe quoi sur le Rwanda!", rw: "Nshobora kugufasha gutegura urugendo rwawe. Mbaza ikibazo cyose ushaka kumenya ku Rwanda!", sw: "Ninaweza kukusaidia kupanga safari yako. Niulize chochote kuhusu Rwanda!", es: "Puedo ayudarte a planificar tu viaje. ¡Pregúntame cualquier cosa sobre Ruanda!", de: "Ich kann dir bei der Planung deiner Reise helfen. Frag mich alles über Ruanda!", zh: "我可以帮你规划行程。关于卢旺达的任何事情都可以问我！", hi: "मैं आपकी यात्रा की योजना बनाने में मदद कर सकता हूँ। रवांडा के बारे में मुझसे कुछ भी पूछें!", ar: "يمكنني مساعدتك في التخطيط لرحلتك. اسألني أي شيء عن رواندا!", pt: "Posso ajudar a planejar sua viagem. Pergunte-me qualquer coisa sobre Ruanda!", ja: "あなたの旅行の計画をお手伝いします。ルワンダについて何でも聞いてください！", ru: "Я могу помочь вам спланировать поездку. Спрашивайте меня о чем угодно в Руанде!" },
  promptHeader: { en: "Try one of these prompts:", fr: "Essayez l'une de ces suggestions :", rw: "Gerageza kimwe muri ibi bibazo:", sw: "Jaribu mojawapo ya vidokezo hivi:", es: "Prueba una de estas sugerencias:", de: "Versuche eine dieser Anregungen:", zh: "试试以下提示之一：", hi: "इनमें से कोई एक संकेत आज़माएँ:", ar: "جرب إحدى هذه المطالبات:", pt: "Experimente uma destas sugestões:", ja: "これらのプロンプトのいずれかをお試しください：", ru: "Попробуйте один из этих запросов:" },
  inputPlaceholder: { en: "Ask about your trip to Rwanda...", fr: "Posez une question sur votre voyage au Rwanda...", rw: "Baza ikibazo ku rugendo rwawe mu Rwanda...", sw: "Uliza kuhusu safari yako ya kwenda Rwanda...", es: "Pregunta sobre tu viaje a Ruanda...", de: "Frage nach deiner Reise nach Ruanda...", zh: "询问关于您的卢ワンダ之旅...", hi: " अपनी रवांडा यात्रा के बारे में पूछें...", ar: "اسأل عن رحلتك إلى رواندا...", pt: "Pergunte sobre sua viagem para Ruanda...", ja: "ルワンダへの旅行について質問してください...", ru: "Спросите о вашей поездке в Руанду..." }
};

type Provider = 'google' | 'facebook' | 'apple' | 'linkedin' | 'instagram' | 'x' | 'email';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(-1);
  const [language, setLanguage] = useState('English');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const langCode = LANGUAGES.find(l => l.name === language)?.code || 'en';
  const t = (key: keyof typeof UI_TEXT) => UI_TEXT[key]?.[langCode] || UI_TEXT[key]['en'];

  const initializeChat = useCallback(() => {
    try {
      const instruction = getSystemInstruction(language);
      const newChat = geminiService.createChat(instruction);
      setChat(newChat);
      setMessages([]);
      setDestinations([]);
      setCurrentDestinationIndex(-1);
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to initialize AI Chat: ${e.message}. Please ensure your API key is set correctly.`);
      } else {
        setError("An unknown error occurred during initialization.");
      }
    }
  }, [language]);

  useEffect(() => {
    if (isLoggedIn) {
      initializeChat();
    }
  }, [isLoggedIn, initializeChat]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (isLoading || !chat) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage, { role: 'model', content: '' }]);

    try {
      let fullResponse = '';
      const stream = await chat.sendMessageStream({ message: prompt });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'model') {
            lastMessage.content += chunkText;
          }
          return newMessages;
        });
      }

      const matches = fullResponse.matchAll(/\[MAP:(-?\d+\.?\d*),(-?\d+\.?\d*),(.*?)\]/g);
      const newDestinations: Destination[] = [];
      for (const match of matches) {
        const [, lat, lng, name] = match;
        newDestinations.push({ lat: parseFloat(lat), lng: parseFloat(lng), name: name.trim() });
      }

      if (newDestinations.length > 0) {
        setDestinations(prevDests => {
            const updatedDestinations = [...prevDests, ...newDestinations];
            setCurrentDestinationIndex(prevDests.length); // Set index to the first of the newly added destinations
            return updatedDestinations;
        });
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(`Error from AI: ${errorMessage}`);
      setMessages(prev => prev.slice(0, -1)); // Remove the placeholder
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);
  
  const handleGetDirections = useCallback((dest: Destination) => {
      if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser.");
          return;
      }

      navigator.geolocation.getCurrentPosition(
          (position) => {
              const { latitude, longitude } = position.coords;
              const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${dest.lat},${dest.lng}`;
              window.open(url, '_blank', 'noopener,noreferrer');
          },
          () => {
              setError("Unable to retrieve your location. Please enable location services in your browser settings.");
          }
      );
  }, []);

  const handlePrevDestination = useCallback(() => {
    setCurrentDestinationIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const handleNextDestination = useCallback(() => {
    setCurrentDestinationIndex(prev => Math.min(prev + 1, destinations.length - 1));
  }, [destinations.length]);

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleNewChat = () => {
    initializeChat();
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleLoginSuccess = (provider: Provider) => {
    // In a real app, you'd handle the auth flow here.
    // For this demo, we'll just simulate a successful login.
    setUser({ name: provider });
    setIsLoggedIn(true);
  };
  
  const currentDestination = destinations[currentDestinationIndex] || null;

  if (!isLoggedIn) {
    return (
        <LoginScreen
            onLogin={handleLoginSuccess}
            texts={{
                loginSubtitle: t('loginSubtitle'),
                signInGoogle: t('signInGoogle'),
                signInFacebook: t('signInFacebook'),
                signInApple: t('signInApple'),
                signInLinkedin: t('signInLinkedin'),
                signInInstagram: t('signInInstagram'),
                signInX: t('signInX'),
                signInEmail: t('signInEmail'),
                or: t('or'),
            }}
            welcomeTitle={t('welcomeTitle')}
        />
    );
  }

  return (
    <div
      className="flex flex-col h-screen font-sans bg-cover bg-center bg-fixed text-gray-800 dark:text-gray-200"
      style={{
        backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.6), rgba(10, 10, 10, 0.6)), linear-gradient(135deg, #00A1DE 0%, #FAD201 50%, #20603D 100%)'
      }}
    >
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RwandaIcon className="h-8 w-8 text-[#00A1DE]" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{t('title')}</h1>
          </div>
          <div className="flex items-center space-x-4">
             {messages.length > 0 && (
              <>
                <button
                  onClick={handleNewChat}
                  className="flex items-center space-x-2 px-3 py-2 border border-transparent rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  aria-label={t('back')}
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>{t('back')}</span>
                </button>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              </>
            )}
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-2 px-3 py-2 border border-transparent rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Start new chat"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{t('newChat')}</span>
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-50/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-800 dark:text-gray-200"
              aria-label="Select language"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.name}>{lang.name}</option>
              ))}
            </select>
            {user && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold" title={`Logged in with ${user.name}`}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    aria-label="Logout"
                >
                    {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <aside className="md:w-2/5 xl:w-1/3 h-64 md:h-auto border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
           <MapComponent
             destination={currentDestination}
             onGetDirections={handleGetDirections}
             onPrev={handlePrevDestination}
             onNext={handleNextDestination}
             currentIndex={currentDestinationIndex}
             totalDestinations={destinations.length}
            />
        </aside>

        <div className="flex-1 flex flex-col bg-black/20 dark:bg-black/40">
           <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                {messages.length === 0 && !isLoading && <WelcomeScreen onPromptClick={handlePromptClick} prompts={EXAMPLE_PROMPTS} welcomeTitle={t('welcomeTitle')} welcomeSubtitle={t('welcomeSubtitle')} promptHeader={t('promptHeader')} />}
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                    ))}
                    {isLoading && messages[messages.length -1]?.role === 'user' && (
                    <ChatMessage message={{role: 'model', content: ''}} isLoading={true} />
                    )}
                </div>
                </div>
            </main>

            <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="max-w-4xl mx-auto">
                {error && (
                    <div className="mb-2 text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-2 rounded-md">
                    <p>{error}</p>
                    </div>
                )}
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} placeholder={t('inputPlaceholder')} />
                </div>
            </footer>
        </div>
      </div>
    </div>
  );
};

export default App;

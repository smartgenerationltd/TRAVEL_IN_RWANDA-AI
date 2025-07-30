
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Message, Destination } from './types';
import { getSystemInstruction, LANGUAGES } from './constants';
import { geminiService } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './WelcomeScreen';
import MapComponent from './components/MapComponent';
import RwandaIcon from './components/icons/RwandaIcon';
import PlusIcon from './components/icons/PlusIcon';
import LoginScreen from './components/LoginScreen';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';
import CreditIcon from './components/icons/CreditIcon';
import PaymentModal from './components/PaymentModal';
import UpgradeIcon from './components/icons/UpgradeIcon';
import CrownIcon from './components/icons/CrownIcon';

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
  prompt1: { en: "Tell me about Rwanda's national parks.", fr: "Parlez-moi des parcs nationaux du Rwanda.", rw: "Mbwira ibya za pariki z'igihugu z'u Rwanda.", sw: "Niambie kuhusu mbuga za kitaifa za Rwanda.", es: "Háblame de los parques nacionales de Ruanda.", de: "Erzählen Sie mir von Ruandas Nationalparks.", zh: "告诉我关于卢旺达国家公园的信息。", hi: "मुझे रवांडा के राष्ट्रीय उद्यानों के बारे में बताएं।", ar: "أخبرني عن المتنزهات الوطنية في رواندا.", pt: "Fale-me sobre os parques nacionais de Ruanda.", ja: "ルワンダの国立公園について教えてください。", ru: "Расскажите мне о национальных парках Руанды." },
  prompt2: { en: "Where is the Kigali Genocide Memorial?", fr: "Où se trouve le Mémorial du génocide de Kigali ?", rw: "Urwibutso rwa Jenoside rwa Kigali ruri he?", sw: "Kumbukumbu ya Mauaji ya Kimbari ya Kigali iko wapi?", es: "¿Dónde está el Memorial del Genocidio de Kigali?", de: "Wo ist das Kigali Genocide Memorial?", zh: "基加利种族灭绝纪念馆在哪里？", hi: "किगाली नरसंहार स्मारक कहाँ है?", ar: "أين يقع نصب كيغالي التذكاري للإبادة الجماعية؟", pt: "Onde fica o Memorial do Genocídio de Kigali?", ja: "キガリ虐殺記念館はどこにありますか？", ru: "Где находится Мемориал геноцида в Кигали?" },
  prompt3: { en: "What are the top 5 things to do in Kigali?", fr: "Quelles sont les 5 meilleures choses à faire à Kigali ?", rw: "Ni ibihe bintu 5 by'ingenzi byo gukorera i Kigali?", sw: "Mambo 5 bora ya kufanya Kigali ni yapi?", es: "¿Cuáles son las 5 mejores cosas que hacer en Kigali?", de: "Was sind die Top 5 Aktivitäten in Kigali?", zh: "在基加利最值得做的5件事是什么？", hi: "किगाली में करने के लिए शीर्ष 5 चीजें क्या हैं?", ar: "ما هي أفضل 5 أشياء يمكن القيام بها في كيغالي؟", pt: "Quais são as 5 melhores coisas para fazer em Kigali?", ja: "キガリでやるべきことトップ5は何ですか？", ru: "Чем заняться в Кигали: топ-5?" },
  prompt4: { en: "How do I get from Kigali to Volcanoes National Park?", fr: "Comment puis-je me rendre de Kigali au Parc National des Volcans ?", rw: "Ngera nte muri Pariki y'Igihugu y'Ibirunga mvuye i Kigali?", sw: "Ninawezaje kufika kutoka Kigali hadi Hifadhi ya Taifa ya Volcanoes?", es: "¿Cómo llego desde Kigali al Parque Nacional de los Volcanes?", de: "Wie komme ich von Kigali zum Volcanoes-Nationalpark?", zh: "我如何从基加利前往火山国家公园？", hi: "मैं किगाली से ज्वालामुखी राष्ट्रीय उद्यान कैसे पहुँचूँ?", ar: "كيف أصل من كيغالي إلى حديقة البراكين الوطنية؟", pt: "Como chego de Kigali ao Parque Nacional dos Vulcões?", ja: "キガリから火山国立公園への行き方を教えてください。", ru: "Как добраться из Кигали в Национальный парк вулканов?" },
  prompt5: { en: "Tell me about Rwandan food.", fr: "Parlez-moi de la nourriture rwandaise.", rw: "Mbwira ku byerekeye amafunguro yo mu Rwanda.", sw: "Niambie kuhusu chakula cha Rwanda.", es: "Háblame de la comida ruandesa.", de: "Erzählen Sie mir vom ruandischen Essen.", zh: "告诉我关于卢旺达美食的信息。", hi: "मुझे रवांडा के भोजन के बारे में बताएं।", ar: "أخبرني عن الطعام الرواندي.", pt: "Fale-me sobre a comida ruandesa.", ja: "ルワンダの食べ物について教えてください。", ru: "Расскажите мне о руандийской еде." },
  prompt6: { en: "Is it safe to travel in Rwanda?", fr: "Est-il sûr de voyager au Rwanda ?", rw: "Gusura u Rwanda biratekanye?", sw: "Je, ni salama kusafiri nchini Rwanda?", es: "¿Es seguro viajar en Ruanda?", de: "Ist es sicher, in Ruanda zu reisen?", zh: "在卢旺达旅行安全吗？", hi: "क्या रवांडा में यात्रा करना सुरक्षित है?", ar: "هل السفر في رواندا آمن؟", pt: "É seguro viajar em Ruanda?", ja: "ルワンダの旅行は安全ですか？", ru: "Безопасно ли путешествовать по Руанде?" },
  prompt7: { en: "Can you teach me a few basic Kinyarwanda phrases?", fr: "Pouvez-vous m'apprendre quelques phrases de base en kinyarwanda ?", rw: "Wanyigisha interuro nkeya z'ibanze mu Kinyarwanda?", sw: "Unaweza kunifundisha misemo michache ya msingi ya Kinyarwanda?", es: "¿Puedes enseñarme algunas frases básicas en kinyarwanda?", de: "Können Sie mir ein paar grundlegende Kinyarwanda-Sätze beibringen?", zh: "你能教我一些基本的基尼亚卢旺达语短语吗？", hi: "क्या आप मुझे कुछ बुनियादी किन्यारवांडा वाक्यांश सिखा सकते हैं?", ar: "هل يمكنك تعليمي بعض العبارات الأساسية في الكينيارواندية؟", pt: "Você pode me ensinar algumas frases básicas em quiniaruanda?", ja: "基本的なキニヤルワンダ語のフレーズをいくつか教えてもらえますか？", ru: "Можете научить меня нескольким основным фразам на киньяруанда?" },
  prompt8: { en: "Tell me about Rwanda's museums and their locations.", fr: "Parlez-moi des musées du Rwanda et de leurs emplacements.", rw: "Mbwira ingoro ndangamurage z'u Rwanda n'aho ziherereye.", sw: "Niambie kuhusu makumbusho ya Rwanda na maeneo yake.", es: "Háblame de los museos de Ruanda y sus ubicaciones.", de: "Erzählen Sie mir von Ruandas Museen und ihren Standorten.", zh: "告诉我关于卢旺达博物馆及其位置的信息。", hi: "मुझे रवांडा के संग्रहालयों और उनके स्थानों के बारे में बताएं।", ar: "أخبرني عن متاحف رواندا ومواقعها.", pt: "Fale-me sobre os museus de Ruanda e suas localizações.", ja: "ルワンダの博物館とその場所について教えてください。", ru: "Расскажите мне о музеях Руанды и их расположении." },
  inputPlaceholder: { en: "Ask about your trip to Rwanda...", fr: "Posez une question sur votre voyage au Rwanda...", rw: "Baza ikibazo ku rugendo rwawe mu Rwanda...", sw: "Uliza kuhusu safari yako ya kwenda Rwanda...", es: "Pregunta sobre tu viaje a Ruanda...", de: "Frage nach deiner Reise nach Ruanda...", zh: "询问关于您的卢ワンダ之旅...", hi: " अपनी रवांडा यात्रा के बारे में पूछें...", ar: "اسأل عن رحلتك إلى رواندا...", pt: "Pergunte sobre sua viagem para Ruanda...", ja: "ルワンダへの旅行について質問してください...", ru: "Спросите о вашей поездке в Руанду..." },
  upgradeToContinue: { en: "Upgrade to Premium to continue", fr: "Passez à Premium pour continuer", rw: "Simbukira kuri Premium kugirango ukomeze", sw: "Boresha hadi Premium ili uendelee", es: "Actualiza a Premium para continuar", de: "Auf Premium upgraden, um fortzufahren", zh: "升级到高级版以继续", hi: "जारी रखने के लिए प्रीमियम में अपग्रेड करें", ar: "الترقية إلى بريميوم للمتابعة", pt: "Atualize para Premium para continuar", ja: "続行するにはプレミアムにアップグレードしてください", ru: "Перейдите на Премиум, чтобы продолжить" },
  creditsRemaining: { en: "Credits: {count}", fr: "Crédits : {count}", rw: "Inguzanyo: {count}", sw: "Salio: {count}", es: "Créditos: {count}", de: "Guthaben: {count}", zh: "积分: {count}", hi: "क्रेडिट: {count}", ar: "الرصيد: {count}", pt: "Créditos: {count}", ja: "クレジット: {count}", ru: "Кредиты: {count}" },
  paymentTitle: { en: "Upgrade to Premium", fr: "Passez à Premium", rw: "Simbukira kuri Premium", sw: "Boresha hadi Premium", es: "Actualizar a Premium", de: "Auf Premium upgraden", zh: "升级到高级版", hi: "प्रीमियम में अपग्रेड करें", ar: "الترقية إلى بريميوم", pt: "Atualizar para Premium", ja: "プレミアムにアップグレード", ru: "Перейти на Премиум" },
  paymentSubtitle: { en: "You've used your free messages. Upgrade for unlimited conversations!", fr: "Vous avez utilisé vos messages gratuits. Passez à Premium pour des conversations illimitées !", rw: "Wakoresheje ubutumwa bwawe bw'ubuntu. Simbukira kuri Premium kugirango ube n'ibiganiro bitagira iherezo!", sw: "Umetumia jumbe zako za bure. Boresha kwa mazungumzo yasiyo na kikomo!", es: "Has usado tus mensajes gratuitos. ¡Actualiza para tener conversaciones ilimitadas!", de: "Sie haben Ihre kostenlosen Nachrichten aufgebraucht. Upgraden Sie für unbegrenzte Unterhaltungen!", zh: "您已用完免费消息。升级以进行无限次对话！", hi: "आपने अपने मुफ्त संदेशों का उपयोग कर लिया है। असीमित बातचीत के लिए अपग्रेड करें!", ar: "لقد استخدمت رسائلك المجانية. قم بالترقية لمحادثات غير محدودة!", pt: "Você usou suas mensagens gratuitas. Atualize para conversas ilimitadas!", ja: "無料メッセージを使い切りました。無制限の会話のためにアップグレードしてください！", ru: "Вы использовали свои бесплатные сообщения. Обновитесь для неограниченных разговоров!" },
  howToUpgrade: { en: "How to Upgrade", fr: "Comment Mettre à Niveau", rw: "Uko wasimbukira ku isumbuye", sw: "Jinsi ya Kuboresha", es: "Cómo Actualizar", de: "So führen Sie ein Upgrade durch", zh: "如何升级", hi: "कैसे अपग्रेड करें", ar: "كيفية الترقية", pt: "Como Atualizar", ja: "アップグレード方法", ru: "Как обновиться" },
  premiumPrice: { en: "Pay $10 for one month of Premium Access.", fr: "Payez 10 $ pour un mois d'accès Premium.", rw: "Ishyura $10 ukwezi kumwe kugirango ukoreshe Premium.", sw: "Lipa $10 kwa mwezi mmoja wa Ufikiaji wa Premium.", es: "Paga $10 por un mes de acceso Premium.", de: "Zahlen Sie 10 $ für einen Monat Premium-Zugang.", zh: "支付10美元，获取一个月的高级访问权限。", hi: "एक महीने के प्रीमियम एक्सेस के लिए $10 का भुगतान करें।", ar: "ادفع 10 دولارات للوصول إلى العضوية المميزة لمدة شهر واحد.", pt: "Pague $10 por um mês de acesso Premium.", ja: "1か月間のプレミアムアクセスに10ドルを支払います。", ru: "Заплатите 10 долларов за один месяц Премиум-доступа." },
  payWithMomo: { en: "Pay with MoMoPay", fr: "Payer avec MoMoPay", rw: "Ishyura na MoMoPay", sw: "Lipa na MoMoPay", es: "Pagar con MoMoPay", de: "Mit MoMoPay bezahlen", zh: "使用MoMoPay支付", hi: "मोमोपे से भुगतान करें", ar: "الدفع بواسطة MoMoPay", pt: "Pagar com MoMoPay", ja: "MoMoPayで支払う", ru: "Оплатить через MoMoPay" },
  payWithBank: { en: "Pay with Equity Bank", fr: "Payer avec Equity Bank", rw: "Ishyura na Equity Bank", sw: "Lipa na Equity Bank", es: "Pagar con Equity Bank", de: "Mit Equity Bank bezahlen", zh: "使用Equity Bank支付", hi: "इक्विटी बैंक से भुगतान करें", ar: "الدفع بواسطة بنك Equity", pt: "Pagar com Equity Bank", ja: "Equity Bankで支払う", ru: "Оплатить через Equity Bank" },
  paymentConfirmation: { en: "I've Sent Payment (Upgrade to Premium)", fr: "J'ai envoyé le paiement (Mettre à Niveau vers Premium)", rw: "Nohereje Ubwishyu (Simbukira kuri Premium)", sw: "Nimetuma Malipo (Boresha hadi Premium)", es: "He enviado el pago (Actualizar a Premium)", de: "Ich habe bezahlt (Auf Premium upgraden)", zh: "我已付款（升级到高级版）", hi: "मैंने भुगतान भेज दिया है (प्रीमियम में अपग्रेड करें)", ar: "لقد أرسلت الدفعة (الترقية إلى بريميوم)", pt: "Enviei o pagamento (Atualizar para Premium)", ja: "支払いを送信しました（プレミアムにアップグレード）", ru: "Я отправил платеж (Перейти на Премиум)" },
  copy: { en: "Copy", fr: "Copier", rw: "Koporora", sw: "Nakili", es: "Copiar", de: "Kopieren", zh: "复制", hi: "कॉपी", ar: "نسخ", pt: "Copiar", ja: "コピー", ru: "Копировать" },
  copied: { en: "Copied!", fr: "Copié !", rw: "Byakoporowe!", sw: "Imenakiliwa!", es: "¡Copiado!", de: "Kopiert!", zh: "已复制！", hi: "कॉपी किया गया!", ar: "تم النسخ!", pt: "Copiado!", ja: "コピーしました！", ru: "Скопировано!" },
  upgrade: { en: "Upgrade", fr: "Mettre à niveau", rw: "Simbukira ku isumbuye", sw: "Boresha", es: "Actualizar", de: "Upgrade", zh: "升级", hi: "अपग्रेड", ar: "ترقية", pt: "Atualizar", ja: "アップグレード", ru: "Обновить" },
  premium: { en: "Premium", fr: "Premium", rw: "Premium", sw: "Premium", es: "Premium", de: "Premium", zh: "高级会员", hi: "प्रीमियम", ar: "بريميوم", pt: "Premium", ja: "プレミアム", ru: "Премиум" },
  getDirections: { en: "Get Directions", fr: "Obtenir l'itinéraire", rw: "Shaka Inzira", sw: "Pata Maelekezo", es: "Obtener Direcciones", de: "Route berechnen", zh: "获取路线", hi: "दिशा - निर्देश प्राप्त करें", ar: "احصل على الاتجاهات", pt: "Obter Direções", ja: "経路を取得", ru: "Проложить маршрут" },
  prevDestination: { en: "Previous destination", fr: "Destination précédente", rw: "Aho uheruka", sw: "Unakoenda awali", es: "Destino anterior", de: "Vorheriges Ziel", zh: "上一个目的地", hi: "पिछला गंतव्य", ar: "الوجهة السابقة", pt: "Destino anterior", ja: "前の目的地", ru: "Предыдущий пункт" },
  nextDestination: { en: "Next destination", fr: "Destination suivante", rw: "Aho utaha", sw: "Unakoenda ijayo", es: "Próximo destino", de: "Nächstes Ziel", zh: "下一个目的地", hi: "अगला गंतव्य", ar: "الوجهة التالية", pt: "Próximo destino", ja: "次の目的地", ru: "Следующий пункт" },
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
  const [credits, setCredits] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
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
    if (!isPremium && credits <= 0) {
        setIsPaymentModalOpen(true);
        return;
    }
    
    if (isLoading || !chat) {
      return;
    }
    
    if (!isPremium) {
        setCredits(prev => prev - 1);
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
            setCurrentDestinationIndex(prevDests.length);
            return updatedDestinations;
        });
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(`Error from AI: ${errorMessage}`);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading, credits, isPremium]);
  
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
    setCredits(0);
    setIsPremium(false);
  };

  const handleLoginSuccess = (provider: Provider) => {
    setUser({ name: provider });
    setCredits(10);
    setIsPremium(false);
    setIsLoggedIn(true);
  };

  const handlePurchasePremium = () => {
    setIsPremium(true);
    setIsPaymentModalOpen(false);
  };
  
  const currentDestination = destinations[currentDestinationIndex] || null;
  const isInputDisabled = isLoading || (!isPremium && credits <= 0);

  const examplePrompts = [
    t('prompt1'),
    t('prompt2'),
    t('prompt3'),
    t('prompt4'),
    t('prompt5'),
    t('prompt6'),
    t('prompt7'),
    t('prompt8'),
  ];

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
            {!isPremium && (
                 <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-yellow-400/80 hover:bg-yellow-500/80 dark:bg-yellow-500/80 dark:hover:bg-yellow-600/80 rounded-md text-sm font-bold text-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                    aria-label={t('upgrade')}
                >
                    <UpgradeIcon className="h-5 w-5" />
                    <span>{t('upgrade')}</span>
                </button>
            )}

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

            {isPremium ? (
              <div className="flex items-center space-x-2 text-yellow-500" title="Premium Access">
                <CrownIcon className="h-6 w-6" />
                <span className="font-semibold text-sm">{t('premium')}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300" title={`${credits} credits remaining`}>
                  <CreditIcon className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-sm">{t('creditsRemaining').replace('{count}', String(credits))}</span>
              </div>
            )}
            
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
             getDirectionsText={t('getDirections')}
             prevDestinationAriaLabel={t('prevDestination')}
             nextDestinationAriaLabel={t('nextDestination')}
            />
        </aside>

        <div className="flex-1 flex flex-col bg-black/20 dark:bg-black/40">
           <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                {messages.length === 0 && !isLoading && <WelcomeScreen onPromptClick={handlePromptClick} prompts={examplePrompts} welcomeTitle={t('welcomeTitle')} welcomeSubtitle={t('welcomeSubtitle')} promptHeader={t('promptHeader')} />}
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
                <ChatInput onSendMessage={handleSendMessage} disabled={isInputDisabled} placeholder={isInputDisabled ? t('upgradeToContinue') : t('inputPlaceholder')} />
                </div>
            </footer>
        </div>
      </div>
      {isPaymentModalOpen && (
          <PaymentModal
            onClose={() => setIsPaymentModalOpen(false)}
            onUpgrade={handlePurchasePremium}
            texts={{
                paymentTitle: t('paymentTitle'),
                paymentSubtitle: t('paymentSubtitle'),
                howToUpgrade: t('howToUpgrade'),
                premiumPrice: t('premiumPrice'),
                payWithMomo: t('payWithMomo'),
                payWithBank: t('payWithBank'),
                paymentConfirmation: t('paymentConfirmation'),
                copy: t('copy'),
                copied: t('copied'),
            }}
          />
      )}
    </div>
  );
};

export default App;

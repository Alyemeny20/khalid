import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Mic, Settings, MessageCircle, Users, Archive, Star } from 'lucide-react';

const ZoliApp = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // بيانات وهمية للمحادثات
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'أحمد محمد',
      avatar: '👨‍💻',
      lastMessage: 'مرحباً، كيف حالك؟',
      time: '10:30',
      unread: 2,
      status: 'online',
      messages: [
        { id: 1, text: 'مرحباً', sender: 'other', time: '10:25' },
        { id: 2, text: 'مرحباً، كيف حالك؟', sender: 'other', time: '10:30' },
      ]
    },
    {
      id: 2,
      name: 'سارة أحمد',
      avatar: '👩‍🎨',
      lastMessage: 'شكراً لك على المساعدة',
      time: '09:45',
      unread: 0,
      status: 'offline',
      messages: [
        { id: 1, text: 'هل يمكنك مساعدتي؟', sender: 'other', time: '09:40' },
        { id: 2, text: 'بالطبع، ما المطلوب؟', sender: 'me', time: '09:42' },
        { id: 3, text: 'شكراً لك على المساعدة', sender: 'other', time: '09:45' },
      ]
    },
    {
      id: 3,
      name: 'مجموعة العمل',
      avatar: '👥',
      lastMessage: 'الاجتماع غداً الساعة 10',
      time: '08:20',
      unread: 5,
      status: 'group',
      messages: [
        { id: 1, text: 'صباح الخير جميعاً', sender: 'other', time: '08:15', senderName: 'محمد' },
        { id: 2, text: 'صباح النور', sender: 'me', time: '08:17' },
        { id: 3, text: 'الاجتماع غداً الساعة 10', sender: 'other', time: '08:20', senderName: 'فاطمة' },
      ]
    },
    {
      id: 4,
      name: 'عمر خالد',
      avatar: '👨‍🔬',
      lastMessage: 'تم إرسال الملف',
      time: 'أمس',
      unread: 0,
      status: 'offline',
      messages: [
        { id: 1, text: 'هل وصل الملف؟', sender: 'other', time: 'أمس 15:30' },
        { id: 2, text: 'نعم، تم إرسال الملف', sender: 'me', time: 'أمس 15:35' },
        { id: 3, text: 'ممتاز، شكراً', sender: 'other', time: 'أمس 15:40' },
      ]
    }
  ]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: message,
              time: newMessage.time
            }
          : chat
      )
    );

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* الشريط الجانبي */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* هيدر التطبيق */}
        <div className="bg-teal-600 text-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">زولي</h1>
            <div className="flex gap-2">
              <MessageCircle size={20} className="cursor-pointer hover:opacity-80" />
              <Settings size={20} className="cursor-pointer hover:opacity-80" />
            </div>
          </div>
          
          {/* شريط البحث */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="البحث في المحادثات"
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-teal-500 text-white placeholder-teal-200 border-none outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* التبويبات */}
        <div className="flex bg-white border-b">
          {[
            { id: 'chats', label: 'المحادثات', icon: MessageCircle },
            { id: 'groups', label: 'المجموعات', icon: Users },
            { id: 'archived', label: 'المؤرشف', icon: Archive }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-teal-600 border-teal-600'
                    : 'text-gray-600 border-transparent hover:text-teal-600'
                }`}
              >
                <Icon size={16} className="mx-auto mb-1" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* قائمة المحادثات */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                activeChat?.id === chat.id ? 'bg-teal-50' : ''
              }`}
            >
              <div className="relative ml-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                  {chat.avatar}
                </div>
                {chat.status === 'online' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* منطقة المحادثة */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* هيدر المحادثة */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg ml-3">
                  {activeChat.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{activeChat.name}</h2>
                  <p className="text-sm text-gray-500">
                    {activeChat.status === 'online' ? 'متصل الآن' : 'آخر ظهور منذ قليل'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Phone className="text-gray-600 cursor-pointer hover:text-teal-600" size={20} />
                <Video className="text-gray-600 cursor-pointer hover:text-teal-600" size={20} />
                <MoreVertical className="text-gray-600 cursor-pointer hover:text-teal-600" size={20} />
              </div>
            </div>

            {/* منطقة الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {activeChat.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === 'me'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-800 border'
                  }`}>
                    {msg.senderName && msg.sender !== 'me' && (
                      <p className="text-xs text-teal-600 font-semibold mb-1">{msg.senderName}</p>
                    )}
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'me' ? 'text-teal-100' : 'text-gray-500'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* حقل كتابة الرسالة */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button className="text-gray-600 hover:text-teal-600">
                  <Paperclip size={20} />
                </button>
                
                <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <input
                    type="text"
                    placeholder="اكتب رسالة..."
                    className="flex-1 bg-transparent border-none outline-none text-right"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                
                {message.trim() ? (
                  <button
                    onClick={sendMessage}
                    className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700"
                  >
                    <Send size={18} />
                  </button>
                ) : (
                  <button className="text-gray-600 hover:text-teal-600">
                    <Mic size={20} />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center text-white text-4xl mb-6 mx-auto">
                💬
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">مرحباً بك في زولي</h2>
              <p className="text-gray-600">اختر محادثة لبدء المراسلة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoliApp;
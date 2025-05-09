import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `💁‍♀️ Hello! I'm the online consultation assistant at NoeveOrBit Dermatology.

If you have any concerns about your skin, feel free to ask me anything. I'm here to help you.

💡 Example questions:
- "Are there any current promotions?"
- "What types of lifting treatments do you offer?"
- "How can pigmentation and spots be treated?"
- "What are your clinic hours and location?"`
    }
  ]);

  const chatEndRef = useRef(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (customMessage) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', text: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const gptMessages = newMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const res = await axios.post('https://chat-demo-bugv.onrender.com/chat', {
        messages: gptMessages
      });

      const reply = res.data.reply;
      setMessages([...newMessages, { role: 'bot', text: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: 'bot', text: '⚠️ Sorry, an error occurred. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen p-6 relative bg-cover bg-center"
      style={{ backgroundImage: 'url("/chat-bg.jpg")' }}
    >
      <div className="absolute inset-0 bg-white/80 z-0" />

      <div
        className="relative max-w-2xl w-full mx-auto rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        style={{
          backgroundImage: 'url("/chat-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 p-6 bg-white/80">
          <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">
            💬 NoeveOrBit Dermatology Online Consultation
          </h2>

          <div className="space-y-3 mb-4 max-h-[450px] overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap shadow ${
                    msg.role === 'user'
                      ? 'bg-pink-600 text-white rounded-br-none'
                      : 'bg-white text-black border border-gray-300 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500 italic">Typing...</div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex justify-center mb-4">
            <a
              href="https://booking.naver.com/booking/13/bizes/820793"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md font-semibold shadow-md"
            >
              📅 Book an Appointment at NoeveOrBit
            </a>
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isComposing) sendMessage();
              }}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-black shadow-sm"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition font-semibold"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

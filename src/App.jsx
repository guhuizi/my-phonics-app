import { useState, useEffect } from 'react'
import PhonicsGame from './components/PhonicsGame'
import LearnMode from './components/LearnMode'

function HomeScreen({ onStartGame }) {
  const [stars, setStars] = useState([])

  useEffect(() => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 3 + 1
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle 2s ease-in-out ${star.delay}s infinite`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-3 flex items-center justify-center gap-2">
            <span>🌟</span>
            <span>自然拼读大冒险</span>
            <span>🌟</span>
          </h1>
          <p className="text-xl md:text-2xl text-pink-200 font-medium">
            Phonics Adventure
          </p>
        </div>

        <div className="mb-8 relative z-10">
          <h2 className="text-lg text-white/80 mb-4">选择学习方式</h2>
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <button
              onClick={() => onStartGame('learn')}
              className="relative z-10 px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-500
                         text-white text-lg font-bold rounded-3xl
                         shadow-[0_8px_30px_rgba(20,184,166,0.5)]
                         hover:shadow-[0_12px_40px_rgba(20,184,166,0.6)]
                         transition-all duration-300
                         hover:scale-105 cursor-pointer"
            >
              📚 学习模式
              <span className="block text-sm font-normal opacity-80">浏览规则 + 跟读练习</span>
            </button>
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <h2 className="text-lg text-white/80 mb-4">选择游戏模式</h2>
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <button
              onClick={() => onStartGame('picture')}
              className="relative z-10 px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-500
                         text-white text-lg font-bold rounded-3xl
                         shadow-[0_8px_30px_rgba(147,51,234,0.5)]
                         hover:shadow-[0_12px_40px_rgba(147,51,234,0.6)]
                         transition-all duration-300
                         hover:scale-105 cursor-pointer"
            >
              🖼️ 看词选图
            </button>

            <button
              onClick={() => onStartGame('listen')}
              className="relative z-10 px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500
                         text-white text-lg font-bold rounded-3xl
                         shadow-[0_8px_30px_rgba(59,130,246,0.5)]
                         hover:shadow-[0_12px_40px_rgba(59,130,246,0.6)]
                         transition-all duration-300
                         hover:scale-105 cursor-pointer"
            >
              🎧 听音选词
            </button>

            <button
              onClick={() => onStartGame('rule')}
              className="relative z-10 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500
                         text-white text-lg font-bold rounded-3xl
                         shadow-[0_8px_30px_rgba(16,185,129,0.5)]
                         hover:shadow-[0_12px_40px_rgba(16,185,129,0.6)]
                         transition-all duration-300
                         hover:scale-105 cursor-pointer"
            >
              📖 看词选规
            </button>
          </div>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => onStartGame('adventure')}
            className="relative z-10 px-12 py-6 bg-gradient-to-r from-yellow-400 to-orange-500
                       text-white text-2xl font-bold rounded-full
                       shadow-[0_8px_30px_rgba(249,115,22,0.5)]
                       hover:shadow-[0_12px_40px_rgba(249,115,22,0.6)]
                       transition-all duration-300
                       hover:scale-110 cursor-pointer
                       animate-bounce-rocket"
          >
            🚀 开始探险
          </button>
          <p className="text-white/60 text-sm mt-3">闯关模式：从第1关开始，逐渐解锁全部6关！</p>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes bounce-rocket {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-bounce-rocket {
          animation: bounce-rocket 0.8s ease-in-out infinite;
        }
        .animate-bounce-rocket:hover {
          animation: none;
          transform: scale(1.1) rotate(0deg);
        }
      `}</style>
    </div>
  )
}

function App() {
  const [gameState, setGameState] = useState('home');

  const handleStartGame = (mode) => {
    setGameState(mode);
  };

  const handleBack = () => {
    setGameState('home');
  };

  if (gameState === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <HomeScreen onStartGame={handleStartGame} />
      </div>
    );
  }

  if (gameState === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <LearnMode onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <PhonicsGame mode={gameState} onBack={handleBack} />
    </div>
  );
}

export default App;

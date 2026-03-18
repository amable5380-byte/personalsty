import { useState, useEffect, useMemo } from 'react';
import { 
  Radar, 
  Search, 
  TrendingUp, 
  MessageSquare, 
  Bell, 
  Plus, 
  Trash2, 
  Activity,
  AlertCircle,
  Hash,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Types
interface Keyword {
  id: string;
  term: string;
  active: boolean;
  mentionCount: number;
}

interface SummaryData {
  sentiment: 'positive' | 'neutral' | 'negative';
  topTopics: string[];
  recentMention: string;
  trend: number;
}

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([
    { id: '1', term: '바이브 코딩', active: true, mentionCount: 124 },
    { id: '2', term: '오세현', active: true, mentionCount: 89 },
    { id: '3', term: 'AI 자동화', active: true, mentionCount: 256 },
  ]);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedKeywordId, setSelectedKeywordId] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Mock Summary Generator
  const summary = useMemo((): SummaryData | null => {
    if (!selectedKeywordId) return null;
    const kw = keywords.find(k => k.id === selectedKeywordId);
    if (!kw) return null;

    return {
      sentiment: kw.mentionCount > 200 ? 'positive' : 'neutral',
      topTopics: [`${kw.term} 기술`, '최신 트렌드', '사용자 반응'],
      recentMention: `최근 소셜 미디어에서 "${kw.term}"에 대한 관심이 급증하고 있습니다. 특히 기술적 한계와 가능성에 대한 토론이 활발합니다.`,
      trend: (kw.mentionCount % 15) + 5
    };
  }, [selectedKeywordId, keywords]);

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    const kw: Keyword = {
      id: Date.now().toString(),
      term: newKeyword,
      active: true,
      mentionCount: 0
    };
    setKeywords([...keywords, kw]);
    setNewKeyword('');
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
    if (selectedKeywordId === id) setSelectedKeywordId(null);
  };

  const toggleKeyword = (id: string) => {
    setKeywords(keywords.map(k => 
      k.id === id ? { ...k, active: !k.active } : k
    ));
  };

  // Simulate hits
  useEffect(() => {
    if (!isMonitoring) return;
    const interval = setInterval(() => {
      setKeywords(kws => kws.map(kw => 
        kw.active ? { ...kw, mentionCount: kw.mentionCount + Math.floor(Math.random() * 2) } : kw
      ));
    }, 3000);
    return () => clearInterval(interval);
  }, [isMonitoring]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <Radar size={32} />
          <h1>KEYWORD RADAR</h1>
        </div>

        <div className="input-section">
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="새 키워드 추가..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <button 
              onClick={addKeyword}
              style={{ position: 'absolute', right: '10px', top: '55%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer' }}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="keyword-list">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <Activity size={16} />
            <span>모니터링 중인 키워드</span>
          </div>
          <AnimatePresence>
            {keywords.map(kw => (
              <motion.div 
                key={kw.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`keyword-item ${selectedKeywordId === kw.id ? 'active' : ''}`}
                onClick={() => setSelectedKeywordId(kw.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Hash size={18} color={kw.active ? 'var(--accent-green)' : 'var(--text-secondary)'} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{kw.term}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {kw.mentionCount.toLocaleString()} mentions
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleKeyword(kw.id); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    <Bell size={16} color={kw.active ? 'var(--accent-green)' : 'var(--text-secondary)'} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeKeyword(kw.id); }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255, 100, 100, 0.5)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>시스템 상태</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)' }}>운영 중</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ x: [-100, 320] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              style={{ width: '100px', height: '100%', background: 'var(--accent-green)' }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Search color="var(--text-secondary)" size={20} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>실시간 소셜 데이터 분석 엔진 v2.4</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="button-primary" onClick={() => setIsMonitoring(!isMonitoring)}>
              {isMonitoring ? '모니터링 일시정지' : '모니터링 시작'}
            </button>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={20} />
            </div>
          </div>
        </header>

        <div className="radar-container">
          {/* Radar Visuals */}
          <div className="radar-circle">
            {/* Grid */}
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  position: 'absolute', 
                  width: `${(i + 1) * 125}px`, 
                  height: `${(i + 1) * 125}px`, 
                  border: '1px solid rgba(57, 255, 20, 0.1)', 
                  borderRadius: '50%' 
                }} 
              />
            ))}
            <div className="grid-line grid-h" />
            <div className="grid-line grid-v" />

            {/* Sweep */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="radar-sweep"
            />

            {/* Hits (Blips) */}
            {keywords.filter(k => k.active).map((kw, idx) => (
              <Blip key={kw.id} index={idx} label={kw.term} />
            ))}
          </div>

          <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
            <div style={{ color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              SCANNING WORLDWIDE...
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Twitter', 'Reddit', 'News', 'YouTube'].map(platform => (
                <span key={platform} style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.65rem' }}>
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <AnimatePresence>
          {selectedKeywordId && summary && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="summary-overlay"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{keywords.find(k => k.id === selectedKeywordId)?.term}</h2>
                  <div className="trend-badge trend-up">
                    <TrendingUp size={14} />
                    <span>+{summary.trend}% 증가</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedKeywordId(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <Plus style={{ transform: 'rotate(45deg)' }} size={24} />
                </button>
              </div>

              <div className="summary-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-blue)' }}>
                  <MessageSquare size={18} />
                  <span style={{ fontWeight: 600 }}>AI 요약 브리핑</span>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  {summary.recentMention}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  주요 화두 (Top Topics)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {summary.topTopics.map(topic => (
                    <span key={topic} style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.8rem' }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, padding: '1rem', background: 'rgba(57, 255, 20, 0.05)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', marginBottom: '0.25rem' }}>긍정 지수</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>84%</div>
                </div>
                <div style={{ flex: 1, padding: '1rem', background: 'rgba(0, 229, 255, 0.05)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', marginBottom: '0.25rem' }}>신규 언급</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>+42</div>
                </div>
              </div>

              <button 
                className="button-primary" 
                style={{ width: '100%', marginTop: '1.5rem', background: 'var(--surface-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Share2 size={16} />
                  <span>보고서 내보내기</span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Blip({ index, label }: { index: number, label: string }) {
  // Stable pseudo-random position for blips based on index
  const pos = useMemo(() => {
    const angle = index * 1.5;
    const distance = 120 + ((index * 20) % 60);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: (index * 0.5) % 2
    };
  }, [index]);

  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0.5],
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        repeatDelay: pos.delay
      }}
      style={{ 
        position: 'absolute', 
        left: `calc(50% + ${pos.x}px)`, 
        top: `calc(50% + ${pos.y}px)`,
        width: '10px',
        height: '10px',
        background: 'var(--accent-green)',
        borderRadius: '50%',
        boxShadow: '0 0 10px var(--accent-green)'
      }}
    >
      <div style={{ position: 'absolute', top: '-20px', left: '15px', whiteSpace: 'nowrap', fontSize: '0.7rem', color: 'var(--accent-green)', opacity: 0.8 }}>
        {label}
      </div>
    </motion.div>
  );
}

export default App;

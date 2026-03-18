import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { 
  Camera, 
  ChevronRight, 
  Ruler, 
  Weight, 
  CheckCircle2,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

type Step = 'initial' | 'physical' | 'complete';

function App() {
  const [step, setStep] = useState<Step>('initial');
  const [photo, setPhoto] = useState<string | null>(null);
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('65');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const nextStep = () => {
    if (step === 'initial' && photo) setStep('physical');
    else if (step === 'physical') setStep('complete');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {step === 'initial' && (
          <motion.div 
            key="initial"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="onboarding-card"
          >
            <div className="onboarding-header">
              <h1>나만의 스타일리스트</h1>
              <p>정확한 스타일링을 위해 전신 사진을 업로드해 주세요.</p>
            </div>

            <div className="upload-section">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              <div className="image-dropzone" onClick={triggerUpload}>
                {photo ? (
                  <>
                    <img src={photo} alt="Preview" className="image-preview" />
                    <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <RefreshCcw size={20} color="var(--primary-color)" />
                    </div>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    <Camera size={48} strokeWidth={1.5} />
                    <span>사진 업로드하기</span>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>JPG, PNG 지원</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              className="button-primary" 
              disabled={!photo}
              onClick={nextStep}
              style={{ opacity: photo ? 1 : 0.5, cursor: photo ? 'pointer' : 'not-allowed' }}
            >
              <span>다음 단계로</span>
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 'physical' && (
          <motion.div 
            key="physical"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="onboarding-card"
          >
            <div className="onboarding-header">
              <h1>신체 정보 입력</h1>
              <p>체형에 맞는 핏을 추천해 드리기 위해 필요합니다.</p>
            </div>

            <div className="inputs-section">
              <div className="input-group">
                <label>키 (cm)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    style={{ width: '100%' }}
                  />
                  <Ruler size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                </div>
              </div>

              <div className="input-group">
                <label>몸무게 (kg)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="65"
                    style={{ width: '100%' }}
                  />
                  <Weight size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="button-primary" 
                style={{ flex: 1, background: 'none', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
                onClick={() => setStep('initial')}
              >
                이전으로
              </button>
              <button 
                className="button-primary" 
                style={{ flex: 2 }}
                onClick={nextStep}
              >
                <span>분석 시작하기</span>
                <CheckCircle2 size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div 
            key="complete"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="onboarding-card"
            style={{ textAlign: 'center' }}
          >
            <div style={{ margin: '0 auto 1.5rem', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
              <CheckCircle2 size={40} />
            </div>
            <div className="onboarding-header">
              <h1>준비 완료!</h1>
              <p>당신의 스타일을 분석하고 있습니다. 잠시만 기다려 주세요.</p>
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>키/몸무게</span>
                <span style={{ fontWeight: 600 }}>{height}cm / {weight}kg</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ height: '100%', background: 'var(--accent-color)' }}
                />
              </div>
            </div>

            <button 
              className="button-primary" 
              style={{ marginTop: '2rem', width: '100%' }}
              onClick={() => setStep('initial')}
            >
              처음으로 돌아가기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

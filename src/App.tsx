import { useState, useRef, useCallback, useEffect } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Camera, Upload, Trash2, Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [faceFeatures, setFaceFeatures] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    // Revoke the object URL on unmount to prevent memory leaks
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImage(prevImage => {
        if (prevImage) {
          URL.revokeObjectURL(prevImage);
        }
        const newImageUrl = URL.createObjectURL(file);
        setImageFile(file);
        return newImageUrl;
      });
      setReport(null);
    }
  }, []);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    // The useEffect will handle revoking the object URL
    setImage(null);
    setImageFile(null);
    setReport(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile || !height || !weight) {
      alert('사진, 키, 몸무게를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setReport(null);

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    try {
      const imageBase64 = await toBase64(imageFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64, height, weight, faceFeatures }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json() as { report?: string; error?: string };
      if (data.report) {
        setReport(data.report);
      } else {
        alert(data.error || '분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : '서버와 통신 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Personal Stylist</h1>
        <p>나만의 스타일을 찾아보세요</p>
        
        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''} ${image ? 'has-image' : ''}`}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={handleClick}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          
          {image ? (
            <div className="preview-container">
              <img src={image} alt="Uploaded" className="preview-image" />
              <button className="remove-btn" onClick={removeImage}>
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                {isDragging ? <Upload size={48} /> : <Camera size={48} />}
              </div>
              <p>{isDragging ? '여기에 놓으세요' : '사진을 업로드하거나 드래그하세요'}</p>
            </>
          )}
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="height">키 (cm)</label>
            <input 
              type="text" 
              id="height" 
              placeholder="예: 179" 
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="weight">몸무게 (kg)</label>
            <input 
              type="text" 
              id="weight" 
              placeholder="예: 84" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="faceFeatures">특이사항 (얼굴 특징 등)</label>
          <input 
            type="text" 
            id="faceFeatures" 
            placeholder="예: 잘생김, 안경 착용 등" 
            value={faceFeatures}
            onChange={(e) => setFaceFeatures(e.target.value)}
          />
        </div>
        
        <button 
          className={`analyze-btn ${loading || !imageFile ? 'loading' : ''}`} 
          onClick={handleAnalyze}
          disabled={loading || !imageFile}
        >
          {loading ? (
            <>
              <Loader2 className="spinner" size={18} />
              <span>AI 분석 중...</span>
            </>
          ) : (
            '스타일 분석 시작'
          )}
        </button>

        {report && (
          <div className="report-container">
            <h2>스타일 컨설팅 보고서</h2>
            <div className="report-content">
              {report.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

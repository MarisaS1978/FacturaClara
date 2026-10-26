import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError('No se pudo acceder a la cámara. Asegúrate de otorgar permisos en tu navegador.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Escanear Factura con Cámara</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative bg-black flex-1 min-h-[340px] flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center max-w-xs">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="text-sm text-slate-300 mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Reintentar permiso
              </button>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={capturedImage}
                alt="Factura capturada"
                className="max-h-[380px] w-auto object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Document overlay guides */}
              <div className="absolute inset-8 border-2 border-dashed border-cyan-400/60 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-medium text-cyan-300 bg-slate-950/70 px-3 py-1 rounded-full border border-cyan-500/30">
                  Encuadra la factura aquí con buena luz
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-3 sm:p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 bg-slate-950 w-full">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors min-h-[42px]"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span>Repetir foto</span>
              </button>
              <button
                onClick={handleConfirm}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all min-h-[42px]"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Analizar comprobante</span>
              </button>
            </>
          ) : (
            <button
              onClick={takeSnapshot}
              disabled={Boolean(error)}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-sm font-extrabold shadow-xl shadow-cyan-500/30 transition-all disabled:opacity-50 min-h-[46px]"
            >
              <Camera className="w-5 h-5 shrink-0" />
              <span>Tomar Foto</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

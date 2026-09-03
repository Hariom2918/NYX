"use client";
import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { formatCurrency } from "@/lib/utils"; // using for general text formatting if needed, though unneeded here.

type ScanResult = {
  success?: boolean;
  message?: string;
  type?: string;
  buyer?: string;
  status: 'idle' | 'success' | 'error';
};

export default function ScannerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  
  const [scanResult, setScanResult] = useState<ScanResult>({ status: 'idle' });
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  
  // Check auth initially
  useEffect(() => {
    setIsAuthenticated(document.cookie.includes("nyx_scanner_auth=true"));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/scanner/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        document.cookie = "nyx_scanner_auth=true; path=/";
      } else {
        setError("Invalid PIN");
      }
    } catch {
      setError("Network error");
    }
  };

  const processScan = async (decodedText: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: decodedText }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setScanResult({
          status: 'success',
          type: data.ticket.type,
          buyer: data.ticket.buyer,
        });
      } else {
        setScanResult({
          status: 'error',
          message: data.error || 'Invalid ticket'
        });
      }
    } catch (err) {
      setScanResult({
        status: 'error',
        message: 'Network error. Try again.'
      });
    } finally {
      // Auto reset after 6 seconds
      setTimeout(() => {
        setScanResult({ status: 'idle' });
        isProcessingRef.current = false;
      }, 6000);
    }
  };

  // Setup Scanner
  useEffect(() => {
    if (isAuthenticated && !scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
      
      scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (!isProcessingRef.current) {
            processScan(decodedText);
          }
        },
        () => {} // Ignore errors
      ).catch(err => {
        console.error("Failed to start scanner:", err);
      });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isAuthenticated]);


  if (isAuthenticated === null) return null; // loading

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950">
        <div className="w-full max-w-sm bg-black border border-neutral-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Scanner Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-center text-2xl tracking-widest text-white focus:outline-none focus:border-neutral-500"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full py-4 bg-white text-black font-bold rounded-xl">
              Access Scanner
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <div className="p-4 bg-neutral-900 border-b border-neutral-800 text-center font-bold">
        Nyx Entry Scanner
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* The div where html5-qrcode injects the video stream */}
        <div id="reader" className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-neutral-800"></div>
        <p className="mt-4 text-neutral-500 text-sm text-center">Point camera at QR code</p>
      </div>

      {/* Result Overlay */}
      {scanResult.status !== 'idle' && (
        <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center
          ${scanResult.status === 'success' ? 'bg-green-600' : 'bg-red-600'}
        `}>
          {scanResult.status === 'success' ? (
            <>
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-6xl text-white">✓</span>
              </div>
              <h2 className="text-5xl font-bold mb-4 text-white">VALID</h2>
              <p className="text-2xl text-white/90 mb-2 font-display">{scanResult.type}</p>
              <p className="text-xl text-white/70">{scanResult.buyer}</p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-black/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-6xl text-white">✕</span>
              </div>
              <h2 className="text-5xl font-bold mb-4 text-white">REJECTED</h2>
              <p className="text-2xl text-white/90 font-medium">{scanResult.message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    // Verifica o status inicial
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-hide da mensagem offline após 5 segundos
  useEffect(() => {
    if (showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showOfflineMessage]);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showOfflineMessage ? 'translate-y-0' : '-translate-y-full'
      }`}
      data-testid="offline-indicator-container"
    >
      <div 
        className={`px-4 py-2 text-center text-sm font-medium ${
          isOnline 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}
        data-testid={isOnline ? "online-message" : "offline-message"}
      >
        <div className="flex items-center justify-center gap-2" data-testid="message-content">
          {isOnline ? (
            <>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                data-testid="online-icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span data-testid="online-text">Conexão restaurada</span>
            </>
          ) : (
            <>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                data-testid="offline-icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span data-testid="offline-text">Você está offline - Algumas funcionalidades podem estar limitadas</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
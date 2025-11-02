import { useEffect, useRef, useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSave?: (settings: SettingsData) => void;
}

interface SettingsData {
  darkMode: boolean;
  matchSystem: boolean;
  density: 'compact' | 'comfortable' | 'spacious';
  soundEnabled: boolean;
  volume: number;
  autoDismiss: boolean;
  refreshInterval: string;
}

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  darkMode, 
  onToggleDarkMode,
  onSave 
}: SettingsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [matchSystem, setMatchSystem] = useState(false);
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [autoDismiss, setAutoDismiss] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('5s');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (modalRef.current && isOpen) {
      // Initialize Alpine.js data
      const alpineData = {
        isOpen,
        darkMode,
        matchSystem,
        density,
        soundEnabled,
        volume,
        autoDismiss,
        refreshInterval,
        closeModal: onClose,
        toggleDarkMode: onToggleDarkMode
      };
      
      (modalRef.current as any)._x_dataStack = [alpineData];
    }
  }, [isOpen, darkMode, matchSystem, density, soundEnabled, volume, autoDismiss, refreshInterval, onClose, onToggleDarkMode]);

  if (!isOpen) return null;

  const handleSave = () => {
    const settings: SettingsData = {
      darkMode,
      matchSystem,
      density,
      soundEnabled,
      volume,
      autoDismiss,
      refreshInterval,
    };
    onSave?.(settings);
    onClose();
  };

  const handleReset = () => {
    setMatchSystem(false);
    setDensity('comfortable');
    setSoundEnabled(true);
    setVolume(70);
    setAutoDismiss(true);
    setRefreshInterval('5s');
  };

  const handleTestSound = () => {
    // Play a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume / 100, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const getDensityPadding = () => {
    switch (density) {
      case 'compact': return 'p-3';
      case 'comfortable': return 'p-4';
      case 'spacious': return 'p-6';
      default: return 'p-4';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-metric-bg max-w-[500px] w-full max-h-[90vh] rounded-lg shadow-xl overflow-y-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-metric-value">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-metric-text hover:text-metric-value transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Display Section */}
            <section>
              <h3 className="text-sm font-semibold text-metric-value mb-3">
                Display
              </h3>
              
              {/* Dark Mode Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-metric-text">Dark Mode</label>
                  <button
                    onClick={onToggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-primary' : 'bg-muted'
                    }`}
                    role="switch"
                    aria-checked={darkMode}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Match System Preference */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={matchSystem}
                    onChange={(e) => setMatchSystem(e.target.checked)}
                    className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-metric-text">Match system preference</span>
                </label>
              </div>

              {/* Display Density */}
              <div className="mt-4">
                <label className="text-sm text-metric-text block mb-2">Display Density</label>
                <div className="space-y-2">
                  {(['compact', 'comfortable', 'spacious'] as const).map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="density"
                        value={option}
                        checked={density === option}
                        onChange={(e) => setDensity(e.target.value as any)}
                        className="w-4 h-4 text-primary bg-muted border-border focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-metric-text capitalize">{option}</span>
                    </label>
                  ))}
                </div>

                {/* Sample Card Preview */}
                <div className={`mt-3 bg-card border border-border rounded-lg ${getDensityPadding()} transition-all`}>
                  <p className="text-xs text-muted-foreground">Sample card</p>
                  <p className="text-sm font-medium text-card-foreground mt-1">Preview text</p>
                </div>
              </div>
            </section>

            {/* Alerts Section */}
            <section className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-metric-value mb-3">
                Alerts
              </h3>

              {/* Sound Notifications */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-metric-text">Play sound for critical alerts</span>
                </label>

                {/* Volume Slider */}
                {soundEnabled && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center justify-between text-xs text-metric-text">
                      <span>Volume</span>
                      <span>{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <button
                      onClick={handleTestSound}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      Test Sound
                    </button>
                  </div>
                )}

                {/* Auto-dismiss */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDismiss}
                    onChange={(e) => setAutoDismiss(e.target.checked)}
                    className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-metric-text">Auto-dismiss info alerts after 10 seconds</span>
                </label>
              </div>
            </section>

            {/* Data Refresh Section */}
            <section className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-metric-value mb-3">
                Data Refresh
              </h3>

              <div>
                <label className="text-sm text-metric-text block mb-2">Update frequency</label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="2s">Real-time (2s)</option>
                  <option value="5s">Normal (5s)</option>
                  <option value="10s">Slow (10s)</option>
                  <option value="manual">Manual</option>
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  Lower intervals increase resource usage
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-metric-value border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;

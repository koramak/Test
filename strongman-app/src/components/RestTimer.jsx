import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RestTimer.css';

const RestTimer = ({ seconds, onComplete, onDismiss }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) {
        // Vibrate if supported
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
        onComplete?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isRunning, onComplete]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const progress = ((seconds - timeLeft) / seconds) * 100;

  const handleAddTime = (amount) => {
    setTimeLeft(prev => prev + amount);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="rest-timer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="rest-timer-card"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <h3>Rest Timer</h3>

          <div className="timer-circle">
            <svg viewBox="0 0 100 100">
              <circle
                className="timer-bg"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="6"
              />
              <circle
                className="timer-progress"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <span className="timer-value">{formatTime(timeLeft)}</span>
          </div>

          <div className="timer-controls">
            <button className="timer-adjust" onClick={() => handleAddTime(-15)}>
              -15s
            </button>
            <button
              className="timer-pause"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button className="timer-adjust" onClick={() => handleAddTime(15)}>
              +15s
            </button>
          </div>

          <button className="timer-skip" onClick={onDismiss}>
            Skip Rest
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RestTimer;

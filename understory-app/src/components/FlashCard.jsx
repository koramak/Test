import React from 'react';
import styles from './FlashCard.module.css';

export default function FlashCard({
  flower,
  mode,
  showAnswer,
  setShowAnswer,
  userGuess,
  setUserGuess,
  feedback,
  checkGuess,
  handleKeyPress,
  photoIndex,
  cyclePhoto,
  imageError,
  setImageError,
  currentIndex,
  totalCount,
  isMastered,
  toggleMastered,
  onPrev,
  onNext,
}) {
  return (
    <div className={styles.card}>
      {/* Photo Section */}
      <div className={styles.photoSection} onClick={cyclePhoto}>
        {!imageError ? (
          <img
            src={flower.photos[photoIndex]}
            alt={flower.commonName}
            className={styles.photo}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.photoFallback}>
            <div
              className={styles.colorCircle}
              style={{ background: flower.color }}
            />
            <p className={styles.latinNameFallback}>{flower.latinName}</p>
            <p className={styles.unavailableText}>Image unavailable</p>
          </div>
        )}

        {/* Photo counter */}
        {flower.photos.length > 1 && !imageError && (
          <div className={styles.photoCounter}>
            {photoIndex + 1} / {flower.photos.length} • tap for more
          </div>
        )}

        {/* Attribution */}
        <div className={styles.attributionOverlay}>
          <p className={styles.attribution}>{flower.attribution}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className={styles.infoSection}>
        {/* Learn Mode */}
        {mode === 'learn' && (
          <>
            <div className={styles.nameSection}>
              <h2 className={styles.commonName}>{flower.commonName}</h2>
              <p className={styles.latinName}>{flower.latinName}</p>
            </div>

            <div className={styles.detailsGrid}>
              <div>
                <p className={styles.detailLabel}>Habitat</p>
                <p className={styles.detailValue}>{flower.habitat}</p>
              </div>
              <div>
                <p className={styles.detailLabel}>Blooming Season</p>
                <p className={styles.detailValue}>{flower.season}</p>
              </div>
            </div>

            <div className={styles.hintBox}>
              <p className={styles.detailLabel}>Key ID Features</p>
              <p className={styles.hintText}>{flower.hint}</p>
            </div>
          </>
        )}

        {/* Practice Mode */}
        {mode === 'practice' && (
          <>
            {!showAnswer && (
              <div className={styles.practiceHintBox}>
                <p className={styles.detailLabel}>Hint</p>
                <p className={styles.hintText}>{flower.hint}</p>
              </div>
            )}

            {!showAnswer ? (
              <div>
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter flower name..."
                  className={styles.guessInput}
                />
                {feedback && (
                  <p className={`${styles.feedback} ${feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
                    {feedback.message}
                  </p>
                )}
                <div className={styles.buttonRow}>
                  <button onClick={checkGuess} className={styles.primaryButton}>
                    Check
                  </button>
                  <button onClick={() => setShowAnswer(true)} className={styles.secondaryButton}>
                    Reveal
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.nameSection}>
                <h2 className={styles.commonName}>{flower.commonName}</h2>
                <p className={styles.latinName}>{flower.latinName}</p>
                <p className={styles.revealedDetails}>
                  {flower.habitat} • {flower.season}
                </p>
              </div>
            )}
          </>
        )}

        {/* Test Mode */}
        {mode === 'test' && (
          <>
            {!showAnswer ? (
              <div>
                <p className={styles.testPrompt}>Identify this wildflower</p>
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter flower name..."
                  className={styles.guessInput}
                />
                {feedback && (
                  <p className={`${styles.feedback} ${feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
                    {feedback.message}
                  </p>
                )}
                <div className={styles.buttonRow}>
                  <button onClick={checkGuess} className={styles.primaryButton}>
                    Check
                  </button>
                  <button onClick={() => setShowAnswer(true)} className={styles.secondaryButton}>
                    Give Up
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.nameSection}>
                <h2 className={styles.commonName}>{flower.commonName}</h2>
                <p className={styles.latinName}>{flower.latinName}</p>
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className={styles.navigation}>
          <button onClick={onPrev} className={styles.navButton}>
            ← Previous
          </button>

          <div className={styles.navCenter}>
            <span className={styles.counter}>
              {currentIndex + 1} / {totalCount}
            </span>
            <button
              onClick={toggleMastered}
              className={`${styles.masteredButton} ${isMastered ? styles.masteredButtonActive : ''}`}
            >
              {isMastered ? '✓ Mastered' : 'Mark Mastered'}
            </button>
          </div>

          <button onClick={onNext} className={styles.navButton}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

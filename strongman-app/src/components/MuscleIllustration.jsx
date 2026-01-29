import React from 'react';

const MUSCLE_COLORS = {
  primary: '#FF5722',
  secondary: '#FFB74D',
  inactive: '#E0E0E0',
};

// Muscle group to SVG path mapping for front view
const FRONT_MUSCLES = {
  chest: 'M 85 105 Q 100 100 115 105 L 115 125 Q 100 130 85 125 Z',
  upperChest: 'M 85 95 Q 100 90 115 95 L 115 105 Q 100 100 85 105 Z',
  frontDelt: 'M 70 95 Q 75 85 85 90 L 85 105 Q 75 110 70 105 Z M 130 95 Q 125 85 115 90 L 115 105 Q 125 110 130 105 Z',
  shoulders: 'M 68 90 Q 75 80 85 85 L 85 100 Q 75 105 68 100 Z M 132 90 Q 125 80 115 85 L 115 100 Q 125 105 132 100 Z',
  sideDelt: 'M 65 95 Q 68 90 70 95 L 70 110 Q 68 115 65 110 Z M 135 95 Q 132 90 130 95 L 130 110 Q 132 115 135 110 Z',
  biceps: 'M 60 110 Q 65 105 70 110 L 68 140 Q 63 145 58 140 Z M 140 110 Q 135 105 130 110 L 132 140 Q 137 145 142 140 Z',
  forearms: 'M 55 145 Q 60 140 65 145 L 60 185 Q 55 190 50 185 Z M 145 145 Q 140 140 135 145 L 140 185 Q 145 190 150 185 Z',
  triceps: 'M 65 110 L 70 115 L 68 145 L 62 145 Z M 135 110 L 130 115 L 132 145 L 138 145 Z',
  abs: 'M 90 130 L 110 130 L 110 180 L 90 180 Z',
  obliques: 'M 80 140 L 90 135 L 90 175 L 80 180 Z M 120 140 L 110 135 L 110 175 L 120 180 Z',
  quads: 'M 80 190 Q 85 185 95 188 L 92 250 Q 85 255 80 250 Z M 120 190 Q 115 185 105 188 L 108 250 Q 115 255 120 250 Z',
  lats: 'M 75 120 Q 85 115 85 130 L 82 155 Q 75 160 75 145 Z M 125 120 Q 115 115 115 130 L 118 155 Q 125 160 125 145 Z',
};

// Muscle group to SVG path mapping for back view
const BACK_MUSCLES = {
  traps: 'M 85 75 Q 100 70 115 75 L 115 95 Q 100 100 85 95 Z',
  upperBack: 'M 80 100 Q 100 95 120 100 L 120 130 Q 100 135 80 130 Z',
  lats: 'M 75 110 Q 85 100 85 130 L 82 160 Q 70 165 70 140 Z M 125 110 Q 115 100 115 130 L 118 160 Q 130 165 130 140 Z',
  lowerBack: 'M 90 155 L 110 155 L 110 180 L 90 180 Z',
  rearDelt: 'M 68 90 Q 75 85 85 90 L 80 105 Q 70 110 68 100 Z M 132 90 Q 125 85 115 90 L 120 105 Q 130 110 132 100 Z',
  triceps: 'M 58 115 Q 65 108 72 115 L 68 150 Q 60 155 55 148 Z M 142 115 Q 135 108 128 115 L 132 150 Q 140 155 145 148 Z',
  glutes: 'M 82 182 Q 100 175 118 182 L 118 205 Q 100 215 82 205 Z',
  hamstrings: 'M 80 210 Q 90 205 95 210 L 92 265 Q 85 270 80 265 Z M 120 210 Q 110 205 105 210 L 108 265 Q 115 270 120 265 Z',
  calves: 'M 78 275 Q 85 270 90 275 L 88 310 Q 82 315 78 310 Z M 122 275 Q 115 270 110 275 L 112 310 Q 118 315 122 310 Z',
};

const MuscleIllustration = ({ primaryMuscles = [], secondaryMuscles = [], size = 200 }) => {
  const scale = size / 200;

  const getMuscleColor = (muscle) => {
    if (primaryMuscles.includes(muscle)) return MUSCLE_COLORS.primary;
    if (secondaryMuscles.includes(muscle)) return MUSCLE_COLORS.secondary;
    return MUSCLE_COLORS.inactive;
  };

  // Determine if we need front, back, or both views
  const frontMuscleGroups = ['chest', 'upperChest', 'frontDelt', 'shoulders', 'sideDelt', 'biceps', 'forearms', 'abs', 'obliques', 'quads'];
  const backMuscleGroups = ['traps', 'upperBack', 'lowerBack', 'rearDelt', 'glutes', 'hamstrings', 'calves'];

  const hasFrontMuscles = [...primaryMuscles, ...secondaryMuscles].some(m => frontMuscleGroups.includes(m));
  const hasBackMuscles = [...primaryMuscles, ...secondaryMuscles].some(m => backMuscleGroups.includes(m));

  // Show both views if muscles from both are worked, or just the relevant one
  const showFront = hasFrontMuscles || (!hasFrontMuscles && !hasBackMuscles);
  const showBack = hasBackMuscles;

  const viewWidth = showFront && showBack ? 200 : 100;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      {showFront && (
        <svg
          width={size * (showBack ? 0.5 : 1)}
          height={size * 1.6}
          viewBox="0 0 200 340"
          style={{ overflow: 'visible' }}
        >
          {/* Body outline - front view */}
          <ellipse cx="100" cy="50" rx="30" ry="35" fill="#BDBDBD" /> {/* Head */}
          <rect x="90" y="80" width="20" height="15" fill="#BDBDBD" /> {/* Neck */}

          {/* Torso */}
          <path d="M 70 95 L 130 95 L 135 100 Q 140 180 120 190 L 80 190 Q 60 180 65 100 Z" fill="#E0E0E0" />

          {/* Arms */}
          <path d="M 65 95 Q 50 100 45 130 L 40 180 Q 35 195 45 200 L 55 195 Q 60 180 58 145 L 65 110 Z" fill="#E0E0E0" />
          <path d="M 135 95 Q 150 100 155 130 L 160 180 Q 165 195 155 200 L 145 195 Q 140 180 142 145 L 135 110 Z" fill="#E0E0E0" />

          {/* Legs */}
          <path d="M 80 188 L 95 188 L 92 280 L 85 320 L 75 320 L 78 280 Z" fill="#E0E0E0" />
          <path d="M 120 188 L 105 188 L 108 280 L 115 320 L 125 320 L 122 280 Z" fill="#E0E0E0" />

          {/* Muscles */}
          {Object.entries(FRONT_MUSCLES).map(([muscle, path]) => (
            <path
              key={muscle}
              d={path}
              fill={getMuscleColor(muscle)}
              opacity={getMuscleColor(muscle) === MUSCLE_COLORS.inactive ? 0.3 : 0.85}
              stroke={getMuscleColor(muscle) !== MUSCLE_COLORS.inactive ? '#333' : 'none'}
              strokeWidth={0.5}
            />
          ))}

          {/* Also render back muscles that should show from front (lats) */}
          {primaryMuscles.includes('lats') || secondaryMuscles.includes('lats') ? (
            <>
              <path d={FRONT_MUSCLES.lats} fill={getMuscleColor('lats')} opacity={0.85} stroke="#333" strokeWidth={0.5} />
            </>
          ) : null}

          <text x="100" y="335" textAnchor="middle" fontSize="12" fill="#666">Front</text>
        </svg>
      )}

      {showBack && (
        <svg
          width={size * (showFront ? 0.5 : 1)}
          height={size * 1.6}
          viewBox="0 0 200 340"
          style={{ overflow: 'visible' }}
        >
          {/* Body outline - back view */}
          <ellipse cx="100" cy="50" rx="30" ry="35" fill="#BDBDBD" /> {/* Head */}
          <rect x="90" y="80" width="20" height="15" fill="#BDBDBD" /> {/* Neck */}

          {/* Torso */}
          <path d="M 70 95 L 130 95 L 135 100 Q 140 180 120 190 L 80 190 Q 60 180 65 100 Z" fill="#E0E0E0" />

          {/* Arms */}
          <path d="M 65 95 Q 50 100 45 130 L 40 180 Q 35 195 45 200 L 55 195 Q 60 180 58 145 L 65 110 Z" fill="#E0E0E0" />
          <path d="M 135 95 Q 150 100 155 130 L 160 180 Q 165 195 155 200 L 145 195 Q 140 180 142 145 L 135 110 Z" fill="#E0E0E0" />

          {/* Legs */}
          <path d="M 80 188 L 95 188 L 92 280 L 85 320 L 75 320 L 78 280 Z" fill="#E0E0E0" />
          <path d="M 120 188 L 105 188 L 108 280 L 115 320 L 125 320 L 122 280 Z" fill="#E0E0E0" />

          {/* Muscles */}
          {Object.entries(BACK_MUSCLES).map(([muscle, path]) => (
            <path
              key={muscle}
              d={path}
              fill={getMuscleColor(muscle)}
              opacity={getMuscleColor(muscle) === MUSCLE_COLORS.inactive ? 0.3 : 0.85}
              stroke={getMuscleColor(muscle) !== MUSCLE_COLORS.inactive ? '#333' : 'none'}
              strokeWidth={0.5}
            />
          ))}

          <text x="100" y="335" textAnchor="middle" fontSize="12" fill="#666">Back</text>
        </svg>
      )}
    </div>
  );
};

export default MuscleIllustration;

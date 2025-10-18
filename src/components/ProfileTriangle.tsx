'use client';

interface ProfileTriangleProps {
  currentProfile: {
    savingsIndex: number;
    debtIndex: number;
    impulsiveIndex: number;
  };
  idealProfile: {
    savingsIndex: number;
    debtIndex: number;
    impulsiveIndex: number;
  };
  size?: number;
}

export default function ProfileTriangle({
  currentProfile,
  idealProfile,
  size = 200
}: ProfileTriangleProps) {
  const center = size / 2;
  const radius = size * 0.35;

  const getTrianglePoints = (profile: typeof currentProfile) => {
    const normalizedSavings = profile.savingsIndex / 100;
    const normalizedDebt = 1 - (profile.debtIndex / 100);
    const normalizedImpulsive = 1 - (profile.impulsiveIndex / 100);

    const savingsAngle = -Math.PI / 2;
    const debtAngle = Math.PI / 2 + Math.PI / 3;
    const impulsiveAngle = Math.PI / 2 - Math.PI / 3;

    const savingsX = center + (normalizedSavings * radius * Math.cos(savingsAngle));
    const savingsY = center + (normalizedSavings * radius * Math.sin(savingsAngle));

    const debtX = center + (normalizedDebt * radius * Math.cos(debtAngle));
    const debtY = center + (normalizedDebt * radius * Math.sin(debtAngle));

    const impulsiveX = center + (normalizedImpulsive * radius * Math.cos(impulsiveAngle));
    const impulsiveY = center + (normalizedImpulsive * radius * Math.sin(impulsiveAngle));

    return `${savingsX},${savingsY} ${debtX},${debtY} ${impulsiveX},${impulsiveY}`;
  };

  const getVertexPoints = () => {
    const savingsAngle = -Math.PI / 2;
    const debtAngle = Math.PI / 2 + Math.PI / 3;
    const impulsiveAngle = Math.PI / 2 - Math.PI / 3;

    return {
      savings: {
        x: center + (radius * Math.cos(savingsAngle)),
        y: center + (radius * Math.sin(savingsAngle))
      },
      debt: {
        x: center + (radius * Math.cos(debtAngle)),
        y: center + (radius * Math.sin(debtAngle))
      },
      impulsive: {
        x: center + (radius * Math.cos(impulsiveAngle)),
        y: center + (radius * Math.sin(impulsiveAngle))
      }
    };
  };

  const vertices = getVertexPoints();
  const currentPoints = getTrianglePoints(currentProfile);
  const idealPoints = getTrianglePoints(idealProfile);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
          </pattern>
        </defs>

        <rect width={size} height={size} fill="url(#grid)" opacity="0.3" />

        <polygon
          points={`${vertices.savings.x},${vertices.savings.y} ${vertices.debt.x},${vertices.debt.y} ${vertices.impulsive.x},${vertices.impulsive.y}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        <polygon
          points={idealPoints}
          fill="rgba(34, 197, 94, 0.2)"
          stroke="#22c55e"
          strokeWidth="2"
        />

        <polygon
          points={currentPoints}
          fill="rgba(239, 68, 68, 0.2)"
          stroke="#ef4444"
          strokeWidth="2"
        />

        <circle cx={vertices.savings.x} cy={vertices.savings.y} r="4" fill="#6b7280" />
        <circle cx={vertices.debt.x} cy={vertices.debt.y} r="4" fill="#6b7280" />
        <circle cx={vertices.impulsive.x} cy={vertices.impulsive.y} r="4" fill="#6b7280" />

        <text
          x={vertices.savings.x}
          y={vertices.savings.y - 10}
          textAnchor="middle"
          className="text-xs font-medium fill-gray-700"
        >
          Savings: {idealProfile.savingsIndex}
        </text>
        <text
          x={vertices.debt.x - 10}
          y={vertices.debt.y + 15}
          textAnchor="middle"
          className="text-xs font-medium fill-gray-700"
        >
          Debt: {idealProfile.debtIndex}
        </text>
        <text
          x={vertices.impulsive.x + 10}
          y={vertices.impulsive.y + 15}
          textAnchor="middle"
          className="text-xs font-medium fill-gray-700"
        >
          Impulse: {idealProfile.impulsiveIndex}
        </text>
      </svg>

      <div className="mt-4 flex items-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 opacity-40 border-2 border-red-500 mr-2"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 opacity-40 border-2 border-green-500 mr-2"></div>
          <span>Target</span>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-600 text-center max-w-xs">
        Triangle shows how close your profile is to the ideal for achieving this goal.
        Larger triangles indicate better alignment with goal requirements.
      </div>
    </div>
  );
}
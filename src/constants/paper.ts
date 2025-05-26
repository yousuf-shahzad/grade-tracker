export const PAPER_TYPES = [
  { value: 'Exam', label: 'Exam' },
  { value: 'Test', label: 'Test' },
  { value: 'Assignment', label: 'Assignment' },
  { value: 'Coursework', label: 'Coursework' },
] as const;

export const SUBJECTS = [
  { value: 'MATHS', label: 'Mathematics' },
  { value: 'FURTHER_MATHS', label: 'Further Mathematics' },
] as const;

export const MATHS_PAPER_TYPES = [
  { value: 'PURE', label: 'Pure Mathematics' },
  { value: 'STATS', label: 'Statistics' },
  { value: 'MECHANICS', label: 'Mechanics' },
] as const;

export const MATHS_TOPICS = {
  PURE: [
    'Algebra',
    'Calculus',
    'Geometry',
    'Trigonometry',
    'Coordinate Geometry',
    'Sequences and Series',
    'Complex Numbers',
    'Functions',
    'Logarithms',
    'Polynomials'
  ],
  STATS: [
    'Data Presentation',
    'Probability',
    'Statistical Distributions',
    'Hypothesis Testing',
    'Correlation and Regression',
    'Sampling',
    'Statistical Diagrams',
    'Measures of Central Tendency',
    'Measures of Dispersion',
    'Normal Distribution'
  ],
  MECHANICS: [
    'Forces and Motion',
    'Kinematics',
    'Dynamics',
    'Moments',
    'Projectiles',
    'Vectors',
    'Work and Energy',
    'Power',
    'Collisions',
    'Circular Motion'
  ]
} as const;

export const LEVELS = [
  { value: 'AS', label: 'AS Level' },
  { value: 'A2', label: 'A2 Level' },
] as const;

export const GRADE_COLORS = {
  A: {
    light: '#48BB78',
    dark: '#68D391',
  },
  B: {
    light: '#38A169',
    dark: '#48BB78',
  },
  C: {
    light: '#ED8936',
    dark: '#F6AD55',
  },
  D: {
    light: '#DD6B20',
    dark: '#ED8936',
  },
  E: {
    light: '#E53E3E',
    dark: '#FC8181',
  },
} as const;

export const GRADE_THRESHOLDS = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
} as const;

export const FURTHER_MATHS_PAPER_TYPES = {
  CORE_PURE_1: 'Core Pure 1',
  CORE_PURE_2: 'Core Pure 2',
  FURTHER_MECHANICS_1: 'Further Mechanics 1',
  FURTHER_MECHANICS_2: 'Further Mechanics 2',
  FURTHER_STATISTICS_1: 'Further Statistics 1',
  FURTHER_STATISTICS_2: 'Further Statistics 2',
  FURTHER_PURE_1: 'Further Pure 1',
  FURTHER_PURE_2: 'Further Pure 2',
} as const;

export const FURTHER_MATHS_TOPICS = {
  CORE_PURE_1: [
    'Complex Numbers',
    'Argand Diagrams',
    'Series',
    'Roots of Polynomials',
    'Volumes of Revolution',
    'Matrices',
    'Linear Transformations',
    'Proof by Induction',
    'Vectors',
    '3D Coordinate Geometry'
  ],
  CORE_PURE_2: [
    'Complex Numbers',
    'Series',
    'Methods in Calculus',
    'Volumes of Revolution',
    'Polar Coordinates',
    'Hyperbolic Functions',
    'Differential Equations',
    'Matrices',
    'Linear Transformations',
    '3D Coordinate Geometry'
  ],
  FURTHER_MECHANICS_1: [
    'Momentum and Impulse',
    'Work, Energy and Power',
    'Elastic Strings and Springs',
    'Elastic Collisions in One Dimension',
    'Elastic Collisions in Two Dimensions',
    'Centre of Mass',
    'Rigid Bodies in Equilibrium',
    'Toppling and Sliding',
    'Moment of a Force',
    'Angular Momentum'
  ],
  FURTHER_MECHANICS_2: [
    'Circular Motion',
    'Centres of Mass of Planes',
    'Centres of Mass of Solids',
    'Work and Energy',
    'Elastic Strings and Springs',
    'Elastic Collisions',
    'Rigid Bodies in Equilibrium',
    'Toppling and Sliding',
    'Moment of a Force',
    'Angular Momentum'
  ],
  FURTHER_STATISTICS_1: [
    'Discrete Probability Distributions',
    'Poisson Distribution',
    'Geometric Distribution',
    'Negative Binomial Distribution',
    'Hypothesis Testing',
    'Chi-Squared Tests',
    'Probability Generating Functions',
    'Use of Technology',
    'Quality of Tests',
    'Central Limit Theorem'
  ],
  FURTHER_STATISTICS_2: [
    'Linear Regression',
    'Correlation',
    'Continuous Probability Distributions',
    'Combinations of Random Variables',
    'Estimation, Confidence Intervals and Tests',
    'Chi-Squared Tests',
    'Probability Generating Functions',
    'Quality of Tests',
    'Central Limit Theorem',
    'Use of Technology'
  ],
  FURTHER_PURE_1: [
    'Complex Numbers',
    'Roots of Polynomials',
    'Matrices and Transformations',
    'Vectors and 3D Space',
    'Integration Techniques',
    'Numerical Methods',
    'Proof by Induction',
    'Complex Roots of Unity',
    'De Moivre\'s Theorem',
    'Complex Transformations'
  ],
  FURTHER_PURE_2: [
    'Complex Numbers',
    'Matrices and Transformations',
    'Vectors and 3D Space',
    'Integration Techniques',
    'Numerical Methods',
    'Proof by Induction',
    'Complex Roots of Unity',
    'De Moivre\'s Theorem',
    'Complex Transformations',
    'Further Calculus'
  ]
} as const;

export const EXAM_SERIES = [
  { value: 'MAY_JUNE_2017', label: 'May/June 2017' },
  { value: 'OCT_NOV_2017', label: 'October/November 2017' },
  { value: 'MAY_JUNE_2018', label: 'May/June 2018' },
  { value: 'OCT_NOV_2018', label: 'October/November 2018' },
  { value: 'MAY_JUNE_2019', label: 'May/June 2019' },
  { value: 'OCT_NOV_2019', label: 'October/November 2019' },
  { value: 'MAY_JUNE_2020', label: 'May/June 2020' },
  { value: 'OCT_NOV_2020', label: 'October/November 2020' },
  { value: 'MAY_JUNE_2021', label: 'May/June 2021' },
  { value: 'OCT_NOV_2021', label: 'October/November 2021' },
  { value: 'MAY_JUNE_2022', label: 'May/June 2022' },
  { value: 'OCT_NOV_2022', label: 'October/November 2022' },
  { value: 'MAY_JUNE_2023', label: 'May/June 2023' },
  { value: 'OCT_NOV_2023', label: 'October/November 2023' },
  { value: 'MAY_JUNE_2024', label: 'May/June 2024' },
  { value: 'OCT_NOV_2024', label: 'October/November 2024' },
  { value: 'MAY_JUNE_2025', label: 'May/June 2025' },
  { value: 'OCT_NOV_2025', label: 'October/November 2025' },
  { value: 'CUSTOM', label: 'Custom Series' }
] as const;

export type ExamSeries = typeof EXAM_SERIES[number]['value']; 
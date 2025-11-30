// 网格单元状态
export type CellState = 0 | 1; // 0: 海洋, 1: 陆地

// 网格坐标
export type Position = {
  row: number;
  col: number;
};

// 网格配置
export type GridConfig = {
  id: string;
  name: string;
  dimensions: { rows: number; cols: number };
  data: CellState[][];
  createdAt: Date;
};

// 算法状态
export type AlgorithmState = 'idle' | 'running' | 'paused' | 'completed';

// 算法类型
export type AlgorithmType = 'bfs' | 'dfs';

// 遍历节点状态
export type VisitedCell = {
  position: Position;
  visited: boolean;
  isCurrent: boolean;
  islandId: number | null;
};

// 算法执行结果
export type AlgorithmResult = {
  islandCount: number;
  executionSteps: ExecutionStep[];
  totalTime: number;
  visitedCells: number;
};

// 执行步骤
export type ExecutionStep = {
  stepNumber: number;
  currentPosition: Position;
  visitedCells: Position[];
  currentIslandId: number;
  action: 'visit' | 'discover_island' | 'complete';
  description: string;
};

// 算法配置
export type AlgorithmConfig = {
  type: AlgorithmType;
  speed: 'slow' | 'medium' | 'fast'; // 对应延迟: 1000ms, 500ms, 100ms
  delay: number; // 实际延迟毫秒数
};

// 本地存储数据模型
export interface LocalStorageData {
  // 保存的网格配置
  savedGrids: GridConfig[];
  
  // 应用设置
  settings: {
    defaultGridSize: { rows: number; cols: number };
    defaultAlgorithmSpeed: 'slow' | 'medium' | 'fast';
    theme: 'light' | 'dark';
  };
  
  // 最近使用
  recentExecutions: {
    gridId: string;
    algorithm: AlgorithmType;
    result: AlgorithmResult;
    timestamp: Date;
  }[];
}
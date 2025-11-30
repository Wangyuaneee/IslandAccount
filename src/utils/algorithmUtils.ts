import { CellState, Position, ExecutionStep } from '../types';

// 验证位置有效性
export function isValidPosition(
  row: number,
  col: number,
  grid: CellState[][],
  visited: boolean[][]
): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  return row >= 0 && row < rows &&
    col >= 0 && col < cols &&
    grid[row][col] === 1 &&
    !visited[row][col];
}

// 创建执行步骤
export function createStep(
  row: number,
  col: number,
  action: ExecutionStep['action'],
  islandId: number,
  stepNumber: number,
  visitedCells: Position[]
): ExecutionStep {
  return {
    stepNumber,
    currentPosition: { row, col },
    visitedCells: [...visitedCells],
    currentIslandId: islandId,
    action,
    description: generateStepDescription(action, row, col, islandId)
  };
}

// 生成步骤描述
function generateStepDescription(
  action: ExecutionStep['action'],
  row: number,
  col: number,
  islandId: number
): string {
  switch (action) {
    case 'discover_island':
      return `发现第 ${islandId} 个岛屿，起始位置: (${row}, ${col})`;
    case 'visit':
      return `访问节点 (${row}, ${col})，属于岛屿 ${islandId}`;
    case 'complete':
      return `算法完成，共发现 ${islandId} 个岛屿`;
    default:
      return `未知操作: ${action}`;
  }
}

// 获取速度对应的延迟时间
export function getSpeedDelay(speed: 'slow' | 'medium' | 'fast'): number {
  switch (speed) {
    case 'slow':
      return 1000;
    case 'medium':
      return 500;
    case 'fast':
      return 100;
    default:
      return 500;
  }
}

// 创建初始访问状态矩阵
export function createVisitedMatrix(rows: number, cols: number): boolean[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(false));
}

// 创建初始网格数据
export function createEmptyGrid(rows: number, cols: number): CellState[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(0));
}

// 复制网格数据
export function cloneGrid(grid: CellState[][]): CellState[][] {
  return grid.map(row => [...row]);
}

// 复制访问状态矩阵
export function cloneVisitedMatrix(visited: boolean[][]): boolean[][] {
  return visited.map(row => [...row]);
}
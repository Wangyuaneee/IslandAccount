import { CellState, Position, ExecutionStep, AlgorithmResult } from '../types';
import { isValidPosition, createStep, createVisitedMatrix } from '../utils/algorithmUtils';

export function dfsIslandCount(grid: CellState[][]): AlgorithmResult {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = createVisitedMatrix(rows, cols);
  let islandCount = 0;
  const steps: ExecutionStep[] = [];
  let stepNumber = 0;

  function dfs(row: number, col: number, islandId: number, visitedCells: Position[]) {
    visited[row][col] = true;
    visitedCells.push({ row, col });
    stepNumber++;
    steps.push(createStep(row, col, 'visit', islandId, stepNumber, visitedCells));

    // 检查四个方向：上、下、左、右
    const directions: Position[] = [
      { row: -1, col: 0 }, // 上
      { row: 1, col: 0 },  // 下
      { row: 0, col: -1 }, // 左
      { row: 0, col: 1 }   // 右
    ];

    for (const direction of directions) {
      const newRow = row + direction.row;
      const newCol = col + direction.col;

      if (isValidPosition(newRow, newCol, grid, visited)) {
        dfs(newRow, newCol, islandId, visitedCells);
      }
    }
  }

  // 主循环：遍历整个网格
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        islandCount++;
        stepNumber++;
        const visitedCells: Position[] = [];
        steps.push(createStep(i, j, 'discover_island', islandCount, stepNumber, visitedCells));
        dfs(i, j, islandCount, visitedCells);
      }
    }
  }

  const endTime = performance.now();

  return {
    islandCount,
    executionSteps: steps,
    totalTime: endTime - startTime,
    visitedCells: steps.filter(step => step.action === 'visit').length
  };
}

// 异步版本的DFS算法，用于可视化
export async function* dfsIslandCountAsync(
  grid: CellState[][],
  delay: number = 500
): AsyncGenerator<{
  step: ExecutionStep;
  visited: boolean[][];
  islandCount: number;
}, AlgorithmResult, unknown> {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = createVisitedMatrix(rows, cols);
  let islandCount = 0;
  const steps: ExecutionStep[] = [];
  let stepNumber = 0;

  async function* dfsAsync(row: number, col: number, islandId: number, visitedCells: Position[]) {
    visited[row][col] = true;
    visitedCells.push({ row, col });
    stepNumber++;
    const step = createStep(row, col, 'visit', islandId, stepNumber, visitedCells);
    steps.push(step);

    yield {
      step,
      visited: visited.map(row => [...row]),
      islandCount
    };

    await new Promise(resolve => setTimeout(resolve, delay));

    // 检查四个方向
    const directions: Position[] = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 }
    ];

    for (const direction of directions) {
      const newRow = row + direction.row;
      const newCol = col + direction.col;

      if (isValidPosition(newRow, newCol, grid, visited)) {
        yield* dfsAsync(newRow, newCol, islandId, visitedCells);
      }
    }
  }

  // 主循环
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        islandCount++;
        stepNumber++;
        const visitedCells: Position[] = [];
        const step = createStep(i, j, 'discover_island', islandCount, stepNumber, visitedCells);
        steps.push(step);

        yield {
          step,
          visited: visited.map(row => [...row]),
          islandCount
        };

        await new Promise(resolve => setTimeout(resolve, delay));

        // 执行DFS遍历
        yield* dfsAsync(i, j, islandCount, visitedCells);
      }
    }
  }

  const endTime = performance.now();

  return {
    islandCount,
    executionSteps: steps,
    totalTime: endTime - startTime,
    visitedCells: steps.filter(step => step.action === 'visit').length
  };
}
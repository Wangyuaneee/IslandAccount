import { CellState, Position, ExecutionStep, AlgorithmResult } from '../types';
import { isValidPosition, createStep, createVisitedMatrix } from '../utils/algorithmUtils';

export function bfsIslandCount(grid: CellState[][]): AlgorithmResult {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = createVisitedMatrix(rows, cols);
  let islandCount = 0;
  const steps: ExecutionStep[] = [];
  let stepNumber = 0;

  function bfs(startRow: number, startCol: number, islandId: number) {
    const queue: Position[] = [{ row: startRow, col: startCol }];
    visited[startRow][startCol] = true;
    const visitedCells: Position[] = [];

    while (queue.length > 0) {
      const { row, col } = queue.shift()!;
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
          visited[newRow][newCol] = true;
          queue.push({ row: newRow, col: newCol });
        }
      }
    }
  }

  // 主循环：遍历整个网格
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        islandCount++;
        stepNumber++;
        steps.push(createStep(i, j, 'discover_island', islandCount, stepNumber, []));
        bfs(i, j, islandCount);
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

// 异步版本的BFS算法，用于可视化
export async function* bfsIslandCountAsync(
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

  function* bfsAsync(startRow: number, startCol: number, islandId: number) {
    const queue: Position[] = [{ row: startRow, col: startCol }];
    visited[startRow][startCol] = true;
    const visitedCells: Position[] = [];

    while (queue.length > 0) {
      const { row, col } = queue.shift()!;
      visitedCells.push({ row, col });
      stepNumber++;
      const step = createStep(row, col, 'visit', islandId, stepNumber, visitedCells);
      steps.push(step);

      yield {
        step,
        visited: visited.map(row => [...row]),
        islandCount
      };

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
          visited[newRow][newCol] = true;
          queue.push({ row: newRow, col: newCol });
        }
      }
    }
  }

  // 主循环
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        islandCount++;
        stepNumber++;
        const step = createStep(i, j, 'discover_island', islandCount, stepNumber, []);
        steps.push(step);

        yield {
          step,
          visited: visited.map(row => [...row]),
          islandCount
        };

        await new Promise(resolve => setTimeout(resolve, delay));

        // 执行BFS遍历
        for (const asyncResult of bfsAsync(i, j, islandCount)) {
          yield asyncResult;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
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
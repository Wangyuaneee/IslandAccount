import { create } from 'zustand';
import {
  CellState,
  Position,
  AlgorithmState,
  AlgorithmType,
  AlgorithmConfig,
  AlgorithmResult,
  GridConfig,
  LocalStorageData,
  ExecutionStep
} from '../types';
import { createEmptyGrid, createVisitedMatrix, getSpeedDelay } from '../utils/algorithmUtils';
import { bfsIslandCountAsync } from '../algorithms/bfs';
import { dfsIslandCountAsync } from '../algorithms/dfs';

interface IslandStore {
  // 网格状态
  grid: CellState[][];
  gridDimensions: { rows: number; cols: number };

  // 算法状态
  algorithmState: AlgorithmState;
  algorithmConfig: AlgorithmConfig;
  currentStep: ExecutionStep | null;
  visitedMatrix: boolean[][];
  islandCount: number;

  // 执行结果
  algorithmResult: AlgorithmResult | null;
  executionProgress: number;

  // 历史记录
  savedGrids: GridConfig[];
  recentExecutions: LocalStorageData['recentExecutions'];

  // 设置
  settings: LocalStorageData['settings'];

  // 网格操作
  initializeGrid: (rows: number, cols: number) => void;
  toggleCell: (row: number, col: number) => void;
  setGridDimensions: (rows: number, cols: number) => void;
  clearGrid: () => void;

  // 算法配置
  setAlgorithmType: (type: AlgorithmType) => void;
  setAlgorithmSpeed: (speed: 'slow' | 'medium' | 'fast') => void;

  // 算法执行
  startAlgorithm: () => Promise<void>;
  pauseAlgorithm: () => void;
  resumeAlgorithm: () => Promise<void>;
  resetAlgorithm: () => void;

  // 历史记录管理
  saveGrid: (name: string) => void;
  loadGrid: (gridId: string) => void;
  deleteGrid: (gridId: string) => void;

  // 本地存储
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const useIslandStore = create<IslandStore>((set, get) => ({
  // 初始状态
  grid: createEmptyGrid(8, 8),
  gridDimensions: { rows: 8, cols: 8 },
  algorithmState: 'idle',
  algorithmConfig: {
    type: 'bfs',
    speed: 'medium',
    delay: getSpeedDelay('medium')
  },
  currentStep: null,
  visitedMatrix: createVisitedMatrix(8, 8),
  islandCount: 0,
  algorithmResult: null,
  executionProgress: 0,
  savedGrids: [],
  recentExecutions: [],
  settings: {
    defaultGridSize: { rows: 8, cols: 8 },
    defaultAlgorithmSpeed: 'medium',
    theme: 'light'
  },

  // 网格操作
  initializeGrid: (rows: number, cols: number) => {
    set({
      grid: createEmptyGrid(rows, cols),
      gridDimensions: { rows, cols },
      visitedMatrix: createVisitedMatrix(rows, cols)
    });
  },

  toggleCell: (row: number, col: number) => {
    const { grid } = get();
    const newGrid = grid.map((gridRow, r) =>
      gridRow.map((cell, c) => {
        if (r === row && c === col) {
          return cell === 0 ? 1 : 0;
        }
        return cell;
      })
    );
    set({ grid: newGrid });
  },

  setGridDimensions: (rows: number, cols: number) => {
    set({
      gridDimensions: { rows, cols },
      grid: createEmptyGrid(rows, cols),
      visitedMatrix: createVisitedMatrix(rows, cols)
    });
  },

  clearGrid: () => {
    const { gridDimensions } = get();
    set({
      grid: createEmptyGrid(gridDimensions.rows, gridDimensions.cols),
      visitedMatrix: createVisitedMatrix(gridDimensions.rows, gridDimensions.cols),
      islandCount: 0,
      currentStep: null,
      algorithmResult: null,
      executionProgress: 0
    });
  },

  // 算法配置
  setAlgorithmType: (type: AlgorithmType) => {
    set({
      algorithmConfig: {
        ...get().algorithmConfig,
        type
      }
    });
  },

  setAlgorithmSpeed: (speed: 'slow' | 'medium' | 'fast') => {
    set({
      algorithmConfig: {
        ...get().algorithmConfig,
        speed,
        delay: getSpeedDelay(speed)
      }
    });
  },

  // 算法执行
  startAlgorithm: async () => {
    const { grid, algorithmConfig, algorithmState } = get();

    if (algorithmState !== 'idle' && algorithmState !== 'completed') {
      return;
    }

    set({
      algorithmState: 'running',
      visitedMatrix: createVisitedMatrix(grid.length, grid[0].length),
      islandCount: 0,
      currentStep: null,
      executionProgress: 0
    });

    try {
      const asyncGenerator = algorithmConfig.type === 'bfs'
        ? bfsIslandCountAsync(grid, algorithmConfig.delay)
        : dfsIslandCountAsync(grid, algorithmConfig.delay);

      let totalSteps = 0;
      const steps: ExecutionStep[] = [];

      for await (const result of asyncGenerator) {
        const { step, visited, islandCount } = result;

        totalSteps++;
        steps.push(step);

        set({
          currentStep: step,
          visitedMatrix: visited,
          islandCount,
          executionProgress: totalSteps * 2 // 临时进度计算
        });

        // 检查是否被暂停
        if (get().algorithmState === 'paused') {
          // 等待恢复
          while (get().algorithmState === 'paused') {
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          // 如果被重置，停止执行
          if (get().algorithmState === 'idle') {
            return;
          }
        }
      }

      // 算法执行完成
      const algorithmResult: AlgorithmResult = {
        islandCount: get().islandCount,
        executionSteps: steps,
        totalTime: 0,
        visitedCells: steps.filter(s => s.action === 'visit').length
      };

      set({
        algorithmState: 'completed',
        algorithmResult,
        executionProgress: 100,
        recentExecutions: [
          {
            gridId: generateId(),
            algorithm: algorithmConfig.type,
            result: algorithmResult,
            timestamp: new Date()
          },
          ...get().recentExecutions.slice(0, 9) // 保持最近10条记录
        ]
      });

    } catch (error) {
      console.error('算法执行错误:', error);
      set({ algorithmState: 'idle' });
    }
  },

  pauseAlgorithm: () => {
    if (get().algorithmState === 'running') {
      set({ algorithmState: 'paused' });
    }
  },

  resumeAlgorithm: async () => {
    if (get().algorithmState === 'paused') {
      await get().startAlgorithm();
    }
  },

  resetAlgorithm: () => {
    const { gridDimensions } = get();
    set({
      algorithmState: 'idle',
      currentStep: null,
      visitedMatrix: createVisitedMatrix(gridDimensions.rows, gridDimensions.cols),
      islandCount: 0,
      executionProgress: 0
    });
  },

  // 历史记录管理
  saveGrid: (name: string) => {
    const { grid, gridDimensions, savedGrids } = get();
    const newGrid: GridConfig = {
      id: generateId(),
      name,
      dimensions: gridDimensions,
      data: grid,
      createdAt: new Date()
    };

    set({
      savedGrids: [newGrid, ...savedGrids]
    });

    get().saveToLocalStorage();
  },

  loadGrid: (gridId: string) => {
    const { savedGrids } = get();
    const gridConfig = savedGrids.find(g => g.id === gridId);

    if (gridConfig) {
      set({
        grid: gridConfig.data,
        gridDimensions: gridConfig.dimensions,
        visitedMatrix: createVisitedMatrix(gridConfig.dimensions.rows, gridConfig.dimensions.cols)
      });
    }
  },

  deleteGrid: (gridId: string) => {
    const { savedGrids } = get();
    set({
      savedGrids: savedGrids.filter(g => g.id !== gridId)
    });
    get().saveToLocalStorage();
  },

  // 本地存储
  loadFromLocalStorage: () => {
    try {
      const stored = localStorage.getItem('islandCounterData');
      if (stored) {
        const data: LocalStorageData = JSON.parse(stored);

        // 恢复数据时转换日期字符串为Date对象
        set({
          savedGrids: data.savedGrids.map(grid => ({
            ...grid,
            createdAt: new Date(grid.createdAt)
          })),
          recentExecutions: data.recentExecutions.map(exec => ({
            ...exec,
            timestamp: new Date(exec.timestamp)
          })),
          settings: data.settings
        });
      }
    } catch (error) {
      console.error('从本地存储加载数据失败:', error);
    }
  },

  saveToLocalStorage: () => {
    try {
      const { savedGrids, recentExecutions, settings } = get();
      const data: LocalStorageData = {
        savedGrids,
        recentExecutions,
        settings
      };

      localStorage.setItem('islandCounterData', JSON.stringify(data));
    } catch (error) {
      console.error('保存到本地存储失败:', error);
    }
  }
}));

// 初始化时从本地存储加载数据
useIslandStore.getState().loadFromLocalStorage();
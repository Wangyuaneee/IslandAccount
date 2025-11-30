import React from 'react';
import { useIslandStore } from '../store/islandStore';
import { CellState } from '../types';

interface GridCellProps {
  value: CellState;
  row: number;
  col: number;
  isVisited: boolean;
  isCurrent: boolean;
  islandId: number | null;
  onClick: (row: number, col: number) => void;
}

const GridCell: React.FC<GridCellProps> = ({
  value,
  row,
  col,
  isVisited,
  isCurrent,
  islandId,
  onClick
}) => {
  const getCellStyle = () => {
    let baseClasses = 'w-8 h-8 border border-gray-300 cursor-pointer transition-all duration-200 hover:scale-105';

    if (isCurrent) {
      baseClasses += ' bg-orange-400 ring-2 ring-orange-600';
    } else if (isVisited && value === 1) {
      baseClasses += ' bg-green-200';
    } else if (value === 1) {
      baseClasses += ' bg-green-500 hover:bg-green-600';
    } else {
      baseClasses += ' bg-blue-100 hover:bg-blue-200';
    }

    return baseClasses;
  };

  const getCellContent = () => {
    if (isCurrent) {
      return '●';
    }
    if (isVisited && islandId !== null) {
      return islandId.toString();
    }
    return '';
  };

  return (
    <div
      className={getCellStyle()}
      onClick={() => onClick(row, col)}
      title={`位置: (${row}, ${col})${value === 1 ? ' - 陆地' : ' - 海洋'}${islandId ? ` - 岛屿 ${islandId}` : ''}`}
    >
      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
        {getCellContent()}
      </div>
    </div>
  );
};

interface GridSizeControlProps {
  rows: number;
  cols: number;
  onChange: (rows: number, cols: number) => void;
}

const GridSizeControl: React.FC<GridSizeControlProps> = ({ rows, cols, onChange }) => {
  const sizes = [
    { label: '5×5', rows: 5, cols: 5 },
    { label: '8×8', rows: 8, cols: 8 },
    { label: '10×10', rows: 10, cols: 10 },
    { label: '12×12', rows: 12, cols: 12 },
    { label: '15×15', rows: 15, cols: 15 }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="text-sm font-medium text-gray-700">网格大小:</span>
      {sizes.map((size) => (
        <button
          key={`${size.rows}x${size.cols}`}
          onClick={() => onChange(size.rows, size.cols)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${rows === size.rows && cols === size.cols
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
};

interface GridEditorProps {
  className?: string;
}

const GridEditor: React.FC<GridEditorProps> = ({ className = '' }) => {
  const {
    grid,
    gridDimensions,
    visitedMatrix,
    currentStep,
    islandCount,
    algorithmState,
    toggleCell,
    setGridDimensions,
    clearGrid
  } = useIslandStore();

  const handleCellClick = (row: number, col: number) => {
    if (algorithmState === 'running' || algorithmState === 'paused') {
      return; // 算法运行时禁止编辑
    }
    toggleCell(row, col);
  };

  const getCellStatus = (row: number, col: number) => {
    const isVisited = visitedMatrix[row][col];
    const isCurrent = currentStep?.currentPosition.row === row &&
      currentStep?.currentPosition.col === col;
    const islandId = currentStep?.currentIslandId ?? null;

    return { isVisited, isCurrent, islandId };
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">网格编辑区</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            当前岛屿数量: <span className="font-bold text-blue-600">{islandCount}</span>
          </div>
          <button
            onClick={clearGrid}
            disabled={algorithmState === 'running'}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            清空网格
          </button>
        </div>
      </div>

      <GridSizeControl
        rows={gridDimensions.rows}
        cols={gridDimensions.cols}
        onChange={setGridDimensions}
      />

      <div className="flex flex-col items-center">
        <div
          className="grid gap-1 p-4 bg-gray-50 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridDimensions.rows}, minmax(0, 1fr))`
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const { isVisited, isCurrent, islandId } = getCellStatus(rowIndex, colIndex);
              return (
                <GridCell
                  key={`${rowIndex}-${colIndex}`}
                  value={cell}
                  row={rowIndex}
                  col={colIndex}
                  isVisited={isVisited}
                  isCurrent={isCurrent}
                  islandId={islandId}
                  onClick={handleCellClick}
                />
              );
            })
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>点击网格单元来切换陆地（绿色）和海洋（蓝色）</p>
          {algorithmState === 'running' && (
            <p className="text-orange-600 font-medium">算法运行中，网格编辑已禁用</p>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">图例:</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-gray-300 rounded"></div>
            <span>海洋 (0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 border border-gray-300 rounded"></div>
            <span>陆地 (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border border-gray-300 rounded"></div>
            <span>已访问陆地</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 border-2 border-orange-600 rounded"></div>
            <span>当前访问节点</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridEditor;
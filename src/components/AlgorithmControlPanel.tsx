import React from 'react';
import { useIslandStore } from '../store/islandStore';
import { Play, Pause, Square, RotateCcw, Save } from 'lucide-react';

interface AlgorithmControlPanelProps {
  className?: string;
}

const AlgorithmControlPanel: React.FC<AlgorithmControlPanelProps> = ({ className = '' }) => {
  const {
    algorithmState,
    algorithmConfig,
    islandCount,
    executionProgress,
    currentStep,
    startAlgorithm,
    pauseAlgorithm,
    resumeAlgorithm,
    resetAlgorithm,
    setAlgorithmType,
    setAlgorithmSpeed,
    saveGrid
  } = useIslandStore();

  const [gridName, setGridName] = React.useState('');
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);

  const handleStart = async () => {
    if (algorithmState === 'idle' || algorithmState === 'completed') {
      await startAlgorithm();
    } else if (algorithmState === 'paused') {
      await resumeAlgorithm();
    }
  };

  const handlePause = () => {
    pauseAlgorithm();
  };

  const handleReset = () => {
    resetAlgorithm();
  };

  const handleSaveGrid = () => {
    if (gridName.trim()) {
      saveGrid(gridName.trim());
      setGridName('');
      setShowSaveDialog(false);
    }
  };

  const getButtonState = () => {
    switch (algorithmState) {
      case 'idle':
        return { text: '开始算法', icon: Play, variant: 'primary' };
      case 'running':
        return { text: '暂停', icon: Pause, variant: 'warning' };
      case 'paused':
        return { text: '继续', icon: Play, variant: 'primary' };
      case 'completed':
        return { text: '重新开始', icon: RotateCcw, variant: 'primary' };
      default:
        return { text: '开始算法', icon: Play, variant: 'primary' };
    }
  };

  const buttonState = getButtonState();
  const IconComponent = buttonState.icon;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-6">算法控制面板</h2>

      {/* 算法类型选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          算法类型
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setAlgorithmType('bfs')}
            disabled={algorithmState === 'running'}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${algorithmConfig.type === 'bfs'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            BFS (广度优先搜索)
          </button>
          <button
            onClick={() => setAlgorithmType('dfs')}
            disabled={algorithmState === 'running'}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${algorithmConfig.type === 'dfs'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            DFS (深度优先搜索)
          </button>
        </div>
      </div>

      {/* 速度控制 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          执行速度
        </label>
        <div className="flex gap-2">
          {[
            { key: 'slow', label: '慢速' },
            { key: 'medium', label: '中速' },
            { key: 'fast', label: '快速' }
          ].map((speed) => (
            <button
              key={speed.key}
              onClick={() => setAlgorithmSpeed(speed.key as 'slow' | 'medium' | 'fast')}
              disabled={algorithmState === 'running'}
              className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${algorithmConfig.speed === speed.key
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              {speed.label}
            </button>
          ))}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="mb-6 space-y-2">
        <button
          onClick={handleStart}
          disabled={algorithmState === 'running' || algorithmState === 'completed'}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-medium rounded-md transition-colors ${buttonState.variant === 'primary'
              ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300'
              : 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300'
            } disabled:cursor-not-allowed`}
        >
          <IconComponent size={18} />
          {buttonState.text}
        </button>

        <div className="flex gap-2">
          <button
            onClick={handlePause}
            disabled={algorithmState !== 'running'}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Pause size={16} />
            暂停
          </button>
          <button
            onClick={handleReset}
            disabled={algorithmState === 'running'}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Square size={16} />
            重置
          </button>
        </div>
      </div>

      {/* 进度显示 */}
      {algorithmState !== 'idle' && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>执行进度</span>
            <span>{Math.round(executionProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(executionProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 当前步骤信息 */}
      {currentStep && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">当前步骤</h3>
          <p className="text-sm text-blue-700 mb-1">
            步骤 {currentStep.stepNumber}: {currentStep.description}
          </p>
          <p className="text-xs text-blue-600">
            位置: ({currentStep.currentPosition.row}, {currentStep.currentPosition.col})
          </p>
        </div>
      )}

      {/* 统计信息 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">统计信息</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>当前岛屿数量:</span>
            <span className="font-medium text-blue-600">{islandCount}</span>
          </div>
          <div className="flex justify-between">
            <span>算法类型:</span>
            <span className="font-medium">
              {algorithmConfig.type === 'bfs' ? 'BFS' : 'DFS'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>执行速度:</span>
            <span className="font-medium">
              {algorithmConfig.speed === 'slow' ? '慢速' :
                algorithmConfig.speed === 'medium' ? '中速' : '快速'}
            </span>
          </div>
        </div>
      </div>

      {/* 保存网格 */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">保存配置</h3>
        {!showSaveDialog ? (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition-colors"
          >
            <Save size={16} />
            保存当前网格
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={gridName}
              onChange={(e) => setGridName(e.target.value)}
              placeholder="输入网格配置名称"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveGrid()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveGrid}
                disabled={!gridName.trim()}
                className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setGridName('');
                }}
                className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmControlPanel;
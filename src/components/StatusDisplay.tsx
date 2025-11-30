import React from 'react';
import { useIslandStore } from '../store/islandStore';
import { Clock, Activity, Target, Zap } from 'lucide-react';

interface StatusDisplayProps {
  className?: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ className = '' }) => {
  const {
    algorithmState,
    currentStep,
    islandCount,
    executionProgress,
    algorithmResult,
    algorithmConfig
  } = useIslandStore();

  const getStateColor = () => {
    switch (algorithmState) {
      case 'idle':
        return 'text-gray-500';
      case 'running':
        return 'text-green-500';
      case 'paused':
        return 'text-yellow-500';
      case 'completed':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStateText = () => {
    switch (algorithmState) {
      case 'idle':
        return '待机中';
      case 'running':
        return '运行中';
      case 'paused':
        return '已暂停';
      case 'completed':
        return '已完成';
      default:
        return '未知状态';
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-6">实时状态</h2>

      {/* 算法状态 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Activity size={20} className={getStateColor()} />
          <h3 className="text-lg font-semibold text-gray-700">算法状态</h3>
        </div>
        <div className={`text-lg font-bold ${getStateColor()}`}>
          {getStateText()}
        </div>
      </div>

      {/* 关键指标 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Target size={20} className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-700">关键指标</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">岛屿数量</div>
            <div className="text-2xl font-bold text-blue-700">{islandCount}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 mb-1">执行进度</div>
            <div className="text-2xl font-bold text-green-700">
              {Math.round(executionProgress)}%
            </div>
          </div>
        </div>
      </div>

      {/* 当前步骤详情 */}
      {currentStep && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={20} className="text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-700">当前步骤</h3>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-orange-600 mb-2">
              步骤 {currentStep.stepNumber}
            </div>
            <div className="text-orange-800 font-medium mb-2">
              {currentStep.description}
            </div>
            <div className="text-xs text-orange-600">
              位置: ({currentStep.currentPosition.row}, {currentStep.currentPosition.col})
            </div>
            <div className="text-xs text-orange-600">
              岛屿 ID: {currentStep.currentIslandId}
            </div>
          </div>
        </div>
      )}

      {/* 算法配置 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Zap size={20} className="text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-700">算法配置</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">算法类型:</span>
            <span className="font-medium text-gray-800">
              {algorithmConfig.type === 'bfs' ? 'BFS (广度优先)' : 'DFS (深度优先)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">执行速度:</span>
            <span className="font-medium text-gray-800">
              {algorithmConfig.speed === 'slow' ? '慢速 (1s)' :
                algorithmConfig.speed === 'medium' ? '中速 (0.5s)' : '快速 (0.1s)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">延迟时间:</span>
            <span className="font-medium text-gray-800">
              {algorithmConfig.delay}ms
            </span>
          </div>
        </div>
      </div>

      {/* 执行结果 */}
      {algorithmResult && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Activity size={20} className="text-green-500" />
            <h3 className="text-lg font-semibold text-gray-700">执行结果</h3>
          </div>
          <div className="bg-green-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-600">总岛屿数量:</span>
              <span className="font-bold text-green-700">{algorithmResult.islandCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">总执行步骤:</span>
              <span className="font-bold text-green-700">{algorithmResult.executionSteps.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">访问节点数:</span>
              <span className="font-bold text-green-700">{algorithmResult.visitedCells}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">执行时间:</span>
              <span className="font-bold text-green-700">
                {formatTime(algorithmResult.totalTime)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 进度条 */}
      {algorithmState !== 'idle' && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>执行进度</span>
            <span>{Math.round(executionProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(executionProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 状态指示器 */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">状态指示器</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${algorithmState === 'running' ? 'bg-green-500 animate-pulse' :
                algorithmState === 'paused' ? 'bg-yellow-500' :
                  algorithmState === 'completed' ? 'bg-blue-500' :
                    'bg-gray-300'
              }`}></div>
            <span className={`text-sm font-medium ${getStateColor()}`}>
              {getStateText()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Download, Calendar, Clock, Target } from 'lucide-react';
import { useIslandStore } from '../store/islandStore';
import { GridConfig } from '../types';

const History: React.FC = () => {
  const { savedGrids, recentExecutions, loadGrid, deleteGrid } = useIslandStore();

  const handleLoadGrid = (gridId: string) => {
    loadGrid(gridId);
  };

  const handleDeleteGrid = (gridId: string) => {
    if (window.confirm('确定要删除这个网格配置吗？')) {
      deleteGrid(gridId);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const renderGridPreview = (grid: number[][]) => {
    const maxRows = 8;
    const maxCols = 8;
    const displayGrid = grid.slice(0, maxRows).map(row => row.slice(0, maxCols));

    return (
      <div className="grid gap-px bg-gray-200" style={{
        gridTemplateColumns: `repeat(${displayGrid[0].length}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${displayGrid.length}, minmax(0, 1fr))`
      }}>
        {displayGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-3 h-3 ${cell === 1 ? 'bg-green-500' : 'bg-blue-100'
                }`}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} />
              返回主页
            </Link>
            <div className="flex items-center gap-3 ml-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">历史</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">历史记录</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">历史记录</h2>
          <p className="text-gray-600">
            查看保存的网格配置和最近的算法执行历史
          </p>
        </div>

        {/* 保存的网格配置 */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Download size={20} className="text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800">保存的网格配置</h2>
              </div>
            </div>
            <div className="p-6">
              {savedGrids.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Download size={48} />
                  </div>
                  <p className="text-gray-500">暂无保存的网格配置</p>
                  <p className="text-sm text-gray-400 mt-1">
                    在主页的算法控制面板中可以保存当前网格配置
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedGrids.map((grid) => (
                    <div key={grid.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 truncate">{grid.name}</h3>
                        <button
                          onClick={() => handleDeleteGrid(grid.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="删除配置"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mb-3">
                        {renderGridPreview(grid.data)}
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar size={12} />
                          <span>{formatDate(grid.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target size={12} />
                          <span>{grid.dimensions.rows} × {grid.dimensions.cols}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLoadGrid(grid.id)}
                        className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        加载配置
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 最近的执行历史 */}
        <section>
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-green-500" />
                <h2 className="text-xl font-bold text-gray-800">最近的执行历史</h2>
              </div>
            </div>
            <div className="p-6">
              {recentExecutions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Clock size={48} />
                  </div>
                  <p className="text-gray-500">暂无执行历史</p>
                  <p className="text-sm text-gray-400 mt-1">
                    在主页运行算法后会显示执行历史
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentExecutions.map((execution, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${execution.algorithm === 'bfs' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                            }`}>
                            <span className="text-sm font-bold">
                              {execution.algorithm === 'bfs' ? 'B' : 'D'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {execution.algorithm === 'bfs' ? 'BFS (广度优先搜索)' : 'DFS (深度优先搜索)'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(execution.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {execution.result.islandCount}
                          </div>
                          <div className="text-xs text-gray-500">岛屿数量</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-gray-500 mb-1">执行步骤</div>
                          <div className="font-semibold text-gray-800">
                            {execution.result.executionSteps.length}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 mb-1">访问节点</div>
                          <div className="font-semibold text-gray-800">
                            {execution.result.visitedCells}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 mb-1">执行时间</div>
                          <div className="font-semibold text-gray-800">
                            {formatTime(execution.result.totalTime)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 mb-1">算法类型</div>
                          <div className="font-semibold text-gray-800">
                            {execution.algorithm.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default History;
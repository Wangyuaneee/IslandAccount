import React from 'react';
import GridEditor from '../components/GridEditor';
import AlgorithmControlPanel from '../components/AlgorithmControlPanel';
import StatusDisplay from '../components/StatusDisplay';
import { Info, BookOpen, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">岛屿</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">岛屿计数器</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                to="/algorithm"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BookOpen size={16} />
                算法详情
              </Link>
              <Link
                to="/history"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <History size={16} />
                历史记录
              </Link>
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                <Info size={16} />
                <span>使用说明</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            岛屿数量算法可视化
          </h2>
          <p className="text-gray-600">
            通过交互式网格编辑和实时可视化，深入理解BFS和DFS算法如何计算岛屿数量
          </p>
        </div>

        {/* 使用说明 */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">使用说明</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 点击网格单元来创建陆地（绿色）或海洋（蓝色）</li>
            <li>• 选择算法类型（BFS或DFS）和执行速度</li>
            <li>• 点击"开始算法"按钮开始可视化演示</li>
            <li>• 观察算法如何遍历网格并识别岛屿</li>
            <li>• 可以暂停、继续或重置算法执行</li>
            <li>• 保存当前网格配置以便后续使用</li>
          </ul>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：算法控制面板 */}
          <div className="lg:col-span-1">
            <AlgorithmControlPanel />
          </div>

          {/* 中间：网格编辑区 */}
          <div className="lg:col-cols-1">
            <GridEditor />
          </div>

          {/* 右侧：实时状态显示 */}
          <div className="lg:col-span-1">
            <StatusDisplay />
          </div>
        </div>

        {/* 算法对比说明 */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">算法对比</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">BFS (广度优先搜索)</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 使用队列数据结构</li>
                <li>• 逐层遍历节点</li>
                <li>• 适合寻找最短路径</li>
                <li>• 空间复杂度较高</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">DFS (深度优先搜索)</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 使用栈数据结构</li>
                <li>• 深入遍历分支</li>
                <li>• 适合拓扑排序</li>
                <li>• 空间复杂度较低</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

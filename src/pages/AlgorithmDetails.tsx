import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, BarChart3, Clock, MemoryStick } from 'lucide-react';

const AlgorithmDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <span className="text-white font-bold text-sm">算法</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">算法详情</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* BFS 算法 */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Code size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">BFS (广度优先搜索)</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">算法原理</h3>
                <p className="text-gray-600 leading-relaxed">
                  广度优先搜索（BFS）是一种图遍历算法，它从根节点开始，逐层地访问节点。
                  在岛屿数量问题中，BFS会从一个陆地单元开始，先访问所有相邻的陆地单元，
                  然后再访问下一层的相邻单元，直到整个岛屿都被标记为已访问。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">算法步骤</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>遍历整个网格，寻找未被访问的陆地单元</li>
                  <li>当发现陆地时，岛屿计数加1，并开始BFS遍历</li>
                  <li>使用队列存储待访问的节点</li>
                  <li>从队列中取出节点，标记为已访问</li>
                  <li>检查当前节点的四个相邻方向（上、下、左、右）</li>
                  <li>如果相邻节点是未被访问的陆地，则加入队列</li>
                  <li>重复步骤4-6，直到队列为空</li>
                  <li>继续遍历网格，直到所有单元都被检查</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">伪代码</h3>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <pre className="text-gray-800">
                    {`function bfsIslandCount(grid):
    rows, cols = grid的行数和列数
    visited = 创建visited矩阵，初始化为false
    islandCount = 0
    
    for i from 0 to rows-1:
        for j from 0 to cols-1:
            if grid[i][j] == 1 and not visited[i][j]:
                islandCount += 1
                queue = [(i, j)]
                visited[i][j] = true
                
                while queue不为空:
                    (row, col) = queue出队
                    
                    # 检查四个相邻方向
                    for (dr, dc) in [(-1,0), (1,0), (0,-1), (0,1)]:
                        newRow, newCol = row + dr, col + dc
                        
                        if 位置有效且是陆地且未访问:
                            visited[newRow][newCol] = true
                            queue入队(newRow, newCol)
    
    return islandCount`}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-blue-600" />
                    <h4 className="font-semibold text-blue-800">时间复杂度</h4>
                  </div>
                  <p className="text-blue-700 text-sm">
                    O(m × n)，其中m和n分别是网格的行数和列数。每个单元最多被访问一次。
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MemoryStick size={16} className="text-purple-600" />
                    <h4 className="font-semibold text-purple-800">空间复杂度</h4>
                  </div>
                  <p className="text-purple-700 text-sm">
                    O(min(m, n))，最坏情况下队列需要存储一层中的所有节点。
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">特点</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>使用队列数据结构实现</li>
                  <li>逐层遍历，保证找到最短路径</li>
                  <li>适合寻找连通分量的最小深度</li>
                  <li>空间复杂度相对较高</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* DFS 算法 */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Code size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">DFS (深度优先搜索)</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">算法原理</h3>
                <p className="text-gray-600 leading-relaxed">
                  深度优先搜索（DFS）是一种图遍历算法，它沿着一条路径尽可能深入地访问节点，
                  直到无法继续为止，然后回溯到上一个节点，继续探索其他路径。
                  在岛屿数量问题中，DFS会从一个陆地单元开始，沿着一条路径深入遍历整个岛屿。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">算法步骤</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>遍历整个网格，寻找未被访问的陆地单元</li>
                  <li>当发现陆地时，岛屿计数加1，并开始DFS遍历</li>
                  <li>递归地访问当前节点的四个相邻方向</li>
                  <li>标记当前节点为已访问</li>
                  <li>对每个相邻的未被访问的陆地单元重复DFS过程</li>
                  <li>当没有更多相邻的未访问陆地时，回溯</li>
                  <li>继续遍历网格，直到所有单元都被检查</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">伪代码</h3>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <pre className="text-gray-800">
                    {`function dfsIslandCount(grid):
    rows, cols = grid的行数和列数
    visited = 创建visited矩阵，初始化为false
    islandCount = 0
    
    function dfs(row, col):
        if 位置无效或不是陆地或已访问:
            return
            
        visited[row][col] = true
        
        # 检查四个相邻方向
        for (dr, dc) in [(-1,0), (1,0), (0,-1), (0,1)]:
            newRow, newCol = row + dr, col + dc
            dfs(newRow, newCol)
    
    for i from 0 to rows-1:
        for j from 0 to cols-1:
            if grid[i][j] == 1 and not visited[i][j]:
                islandCount += 1
                dfs(i, j)
    
    return islandCount`}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-blue-600" />
                    <h4 className="font-semibold text-blue-800">时间复杂度</h4>
                  </div>
                  <p className="text-blue-700 text-sm">
                    O(m × n)，其中m和n分别是网格的行数和列数。每个单元最多被访问一次。
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MemoryStick size={16} className="text-purple-600" />
                    <h4 className="font-semibold text-purple-800">空间复杂度</h4>
                  </div>
                  <p className="text-purple-700 text-sm">
                    O(m × n)，最坏情况下递归栈需要存储所有节点，适合深度较小的图。
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">特点</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>使用递归或栈数据结构实现</li>
                  <li>深入遍历，直到无法继续</li>
                  <li>适合拓扑排序和连通性检测</li>
                  <li>空间复杂度相对较低（使用递归时）</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 算法对比 */}
        <section>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">算法对比</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">特性</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">BFS</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">DFS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">数据结构</td>
                    <td className="border border-gray-300 px-4 py-2">队列</td>
                    <td className="border border-gray-300 px-4 py-2">栈（递归）</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">遍历顺序</td>
                    <td className="border border-gray-300 px-4 py-2">逐层遍历</td>
                    <td className="border border-gray-300 px-4 py-2">深度优先</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">时间复杂度</td>
                    <td className="border border-gray-300 px-4 py-2">O(m × n)</td>
                    <td className="border border-gray-300 px-4 py-2">O(m × n)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">空间复杂度</td>
                    <td className="border border-gray-300 px-4 py-2">O(min(m, n))</td>
                    <td className="border border-gray-300 px-4 py-2">O(m × n)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">适用场景</td>
                    <td className="border border-gray-300 px-4 py-2">最短路径、层次遍历</td>
                    <td className="border border-gray-300 px-4 py-2">拓扑排序、连通性</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">实现复杂度</td>
                    <td className="border border-gray-300 px-4 py-2">中等</td>
                    <td className="border border-gray-300 px-4 py-2">简单（递归）</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">选择建议</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>使用BFS：</strong>当需要找到最短路径或进行层次遍历时</li>
                <li>• <strong>使用DFS：</strong>当需要进行拓扑排序或检测连通性时</li>
                <li>• <strong>岛屿数量问题：</strong>两种算法都可以，选择取决于个人偏好和具体需求</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AlgorithmDetails;
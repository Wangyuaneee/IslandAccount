function createVisited(rows, cols){const v=[];for(let i=0;i<rows;i++){const r=[];for(let j=0;j<cols;j++){r.push(false)}v.push(r)}return v}
function inBounds(grid,r,c){return r>=0&&c>=0&&r<grid.length&&c<grid[0].length}
function neighbors(r,c){return [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]}
function runBfs(grid,delay,onStep,shouldPause){return new Promise(async resolve=>{const rows=grid.length,cols=grid[0].length;const visited=createVisited(rows,cols);let islands=0;let steps=0;function enqueueBfs(sr,sc){const q=[[sr,sc]];visited[sr][sc]=true;function step(){if(q.length===0){resolveIsland();return}const [r,c]=q.shift();steps++;onStep({stepNumber:steps,description:'BFS',currentPosition:{row:r,col:c}},clone(visited),islands);const ns=neighbors(r,c);for(const [nr,nc]of ns){if(inBounds(grid,nr,nc)&&grid[nr][nc]===1&&!visited[nr][nc]){visited[nr][nc]=true;q.push([nr,nc])}}schedule(step)}
function schedule(fn){if(shouldPause())return setTimeout(()=>schedule(fn),100);setTimeout(fn,delay)}
function resolveIsland(){schedule(next)}
function next(){for(let i=0;i<rows;i++){for(let j=0;j<cols;j++){if(grid[i][j]===1&&!visited[i][j]){islands++;enqueueBfs(i,j);return}}}resolve({islandCount:islands,visited,steps})}
next()})}
function runDfs(grid,delay,onStep,shouldPause){return new Promise(resolve=>{const rows=grid.length,cols=grid[0].length;const visited=createVisited(rows,cols);let islands=0;let steps=0;function dfs(sr,sc){const stack=[[sr,sc]];visited[sr][sc]=true;function step(){if(stack.length===0){resolveIsland();return}const [r,c]=stack.pop();steps++;onStep({stepNumber:steps,description:'DFS',currentPosition:{row:r,col:c}},clone(visited),islands);const ns=neighbors(r,c);for(const [nr,nc]of ns){if(inBounds(grid,nr,nc)&&grid[nr][nc]===1&&!visited[nr][nc]){visited[nr][nc]=true;stack.push([nr,nc])}}schedule(step)}
function schedule(fn){if(shouldPause())return setTimeout(()=>schedule(fn),100);setTimeout(fn,delay)}
function resolveIsland(){schedule(next)}
function next(){for(let i=0;i<rows;i++){for(let j=0;j<cols;j++){if(grid[i][j]===1&&!visited[i][j]){islands++;dfs(i,j);return}}}resolve({islandCount:islands,visited,steps})}
next()})}
function emptyGrid(rows,cols){const g=[];for(let i=0;i<rows;i++){const r=[];for(let j=0;j<cols;j++){r.push(0)}g.push(r)}return g}
function clone(m){return m.map(r=>r.slice())}
module.exports={runBfs,runDfs,emptyGrid}

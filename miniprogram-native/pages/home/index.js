const { runBfs, runDfs, emptyGrid } = require('../../utils/algorithms.js')
Page({
  data:{
    gridDimensions:{rows:8,cols:8},
    grid:emptyGrid(8,8),
    visited:[],
    algorithmState:'idle',
    algorithmType:'bfs',
    speed:'medium',
    delay:500,
    islandCount:0,
    executionProgress:0,
    currentStep:null
  },
  onLoad(){this.setData({visited:this.createVisited(this.data.gridDimensions.rows,this.data.gridDimensions.cols)})},
  createVisited(r,c){const v=[];for(let i=0;i<r;i++){const row=[];for(let j=0;j<c;j++){row.push(false)}v.push(row)}return v},
  setBfs(){this.setData({algorithmType:'bfs'})},
  setDfs(){this.setData({algorithmType:'dfs'})},
  setSlow(){this.setData({speed:'slow',delay:1000})},
  setMedium(){this.setData({speed:'medium',delay:500})},
  setFast(){this.setData({speed:'fast',delay:100})},
  setSize(e){const rows=Number(e.currentTarget.dataset.r);const cols=Number(e.currentTarget.dataset.c);this.setData({gridDimensions:{rows,cols},grid:emptyGrid(rows,cols),visited:this.createVisited(rows,cols),islandCount:0,executionProgress:0,currentStep:null})},
  onCellTap(e){if(this.data.algorithmState==='running'||this.data.algorithmState==='paused')return;const r=Number(e.currentTarget.dataset.r);const c=Number(e.currentTarget.dataset.c);const g=this.data.grid.map(row=>row.slice());g[r][c]=g[r][c]===0?1:0;this.setData({grid:g})},
  clearGrid(){const {rows,cols}=this.data.gridDimensions;this.setData({grid:emptyGrid(rows,cols),visited:this.createVisited(rows,cols),islandCount:0,currentStep:null,executionProgress:0})},
  start(){if(!(this.data.algorithmState==='idle'||this.data.algorithmState==='completed'))return;this.setData({algorithmState:'running',visited:this.createVisited(this.data.gridDimensions.rows,this.data.gridDimensions.cols),islandCount:0,currentStep:null,executionProgress:0});const delay=this.data.delay;const grid=this.data.grid.map(row=>row.slice());const onStep=(step,visited,islands)=>{this.setData({currentStep:step,visited:visited,islandCount:islands,executionProgress:this.data.executionProgress+2})};const shouldPause=()=>this.data.algorithmState==='paused';const runner=this.data.algorithmType==='bfs'?runBfs:runDfs;runner(grid,delay,onStep,shouldPause).then(res=>{this.setData({algorithmState:'completed',visited:res.visited,islandCount:res.islandCount,executionProgress:100})}).catch(()=>{this.setData({algorithmState:'idle'})})},
  pause(){if(this.data.algorithmState==='running'){this.setData({algorithmState:'paused'})}},
  reset(){if(this.data.algorithmState==='running')return;const {rows,cols}=this.data.gridDimensions;this.setData({algorithmState:'idle',currentStep:null,visited:this.createVisited(rows,cols),islandCount:0,executionProgress:0})},
  stateText(){const s=this.data.algorithmState;return s==='idle'?'待机中':s==='running'?'运行中':s==='paused'?'已暂停':'已完成'},
  getCellClass(r,c){const v=this.data.grid[r][c];const visited=this.data.visited[r][c];const cur=this.data.currentStep&&this.data.currentStep.currentPosition.row===r&&this.data.currentStep.currentPosition.col===c;return v===1?(cur?'current':visited?'visited':'land'):'ocean'},
  getCellText(r,c){const cur=this.data.currentStep&&this.data.currentStep.currentPosition.row===r&&this.data.currentStep.currentPosition.col===c;return cur?'●':''}
})

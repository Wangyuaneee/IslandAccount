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
    currentStep:null,
    renderGrid:[],
    stateText:'待机中',
    progressText:'0%'
  },
  onLoad(){this.setData({visited:this.createVisited(this.data.gridDimensions.rows,this.data.gridDimensions.cols)});this.updateComputed()},
  createVisited(r,c){const v=[];for(let i=0;i<r;i++){const row=[];for(let j=0;j<c;j++){row.push(false)}v.push(row)}return v},
  updateComputed(){
    const { grid, visited, currentStep, algorithmState, executionProgress } = this.data
    const rows = grid.length, cols = rows?grid[0].length:0
    const render = []
    for(let r=0;r<rows;r++){
      const row=[]
      for(let c=0;c<cols;c++){
        const v = grid[r][c]
        const isVisited = visited[r] && visited[r][c]
        const isCurrent = currentStep && currentStep.currentPosition.row===r && currentStep.currentPosition.col===c
        const cls = v===1 ? (isCurrent?'current':(isVisited?'visited':'land')) : 'ocean'
        const text = isCurrent ? '●' : ''
        row.push({ cls, text })
      }
      render.push(row)
    }
    const stateText = algorithmState==='idle'?'待机中':algorithmState==='running'?'运行中':algorithmState==='paused'?'已暂停':'已完成'
    const progressText = `${Math.round(executionProgress)}%`
    this.setData({ renderGrid: render, stateText, progressText })
  },
  setBfs(){this.setData({algorithmType:'bfs'})},
  setDfs(){this.setData({algorithmType:'dfs'})},
  setSlow(){this.setData({speed:'slow',delay:1000})},
  setMedium(){this.setData({speed:'medium',delay:500})},
  setFast(){this.setData({speed:'fast',delay:100})},
  setSize(e){const rows=Number(e.currentTarget.dataset.r);const cols=Number(e.currentTarget.dataset.c);this.setData({gridDimensions:{rows,cols},grid:emptyGrid(rows,cols),visited:this.createVisited(rows,cols),islandCount:0,executionProgress:0,currentStep:null});this.updateComputed()},
  onCellTap(e){if(this.data.algorithmState==='running'||this.data.algorithmState==='paused')return;const r=Number(e.currentTarget.dataset.r);const c=Number(e.currentTarget.dataset.c);const g=this.data.grid.map(row=>row.slice());g[r][c]=g[r][c]===0?1:0;this.setData({grid:g});this.updateComputed()},
  clearGrid(){const {rows,cols}=this.data.gridDimensions;this.setData({grid:emptyGrid(rows,cols),visited:this.createVisited(rows,cols),islandCount:0,currentStep:null,executionProgress:0});this.updateComputed()},
  start(){if(!(this.data.algorithmState==='idle'||this.data.algorithmState==='completed'))return;this.setData({algorithmState:'running',visited:this.createVisited(this.data.gridDimensions.rows,this.data.gridDimensions.cols),islandCount:0,currentStep:null,executionProgress:0});this.updateComputed();const delay=this.data.delay;const grid=this.data.grid.map(row=>row.slice());const onStep=(step,visited,islands)=>{this.setData({currentStep:step,visited:visited,islandCount:islands,executionProgress:this.data.executionProgress+2});this.updateComputed()};const shouldPause=()=>this.data.algorithmState==='paused';const runner=this.data.algorithmType==='bfs'?runBfs:runDfs;runner(grid,delay,onStep,shouldPause).then(res=>{this.setData({algorithmState:'completed',visited:res.visited,islandCount:res.islandCount,executionProgress:100});this.updateComputed()}).catch(()=>{this.setData({algorithmState:'idle'});this.updateComputed()})},
  pause(){if(this.data.algorithmState==='running'){this.setData({algorithmState:'paused'})}},
  reset(){if(this.data.algorithmState==='running')return;const {rows,cols}=this.data.gridDimensions;this.setData({algorithmState:'idle',currentStep:null,visited:this.createVisited(rows,cols),islandCount:0,executionProgress:0});this.updateComputed()}
})

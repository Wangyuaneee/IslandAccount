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
    speedValue:2,
    speedLabel:'中速',
    islandCount:0,
    executionProgress:0,
    currentStep:null,
    renderGrid:[],
    stateText:'待机中',
    progressText:'0%',
    progressWidth:'0%',
    visitedCount:0,
    steps:0,
    totalTime:0,
    structureSize:0,
    startTime:0,
    formattedTime:'0.00s'
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
    const speedLabel = this.data.speed==='slow'?'慢速':(this.data.speed==='medium'?'中速':'快速')
    const progressText = `${Math.round(executionProgress)}%`
    const progressWidth = progressText
    const formattedTime = ((this.data.totalTime||0)/1000).toFixed(2)+'s'
    this.setData({ renderGrid: render, stateText, progressText, progressWidth, formattedTime, speedLabel })
  },
  setBfs(){this.setData({algorithmType:'bfs'});wx.showToast({title:'已切换为 BFS',icon:'none'})},
  setDfs(){this.setData({algorithmType:'dfs'});wx.showToast({title:'已切换为 DFS',icon:'none'})},
  setSlow(){this.setData({speed:'slow',delay:1000,speedValue:1,speedLabel:'慢速'});wx.showToast({title:'速度：慢速',icon:'none'})},
  setMedium(){this.setData({speed:'medium',delay:500,speedValue:2,speedLabel:'中速'});wx.showToast({title:'速度：中速',icon:'none'})},
  setFast(){this.setData({speed:'fast',delay:100,speedValue:3,speedLabel:'快速'});wx.showToast({title:'速度：快速',icon:'none'})},
  onSpeedChange(e){
    var v = Number(e.detail.value)
    if(v===1){this.setSlow()} else if(v===2){this.setMedium()} else {this.setFast()}
    this.updateComputed()
  },
  setSize(e){const rows=Number(e.currentTarget.dataset.r);const cols=Number(e.currentTarget.dataset.c);this.setData({gridDimensions:{rows,cols},grid:emptyGrid(rows,cols),visited:this.createVisited(rows,cols),islandCount:0,executionProgress:0,currentStep:null});this.updateComputed()},
  onCellTap(e){if(this.data.algorithmState==='running'||this.data.algorithmState==='paused')return;const r=Number(e.currentTarget.dataset.r);const c=Number(e.currentTarget.dataset.c);const g=this.data.grid.map(row=>row.slice());g[r][c]=g[r][c]===0?1:0;this.setData({grid:g});this.updateComputed()},
  clearGrid(){const {rows,cols}=this.data.gridDimensions;this.setData({grid:emptyGrid(rows,cols),visited:this.createVisited(rows,cols),islandCount:0,currentStep:null,executionProgress:0,visitedCount:0,steps:0,totalTime:0});this.updateComputed();wx.showToast({title:'已清空网格',icon:'none'})},
  start(){
    if(!(this.data.algorithmState==='idle'||this.data.algorithmState==='completed'))return;
    this.setData({algorithmState:'running',visited:this.createVisited(this.data.gridDimensions.rows,this.data.gridDimensions.cols),islandCount:0,currentStep:null,executionProgress:0,visitedCount:0,steps:0,totalTime:0,structureSize:0,startTime:Date.now()});
    this.updateComputed();
    wx.showToast({title:'算法已开始',icon:'none'})
    const delay=this.data.delay;const grid=this.data.grid.map(row=>row.slice());
    const onStep=(step,visited,islands,size)=>{this.setData({currentStep:step,visited:visited,islandCount:islands,executionProgress:this.data.executionProgress+2,visitedCount:this.data.visitedCount+1,steps:this.data.steps+1,structureSize:size});this.updateComputed()}
    const shouldPause=()=>this.data.algorithmState==='paused'
    const runner=this.data.algorithmType==='bfs'?runBfs:runDfs
    runner(grid,delay,onStep,shouldPause).then(res=>{
      const totalTime=Date.now()-this.data.startTime
      this.setData({algorithmState:'completed',visited:res.visited,islandCount:res.islandCount,executionProgress:100,steps:res.steps,totalTime:totalTime,structureSize:0});
      this.updateComputed();
      wx.showToast({title:'算法已完成',icon:'none'})
    }).catch(()=>{this.setData({algorithmState:'idle'});this.updateComputed();wx.showToast({title:'算法出错',icon:'none'})})
  },
  pause(){if(this.data.algorithmState==='running'){this.setData({algorithmState:'paused'});wx.showToast({title:'已暂停',icon:'none'})}},
  reset(){if(this.data.algorithmState==='running')return;const {rows,cols}=this.data.gridDimensions;this.setData({algorithmState:'idle',currentStep:null,visited:this.createVisited(rows,cols),islandCount:0,executionProgress:0,visitedCount:0,steps:0,totalTime:0,structureSize:0});this.updateComputed();wx.showToast({title:'已重置',icon:'none'})}
})

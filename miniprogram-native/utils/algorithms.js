function createVisited(rows, cols) {
  var v = []
  for (var i = 0; i < rows; i++) {
    var r = []
    for (var j = 0; j < cols; j++) { r.push(false) }
    v.push(r)
  }
  return v
}

function inBounds(grid, r, c) { return r >= 0 && c >= 0 && r < grid.length && c < grid[0].length }
function neighbors(r, c) { return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]] }

function runBfs(grid, delay, onStep, shouldPause) {
  return new Promise(function (resolve) {
    var rows = grid.length, cols = grid[0].length
    var visited = createVisited(rows, cols)
    var islands = 0
    var steps = 0

    function schedule(fn) {
      if (typeof shouldPause === 'function' && shouldPause()) {
        setTimeout(function () { schedule(fn) }, 100)
      } else {
        setTimeout(fn, delay)
      }
    }

    function findNextStart() {
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          if (grid[i][j] === 1 && !visited[i][j]) {
            islands++
            runQueue(i, j)
            return true
          }
        }
      }
      resolve({ islandCount: islands, visited: visited, steps: steps })
      return false
    }

    function runQueue(sr, sc) {
      var q = []
      q.push([sr, sc])
      visited[sr][sc] = true

      function step() {
        if (q.length === 0) { schedule(findNextStart); return }
        var rc = q.shift(); var r = rc[0]; var c = rc[1]
        steps++
        onStep({ stepNumber: steps, description: 'BFS', currentPosition: { row: r, col: c } }, clone(visited), islands, q.length)
        var ns = neighbors(r, c)
        for (var k = 0; k < ns.length; k++) {
          var nr = ns[k][0], nc = ns[k][1]
          if (inBounds(grid, nr, nc) && grid[nr][nc] === 1 && !visited[nr][nc]) {
            visited[nr][nc] = true
            q.push([nr, nc])
          }
        }
        schedule(step)
      }
      schedule(step)
    }

    findNextStart()
  })
}

function runDfs(grid, delay, onStep, shouldPause) {
  return new Promise(function (resolve) {
    var rows = grid.length, cols = grid[0].length
    var visited = createVisited(rows, cols)
    var islands = 0
    var steps = 0

    function schedule(fn) {
      if (typeof shouldPause === 'function' && shouldPause()) {
        setTimeout(function () { schedule(fn) }, 100)
      } else {
        setTimeout(fn, delay)
      }
    }

    function findNextStart() {
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          if (grid[i][j] === 1 && !visited[i][j]) {
            islands++
            runStack(i, j)
            return true
          }
        }
      }
      resolve({ islandCount: islands, visited: visited, steps: steps })
      return false
    }

    function runStack(sr, sc) {
      var stack = []
      stack.push([sr, sc])
      visited[sr][sc] = true

      function step() {
        if (stack.length === 0) { schedule(findNextStart); return }
        var rc = stack.pop(); var r = rc[0]; var c = rc[1]
        steps++
        onStep({ stepNumber: steps, description: 'DFS', currentPosition: { row: r, col: c } }, clone(visited), islands, stack.length)
        var ns = neighbors(r, c)
        for (var k = 0; k < ns.length; k++) {
          var nr = ns[k][0], nc = ns[k][1]
          if (inBounds(grid, nr, nc) && grid[nr][nc] === 1 && !visited[nr][nc]) {
            visited[nr][nc] = true
            stack.push([nr, nc])
          }
        }
        schedule(step)
      }
      schedule(step)
    }

    findNextStart()
  })
}

function emptyGrid(rows, cols) {
  var g = []
  for (var i = 0; i < rows; i++) {
    var r = []
    for (var j = 0; j < cols; j++) { r.push(0) }
    g.push(r)
  }
  return g
}

function clone(m) { return m.map(function (r) { return r.slice() }) }

module.exports = { runBfs: runBfs, runDfs: runDfs, emptyGrid: emptyGrid }

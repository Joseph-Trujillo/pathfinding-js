const grid = document.getElementById('grid')
let rows = 10
let cols = 10
let startCell = null
let endCell = null
createGrid()


function createGrid(){
    grid.style.gridTemplateColumns= `repeat(${cols}, 30px)`
    grid.innerHTML = ''

    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){

            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.dataset.row = i
            cell.dataset.col = j


            if(Math.random()<.3){
                cell.classList.add('obstacle')
            }

            cell.addEventListener('click', ()=> handleCellClick(cell))
            grid.appendChild(cell)

        }
    }
}



function handleCellClick(cell){
    if(cell.classList.contains('obstacle')){
        return
    }

    if(!startCell){
        startCell = cell
        cell.classList.add('start')
    }
    else if(!endCell){
        endCell = cell
        cell.classList.add('end')
    }
    else{
        if(startCell) startCell.classList.remove('start')
        if(endCell) endCell.classList.remove('end')

        
        startCell = cell
        cell.classList.add('start')
        endCell = null
    }
}


function addRow(){
    rows++
    createGrid()
}
function removeRow(){
    if(rows > 1) rows--
    createGrid()
}

function addCol(){
    cols++
    createGrid()
}
function removeCol(){
    if(cols > 1) cols--
    createGrid()
}

function resetGrid(){
    startCell = null
    endCell = null
    createGrid()
}


function bfs(){

    if(!startCell || !endCell){
        alert('haz click en el grid para declarar fuente y objetivo')
        return
    }

    const queue = []
    const visited = new Set()
    const parents = new Map()

    const startRow = parseInt(startCell.dataset.row)
    const startCol = parseInt(startCell.dataset.col)
    const endRow = parseInt(endCell.dataset.row)
    const endCol = parseInt(endCell.dataset.col)

    queue.push([startRow, startCol])
    visited.add(`${startRow}, ${startCol}`)

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0] // derecha, abajo, izquierda, arriba
    ]


    function animateSearch(){
        if(queue.length === 0){
            alert('no se encontró camino')
            return
        }


        const [currentRow, currentCol] = queue.shift()
        const currentKey = `${currentRow}, ${currentCol}`
        const currentCell =document.querySelector(`.cell[data-row = '${currentRow}'][data-col = '${currentCol}']`)


        if(currentCell !== startCell && currentCell !== endCell){
            currentCell.classList.add('visited')
        }

        if(currentRow === endRow && currentCol === endCol){
            drawPath(parents, endRow, endCol)
            return
        }

        for(const [dx, dy] of directions){
            const newRow = currentRow + dx
            const newCol = currentCol + dy
            const newKey = `${newRow}, ${newCol}`
            const neighbor = document.querySelector(`.cell[data-row = '${newRow}'][data-col = '${newCol}']`)


            if(
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                neighbor && 
                !visited.has(newKey) &&
                !neighbor.classList.contains('obstacle')
            ){
                queue.push([newRow, newCol])
                visited.add(newKey)
                parents.set(newKey, currentKey)
            }
        }
        
        
        
        setTimeout(animateSearch, 10)

    }

    animateSearch()
}

function drawPath(parents, endRow, endCol){
    let currentKey = `${endRow}, ${endCol}`

    while(parents.has(currentKey)){

        const [row, col] = currentKey.split(',').map(Number)

        const cell = document.querySelector(`.cell[data-row = '${row}'][data-col = '${col}']`)

        if(cell !== startCell && cell !== endCell){
            cell.classList.add('path')
        }

        currentKey = parents.get(currentKey)
    }


}


document.getElementById('add-row').addEventListener('click', addRow)
document.getElementById('remove-row').addEventListener('click', removeRow)

document.getElementById('add-col').addEventListener('click', addCol)
document.getElementById('remove-col').addEventListener('click', removeCol)

document.getElementById('reset').addEventListener('click', resetGrid)
document.getElementById('start').addEventListener('click', bfs)
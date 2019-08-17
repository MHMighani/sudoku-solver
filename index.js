// TODO: provide input validation in sudoku cells


function getNumArray(){
  mainArray = []
  smallArray = []

  var allTd = document.getElementsByTagName("td")

  for(let item of allTd){
    value = item.firstChild.value
    if(value==""){
      value = 0
    }else{
      value = parseInt(value)
    }
    smallArray.push(value)
    if(smallArray.length==9){
      mainArray.push(smallArray)
      smallArray = []
    }
  }

  try{
    solved = mainChecker(mainArray)
    console.log(solved);
    showSolvedArray(solved)
  }catch{
    alert("cant solve this sudoku")
  }
}

function newGameFunction(){
  const allTd = document.getElementsByTagName("td")
  for(let item of allTd){
    item.innerHTML = '<input type="text">'
  }
}

solveButton = document.getElementsByTagName("button")[0]
solveButton.onclick = getNumArray

newButton = document.getElementsByTagName("button")[1]
newButton.onclick = newGameFunction


//-------------------------------------------------------------------------------------------

//returns row of a matrix
function rowReturner(row,mat){
  var newArray = new Array()

  for(i=0;i<9;i++){
    num = mat[row][i]
    newArray.push(num)
  }

  return newArray
}

//returns column for a matrix
function colReturner(col,mat){
  var newArray = new Array()

  for(i=0;i<9;i++){
    num = mat[i][col]
    newArray.push(num)
  }
  return newArray
}

//returns square numbers for a given row & col
function squareReturner(row,col,mat){
  row = (Math.floor(row/3))*3
  col = (Math.floor(col/3))*3
  var array = new Array()
  for (i=row;i<row+3;i++){
    for (j=col;j<col+3;j++){
      array.push(mat[i][j])
    }
  }
  return array
}

//gets an array and returns missing and possible numbers
function mishecker(array){
  var newArray = new Array()

  for(i=1;i<10;i++){
    if(!array.includes(i)){
      newArray.push(i)
    }
  }
  return newArray
}

//this function gets to arrays and returns possible numbers
function mutualNumbers(arr1,arr2){
  var newArray = new Array()
  for(i=0;i<arr1.length;i++){
    if(arr2.includes(arr1[i])){
      newArray.push(arr1[i])
    }
  }
  return newArray
}

//checks whether the mat is solved and complete or not
function isComplete(mat){
  for(i=0;i<9;i++){
    if(mat[i].includes(0)){
      return false
    }
  }
  return true
}

//checks if two arrays are equal or not
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

//returns positions with possible numbers
function lonelyChecker(array){
  newArray = array.map(function(el){
    return el.map(function(el2){
      counter = 0
      for(ar of array){
        if(ar.includes(el2)){
          counter++
        }
      }
      if(counter==1){
        // console.log(el2);
        return el2
      }
    })
  })


  dic = {}
  index = 0
  for (ar1 of newArray){
    for(ar2 of ar1){
      if(ar2!=undefined){
        dic[index] = ar2
      }
    }
    index++
  }
  return dic
}



//returns matrix that includes all possible numbers for each cell
function possNumbers(mat){
  mainPossMat = []

  for(row=0;row<9;row++){
    possMat = []
    for(col=0;col<9;col++){
      if(!mat[row][col]){
        rowMat = mishecker(rowReturner(row,mat))
        colMat = mishecker(colReturner(col,mat))
        squareMat = mishecker(squareReturner(row,col,mat))
        mut1 = (mutualNumbers(rowMat,colMat))
        mut2 = mutualNumbers(mut1,squareMat)
        possMat.push(mut2)
      }else{
        possMat.push([])
      }
    }
      mainPossMat.push(possMat)
    }
    return mainPossMat
  }

//returns copy of a multidimensional array
function makeCopy(array){
  newArray = []
  for(i=0;i<array.length;i++){
    newArray[i] = array[i].slice()
  }
  return newArray
}


//first strategy
//this strategy gets the matrix and looks for cells with one possible number
//and returns best possible solved sudoku
function firstStrategy(mat){
  possMat = possNumbers(mat)
  newmat = mat.map(function(rowMat,row){
    return rowMat.map(function(colMat,col){
      possAr = possMat[row][col]
      if(possAr.length==1){
        return possAr[0]
      }else{
        return colMat
      }
    })
  })

  if(isComplete(newmat)){
    return [true,newmat]
  }else if(JSON.stringify(mat)==JSON.stringify(newmat)){
    return [false,newmat]
  }else{
    return firstStrategy(newmat)
  }
}


//second strategy
function secondStrategy(mat){
  changed = false
  possMat = possNumbers(mat)

  for(var index=0;index<9;index++){
    posRow = lonelyChecker(rowReturner(index,possMat))
    posCol = lonelyChecker(colReturner(index,possMat))

    for(let key in posRow){
      let col = parseInt(key)
      let value = posRow[key]

      changed = true
      mat[index][col] = value
    }
    for(let key in posCol){
      changed = true
      let row = parseInt(key)
      let value = posCol[key]
      mat[row][index] = value
    }
  }
  if(isComplete(mat)){
    // console.log(mat);
    return [true,mat]
  }if(!changed){
    return [false,mat]
  }else{
    return secondStrategy(mat)
  }
}

//third strategy
//bruteforce strategy!!
function thirdStrategy(mat){
  // console.log("recursion");
  if(isComplete(mat)){
    // console.log(mat);
    return mat
  }
  possMat = possNumbers(mat)
  for(var row=0;row<9;row++){
    for(var col=0;col<9;col++){

      if(!mat[row][col]){
        cellPossMat=possMat[row][col];
        if(cellPossMat.length==0){
          return false
        }else{
          for(el of cellPossMat){
            mat[row][col] = el
            if(thirdStrategy(mat)){
              return thirdStrategy(mat)
            }
        }
        mat[row][col] = 0
        return false
      }
    }
  }
}
}



//mainChecker
function mainChecker(mat){
    while(true){
      copyMat = makeCopy(mat)
      mat = firstStrategy(mat)[1]
      mat = secondStrategy(mat)[1]
      mat = thirdStrategy(mat)
      if(JSON.stringify(mat)==JSON.stringify(copyMat)){
        // thirdStrategy(mat)
        // console.log("these strategies are worthless!!");
        break
      }else if(isComplete(mat)){
        // console.log("completed");
        // console.log(mat);
        return mat
      }else{
        return mainChecker(mat)
      }
    }
  }

//------------------------------------------------------------------------------

function showSolvedArray(solvedArray){
  var array2 = document.getElementsByTagName("td")
  index = 0

  for(let item of array2){
    console.log("got it!!");
    value = item.firstChild.value
    row = Math.floor(index/9)
    col = (index % 9)
    if(value==""){
      item.innerText = solvedArray[row][col]
      item.setAttribute("class","solved")
    }
    index = index + 1
  }
}

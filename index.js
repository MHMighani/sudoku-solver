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

//mainChecker
function mainChecker(mat){
  for(row=0;row<9;row++){
    for(col=0;col<9;col++){
      if(!mat[row][col]){
        rowMat = mishecker(rowReturner(row,mat))
        colMat = mishecker(colReturner(col,mat))
        squareMat = mishecker(squareReturner(row,col,mat))
        mut1 = (mutualNumbers(rowMat,colMat))
        mut2 = mutualNumbers(mut1,squareMat)
        if(mut2.length==1){
          mat[row][col]=mut2[0]
        }
        }
      }
    }
    if(isComplete(mat)){
      return mat
    }else{
      return mainChecker(mat)
    }
  }


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

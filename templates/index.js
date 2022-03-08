let dataUrl2 ="http://127.0.0.1:3000/api/attractions?page=0";
let dataUrl ='http://15.165.73.175:3000/api/attractions?page=0';
let loc_array = {};

function fetchdata(URL){
  
  fetch(URL)  
  .then((response) => {
        return response.json();
  })
  .then((dataList) => {
  data = dataList.data ;
  console.log(data[0])
  DealFunction()

  })
  let DealFunction = function(){
    temp = 0 ;
    for(let i =0 ; i<12 ; i++){
      temp = temp+1
      let newDIV  = document.createElement('div') 
      let newImg = document.createElement('img')
      newDIV.appendChild(newImg)
      newImg.src = data[i].img[0]
      let Box = document.getElementsByClassName("box")
      Box[i].appendChild(newDIV)
      newName = document.createElement('p')
      newName.textContent = data[i].name
      newMrt = document.createElement('p')
      newMrt.textContent = data[i].mrt
      newCat = document.createElement('p')
      newCat.textContent = data[i].category
      Box[i].appendChild(newName)
      Box[i].appendChild(newMrt)
      Box[i].appendChild(newCat) 
  }
  
  }
  

}
    
fetchdata(dataUrl2)



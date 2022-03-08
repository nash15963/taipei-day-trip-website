let dataUrl2 ="http://127.0.0.1:3000/api/attractions?page=0";
let dataUrl ='http://15.165.73.175:3000/api/attractions?page=0';
let data = [];

function fetchdata(URL){
    fetch(dataUrl)  
    .then((response) => {
    return response.json();
  })
    .then((dataList) => {
    data = dataList.result.results;
    console.log(data);
    render();  //放一個函數操作data
  });

    let = render = function(){
	console.log(data)
}
    
}
fetchdata(dataUrl)



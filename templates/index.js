let dataUrl2 ='https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment.json';
let dataUrl ='http://15.165.73.175:3000/api/attractions?page=0';
let data = [];

function fetchdata(URL){
    fetch(URL)
    
}
fetchdata(dataUrl)


// fetch(dataUrl)  
//   .then((response) => {
//     return response.json();
//   })
//   .then((dataList) => {
//     data = dataList.result.results;
//     console.log(data);
//     render();  //放一個函數操作data
//   });
// console.log(data) //空值
// let = render = function(){
// 	console.log(data)
// }
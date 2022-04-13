// selecting loading div
const loader = document.querySelector("#loading");
const content = document.querySelector('.content')
let input = ''
function displayLoading() {
    loader.classList.add("display");
    setTimeout(() => {
        loader.classList.remove("display");
    }, 50000);
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}

let currentPage = 0 ;
let pageList = [0]
let RenderData = (page)=>{
    displayLoading()
    if (input != '') {
        attractionAPI = `/api/attractions?page=${page}&keyword=${input}`;
    } else {
        attractionAPI = `/api/attractions?page=${page}`;
    }
    currentPage++
    fetch(attractionAPI)
    .then(res => res.json())
    .then(data =>{
        console.log(data)
        hideLoading()
        pageList.push(data.nextPage)
        console.log(pageList)
        let contentArea = document.querySelector('.contentArea')
        for(let i =0 ;i<data.data.length ;i++){
            const boxEle = document.createElement('div');
            boxEle.classList.add('box');
            boxEle.innerHTML = `
            <div>
                <img src="${data.data[i].img[0]}" >
            </div>
            
            <p>${data.data[i].name}</p>
            <p>${data.data[i].mrt}</p>
            <p>${data.data[i].category}</p>
            `;
            boxEle.onclick = () => {
            window.location.href = `/attraction/${data.data[i].id}`
            } //增加超連結在每個元素中
            contentArea.appendChild(boxEle);
        }
        content.insertBefore(contentArea,loader)
    })
    .catch(error =>{
        const errorMessage = document.createElement('h3')
        errorMessage.innerText = '沒有更多資料可以顯示'
        errorMessage.style.color = '#666666'
        let contentArea = document.querySelector('.contentArea')
        contentArea.appendChild(errorMessage)
    })
}
RenderData(currentPage)

//scroll
window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    if (scrollTop + clientHeight == scrollHeight & pageList[currentPage] !=null) {
        RenderData(pageList[currentPage]);
        console.log(currentPage)  
        
    }
}, {
    passive: true
}); 

//搜尋功能
let searchBtn = document.querySelector('#btn')
let queryKeyword =(e)=>{
    e.preventDefault();
    input = document.querySelector('#keyWord').value;
    console.log(input)
    if(input!=''){
        let contentArea = document.querySelector('.contentArea')
        contentArea.innerHTML = ''
        currentPage = 0 ;
        pageList = [0]
        RenderData(currentPage)
    }
}

searchBtn.addEventListener('click', queryKeyword);


//“Scroll Back to Top” button
let topBtn = document.querySelector('.topBtn')
window.onscroll = function() {scrollfunc()};
function scrollfunc() {
  if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
}

let scrollTop =()=>{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
topBtn.addEventListener('click' , scrollTop)

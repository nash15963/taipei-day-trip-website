let input = '';  //預設沒有輸入關鍵字查找
let page = 0; 
let content = document.querySelector('.content');
let btn = document.querySelector('#btn');
let nextPage = 0 ;
// console.log(nextPage)
let currentPage = 0; //第一頁預設0

//取得fetch資料
const getDatas = async (page) => {
    if (input != '') {
        API_URL = `/api/attractions?page=${page}&keyword=${input}`;
    } else {
        API_URL = `/api/attractions?page=${page}`;
    }
    const response = await fetch(API_URL);
    const data = response.json()
    page = data['nextPage']
    console.log(page)
    if(data.nextPage != null){
        nextPage++
        
    }
    
    else{nextPage = 0}

    //console.log(API_URL)
    // handle 404
    if (!response.ok) {
        throw new Error(`An error occurred: ${response.status}`);
    }
    return await data;
}

//插入元素box，裡面置入圖片存放點
const showDatas = (dataList) => {
    dataList.forEach(data => {
        const boxEle = document.createElement('div');
        boxEle.classList.add('box');
        boxEle.innerHTML = `
        <div>
            <img src="${data.img[0]}" >
        </div>
        
        <p>${data.name}</p>
        <p>${data.mrt}</p>
        <p>${data.category}</p>
    `;
        content.appendChild(boxEle);
    });
};
//過濾字串
let queryKeyword = (e) => {
    e.preventDefault();
    input = document.querySelector('#keyWord').value;
    content.innerHTML = '';
    loadDatas(page, input) ; //過濾完字串則抓取api，空白字串則進入沒有keyword路徑
};
btn.addEventListener('click', queryKeyword);

// search api
const hasMoreDatas = (page) => {
    nextPage = response.nextPage;
    console.log(nextPage)
    return nextPage ;
};

const loadDatas = async (page, input) => {
    // // show the loader(keep it)
    // 0.5 second later
    setTimeout(async () => {
        try {
            // if having more data to fetch
            
                // call the API to get data
                const response = await getDatas(page, input);
                // show data
                showDatas(response.data);
                // update the total
                
                // console.log('input:', input); 除錯輸入字串
                
            
        } catch (error) {
            content.innerHTML = '';
            const errorMessage = document.createElement('h3')
            errorMessage.innerText = '找不到您所要的資料'
            errorMessage.style.color = '#666666'
            content.append(errorMessage)
        }
    }, 1000);
    //可以嘗試增加讀取動畫(不然看起來很像當機)
};

window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    //滑到底部則讀取api資料
    if (scrollTop + clientHeight >= scrollHeight - 5 && nextPage>0) {
        currentPage++;
        
        loadDatas(currentPage);
    }
}, {
    passive: true
});
// initialize
loadDatas(currentPage, input);
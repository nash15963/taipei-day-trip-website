let initinput = ''
let input = '';
let page = 0;
let content = document.querySelector('.content');
let Body = document.querySelector('body');
let btn = document.querySelector('#btn');



const getDatas = async (page) => {
    if (input != '') {
        API_URL = `/api/attractions?page=${page}&keyword=${input}`;
    } else {
        API_URL = `/api/attractions?page=${page}`;
    }
    const response = await fetch(API_URL);
    console.log(API_URL)
    // handle 404
    if (!response.ok) {
        throw new Error(`An error occurred: ${response.status}`);
    }
    return await response.json();
}
//create box
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
    loadDatas(page, input)
};
btn.addEventListener('click', queryKeyword);

// search api
const hasMoreDatas = (e) => {
    return e !== null;
};
const loadDatas = async (page, input) => {
    // // show the loader(keep it)
    // 0.5 second later
    setTimeout(async () => {
        try {
            // if having more quotes to fetch
            if (hasMoreDatas(nextPage)) {
                // call the API to get quotes
                const response = await getDatas(page, input);
                // show quotes
                showDatas(response.data);
                // update the total
                nextPage = response.nextPage;
                console.log('input:', input);
            }
        } catch (error) {
            const errorMessage = document.createElement('h3')
            errorMessage.innerText = '找不到您所要的資料'
            errorMessage.style.color = '#666666'
            content.append(errorMessage)
        }
    }, 500);
};
let currentPage = 0;
let nextPage = 0;
window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    if (scrollTop >= scrollHeight - clientHeight && hasMoreDatas(currentPage)) {
        currentPage++;
        loadDatas(currentPage);
    }
}, {
    passive: true
});
// initialize
loadDatas(currentPage, input);

let content = document.querySelector('.content');
let btn = document.querySelector('#btn');


const getDatas = async (page) => {
	if (input != '') {
		API_URL = `/api/attractions?page=${page}&keyword=${input}`;
	} else {
		API_URL = `/api/attractions?page=${page}`;
	}
	const response = await fetch(API_URL);
	//console.log(API_URL)
	// handle 404
	if (!response.ok) {
		throw new Error(`An error occurred: ${response.status}`);
	}
	return await response.json();}

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
let nextPage = 0 ;
const hasMoreDatas = (e) => {
	console.log(e !== null)
	return e !== null;
};

const loadDatas = async (page) => {
	// // show the loader(keep it)
	// 0.5 second later
	setTimeout(async () => {
			// if having more data to fetch
			if (hasMoreDatas(nextPage)) {
				// call the API to get data
				const response = await getDatas(nextPage);
                
				// show data
				showDatas(response.data);
                currentPage++;
				// update the total
				nextPage = response.nextPage;
				// console.log('input:', input); 除錯輸入字串
			}
	} , 800);
};

let currentPage = 0;
window.addEventListener('scroll', () => {
	const {
		scrollTop,
		scrollHeight,
		clientHeight
	} = document.documentElement;
	//滑到底部則讀取api資料
	if (scrollTop + clientHeight == scrollHeight  && hasMoreDatas(nextPage)) {
		
		loadDatas(currentPage);
	}
}, {
	passive: true
});
// initialize
let input = ''; //預設沒有輸入關鍵字查找
loadDatas(currentPage);




let queryKeyword = (e) =>{
    e.preventDefault();
    input = document.querySelector('#keyWord').value;
    quert_nextPage = 0 ;
    content.innerHTML = '';

    setTimeout(async () => {
		try {
			// if having more data to fetch
			if (hasMoreDatas(quert_nextPage)) {
				// call the API to get data
				const response = await getDatas(quert_nextPage, input);
				// show data
				showDatas(response.data);
				// update the total
				nextPage = response.nextPage;
				console.log('nextPage :',nextPage)
				// console.log('input:', input); 除錯輸入字串
			}
		} catch (error) {
			content.innerHTML = '';
			const errorMessage = document.createElement('h3')
			errorMessage.innerText = '沒有更多資料可以顯示'
			errorMessage.style.color = '#666666'
			content.append(errorMessage)
		}
	}, 800);

}
btn.addEventListener('click', queryKeyword);


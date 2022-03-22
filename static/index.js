//一進入頁面就載入資料
let content = document.querySelector('.content'); //增加可以填充資料的父代區塊
let btn = document.querySelector('#btn'); //按鈕:點擊則搜尋資料

//依照是否有搜尋條件來fetch api
const getDatas = async (page) => {
	if (input != '') {
		API_URL = `/api/attractions?page=${page}&keyword=${input}`;
	} else {
		API_URL = `/api/attractions?page=${page}`;
	}
	const response = await fetch(API_URL);
	//console.log(API_URL) 除錯發出的api為哪一條網址
	// handle 404
	if (!response.ok) {
		throw new Error(`An error occurred: ${response.status}`);
	} //若資料錯誤回傳結果
	return await response.json(); //向global丟出得到的api資料，PS需要在
}

//將資料填入box裡
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
		boxEle.onclick = () => {window.location.href=`/attraction/${data.id}`}//增加超連結在每個元素中
		content.appendChild(boxEle);
	});
};

let nextPage = 0; //在hasMoreDatas的函式中代入第一筆資料(因為api的下一頁第一個編碼=1)
//判斷api的下一頁
const hasMoreDatas = (e) => {
	console.log(e !== null)
	return e !== null;
};
const loadDatas = async (page) => {
	// show the loader(keep it)
	// 0.5 second later
	setTimeout(async () => {
		// if having more data to fetch
		if (hasMoreDatas(nextPage)) {
			// call the API to get data
			const response = await getDatas(nextPage);
			// show data
			showDatas(response.data);
			currentPage++;
			// 在子代函式中更新nextPage
			nextPage = response.nextPage;
			// console.log('input:', input); 除錯輸入字串
		}
	}, 800);
};
let currentPage = 0;
window.addEventListener('scroll', () => {
	const {
		scrollTop,
		scrollHeight,
		clientHeight
	} = document.documentElement;
	//滑到頁面底部(scrollTop + clientHeight == scrollHeight)
	//如果滑到底部且有更多=true的話(雙重條件)，則載入資料。
	if (scrollTop + clientHeight == scrollHeight && hasMoreDatas(nextPage)) {
		loadDatas(currentPage);
	}
}, {
	passive: true
});
// initialize
let input = ''; //預設沒有輸入關鍵字查找
loadDatas(currentPage); //載入頁面則跑一次函式

//查詢功能
//當點擊查詢按鈕，則使用此函式
let queryKeyword = (e) => {
	//避免發出api要求後重新載入
	e.preventDefault();
	input = document.querySelector('#keyWord').value;
	quert_nextPage = 0;  //刻意多寫一個變數來區分第一個函式
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
				console.log('nextPage :', nextPage)
				// console.log('input:', input); 除錯輸入字串
			}
			//只在第二個函式考慮會有查詢不到的問題，
			//因為如果第一個函式抓不到資料或資料錯誤則可能的錯誤來源是來自後端出錯
			//此條件與找不到資料的條件不符合。
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


//點擊box跳轉到相對應的
const addHyperlink =async()=> {
	response =  await getDatas(quert_nextPage, input);
}


//擷取網址ID到fetch
const topContent = document.querySelector('.top-content');
let UrlId = window.location.pathname.split('/')[2]
//console.log(UrlId)
let imgArrayLen = 0 ;//圖片張數


//fetch api
const getDatas = async (id) => {
	API_URL = `/api/attraction/${id}`;
	const response = await fetch(API_URL);
	// handle 404
	if (!response.ok) {
		throw new Error(`An error occurred: ${response.status}`);
	} //若資料錯誤回傳結果
	return await response.json(); //向global丟出得到的api資料
}

//li的父代
cir = document.querySelector('.cir')
//介紹資料渲染網頁
const showDatas = (response) => {
	//console.log('data1 :', response.data)
	imgArrayLen = response.data.img.length;
	//渲染li(有幾張圖則掛幾個白點上去)
	for(let i=0 ;i<imgArrayLen ;i++){
		let li = document.createElement('li');
		cir.appendChild(li) ;
	}

	let topIntroduction = document.querySelector('.top-introduction')
	topIntroduction.innerHTML = `
        <h3>${response.data.name}</h3>
        <p>${response.data.category}</p> 
        <p>at</p>  
        <p>${response.data.mrt}</p>
    `
	let bottomContent = document.querySelector('.bottom-content')
	bottomContent.innerHTML = `
        <p>${response.data.description}</p>
        <h4>景點地址：</h4>
        <p>${response.data.address}</p>
        <h4>交通方式：</h4>
        <p>${response.data.transport}</p>
    `
};

let imgId = 0 //圖片ID位置

let topImg = document.querySelector('.top-img') //圖片父代
let leftArrow = document.querySelector('#leftArrow') //左箭頭元素
let rightArrow = document.querySelector('#rightArrow') //右箭頭元素

//左右點擊置換圖片，加上索引
const shadowImg = (response)=>{
	//console.log('data2 :', response.data.img[imgId]) 
	let Img = document.createElement('img');
	Img.src = response.data.img[imgId]  //掛上第一張圖
	Img.classList.add('slideshadow')
	topImg.appendChild(Img)
	let shadow = document.querySelector('.slideshadow') //準備被置換的圖片
	//點點的部分
	let focus_point = document.querySelector(`.cir li:nth-child(${imgId+1})`) //抓取元素li
	focus_point.classList.add('cir_focus')  //在第一個點掛上黑色 
	let blackPoint = document.querySelector('.cir_focus')//準備被置換的黑點
	// console.log(imgArrayLen)
	// let leftMovePoint = 200-imgArrayLen*6 ;
	// console.log(leftMovePoint)
	// cir.style = `left:${leftMovePoint}px`
	//左右點擊切換圖片
	
	const addFocusFlip =()=>{
		blackPoint = document.querySelector('.cir_focus')//準備被置換的黑點
		blackPoint.removeAttribute('class') //移除黑點(class)
		focus_point = document.querySelector(`.cir li:nth-child(${imgId+1})`) //選擇下一個元素
		focus_point.classList.add('cir_focus') //增加黑點
	}

	let nextImg = () => {
		if (imgId < imgArrayLen - 1) {
			imgId++
			//console.log(imgId)
			shadow.removeAttribute('src')
			Img.src = response.data.img[imgId] //換圖片讀取
			addFocusFlip() //用函數替換

		}
	}
	rightArrow.addEventListener('click', nextImg)
	
	let previousImg = () => {
		if (imgId > 0) {
			imgId--
			//console.log(imgId)
			shadow.removeAttribute('src')
			Img.src = response.data.img[imgId]
			addFocusFlip()
		}
	}
	leftArrow.addEventListener('click', previousImg)
	
}

//進入頁面則渲染畫面
const firstRender = async (id) => {
	try {
		response = await getDatas(id)
		showDatas(response)
		shadowImg(response)
	} catch {
		topContent.innerHTML = '';
		const errorMessage = document.createElement('h3')
		errorMessage.innerText = '沒有更多資料可以顯示'
		errorMessage.style.color = '#666666'
		topContent.append(errorMessage)
	}
}
firstRender(UrlId)


//改變金額
let fullday_moring = document.querySelector('.fullday_moring')
let fullday_evening = document.querySelector('.fullday_evening')
let TWdollar = document.querySelector('#TWdollar')
if (document.querySelector('input[name="fullday"]')) {
	document.querySelectorAll('input[name="fullday"]').forEach((elem) => {
		elem.addEventListener("change", function(event) {
			console.log(event.target)
			var item = event.target.value;
			TWdollar.innerText = item;
		});
	});
}

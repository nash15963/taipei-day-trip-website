//擷取網址ID到fetch
const topContent = document.querySelector('.top-content');
let UrlId = window.location.pathname.split('/')[2]
console.log(UrlId)
let imgId = 0 //圖片ID位置
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
//將資料填入網頁裡
const showDatas = (response) => {
	console.log('data :', response.data)
	let topImg = document.querySelector('.top-img')
	let Img = document.createElement('img');
	imgArrayLen = response.data.img.length;
	Img.src = response.data.img[imgId]
	Img.classList.add('slideshadow')
	topImg.appendChild(Img)
	let shadow = document.querySelector('.slideshadow')
	//左右點擊切換圖片
	let leftArrow = document.querySelector('#leftArrow')
	let rightArrow = document.querySelector('#rightArrow')
	let = nextImg = () => {
		if (imgId < imgArrayLen - 1) {
			imgId++
			console.log(imgId)
			shadow.removeAttribute('src')
			Img.src = response.data.img[imgId]
		}
	}
	rightArrow.addEventListener('click', nextImg)
	previousImg = () => {
		if (imgId > 0) {
			imgId--
			console.log(imgId)
			shadow.removeAttribute('src')
			Img.src = response.data.img[imgId]
		}
	}
	leftArrow.addEventListener('click', previousImg)
	// ### 是否要移出來呢###
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
const firstRender = async (id) => {
	try {
		response = await getDatas(id)
		showDatas(response)
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
//插入預覽圖片 ??
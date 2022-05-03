let urlParams = new URLSearchParams(window.location.search)
const orderNumber = urlParams.get('number')
let thankyouApi = `/api/order/${orderNumber}`
let content = document.querySelector(".content")
let information = document.querySelector(".information")

function getUserData(){
    const UserApi = '/api/user'
    fetch(UserApi)
    .then(res => res.json())
    .then(data => {
        if(data.data != null){
            content.innerHTML = `
            <h4>${data.data.name}，感謝您訂購本產品，<span>訂單編號如下:${orderNumber}</span></h4>

            `
            // alert(`${data.data.name}，感謝您訂購本產品`)
        }else{
            window.location.href='/';
        }
    })
}
getUserData()

function getOrderData(){
    fetch(thankyouApi)
    .then(res => res.json())
    .then(data => {
        console.log(data.data)
        information.innerHTML =`
        <div class="locationImg">
            <div><img src="${data.data.trip.attraction.image}" alt=""></div>
        </div>
		<div class="locationDetail">
			<h4>訂購資料</h4>
			<p>名字 : <span>${data.data.contact.name}</span></p>
			<p>信箱 : <span>${data.data.contact.email}</span></p>
			<p>電話 : <span>${data.data.contact.phone}</span></p>
			<hr/>
			<h4>景點資料</h4>
			<p>名稱 : <span>${data.data.trip.attraction.name}</span></p>
			<p>地址 : <span>${data.data.trip.attraction.address}</span></p>
			<p>日期 : <span>${data.data.trip.date}</span></p>
			<p>時間 : <span>${data.data.trip.time}</span></p>

		</div>

        `

    })
}
getOrderData()

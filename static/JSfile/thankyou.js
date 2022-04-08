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
        information.innerHTML =`
        <h2>本次預定行程如下：</h2>
        <h3>訂單編號：${orderNumber}</h3>
        <h3>景點：${orderNumber}</h3>

        `
    })
}
// getOrderData()

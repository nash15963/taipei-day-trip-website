let memberData = null ;
const signinBtn = document.querySelector('.signin');
const signoutBtn = document.querySelector('.signout')
let UserId = '';
//一進入頁面檢查使用者狀態使否登入
async function signinCheck() {
    const UserApi = '/api/user'
    await fetch(UserApi)
        .then(res => res.json())
        .then(result => {
            console.log('result :',result)
            UserId = result.data.name
            console.log('UserId111',UserId)
            // console.log(result.data, result.data != null)
            if (result.data != null) { //如果api不等於空，也就是session沒有掛上
                memberData = true ;
                signinBtn.style = 'display : none'
                signoutBtn.style = 'display : inline-block'
            } else {
                memberData = false ;
                signinBtn.style = 'display : inline-block'
                signoutBtn.style = 'display : none'
            }
        })
}
signinCheck();
//渲染畫面
let bookingApi = '/api/booking' ;
const bookingDataGet = async() =>{
    signinCheck()
    await fetch(bookingApi,{headers: new Headers({'Content-Type': 'application/json'})})
    .then(result => result.json())
    .then(data=>{
        console.log(data) //從這裡開始差網頁，設定篩選條件如果有資料先插入
        if(data.data!==null){
        let contentImg = document.querySelector('.contentImg')
        let TitleImg = document.createElement('img')
        TitleImg.src = data.data.image
        contentImg.appendChild(TitleImg)
        let contentText = document.querySelector('.contentText')
        contentText.innerHTML = `
        <p>台北一日遊: <span>${data.data.name}</span></p>
		<p>日期: <span>${data.date}</span></p>
		<p>時間: <span>${data.time}</span></p>
		<p>費用: <span>${data.price}</span></p>
		<p>地點: <span>${data.data.address}</span></p>
        `
        let contentTitle = document.querySelector('.contentTitle')
        contentTitle.innerHTML =`
        <h4>您好，${UserId}，待預訂的行程如下：</h4>
        `
        let information = document.querySelector('.information')
        information.innerHTML= `
        <h4>您的聯絡資訊</h4>
		<p><label for="bookName">聯絡姓名：<input type="text" id="bookName"></label></p>
		<p><label for="bookEmail">連絡信箱：<input type="text" id="bookEmail"></label></p>
		<p><label for="bookmobile">手機號碼：<input type="text" id="bookmobile"></label></p>
		<p>請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。</p>
        `
        let creditCard = document.querySelector('.creditCard')
        creditCard.innerHTML=`
        <h4>信用卡付款資訊</h4>
		<p><label for="CardCode">卡片號碼：<input type="text" id="CardCode"></label></p>
		<p><label for="CardDate">過期時間：<input type="text" id="CardDate"></label></p>
		<p><label for="CardPassWord">驗證密碼：<input type="text" id="CardPassWord"></label></p>
        `
        let price = document.querySelector('.price')
        price.innerHTML =`
        <p>總價：新台幣 <span class="dollar">${data.price}</span> 元</p>
		<button>確認訂購並付款</button>
        `
        }
        else{
            let body = document.querySelector('body')
            let content = document.querySelector('.content')
            let information = document.querySelector('.information')
            let creditCard = document.querySelector('.creditCard')
            let price = document.querySelector('.price')
            let foot = document.querySelector('.foot')
            body.removeChild(content)
            body.removeChild(information)
            body.removeChild(creditCard)
            body.removeChild(price)
            body.style = 'grid-template-rows: 50px 130px 1000px;'
            foot.style = 'grid-row: 3/4' ;
            let NullMessage = document.createElement('div') ;
            NullMessage.classList.add('NullMessage')
            NullMessage.innerHTML =`
            <h4>您好，${UserId}，待預訂的行程如下：</h4>
            <p>目前沒有任何待預訂的行程</p>
            `
            body.insertBefore(NullMessage, foot);

        }
        
    })
}
bookingDataGet()
// const signoutBtn = document.querySelector('.signout')
// let memberData = null ;



//登出功能
async function SignOutFunc(e) {
    const UserApi = '/api/user'
    const result = await fetch(UserApi, {
        method: 'DELETE'
    })
    signinBtn.style = 'display : inline-block'
    signoutBtn.style = 'display : none'
    memberData = false ;
    signinCheck()
    window.location.href='/';
}
signoutBtn.addEventListener('click', SignOutFunc)

const contentDelete = document.querySelector('.contentDelete')
async function DeleteBooking(e) {
    await fetch(bookingApi,{
        method: 'DELETE',
        headers: new Headers({'Content-Type': 'application/json'
        })
    })
    window.location.href='/';
}

contentDelete.addEventListener('click', DeleteBooking)

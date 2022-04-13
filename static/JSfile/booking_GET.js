let memberData = null ;
const signinBtn = document.querySelector('.signin');
const signoutBtn = document.querySelector('.signout')
let UserId = '';

//loading animation func
const loader = document.querySelector("#loader");
let CloseLoaderFunc =()=>{
    loader.style.display = 'none'
}


//一進入頁面檢查使用者狀態使否登入
async function signinCheck() {
    const contentDelete = document.querySelector(".contentDelete")
    const body = document.querySelector("body")
    body.style = "grid-template-rows: 50px auto auto 100px;"
    contentDelete.style = 'display :block'
    const UserApi = '/api/user'
    await fetch(UserApi)
        .then(res => res.json())
        .then(result => {
            UserId = result.data.name
            let contentTitle = document.querySelector('.contentTitle')
            contentTitle.innerHTML =`
            <h4>您好，${UserId}，待預訂的行程如下：</h4>
            `
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
const bookingDataGet = async(e) =>{
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
            let dollar = document.querySelector('.dollar')
            dollar.innerText = data.price
            CloseLoaderFunc()
        }
        else{
            let body = document.querySelector('body')
            let content = document.querySelector('.content')
            let information = document.querySelector('.information')
            let foot = document.querySelector('.foot')
            body.removeChild(content)
            body.removeChild(information)
            body.style = 'grid-template-rows: 50px 130px 1000px;'
            foot.style = 'grid-row: 3/4' ;
            let NullMessage = document.createElement('div') ;
            NullMessage.classList.add('NullMessage')
            NullMessage.innerHTML =`
            <h4>您好，${UserId}，待預訂的行程如下：</h4>
            <p>目前沒有任何待預訂的行程</p>
            `
            body.insertBefore(NullMessage, foot);
            CloseLoaderFunc()
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
        headers: new Headers({'Content-Type': 'application/json'})
    })
    window.location.href='/booking';
}

contentDelete.addEventListener('click', DeleteBooking)

//把渲染畫面寫在HTML上面


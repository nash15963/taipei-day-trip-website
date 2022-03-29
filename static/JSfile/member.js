//增加跳出登入頁面功能
const signinBtn = document.querySelector('.signin');
const signoutBtn = document.querySelector('.signout')
const Body = document.querySelector('body');
const shadow = document.querySelector('#shadow');
const login = document.querySelector('#login');
const signup = document.querySelector('#signup')
const signupPage = document.querySelector('.signupPage');
const logInPage = document.querySelector('.logInPage')
const closeloginPageBtn = document.querySelector('.close');
const closesignupPageBtn2 = document.querySelector('#signup .close');
logInPage.style = 'color: #666666; cursor: pointer;'
let memberData = null ;
//進入登入頁面
let signPageOpen = () => {
    Body.style = 'overflow-y:hidden';
    shadow.style = 'display: block';
    login.style = 'display: block';
}
signinBtn.addEventListener('click', signPageOpen)

//增加註冊頁面功能
//進入註冊頁面
const signupPageFunc = () => {
    login.style = 'display: none';
    signup.style = 'display: block';
}
signupPage.addEventListener('click', signupPageFunc)

//切'回'到登入頁面
const logInPageFunc = () => {
    signup.style = 'display: none';
    login.style = 'display: block';
}
logInPage.addEventListener('click', logInPageFunc)

//關閉登入頁面
let signInClose = () => {
    Body.style = 'overflow-y:visible';
    shadow.style = 'display: none';
    login.style = 'display: none';
    let message = document.querySelector('#login .message')
    message.innerText = '';
}
closeloginPageBtn.addEventListener('click', signInClose)

//關閉註冊頁面
let signUpClose = () => {
    Body.style = 'overflow-y:visible';
    shadow.style = 'display: none';
    signup.style = 'display: none';
    let message = document.querySelector('#signup .message')
    message.innerText = '';
}
closesignupPageBtn2.addEventListener('click', signUpClose)

//網頁註冊功能
const signupFormBtn = document.querySelector('#signup_formBtn')
async function SignUpFunc(e) {
    e.preventDefault();
    const signup_form = document.querySelector('#signup_form')
    let message = document.querySelector('#signup .message')
    message.innerText = '';
    const UserApi = '/api/user'
    const data = {
        Name: signup_form['name'].value,
        Email: signup_form['email'].value,
        Password: signup_form['password'].value,
    }
    // console.log(data)
    if (data['Name'] == '' | data['Email'] == '' | data['Password'] == '') {
        message.innerText = '請確認填寫'
    } else {
        await fetch(UserApi, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then(result => result.json())
            .then(data => {
                if (data.ok) {
                    message.innerText = '註冊成功';
                    alert('謝謝您註冊本網站')
                    e.reload();
                } else {
                    message.innerText = data.message;
                    e.reload();
                }
            })

    }
}
signupFormBtn.addEventListener('click', SignUpFunc)

//網頁登入功能
const loginFormBtn = document.querySelector('#login_formBtn')
async function LogInFunc(e) {
    e.preventDefault();
    const login_form = document.querySelector('#login_form')
    let message = document.querySelector('#login .message')
    message.innerText = '';
    const UserApi = '/api/user'
    const data = {
        Email: login_form['email'].value,
        Password: login_form['password'].value,
    }

    // console.log(data)
    if (data['Email'] == '' | data['password'] == '') {
        message.innerText = '請填入帳號或密碼'
    } else {
        await fetch(UserApi, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then(result => result.json())
            .then(data => {
                if (data.ok) {
                    signInClose()
                    signinBtn.style = 'display : none' ;
                    signoutBtn.style = 'display : inline-block' ;
                    memberData = true ;
                } else {
                    message.innerText = data.message;
                }
            })
            .catch(data => {
                console.log('error')
                message.innerText = '帳號或密碼錯誤'
            })
    }
}
loginFormBtn.addEventListener('click', LogInFunc)

//網頁登出功能

async function SignOutFunc(e) {
    const UserApi = '/api/user'
    const result = await fetch(UserApi, {
        method: 'DELETE'
    })
    console.log(result)
    alert('您已登出網站')
    signinBtn.style = 'display : inline-block'
    signoutBtn.style = 'display : none'
    memberData = false ;
}
signoutBtn.addEventListener('click', SignOutFunc)


//一進入頁面檢查使用者狀態使否登入
async function signinCheck() {
    const UserApi = '/api/user'
    await fetch(UserApi)
        .then(res => res.json())
        .then(result => {
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
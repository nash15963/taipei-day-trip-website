const bookingBtn = document.querySelector('#bookingBtn') ;
const bookingForm = document.querySelector('#bookingForm') ;
const bookingMessage = document.querySelector('.bookingMessage') ;
//const signinBtn = document.querySelector('.signin');
const bookingApi = '/api/booking' ;
let attractionId = 0 ;
// let locationData = '' ;
let locationId = window.location.pathname.split('/')[2]

//開始預訂行程//傳一組訂單資料到後端伺服器
let startBooking = async(e) => {
    e.preventDefault();
    //BookSigninCheck()
    //console.log('memberData :',memberData)
    if(memberData == true){
        const data = {
            attractionId:locationId ,
            Date: bookingForm['top-main-date'].value,
            Price: bookingForm['fullday'].value,
            Time:''
        }
        if(data.Price==2000){data.Time = 'moring'}
        else{data.Time = 'afternoon'}
        console.log(data)
        if (data['Date'] == '' | data['Time'] == '' | data['Price'] == ''){
            bookingMessage.innerText = '請完整填寫訂單資料'
        }
        else{ //訂單資料
            await fetch(bookingApi, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then(result => result.json())
            window.location.href='/booking';
        }
    }
    else{
        signinBtn.click()
    }
    
    
}
bookingBtn.addEventListener('click', startBooking)
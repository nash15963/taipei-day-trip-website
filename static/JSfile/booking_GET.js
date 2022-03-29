let bookingApi = '/api/booking' ;
const bookingDataGet = async() =>{
    await fetch(bookingApi,{headers: new Headers({'Content-Type': 'application/json'})})
    .then(result => result.json())
}
bookingDataGet()
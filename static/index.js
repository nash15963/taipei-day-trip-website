let Enroll =()=> {
  
  let content = document.querySelector('.content');
  let Body = document.querySelector('body');
  const getDatas = async (page) => {


      const API_URL = `/api/attractions?page=${page}`;
      const response = await fetch(API_URL);
      // handle 404
      if (!response.ok) {
          throw new Error(`An error occurred: ${response.status}`);
      }
      return await response.json();
  }

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

          content.appendChild(boxEle);
      });
  };
  
  const hasMoreDatas = (e) => {
      return e !== null ;
  };
  
  const loadDatas = async (page) => {

      // // show the loader
      

      // 0.5 second later
      setTimeout(async () => {
          try {
              // if having more quotes to fetch
              if (hasMoreDatas(nextPage)) {
                  // call the API to get quotes
                  const response = await getDatas(page);
                  // show quotes
                  showDatas(response.data);
                  // update the total
                  nextPage = response.nextPage;
              }
          } catch (error) {
              console.log('error.message',error.message);
          }
      }, 1000);

  };
  let currentPage = 0;
  let nextPage = 0;
  
  window.addEventListener('scroll', () => {
      const {
          scrollTop,
          scrollHeight,
          clientHeight
      } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 4 &&
          hasMoreDatas(currentPage)) {
          currentPage++;
          loadDatas(currentPage);
      }
     
  }, {
      passive: true
  });
   // initialize
   loadDatas(currentPage);

};
Enroll()






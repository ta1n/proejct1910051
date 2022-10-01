const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink;
// if user press any key and release

function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    icon.onclick = ()=>{
        webLink = `https://www.google.com/search?q=${selectData}`;
        linkTag.setAttribute("href", webLink);
        linkTag.click();
    }
    searchWrapper.classList.remove("active");
}
function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = `<li>${userValue}</li>`;
    }else{
      listData = list.join('');
    }
    suggBox.innerHTML = listData;
}



inputBox.onkeyup = (e)=>{
    let userData = e.target.value; //user enetered data
    let emptyArray = [];
    if(userData){
        icon.onclick = ()=>{
            // webLink = `https://www.google.com/search?q=${userData}`;
          webLink = '#tbl' ;
            linkTag.setAttribute("href", webLink);
            linkTag.click();
        }
      async function resP(){
        emptyArray = await getSearched(userData) ;

        emptyArray = emptyArray.map((data)=>{
            // passing return data inside li tag
          const dt=data.item.place ;
          const scr=100-data.score*100 ;
          return data = `<li>${dt} (${scr}% match)</li>`;
        });


        searchWrapper.classList.add("active"); //show autocomplete box
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
      }
      resP() ;
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}

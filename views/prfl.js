let post ;
  function get_text(){
    dthead =document.getElementById('hdn').value ;
    dtpst = document.getElementById('pst').value ;
    post={ dthead:dthead, dtpst:dtpst }
  }
  function snd(){
    get_text()  ;
    fetch('/adinfo',{
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      }})
      .then((response) => response.json()).then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }




  function gtinf(){
    // fetch('/getinfo').then((response) => response.json())
    //   .then((data) => console.log(data));
    rendrPosts(prnt_div) ;
  }
  // function send_req(){
  //   fetch('/addinfo',()=> {
  //   method: 'POST', // or 'PUT'
  //   headers: { 'Content-Type': 'application/json', },
  //   body: JSON.stringify(post),
  // }) .then((response) => response.json()).then((data) => {
  //     console.log('Success:', data); }).catch((error) => {
  //     console.error('Error:', error);
  //   });
  // }
function printPosts(objs,container){

  hdngs=objs.hdng ;
  psts=objs.pst ;

  for(let i = 0; i < hdngs.length; i++){
    // console.log(hdngs[i]); console.log(psts[i]);
    let hdr=document.createElement('h3') ;
    hdr.append(hdngs[i]) ;
    let pst=document.createElement('p') ;
    pst.append(psts[i]) ;
    container.appendChild(hdr) ;
    container.appendChild(pst) ;

    
  } }

const prnt_div=document.getElementById('all_psts') ;
async function rendrPosts(container){

  const dta =await fetch("/getinfo")
  const data=await dta.json() ;
  container.innerHTML='' ;

  printPosts(data,container) ;

  // headers=['From/To','From/To','Fare'] ;
  // printTable(data,headers,myTable);

}

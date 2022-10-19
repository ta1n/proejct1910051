
const fs=require('fs') ;

let users ;
try {
  const data = fs.readFileSync('users.json', 'utf8');
  console.log(data);
  users = JSON.parse(data) ;
} catch (err) {
  console.error(err);
}
let admins ;
try {
  const data = fs.readFileSync('admins.json', 'utf8');
  console.log(data);
  admins = JSON.parse(data) ;
} catch (err) {
  console.error(err);
}

let fares ;
try {
  const fdata = fs.readFileSync('fares.json', 'utf8');
  console.log(fdata);
  fares = JSON.parse(fdata) ;
} catch (err) {
  console.error(err);
}

let infos ;
try {
  const data = fs.readFileSync('info.json', 'utf8');
  console.log(data);
  infos = JSON.parse(data) ;
} catch (err) {
  console.error(err);
}


let comments ;
try {
  const data = fs.readFileSync('cmnts.json', 'utf8');
  console.log(data);
  comments = JSON.parse(data) ;
} catch (err) {
  console.error(err);
}


let adm_infos ;
try {
  const data = fs.readFileSync('adm_info.json', 'utf8');
  console.log(data);
  adm_infos = JSON.parse(data) ;
} catch (err) {
  console.error(err);
}



module.exports={
  users,
  admins,
  fares,
  infos,
  adm_infos,
  comments
}

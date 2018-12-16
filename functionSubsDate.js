var days = 55;

function umber(el) {
 let  element =   (Date.now() + -el*24*3600*1000)
  return new Date(element).toString();
}

console.log(umber(64));

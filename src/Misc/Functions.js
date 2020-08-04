const areSame = (x, y) => {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
      ok(x).length === ok(y).length &&
        ok(x).every(key => areSame(x[key], y[key]))
    ) : (x === y);
  };

const filterData = (obj, keyList) => {
	let newObj = {}
	newObj = JSON.parse(JSON.stringify(obj))
    keyList.length && keyList.forEach(key => {(typeof newObj[key] !== "undefined") && delete newObj[key]})
    return newObj
};

const toNum = (txt) => {
  //console.log(typeof(txt))
  let rez = []
  txt.split(',').forEach(subStr=>{
      subStr.split('.').forEach(subStr=>{subStr[0] && rez.push(subStr)})
  })
  if (rez.length > 1) {
      rez = Number(`${rez.slice(0,-1).join('')}.${rez.slice(-1)}`)
  }
  else {
      rez = rez.length? Number(rez): NaN
  }
  return (rez)
};

const invBrValidation = (invBr, exists) => {
    if (exists) {
        return [true, 'Inv br već postoji!']
    }
    if (!(Number(invBr)&&invBr>0&&Number.isInteger(Number(invBr)))) {
        return [true, 'Unesi validan inv br!']
    } 
    return [false, '?']
};

const sorter = (arr, prop, direction) => {
    direction?
    arr.sort((a,b)=>{return a[prop]>b[prop] ? -1 : a[prop]<b[prop] ? 1 : 0}):
    arr.sort((a,b)=>{return a[prop]<b[prop] ? -1 : a[prop]>b[prop] ? 1 : 0})
    return [...arr]
};

const getDates = (deltaMonths) => {
    let date = new Date()
	let dNow = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
	let dPast = new Date()
	dPast.setMonth(dPast.getMonth() - deltaMonths)
    dPast = dPast.toISOString().split("T")[0];
    return [dPast, dNow]
};

const incrementDocBr = (docBr) => {
    let docBrArr = []
    if (docBr) {
        docBrArr = docBr.split('/');
        docBrArr[docBrArr.length-1] = Number(docBrArr[docBrArr.length-1])+1 //inkrementira poslednji br za +1
    }
    return docBrArr.join('/')
}


export {areSame, filterData, toNum, invBrValidation, sorter, getDates, incrementDocBr, };
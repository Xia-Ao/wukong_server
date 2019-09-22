
const random = (n) => {
    let randomStr = '';
    for(let i =0; i< n; i++ ){
        randomStr += Math.floor(Math.random() * 10);
    }
    return randomStr;
}

module.exports ={
    random,
}
const szyfr = ()=>{
    let str = '';
    let szyfrTab = [1,2,3,4,5,6,7,8,9,0];
    for(let i=0;i<=4;i++){
        let rnd = Math.floor(Math.random()*10);
        str+=szyfrTab[rnd];
    }
    return str;
}

module.exports = szyfr;
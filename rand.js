const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const maxLv = 100

app.use(cors())

// 변수를 넣으려면 :id 처럼 만들어야 한다.
// { id : '아이디' } 형식으로 들어 온다.

// query 방식
// 값을 &를 이용하여 여러개 보낼수 있다.
// q=mitier&name=m
// asdf?id=mitier
// asdf 는 q의 이름
app.get('/box/:box', (req, res) => {
    const q = req.query;
    var selected;

    const num = Number(q.num);
    const lv = Number(q.lv);

    res.send(numSelect(q.name, num, lv));

})

// 결과 숫자를 계산 하는 함수
function numSelect(name, num, lv)
{
    // 예외 처리
    // 상자 구매 수량이 0 또는 10 만 가능하게 만든다.
    if(num <= 0) num = 0;
    else if(num > 10) num = 0;

    if(lv < 0) lv = 0;
    else if(lv > maxLv) lv = maxLv;

    // 선택 하는 숫자는 1 ~ 5 하지만 사용은 4개
    // 1 ~ 4 까지 하고 name당 1씩 더하는 것으로 한다.
    // name이 n 이면 1,2,3,4
    // name이 r 이면 2,3,4,5
    // Math.floor(Math.random() * (max - min + 1)) + min;
    
    // 상자의 질 노말, 레어 등
    const qa = (name === 'n') ? 0 : 1;

    // 확률을 위한 변수
    const a = 900-(lv * 10) +100; 
    const b = (lv * 0.6);
    const c = (lv * 0.3);
    const d = (lv * 0.1);

    var sendMassage = '';

        for(var i = 0; i < num; i++)
        {
            const rand = Math.floor(Math.random() * (1000 - 0 + 1)) + 0;

            if(rand <= a){
                sendMassage += 1+qa;
            }
            else if(rand <= b ){
                sendMassage += 2+qa;
            }
            else if(rand <= c){
                sendMassage += 3+qa;
            }
            else if(rand <= d){
                sendMassage += 4+qa;
            }
        }
        return(sendMassage);
    
}


// 3000 번 페이지에 접속하면 실행
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
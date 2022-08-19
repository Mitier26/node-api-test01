var _gold = 0;
var _spg = 1;
var _gem = 0;

var _nLevel = 0;
var _nExp = 0;
var _rLevel = 0;
var _rExp = 0;

var _boxCount = [0,0,0,0,0];

const _maxExp = 10;

// 인자로 받은 값을 전역 변수에 대입하는 함수
function setData(gold, spg, gem, nLevel, nExp, rLevel, rExp)
{
    // 숫자가 기본수치 보다 작으면 초기화
    if(gold <= 0) _gold = 0;
    else _gold = gold;
    if(spg <= 1) _spg = 1;
    else _spg = spg;
    if(gem <= 0) _gem = 0;
    else _gem = gem;

    if(nLevel <= 0) _nLevel = 0;
    else _nLevel = nLevel;
    if(nExp <= 0) _nExp = 0;
    else _nExp = nExp;
    if(rLevel <= 0) _rLevel = 0;
    else _rLevel = rLevel;
    if(rExp <= 0) _rExp = 0;
    else _rExp = rExp;
    showUI();
}

//저장한것을 불러오는 함수
function load()
{
    // 로드할 때 문제가 있다.
    // localStorage는 문자열만 저장 할 수 있는데
    // 값을 초기화 하면 0 이 아닌 NaN으로 저장이 된다.
    // 그래서 숫자로 변경하는 것이 불가능 하다.
    // 그러면 문자를 불러와 null 이면 0 으로 하는 것이 필요해 보인다.

    var loadGold;
    var loadSpg;
    var loadGem;

    var loadNLevel;
    var loadNExp;
    var loadRLevel;
    var loadRExp;

    if(localStorage.getItem('gold') === 'NaN')
    {
        loadGold = 0;
    }
    else
    {
        loadGold = Number(localStorage.getItem('gold'));
    }

    if(localStorage.getItem('spg') == undefined)
    {
        loadSpg = 1;
    }
    else
    {
        loadSpg = Number(localStorage.getItem('spg'));
    }

    if(localStorage.getItem('gem') == undefined)
    {
        loadGem = 0;
    }
    else
    {
        loadGem = Number(localStorage.getItem('gem'));
    }

    if(localStorage.getItem('nLevel') == undefined)
    {
        loadNLevel = 0;
    }
    else
    {
        loadNLevel = Number(localStorage.getItem('nLevel'));
    }

    if(localStorage.getItem('nExp') == undefined)
    {
        loadNExp = 0;
    }
    else
    {
        loadNExp = Number(localStorage.getItem('nExp'));
    }

    if(localStorage.getItem('rLevel') == undefined)
    {
        loadRLevel = 0;
    }
    else
    {
        loadRLevel = Number(localStorage.getItem('rLevel'));
    }

    if(localStorage.getItem('rExp') == undefined)
    {
        loadRExp = 0;
    }
    else
    {
        loadRExp = Number(localStorage.getItem('rExp'));
    }

    var output = localStorage.getItem("boxArray");		
    _boxCount = JSON.parse(output)

    showUI();
    setData(loadGold, loadSpg, loadGem, loadNLevel, loadNExp, loadRLevel, loadRExp);
}

// 데이터를 저장하는 함수
function save()
{
    // localStorage는 string만 저장이 가능 하다.
    localStorage.setItem('gold', _gold.toString());
    localStorage.setItem('spg', _spg.toString());
    localStorage.setItem('gem', _gem.toString());

    localStorage.setItem('nLevel', _nLevel.toString());
    localStorage.setItem('nExp', _nExp.toString());
    localStorage.setItem('rLevel', _rLevel.toString());
    localStorage.setItem('rExp', _rExp.toString());

    localStorage.setItem("boxArray", JSON.stringify(_boxCount));
}

// 1초 마다 실행되는 함수
function startGame()
{
    setInterval(() => {
        _gold += _spg;
        showUI();
        save();
    }, 1000);
}

// html과 연결해서 화면에 보여주는 함수
function showUI()
{
    document.getElementById('currentGold').innerHTML = _gold + ' 원';
    document.getElementById('timeperGold').innerHTML = _spg + ' / Sec';
    document.getElementById('currentGem').innerHTML = _gem + '보석';

    showExpUI();
    showBox();
}

function showExpUI()
{
    document.getElementById('nExp').innerHTML = `경험치 : ${_nExp} / ${_maxExp * _nLevel + _maxExp}`;
    document.getElementById('nLevel').innerHTML = `레벨 : ${_nLevel}`;

    document.getElementById('rExp').innerHTML = `경험치 : ${_rExp} / ${_maxExp * _rLevel + _maxExp}`;
    document.getElementById('rLevel').innerHTML = `레벨 : ${_rLevel}`;

    const a1 = 900-(_nLevel * 10) +100;
    const a2 = 900-(_rLevel * 10) +100;

    document.getElementById('percent1').innerHTML = `N: ${a1/10}% R: ${(_nLevel*0.6).toFixed(1)}% U: ${(_nLevel*0.3).toFixed(1)}% S: ${(_nLevel*0.1).toFixed(1)}%`;
    document.getElementById('percent2').innerHTML = `R: ${a2/10}% U: ${(_rLevel*0.6).toFixed(1)}% S: ${(_rLevel*0.3).toFixed(1)}% L: ${(_rLevel*0.1).toFixed(1)}%`;
}

// 초기화
function reset()
{
    //저장된 값을 삭제
    localStorage.clear();

    // 전역 변수 초기화
    _gold = 0;
    _spg = 1;
    _gem = 0;

    _nLevel = 0;
    _nExp = 0;
    _rLevel = 0;
    _rExp = 0;

    _boxCount = [0,0,0,0,0];
    showUI();
}

// 추가 할 것
// 초기화 할 때 경고창을 보여주는 것
var result;

function buybuy(name, num, lv, price)
{
    if(name === 'n') lv = _nLevel;
    else if(name === 'r') lv = _rLevel;

    // 돈 감소
    if(_gold >= price)
    {
        _gold-=price;
        showUI();
        fetch(`http://localhost:3000/box/box?name=${name}&num=${num}&lv=${lv}`)
            .then((response) => response.json())
            .then((data) => {
                setText(data);
        })
        setExp(name, num, lv);
    }
    else{
        clearText();
        document.getElementById('m0').innerHTML = '돈이 부족 합니다.';
        setTimeout(() => {
            clearText();
        }, 1000);
    }
    
}

function setExp(name, num, lv)
{
    if(name === 'n')
    {
        _nExp += num;
        if(_nExp >= _maxExp * lv + _maxExp)
        {
            const d = _nExp - ((_maxExp * lv) + _maxExp);
            console.log(d);
            _nLevel++;
            _nExp=0;
            _nExp+= d;
        }
    }
    if(name === 'r')
    {
        _rExp += num;
        if(_rExp >= _maxExp * lv + _maxExp)
        {
            const d = _rExp - ((_maxExp * lv) + _maxExp);
            _rLevel++;
            _rExp=0;
            _rExp+= d;
        }
    }
}

function setBoxCont(num)
{
    _boxCount[num-1]++;
}

function setText(data)
{
    const str = data.toString();
    let arr = str.split("");

    clearText();

    for(var i = 0 ; i < arr.length; i++)
    {
        document.getElementById(`m${i}`).innerHTML = `${arr[i]} 원 증가 합니다.` ;
        // 글자 출력
        // 능력 증가
        _spg+= Number(arr[i]);
        setBoxCont(arr[i]);
        console.log(_boxCount);
        showUI();
        
    }

    setTimeout(() => {
            clearText();
        }, 1000);
}

function clearText() {
    clearTimeout()
    for(var i = 0 ; i < 10; i++)
    {
        document.getElementById(`m${i}`).innerHTML = '';
    }
}

function dis1()
{
    document.getElementById('result1').style.display = "block";
    document.getElementById('result2').style.display = "none";
    document.getElementById('result3').style.display = "none";
}

function dis2()
{
    document.getElementById('result1').style.display = "none";
    document.getElementById('result2').style.display = "block";
    document.getElementById('result3').style.display = "none";

    // 상자 수량 표시
    showBox();
    
    
}

function showBox()
{
    document.getElementById(`bc1`).innerHTML = `일반 상자의 수량 : ${_boxCount[0]}`;
    document.getElementById(`bc2`).innerHTML = `좋은 상자의 수량 : ${_boxCount[1]}`;
    document.getElementById(`bc3`).innerHTML = `귀한 상자의 수량 : ${_boxCount[2]}`;
    document.getElementById(`bc4`).innerHTML = `특별 상자의 수량 : ${_boxCount[3]}`;
    document.getElementById(`bc5`).innerHTML = `전설 상자의 수량 : ${_boxCount[4]}`;
}

function dis3()
{
    document.getElementById('result1').style.display = "none";
    document.getElementById('result2').style.display = "none";
    document.getElementById('result3').style.display = "block";

    // TMI
    document.getElementById('t0').innerHTML = 'API 설명'
    document.getElementById('t1').innerHTML = '버튼에서 [상자의 이름], [상자 구입 수량], [상자의 레벨]을'
    document.getElementById('t2').innerHTML = '전달하면 어떤 아이템을 뽑았는지 보내 주는 API 입니다.'
    document.getElementById('t3').innerHTML = '1개를 구입하면 1'
    document.getElementById('t4').innerHTML = '10개를 구입하면 1111111111'
    document.getElementById('t5').innerHTML = 'String 형식으로 돌려 줍니다.'
    document.getElementById('t6').innerHTML = 'Json으로 돌려 주지 않고 문자 나누기를 한 이유는'
    document.getElementById('t7').innerHTML = '이렇게 보내는 데이터 전송량을 줄일 수 있지않을까? 해서 입니다.'
    document.getElementById('t8').innerHTML = '쓸대없이 복잡하게 만들어 시간이 오래걸렸습니다.'
    document.getElementById('t9').innerHTML = '연습용으로는 간단한 텍스트만 받는 것을 만들기를 추천합니다.'
}
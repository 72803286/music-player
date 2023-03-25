let list = [
    {
        "id": "0",
        "title": "真的吗",
        "author": "莫文蔚",
        "albumn": "我要说I Say",
        "lyric": "./music-player/assets/lyric_真的吗.json",
        "url": "./music-player/assets/莫文蔚-真的吗.mp3",
        "cover": "./music-player/assets/真的吗.jpg"
    },

    {
        "id": "1",
        "title": "水星记",
        "author": "郭顶",
        "albumn": "飞行器的执行周期",
        "lyric": "./music-player/assets/lyric_水星记.json",
        "url": "./music-player/assets/水星记.mp3",
        "cover": "./music-player/assets/水星记.jpg"
    },
    {
        "id": "2",
        "title": "后来的我们",
        "author": "五月天",
        "albumn": "后来的我们",
        "lyric": "./music-player/assets/lyric_后来的我们.json",
        "url": "./music-player/assets/后来的我们.mp3",
        "cover": "./music-player/assets/后来的我们.jpg"
    },
    {
        "id": "3",
        "title": "假装",
        "author": "陈雪凝",
        "albumn": "拾陆",
        "lyric": "./music-player/assets/lyric_假装.json",
        "url": "./music-player/assets/假装.mp3",
        "cover": "./music-player/assets/假装.jpg"
    },
    {
        "id": "4",
        "title": "烦恼歌",
        "author": "张学友",
        "albumn": "在你身边",
        "lyric": "./music-player/assets/lyric_烦恼歌.json",
        "url": "./music-player/assets/烦恼歌.mp3",
        "cover": "./music-player/assets/烦恼歌.jpg"
    }
]

//变量的声明
const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)
const $iconPlay = $('.icon-play')
const $iconPause = $('.icon-pause-one')
const $songTitle = $('.songTitle')
const $author = $('.author')
const $currentTime = $('.currentTime')
const $totalTime = $('.totalTime')
const $cover = $('.cover')
const $progress = $('.progress')
const $proContainer = $('.progress-container')
const $iconOrder = $('.icon-order')
const $iconRandom = $('.icon-random')
const $iconCycle = $('.icon-cycle')
const $iconGoStart = $('.icon-go-start')
const $iconGoEnd = $('.icon-go-end')
const $ball = $('.progress .ball')
const $panel = $('.panel')


const audio = new Audio()

let index = 0


//设置歌曲时间，需在歌曲加载完成时才能读取，如果歌曲还未加载完毕，则获取不到，所以要监听canplay事件。
audio.addEventListener('canplay', function (e) {
    $totalTime.innerText = secToMin(audio.duration)
})


// 一些函数
const setSong = function () {
    $songTitle.innerText = list[index].title
    $author.innerText = list[index].author
    $cover.style.backgroundImage = `url(${list[index].cover})`
    audio.src = list[index].url
}//设置歌曲基本信息
setSong(index)

const secToMin = function (n) {
    n = n.toFixed(0)
    let min = Math.floor((n / 60), 10)
    min = min > 10 ? '' + min : '0' + min
    let sec = (n % 60).toFixed(0)
    sec = sec >= 10 ? '' + sec : '0' + sec
    return `${min}:${sec}`//将秒数转换为分钟+秒数
}

function randomNoRepeat() {
    let currentNum = null;
    do {
        currentNum = Math.floor(Math.random() * list.length);
    } while (currentNum === index);
    index = currentNum;
    return index;//相邻两次不重复的随机数
}




//setInterval中的函数
const colok = function () {
    $currentTime.innerText = secToMin(audio.currentTime)
    $progress.style.width = (audio.currentTime / audio.duration) * 100 + '%'
}

//点击播放
$iconPlay.onclick = function () {
    console.log(6);
    setInterval(colok, 1000)   //一个计时器，每1000毫秒执行一次前面的函数
    audio.play()
    $iconPlay.classList.toggle('hide')
    $iconPause.classList.toggle('hide')
}

//点击暂停
$iconPause.onclick = function () {
    clearInterval(colok)
    audio.pause()
    $iconPlay.classList.toggle('hide')
    $iconPause.classList.toggle('hide')
}

//点击切换单曲循环，随机播放，顺序播放
$iconOrder.onclick = function () {
    $iconOrder.classList.toggle('hide')
    $iconRandom.classList.toggle('hide')
}

$iconRandom.onclick = function () {
    $iconRandom.classList.toggle('hide')
    $iconCycle.classList.toggle('hide')
}

$iconCycle.onclick = function () {
    $iconCycle.classList.toggle('hide')
    $iconOrder.classList.toggle('hide')
}


//单曲循环，随机播放，顺序播放逻辑
audio.addEventListener('ended', function () {
    if (!$iconOrder.classList.contains('hide')) {
        index++
        index = index >= list.length ? 0 : index
        setSong(index)
        audio.play()
    } else if (!$iconRandom.classList.contains('hide')) {
        randomNoRepeat()
        setSong(index)
        audio.play()
    } else {
        audio.play()
    }
})


//下一曲、上一曲
$iconGoEnd.onclick = function () {
    index++
    index = index >= list.length ? 0 : index
    shouPlay()
}

$iconGoStart.onclick = function () {
    index--
    index = index < 0 ? list.length - 1 : index
    shouPlay()
}

function shouPlay() {
    if ($iconPlay.classList.contains('hide')) {
        setSong(index)
        audio.play()
    } else setSong(index)
}

//点击切换进度条(PC端与移动端通用)
$proContainer.onclick = function (e) {
    $progress.style.width = (e.offsetX / $proContainer.offsetWidth) * 100 + '%'
    audio.currentTime = audio.duration * (e.offsetX / $proContainer.offsetWidth)
}

$ball.onclick = function (e) {
    e.stopPropagation()
} //点击ball也会触发其父元素绑定的事件，所以要停止ball的事件传播





// 拖动进度条使用的一些函数
let colock2 = null //优化播放卡顿
function move(e) {
    e.preventDefault()
    console.log(5);
    if (isDown) {
        let percent
            e.offsetX ? percent = e.offsetX / $proContainer.offsetWidth : percent = (e.touches[0].clientX - $proContainer.getBoundingClientRect().x) / $proContainer.offsetWidth
            $progress.style.width = percent * 100 + '%'
        if (colock2) {
            clearTimeout(colock2)
        }
        colock2 = setTimeout(() => {          
            audio.currentTime = audio.duration * percent
        }, 50)   
    }
}
// 拖动进度条PC端
let isDown = false
$ball.onmousedown = function (e) {
    console.log(1);
    e.preventDefault()
    isDown = true
}
$panel.onmouseup = function (e) {
    console.log(2);
    e.preventDefault()
    isDown = false
}

$ball.onmousemove = function (e) {
    e.stopPropagation()
} //点击ball也会触发其父元素绑定的事件，所以要停止ball的事件传播

$panel.onmousemove = move


// 拖动进度条移动端
$proContainer.addEventListener('touchstart',function (e) {
    console.log(3);
    isDown = true    
})

$panel.addEventListener('touchend',function (e) {
    console.log(4);
    isDown = false
})

$panel.addEventListener('touchmove',move)

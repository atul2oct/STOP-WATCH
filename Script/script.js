window.onload = function () {
    //getting data
    var Minute = document.querySelector("#min");
    var Second = document.querySelector("#sec");
    var MilliSecond = document.querySelector("#msec");
    var Start = document.querySelector(".start");
    var Stop = document.querySelector(".stop");
    var Reset = document.querySelector(".reset");
    var lapBtn = document.querySelector(".lap-btn");
    var tableLap = document.querySelector("table");
    var copyBtn = document.querySelector(".copy-btn");
    //setting initial values
    var startClock = false;
    var ms = 0;
    var seconds = 0;
    var minutes = 0;
    var timeInterval = null;
    var i = 0;
    var laps = 0;
    var prevMin = 0;
    var prevSec = 0;
    var prevMsec = 0;
    var prevMinimum = "59 : 59 . 99";
    var prevMinimumId = 1;
    var prevMaximum = "00 : 00 . 00";
    var prevMaximumId = 0;
    var startAudio = new Audio("Audio/Start.mp3");
    var lapAudio = new Audio("Audio/Stop.mp3");

    //start button function
    Start.addEventListener("click", function () {
        if (!startClock) {
            startAudio.play();
            animateBtn(this.innerHTML);
            startClock = true;
            //after every 10ms function run
            timeInterval = setInterval(function () {
                //for millisecond
                ms++;
                //add 0 before if single digit
                MilliSecond.innerHTML = ms < 10 ? "0" + ms : ms;
                //for second
                if (ms == 100) {
                    seconds++
                    //add 0 before if single digit
                    Second.innerHTML = seconds < 10 ? "0" + seconds : seconds;
                    //reset millisecond after every second
                    ms = 0;
                    MilliSecond.innerHTML = "0" + 0;
                }
                //for minutes
                if (seconds == 60) {
                    minutes++;
                    //add 0 before if single digit
                    Minute.innerHTML = minutes < 10 ? "0" + minutes : minutes;
                    //reset seconds after every minutes
                    seconds = 0;
                    Second.innerHTML = "0" + 0;
                }
            }, 10)
            //after stopwatch starts it will show stop and lap buttons only
            Start.style.display = "none"
            Stop.style.display = "inline-block"
            Reset.style.display = "none";
            lapBtn.style.display = "inline-block";
        }
    });

    //stop button function
    Stop.addEventListener("click", function stop() {
        if (startClock) {
            startAudio.play();
            animateBtn(this.innerHTML)
            clearInterval(timeInterval);
            startClock = false;
            //after stopwatch stop it will show start and reset buttons only
            Start.style.display = "inline-block"
            Stop.style.display = "none"
            Reset.style.display = "inline-block";
            lapBtn.style.display = "none";
        }
    });

    //Restart button function
    Reset.addEventListener("click", function () {
        animateBtn(this.innerHTML);
        startAudio.play();
        clearInterval(timeInterval);
        if (startClock) {
            Stop.style.display = "none"
            Start.style.display = "inline-block"
        }
        startClock = false;
        //reset the time to 00:00.00
        ms = 0;
        seconds = 0;
        minutes = 0;
        Minute.innerHTML = "00"
        Second.innerHTML = "00"
        MilliSecond.innerHTML = "00"
        tableLap.style.display = "none";
        prevMin = 0;
        prevSec = 0;
        prevMsec = 0;
        prevMaximum = "00 : 00 . 00"
        prevMinimum = "59 : 59 . 99"
        // laps = 0;
        removeLaps();
    });

    //button animation when pressed
    function animateBtn(btn) {
        var activeButton = document.querySelector("#" + btn);
        activeButton.classList.add("pressed");
        setTimeout(function () {
            activeButton.classList.remove("pressed");
        }, 100)
    }
}
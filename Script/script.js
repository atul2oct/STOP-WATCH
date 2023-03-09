window.onload = () => {
    //setting initial values
    var startWatch = false;
    var ms = 0;
    var seconds = 0;
    var minutes = 0;
    var timeInterval = null;
    var LapNumber = 0;
    var previousMin = 0;
    var previousSec = 0;
    var previousMsec = 0;
    var previousMinimum = "59 : 59 . 99";
    var previousMinimumId = 1;
    var previousMaximum = "00 : 00 . 00";
    var previousMaximumId = 0;
    var play_pauseAudio = new Audio("Script/Audio/Start.mp3");
    var lapAudio = new Audio("Script/Audio/Lap.mp3");

    //getting data from html
    var Minute = document.querySelector("#min");
    var Second = document.querySelector("#sec");
    var MilliSecond = document.querySelector("#msec");
    var Start = document.querySelector(".start");
    var Stop = document.querySelector(".stop");
    var Reset = document.querySelector(".reset");
    var lapBtn = document.querySelector(".lap-btn");
    var LapTable = document.querySelector("table");

    //button animation when pressed
    function animateBtn(btn) {
        var activeButton = document.querySelector("#" + btn);
        activeButton.classList.add("pressed");
        setTimeout(function () {
            activeButton.classList.remove("pressed");
        }, 100)
    }
    //start button function
    Start.addEventListener("click", function () {
        if (!startWatch) {
            play_pauseAudio.play();
            animateBtn(this.innerHTML);
            startWatch = true;
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
        if (startWatch) {
            play_pauseAudio.play();
            animateBtn(this.innerHTML)
            clearInterval(timeInterval);
            startWatch = false;
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
        play_pauseAudio.play();
        clearInterval(timeInterval);
        if (startWatch) {
            Stop.style.display = "none"
            Start.style.display = "inline-block"
        }
        startWatch = false;
        //reset the time to 00:00.00
        ms = 0;
        seconds = 0;
        minutes = 0;
        Minute.innerHTML = "00"
        Second.innerHTML = "00"
        MilliSecond.innerHTML = "00"
        LapTable.style.display = "none";
        previousMin = 0;
        previousSec = 0;
        previousMsec = 0;
        previousMaximum = "00 : 00 . 00"
        previousMinimum = "59 : 59 . 99"
        removeLaps();
    });

    //lap button function
    lapBtn.addEventListener("click", function () {
        lapAudio.play();
        animateBtn(this.innerHTML);
        LapTable.style.display = "table";
        lap();
    });

    //Lap function
    var tableRow = document.querySelector("tr");
    function lap() {
        LapNumber+=1;
        var row = document.createElement("tr")
        row.classList.add("remove");
        row.setAttribute("id", LapNumber);
        var srNo = document.createElement("td");
        //--note input for remarks for each lap times--//
        var note = document.createElement("td");
        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Add Note"
        input.classList.add("remarks");
        note.appendChild(input);
        //--Lap and overall times--//
        var currentLap = document.createElement("td");
        var overallTime = document.createElement("td");
        var deleteLap = document.createElement("td");
        //adding 0 to single digit serial number
        srNo.innerHTML = LapNumber < 10 ? "0" + LapNumber : LapNumber;
        //every individual lap time
        currentLap.innerHTML = DifferenceBetweenLaps(minutes, seconds, ms);
        overallTime.innerHTML = (minutes < 10 ? "0" + minutes : minutes) + " : " + (seconds < 10 ? "0" + seconds : seconds) + " . " + (ms < 10 ? "0" + ms : ms);
        //delete icon for removing lap row from table
        var deleteIcon = document.createElement("Button");
        deleteIcon.classList.add("bin");
        deleteIcon.innerHTML = ('<i class="fa-solid fa-trash-can"></i>')
        //inserting into columns
        deleteLap.appendChild(deleteIcon);
        row.appendChild(srNo);
        row.appendChild(note);
        row.appendChild(currentLap);
        row.appendChild(overallTime);
        row.appendChild(deleteLap);
        tableRow.after(row);
        //for delete button
        document.querySelector(".bin").addEventListener("click", function () {
            var currentRow = this.parentNode.parentNode;
            currentRow.classList.add('remove-active');
            setTimeout(() => {
                currentRow.remove();
            }, 500);
        })
        //minimum and maximum time amongst all lap times
        MinMaxOfLapTime(currentLap.innerHTML, LapNumber);
    }
    //Deleting lap row function
    function removeLaps() {
        var createdLaps = document.querySelectorAll(".remove");
        for (var i = 0; i < LapNumber; i++) {
            createdLaps[i].remove();
        }
        LapNumber = 0;
    }

    //function for calculating lap time
    function DifferenceBetweenLaps(currentMinutes, currentSeconds, currentMs) {
        var diffMin = 0;
        var diffSec = 0;
        var diffMsec = 0;

        if (currentMinutes > previousMin) {
            currentMinutes--;
            currentSeconds += 60;
        }

        if (previousMsec > currentMs) {
            currentSeconds--;
            currentMs += 100;
            diffMsec = currentMs - previousMsec;
            diffSec = currentSeconds - previousSec;
            diffMin = currentMinutes - previousMin;
        }

        else if (previousMsec <= currentMs) {
            diffMsec = currentMs - previousMsec;
            diffSec = currentSeconds - previousSec;
            diffMin = currentMinutes - previousMin;
        }

        var diffTime = ((diffMin < 10 ? "0" + diffMin : diffMin) + " : " + (diffSec < 10 ? "0" + diffSec : diffSec) + " . " + (diffMsec < 10 ? "0" + diffMsec : diffMsec));
        previousMin = minutes;
        previousSec = seconds;
        previousMsec = ms;

        return (diffTime);
    }

    //for finding minimum and maximum time
    function MinMaxOfLapTime(cTime, Id) {

        if (Id == 1) {
            previousMinimum = cTime;
            previousMinimumId = Id;
            previousMaximum = cTime;
            previousMaximumId = Id;
        }

        else {
            //Minimum
            if (cTime < previousMinimum) {
                previousMinimum = cTime;
                var minimumValues = document.querySelectorAll(".minimum");
                for (var i = 0; i < minimumValues.length; i++) {
                    minimumValues[i].classList.remove("minimum");
                }
                previousMinimumId = Id;
                document.getElementById(previousMinimumId).classList.add("minimum");
            }

            else if (cTime == previousMinimum) {
                document.getElementById(Id).classList.add("minimum");
            }

            else {
                document.getElementById(previousMinimumId).classList.add("minimum");
            }

            //Maximum

            if (cTime > previousMaximum) {
                previousMaximum = cTime;
                var maxValues = document.querySelectorAll(".max");
                for (var i = 0; i < maxValues.length; i++) {
                    maxValues[i].classList.remove("max");
                }
                previousMaximumId = Id;
                document.getElementById(previousMaximumId).classList.add("max");
            }

            else if (cTime == previousMaximum) {
                document.getElementById(Id).classList.add("max");
            }

            else {
                document.getElementById(previousMaximumId).classList.add("max");
            }

        }

    }
}
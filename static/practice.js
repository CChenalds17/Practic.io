// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function() {

    // Store goals_id so it can't be changed by malicious user
    const goalsIdInput = document.getElementById("goals-id");
    const initGoalsId = goalsIdInput.value;

    const SCALES_SIMPLE = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
    const SCALES_ENHARMONICS = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];
    const SCALE_TYPES = ["major", "minor"];

    // RANDOM SCALE GENERATOR //
    const generateBtn = document.getElementById("generate-btn");
    const scaleLetter = document.getElementById("scale-letter");
    const scaleType = document.getElementById("scale-type");
    const groupEnharmonicsCheckbox = document.getElementById("group-enharmonics");
    const scaleTypeInput = document.getElementById("scale-type-input");
    
    let grpEnharms = groupEnharmonicsCheckbox.checked;
    let scaleTypeSelection = scaleTypeInput.value;

    groupEnharmonicsCheckbox.addEventListener("change", function() {
        grpEnharms = groupEnharmonicsCheckbox.checked;
    });

    scaleTypeInput.addEventListener("change", function() {
        scaleTypeSelection = scaleTypeInput.value;
    });

    generateBtn.addEventListener("click", function() {
        let letterIdx = 0;
        // Generate random scale and type
        if (grpEnharms) {
            letterIdx = Math.floor(Math.random() * SCALES_SIMPLE.length);
            scaleLetter.textContent = SCALES_SIMPLE[letterIdx];
        } else {
            letterIdx = Math.floor(Math.random() * SCALES_ENHARMONICS.length);
            scaleLetter.textContent = SCALES_ENHARMONICS[letterIdx];
        }
        let typeIdx = 0;
        if (scaleTypeSelection === "major") {
            typeIdx = 0;
        } else if (scaleTypeSelection === "minor") {
            typeIdx = 1;
        } else if (scaleTypeSelection === "both") {
            typeIdx = Math.floor(Math.random() * SCALE_TYPES.length);
        }
        scaleType.textContent = SCALE_TYPES[typeIdx];
    });

    // METRONOME //
    // Slider
    const bpmSlider = document.getElementById("bpm");
    const bpmLabel = document.getElementById("bpm-label");
    let bpm = parseInt(bpmSlider.value, 10);
    bpmLabel.textContent = bpm;

    // Play/Pause
    const playBtn = document.getElementById("play-btn");
    let isPlaying = false;

    const context = new (window.AudioContext || window.webkitAudioContext)();
    let timer;
    let curTime = 0.0;
    
    // Update bpm according to bpmSlider
    bpmSlider.addEventListener("input", function() {
        bpm = parseInt(bpmSlider.value, 10);
        bpmLabel.textContent = bpm;
    });

    /* Metronome logic adapted from https://codepen.io/ganderzz/pen/poOQbJ */

    // Schedules next beat
    function schedule() {
        // While curTime is more than 0.1 seconds behind the context's time, play the click and then update the time
        while (curTime < context.currentTime + 0.1) {
            playClick(curTime);
            updateTime();
        }
        timer = window.setTimeout(schedule, 0.1);
    }
    
    // Sets the new curTime to when the next beat is supposed to be played
    function updateTime() {
        curTime += 60 / bpm;
    }

    // When playBtn is clicked, change between paused/playing
    playBtn.addEventListener("click", function() {
        // Switch from playing to paused
        if (isPlaying) {
            stopMetronome();
        } 
        // Switch from paused to playing
        else {
            startMetronome();
        }
    });

    function startMetronome() {
        // Syncs curTime with context.currentTime
        curTime = context.currentTime;
        schedule();

        isPlaying = true;

        playBtn.textContent = "Pause";
        playBtn.style.backgroundColor = "#e43967";
        playBtn.style.border = "#e43967";
    }

    function stopMetronome() {
        window.clearInterval(timer);

        isPlaying = false;

        playBtn.textContent = "Play";
        playBtn.style.backgroundColor = "#74d2b1";
        playBtn.style.border = "#74d2b1";
    }

    function playClick(t) {
        // Creates oscillator to play metronome click
        const note = context.createOscillator();
        const gainNode = context.createGain();

        note.connect(gainNode);
        gainNode.connect(context.destination);

        note.type = "sine";
        // 1600 for emphasis beat
        note.frequency.setValueAtTime(1000, context.currentTime);

        const attackTime = 0.03;
        const decayTime = 0.1;
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, context.currentTime + attackTime);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attackTime + decayTime);

        note.start(t);
        note.stop(t + 0.01);
    }

    // Duration Stopwatch
    const hoursTens = document.getElementById("hours-tens");
    const hoursOnes = document.getElementById("hours-ones");
    const minsTens = document.getElementById("mins-tens");
    const minsOnes = document.getElementById("mins-ones");
    const secsTens = document.getElementById("secs-tens");
    const secsOnes = document.getElementById("secs-ones");
    
    let numHoursTens = 0;
    let numHoursOnes = 0;
    let numMinsTens = 0;
    let numMinsOnes = 0;
    let numSecsTens = 0;
    let numSecsOnes = 0;
    
    function stopwatch() {
        // Increment seconds
        numSecsOnes += 1;
        
        // Logic for changing hours/mins/secs values as needed
        if (numSecsOnes > 9) {
            numSecsOnes = 0;
            numSecsTens += 1;
        }
        if (numSecsTens > 5) {
            numSecsTens = 0;
            numMinsOnes += 1;
        }
        if (numMinsOnes > 9) {
            numMinsOnes = 0;
            numMinsTens += 1;
        }
        if (numMinsTens > 5) {
            numMinsTens = 0;
            numHoursOnes += 1;
        }
        if (numHoursOnes > 9) {
            numHoursOnes = 0;
            numHoursTens += 1;
        }
        
        hoursTens.textContent = numHoursTens;
        hoursOnes.textContent = numHoursOnes;
        minsTens.textContent = numMinsTens;
        minsOnes.textContent = numMinsOnes;
        secsTens.textContent = numSecsTens;
        secsOnes.textContent = numSecsOnes;
    }
    
    let stopwatchInterval = setInterval(stopwatch, 1000);
            
    // When opening modal //
    const endSessionBtn = document.getElementById("end-session");
    const timePracticedLabel = document.getElementById("time-practiced");
    const title = document.getElementById("title");
    const initTitle = title.textContent;

    endSessionBtn.addEventListener("click", function() {
        // Pause stopwatch when opening modal
        clearInterval(stopwatchInterval);

        // Set time practiced
        let finalNumMinsOnes = numSecsTens === 0 && numSecsOnes === 0 ? numMinsOnes : numMinsOnes + 1;
        timePracticedLabel.textContent = String(numHoursTens) + String(numHoursOnes) + ":" + String(numMinsTens) + String(finalNumMinsOnes);

        title.textContent = initTitle;

        // Autoselect title
        const range = document.createRange();
        range.selectNodeContents(title);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        title.contentEditable = true;
        title.focus();
    });

    // Resume stopwatch if closing modal
    const closeModalBtn = document.getElementById("close-modal");
    const backToPracticingBtn = document.getElementById("back");
    closeModalBtn.addEventListener("click", function() {
        stopwatchInterval = setInterval(stopwatch, 1000);
    });
    backToPracticingBtn.addEventListener("click", function() {
        stopwatchInterval = setInterval(stopwatch, 1000);
    });

    const finalizeBtn = document.getElementById("finalize");
    const sessionTitleInput = document.getElementById("session-title");
    const sessionDurationInput = document.getElementById("session-duration");
    const endTimestampInput = document.getElementById("end-timestamp");

    finalizeBtn.addEventListener("click", function() {
        // Reset goalsId to initial goalsId
        goalsIdInput.value = initGoalsId;

        // Set sessionTitleInput to sessionTitle
        sessionTitleInput.value = title.textContent;
        // Calculate session duration in minutes
        let finalNumMinsOnes = numSecsTens === 0 && numSecsOnes === 0 ? numMinsOnes : numMinsOnes + 1;
        let sessionDurationMins = 60 * 10 * numHoursTens + 60 * numHoursOnes + 10 * numMinsTens + finalNumMinsOnes;
        // Set sessionDurationInput to session duration in mins
        sessionDurationInput.value = sessionDurationMins;
        // Format end timestamp
        let d = new Date();
        d = new Date(d.getTime() - (d.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
        let t = new Date().toLocaleString('en-US', {hour12: false}).split(" ")[1];
        let endTimestampFormatted = d + " " + t;
        // Set endTimestampInput to end timestamp
        endTimestampInput.value = endTimestampFormatted;
    });

});

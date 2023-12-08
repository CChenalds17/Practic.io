document.addEventListener("DOMContentLoaded", function() {
    const MAX_HOURS = 23;
    const MAX_MINS = 60;

    let hours = document.getElementById("hours");
    let mins = document.getElementById("minutes");

    // Mins and Hours input validation & formatting
    mins.addEventListener("input", function(e) {
        if (parseInt(mins.value, 10) === MAX_MINS) {
            if (!hours.value || parseInt(hours.value, 10) < MAX_HOURS) {
                hours.value = parseInt(hours.value, 10) + 1;
                if (hours.value.length < 2) {
                    hours.value = "0" + hours.value;
                }
                mins.value = 0;
            } else {
                mins.value = 59;
            }
        }
        if (mins.value.length === 1) {
            mins.value = "0" + mins.value;
        } else if (mins.value.charAt(0) === "0" && mins.value.length >= 2) {
            mins.value = mins.value.substring(1);
        }
    });
    mins.addEventListener("keypress", function(e) {
        if (mins.value.length >= 2 && mins.value.charAt(0) != "0") {
            e.preventDefault();
        }
    });
    hours.addEventListener("input", function(e) {
        if (hours.value.length === 1) {
            hours.value = "0" + hours.value;
        } else if (hours.value.charAt(0) === "0" && hours.value.length >= 2) {
            hours.value = hours.value.substring(1);
        }
    });
    hours.addEventListener("keypress", function(e) {
        if (hours.value.length >= 2 && hours.value.charAt(0) != "0") {
            e.preventDefault();
        }
    });
});
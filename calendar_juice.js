let startRangeDate = null,
    endRangeDate = null,
    skipRange = false,
    oldDays = 0,
    defaultDays = 1;

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

document.addEventListener("DOMContentLoaded", function () {
    window.picker = new Litepicker({
        element: document.getElementById("date-info"),
        plugins: ["mobilefriendly"],
        lang: "pl-PL",
        format: "DD.MM.YYYY",
        // set locked date: 24*60*60*1000*2
        minDate: new Date().getTime() + 259200000,
        startDate: new Date().getTime() + 259200000,
        endDate: new Date().getTime() + 259200000,
        minDays: defaultDays,
        maxDays: defaultDays,
        selectBackward: false,
        selectForward: true,
        inlineMode: true,
        allowRepick: true,
        autoRefresh: false,
        showTooltip: true,
        singleMode: false,
        disallowLockDaysInRange: false,
        autoApply: true,
        numberOfMonths: 2,
        numberOfColumns: 2,
        mobilefriendly: {
            breakpoint: 480,
            numberOfMonths: 1,
            numberOfColumns: 1,
            singleMode: true,
        },
        tooltipText: {
            one: "dzień",
            few: "dni",
            many: "dni",
            other: "dni",
        },
        lockDaysFilter: (date1, date2, pickedDates) => {
            if (defaultDays == 0) {
                return true;
            } else {
                return lockDaysWithRange(date1, date2, pickedDates);
            }
        },
        setup: (picker) => {
            document.getElementById("days").value = defaultDays;
            picker.on("preselect", (date1, date2) => {
                console.log("preselect");
                const days = parseInt(document.getElementById("days").value);
                if (!date2 && date1 && days != 0) {
                    calculateRangeInfo(date1, date2);
                }
            }),
                picker.on("selected", (date1, date2) => {
                    console.log("selected");
                    calculateRangeInfo(date1, date2);
                });
        },
    });

    document.querySelector("#days").addEventListener("change", function (e) {
        updateDays(e);
    });

    document.querySelector("#reset").addEventListener("click", function (e) {
        resetCalendar(e);
    });
});

function resetCalendar(e) {
    setTimeout(function () {
        startRangeDate = null;
        endRangeDate = null;
        window.picker.clearSelection();
        document.getElementById("date").value = "";
        document.getElementById("days").value = defaultDays;
        document.querySelectorAll('[name="juice"]')[0].checked = true;
        window.picker.setOptions({ minDays: defaultDays, maxDays: defaultDays });
        $(".calories-radio-wrapper .radio-button-juice.w-radio").eq(0).click();
        $(".radio-button-juice.w-radio .w-form-formradioinput").removeClass(
            "w--redirected-checked"
        );
        $(".radio-button-juice.w-radio .w-form-formradioinput")
            .eq(0)
            .addClass("w--redirected-checked");
        // $('input[name="days"]').trigger('input');
    }, 10);
}

function updateDays(e) {
    const days = parseInt(document.getElementById("days").value);

    setTimeout(function () {
        const val = parseInt(e.target.value);
        console.log("val", val);
        if (val > 0) {
            window.picker.setOptions({
                minDays: val,
                maxDays: val,
            });
            if (startRangeDate) {
                calculateRangeInfo(startRangeDate, startRangeDate.dateInstance.addDays(days - 1));
            }
            if (!startRangeDate) {
                window.picker.clearSelection();
            }
        } else {
            window.picker.setOptions({
                minDays: defaultDays,
                maxDays: defaultDays,
            });
        }
    }, 100);
}

/////////////////////////////////////////////////////////////////////

function lockDaysWithRange(date1, date2, pickedDates) {
    if (!date2) {
        const d = date1.getDay(),
            day = date1.getDate(),
            month = date1.getMonth(),
            year = date1.getFullYear();

        // Sprawdzenie, czy data znajduje się w zakresie od 23 grudnia 2023 do 2 stycznia 2024
        const isAfterStart = new Date(year, month, day) >= new Date(2023, 11, 23); // 23 grudnia 2023
        const isBeforeEnd = new Date(year, month, day) <= new Date(2024, 0, 2); // 2 stycznia 2024

        if (isAfterStart && isBeforeEnd) {
            return true;
        }

        return [6, 0].includes(d);
    }

    while (date1.toJSDate() < date2.toJSDate()) {
        const d = date1.getDay(),
            day = date1.getDate(),
            month = date1.getMonth(),
            year = date1.getFullYear();

        const isAfterStart = new Date(year, month, day) >= new Date(2023, 11, 23);
        const isBeforeEnd = new Date(year, month, day) <= new Date(2024, 0, 2);

        if (isAfterStart && isBeforeEnd) {
            return true;
        }

        isWeekend = [6, 0].includes(d);
        if (isWeekend) {
            return true;
        }

        date1.add(1, "day");
    }

    return false;
}

////////////////////////////////////////////////////////////////////
("");
function calculateRangeSelect(date1, date2) {
    console.log("calculateRangeSelect");
    console.log(date1);
    console.log(date2);
    if (date1 && date2) {
        startRangeDate = date1;
        endRangeDate = date2;
        window.picker.clearSelection();
        skipRange = true;
        window.picker.setDateRange(date1, date2, false);
        skipRange = false;
    }
}

function calculateRangeInfo(date1, date2) {
    if (skipRange) {
        return;
    }
    let displayInfo = "";
    let daysCount = 0;
    const days = parseInt(document.getElementById("days").value);

    const date1_day = date1.getDate();
    const date1_month = date1.getMonth();
    const date1_year = date1.getFullYear();
    const date1_dow = date1.getDay();
    console.log(date1_day, date1_month, date1_year, date1_dow);

    if (!date2) {
        date2 = new Date(date1_year, date1_month, date1_day).addDays(days - 1);
    }

    const date2_day = date2.getDate();
    const date2_month = date2.getMonth();
    const date2_year = date2.getFullYear();
    const date2_dow = date2.getDay();
    console.log(date2_day, date2_month, date2_year, date2_dow);

    const startLoopDate = new Date(date1_year, date1_month, date1_day);
    let endLoopDate = new Date(date2_year, date2_month, date2_day);

    for (var d = startLoopDate; d <= endLoopDate; d.setDate(d.getDate() + 1)) {
        let currentDate = new Date(d);
        const currentDate_day = currentDate.getDate();
        const currentDate_month = currentDate.getMonth();
        const currentDate_year = currentDate.getFullYear();
        const currentDate_dow = currentDate.getDay();
        console.log(currentDate_day, currentDate_month, currentDate_year, currentDate_dow);
        if (currentDate_dow == 0 || currentDate_dow == 6) {
            if (days > 0) {
                endLoopDate = endLoopDate.addDays(1);
            }
            continue;
        }
        daysCount++;
    }
    console.log("calculateRangeInfo");
    console.log(date1);
    console.log(endLoopDate);
    calculateRangeSelect(date1, endLoopDate);
    // calculateRangeInfo(startRangeDate, endRangeDate);
    console.log("daysCount: ", daysCount);
    displayInfo = document.getElementById("date-info").value;
    if (!displayInfo) {
        document.getElementById("date").value = displayInfo;
    } else {
        displayInfo += ", days: " + daysCount;
        displayInfo += " (no weekends)";
        document.getElementById("date").value = displayInfo;
    }
}

function setDays(value) {
    document.getElementById("days").value = value;
}

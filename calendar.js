        let startRangeDate = null,
            endRangeDate = null,
            skipRange = false,
            oldDays = 0;

        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }

        document.addEventListener('DOMContentLoaded', function() {
            window.picker = new Litepicker({
            element: document.getElementById('date-info'),
            plugins: ['mobilefriendly'],
            lang: "pl-PL",
            format: "DD.MM.YYYY",
            // set locked date: 24*60*60*1000*2
            minDate: (new Date().getTime() + 259200000),
            startDate: (new Date().getTime() + 259200000),
            endDate: (new Date().getTime() + 259200000),
            selectBackward: false,
            selectForward: true,
            inlineMode: true,
            allowRepick: true,
            autoRefresh: false,
            showTooltip: false,
            singleMode: false,
            disallowLockDaysInRange: false,
            autoApply: true,
            numberOfMonths: 2,
            numberOfColumns: 2,
            mobilefriendly: {
                breakpoint: 480,
                numberOfMonths: 2,
                numberOfColumns: 1,
              },
            tooltipText: {
                "one":"dzień",
                "few":"dni",
                "many":"dni",
                "other":"dni"
            },
            lockDaysFilter: (date1, date2, pickedDates) => {
                return lockDaysWithRange(date1, date2, pickedDates)
            },
            setup: (picker) => {
                // picker.on('before:click', (target) => {
                //     picker.preventClick = true;
                //     // some action
                // }),
                picker.on('preselect', (date1, date2) => {
                    console.log('preselect');
                    // return;
                    const weekends = document.getElementById('weeknds').checked;
                    const days = parseInt(document.getElementById('days').value);
                    if (!date2 && date1 && (days != 0) && !weekends) {
                        // checkRangeIfValid(date1, days);
                        if (!checkRangeIfValid(date1, days) && startRangeDate) {
                            calculateRangeSelect(startRangeDate, endRangeDate);
                            return;
                    //     } else {

                        }
                    }
                    // startRangeDate = date1;
                    // if (date2) {
                    //     endRangeDate = date2;
                    // }
                }),
                picker.on('selected', (date1, date2) => {
                    console.log('selected');
                    // return;
                    // let displayInfo = document.getElementById('index-demo-selection').value;
                    // let daysCount = 0;
                    // const weekends = document.getElementById('weeknds').checked;
                    // console.log(weekends);

                    calculateRangeInfo(date1, date2);
                });
            },
          });

          document.querySelector('#weeknds').addEventListener('change', function() {

            const weekends = document.getElementById('weeknds').checked;
            const days = parseInt(document.getElementById('days').value);

            setTimeout(function() {
                if(document.querySelector("#weeknds").checked) {
                    // weekendy dostepne
                    console.log('weekendy dostępne');

                    // // uaktualni zaznaczenie jesli okreslona liczba dni diety
                    // if ((days > 0) && startRangeDate) {
                    //     console.log('weekendy dostepne - days > 0');
                    //     calculateRangeInfo(startRangeDate, startRangeDate.dateInstance.addDays(days-1));
                    // }

                    // zmien opje kalendarza
                    window.picker.setOptions({
                        lockDaysFilter:(day) => {}
                    });


                } else {
                    // window.picker.clearSelection();

                    // if (!checkRangeIfValid(startRangeDate, days)) {
                        // alert('Nieprawidowa data poniewaz koniec diety przypada w weekend. Wybierz inna date poczatkowa lub liczbe dni diety, lub odblokuj weekendy.');

                        // document.querySelector("#weeknds").checked = true;
                        // return;
                    // }

                    window.picker.setOptions({
                        lockDaysFilter: (date1, date2, pickedDates) => {
                            return lockDaysWithRange(date1, date2, pickedDates)
                        }
                    });
                }
                if ((days > 0) && startRangeDate) {
                    calculateRangeInfo(startRangeDate, startRangeDate.dateInstance.addDays(days-1));
                } else if (startRangeDate && endRangeDate) {
                    calculateRangeInfo(startRangeDate, endRangeDate);
                }
                // window.picker.clearSelection();
                // document.getElementById('index-demo-selection-view').value = '';
            }, 10);
          });

        //   document.querySelector('#days').addEventListener('keyup', function(e) {
        //     updateDays(e);
        //   });
          document.querySelector('#days').addEventListener('change', function(e) {
            updateDays(e);
          });

          document.querySelector('#reset').addEventListener('click', function(e) {
            setTimeout(function() {
                    startRangeDate = null;
                    endRangeDate = null;
                    window.picker.clearSelection();
                    document.getElementById('date').value = '';
                    document.getElementById('weeknds').checked = false;
                    document.getElementById('days').value = 0;
                    window.picker.setOptions({minDays: 1, maxDays: 365});
            }, 10);
          });

        });

        function updateDays(e) {
            setTimeout(function() {
                const val = parseInt(e.target.value);
                console.log('val', val);
                if (val > 0) {
                    const weekends = document.getElementById('weeknds').checked;
                    const days = parseInt(document.getElementById('days').value);
                    // const rangeValid = checkRangeIfValid(startRangeDate, days);
                    // if ((!weekends && startRangeDate && rangeValid) || (weekends && startRangeDate)) {
                    // if ((!weekends && startRangeDate) || (weekends && startRangeDate)) {
                        window.picker.setOptions({
                            minDays: val,
                            maxDays: val,
                        });
                        // calculateRangeSelect(startRangeDate, startRangeDate.dateInstance.addDays(days-1));
                        if (startRangeDate) {
                            calculateRangeInfo(startRangeDate, startRangeDate.dateInstance.addDays(days-1));
                        }
                    // } else {
                    //     window.picker.setOptions({
                    //         minDays: val,
                    //         maxDays: val,
                    //     });
                    //     if (startRangeDate && endRangeDate) {
                    //         // calculateRangeSelect(startRangeDate, endRangeDate);
                    //         calculateRangeInfo(startRangeDate, endRangeDate);
                    //     }
                    // }
                    // if (!rangeValid) {
                    //     document.getElementById('days').value = oldDays;
                    // } else {
                    //     oldDays = val;
                    // }
                    if (!startRangeDate) {
                        window.picker.clearSelection();
                    }
                } else {
                    window.picker.setOptions({
                        minDays: 1,
                        maxDays: 365,
                    });
                }
            }, 10);
        }

        function lockDaysWithRange(date1, date2, pickedDates) {
            if (!date2) {
                const d = date1.getDay();
                return [6, 0].includes(d);
            }

            while (date1.toJSDate() < date2.toJSDate()) {
                const day = date1.getDay();
                isWeekend = [6, 0].includes(day);
                if (isWeekend) { return true; }
                date1.add(1, 'day');
            }

            return false;
        }
""
        function calculateRangeSelect(date1, date2) {
            console.log('calculateRangeSelect');
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
            const weekends = document.getElementById('weeknds').checked;
            const days = parseInt(document.getElementById('days').value);

            const date1_day = date1.getDate();
            const date1_month = date1.getMonth();
            const date1_year = date1.getFullYear();
            const date1_dow = date1.getDay();
            console.log(date1_day, date1_month, date1_year, date1_dow);

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
                if (!weekends && (currentDate_dow == 0 || currentDate_dow == 6)) {
                    if (days > 0) {
                        endLoopDate = endLoopDate.addDays(1);
                    }
                    continue;
                }
                daysCount++;
            }
            console.log('calculateRangeInfo');
            console.log(date1);
            console.log(endLoopDate);
            calculateRangeSelect(date1, endLoopDate);
            // calculateRangeInfo(startRangeDate, endRangeDate);
            console.log('daysCount: ', daysCount);
            displayInfo = document.getElementById('date-info').value;
            displayInfo += ', Liczba Dni: '+daysCount;
            if (weekends) {
                displayInfo += ' (z weekendami)';
            } else {
                displayInfo += ' (bez weekendów)';
            }
            document.getElementById('date').value = displayInfo;
        }

        function checkRangeIfValid(date1, days) {

            if (!date1) {
                return true;
            }

            const weekends = document.getElementById('weeknds').checked;
            if (weekends) {
                return true;
            }

            console.log(days);
            const date1_day = date1.getDate();
            const date1_month = date1.getMonth();
            const date1_year = date1.getFullYear();
            const date1_dow = date1.getDay();
            // console.log(date1_day, date1_month, date1_year, date1_dow);

            let date2 = date1;
            date2 = date2.dateInstance.addDays(days);
            console.log(date2);
            const date2_day = date2.getDate();
            const date2_month = date2.getMonth();
            const date2_year = date2.getFullYear();
            const date2_dow = date2.getDay();
            console.log(date2_day, date2_month, date2_year, date2_dow);

            const startLoopDate = new Date(date1_year, date1_month, date1_day);
            const endLoopDate = new Date(date2_year, date2_month, date2_day);

            let currentDate,
                currentDate_day,
                currentDate_month,
                currentDate_year,
                currentDate_dow;

            for (var d = startLoopDate; d < endLoopDate; d.setDate(d.getDate() + 1)) {
                currentDate = new Date(d);
                currentDate_day = currentDate.getDate();
                currentDate_month = currentDate.getMonth();
                currentDate_year = currentDate.getFullYear();
                currentDate_dow = currentDate.getDay();
            }
            console.log(currentDate_day, currentDate_month, currentDate_year, currentDate_dow);
            if (currentDate_dow == 0 || currentDate_dow == 6) {
                alert('Nieprawidłowa data ponieważ koniec diety przypada w weekend. Wybierz inną datę początkową lub liczbę dni diety, lub odblokuj weekendy.');
                // window.picker.clearSelection();
                return false;
            }
            return true;
        }
const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function ParseTime(time) {
    let [timeStarted, identifier] = time.split(" ");
    let [hours, min, sec] = timeStarted.split(":").map(Number);
    if (hours === 12) {
        hours = 0;
    }
    if (identifier === "pm") {
        hours += 12;
    }

    return [hours, min, sec, identifier];

}
function ParseDuration(time) {
    let [hour, min, sec] = time.split(":").map(Number);
    return [hour, min, sec];

}

function convertToSec(hour, min, sec) {
    return hour * 3600 + min * 60 + sec;

}

function ParseToString(duration) {
    d_hours = Math.floor(duration / 3600);
    rest = duration % 3600;
    d_minutes = Math.floor(rest / 60);
    d_sec = rest % 60;

    return d_hours + ":" + String(d_minutes).padStart(2, '0') + ":" + String(d_sec).padStart(2, '0');

}
function parseDate(date) {
    let [year, month, day] = date.split("-").map(Number);
    return [year, month, day];
}
function isEid(month, day) {
    if (month === 4) {
        if (day >= 10 && day <= 30)
            return true;
    }
    return false;
}


function getShiftDuration(startTime, endTime) {

    // TODO: Implement this function

    //calling helper function parseTime
    let [hours1, min1, sec1, identifier1] = ParseTime(startTime);
    let [hours2, min2, sec2, identifier2] = ParseTime(endTime);


    //case if employee started on a day and finished on the next day
    if (hours2 < hours1) {
        hours2 += 24;
    }
    let time1Sec = convertToSec(hours1, min1, sec1);
    let time2Sec = convertToSec(hours2, min2, sec2);

    duration = time2Sec - time1Sec;

    let timeAsString = ParseToString(duration);
    return timeAsString;
}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
    let shiftStart = "8:00:00 am";
    let shiftEnd = "10:00:00 pm"
    let [hours1, min1, sec1, identifier1] = ParseTime(startTime);
    let [hours2, min2, sec2, identifier2] = ParseTime(endTime);
    let [hour8, min8, sec8, identifier8] = ParseTime(shiftStart);
    let [hour10, min10, sec10, identifier10] = ParseTime(shiftEnd);

    let startTimeSec = convertToSec(hours1, min1, sec1);
    let endTimeSec = convertToSec(hours2, min2, sec2);
    let eightAmSec = convertToSec(hour8, min8, sec8);
    let tenPmSec = convertToSec(hour10, min10, sec10);
    let idleSec = 0;

    if (endTimeSec < startTimeSec) {
        endTimeSec += 24 * 3600;
    }
    if (startTimeSec < eightAmSec && endTimeSec < eightAmSec) {
        idleSec += endTimeSec - startTimeSec;
        return ParseToString(idleSec);
    }
    if (startTimeSec > tenPmSec && endTimeSec > tenPmSec) {
        idleSec += endTimeSec - startTimeSec;
        return ParseToString(idleSec);
    }

    if (startTimeSec < eightAmSec) {
        diffrence = eightAmSec - startTimeSec;
        idleSec += diffrence;

    }
    if (endTimeSec > tenPmSec) {
        diffrence = endTimeSec - tenPmSec;
        idleSec += diffrence;
    }
    finalIdleTime = ParseToString(idleSec);

    return finalIdleTime;







    // TODO: Implement this function
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    let [h1, m1, s1] = ParseDuration(shiftDuration);
    let [h2, m2, s2] = ParseDuration(idleTime);

    shiftInSec = convertToSec(h1, m1, s1);
    idelInSec = convertToSec(h2, m2, s2);

    diffrence = shiftInSec - idelInSec;

    return ParseToString(diffrence);


    // TODO: Implement this function
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    let [year, month, day] = parseDate(date);
    let [hour, min, sec] = ParseDuration(activeTime);
    let workedSec = convertToSec(hour, min, sec);
    let quotaInSec = convertToSec(8, 24, 0)
    let eidQuotaInSec = convertToSec(6, 0, 0)
    if (isEid(month, day)) {
        if (workedSec < eidQuotaInSec) {
            return false;
        }
    } else {
        if (workedSec < quotaInSec) {
            return false;
        }
    }
    return true;


    // TODO: Implement this function
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function objTorow(obj) {
    const valuesArray = Object.values(obj);
    const commaSeparatedString = valuesArray.join(',');
    const finalRow = commaSeparatedString + '\n';
    return finalRow;
}
function addShiftRecord(textFile, shiftObj) {
    startTime = shiftObj.startTime;
    endTime = shiftObj.endTime;
    date = shiftObj.date;
    shiftObj.shiftDuration = getShiftDuration(startTime, endTime);
    shiftObj.idleTime = getIdleTime(startTime, endTime);
    shiftObj.activeTime = getActiveTime(shiftObj.shiftDuration, shiftObj.idleTime);
    shiftObj.metQuota = metQuota(date, shiftObj.activeTime)
    shiftObj.hasBonus = false;

    let data = fs.readFileSync('shifts.txt', 'utf8')
    lines = data.trim().split('\n');
    let headers = lines[0].split(',');
    let objs = lines.slice(1).map(line => {
        let values = line.split(',')
        let obj = {};
        for (let i = 0; i < values.length; i++) {
            let key = headers[i];
            let value = values[i];
            obj[key] = value;
        }
        return obj;
    })
   //console.log(objs);

    for (let i = 0; i < objs.length; i++) {
        if (objs[i].DriverID === shiftObj.driverID && objs[i].Date === shiftObj.date) {
            return {};
        }
    }
    let lastIndex = -1;
    
    for (let i = 0; i < objs.length; i++) {
        
        if (objs[i].DriverID === shiftObj.driverID) {
            lastIndex = i;
        }
    } 
     console.log(lastIndex)

    if (lastIndex !== -1) {

        objs.splice(lastIndex + 1, 0, shiftObj);
    } else {
        objs.push(shiftObj);
    }

    let fileContent = headers.join(',') + '\n';

    for (let i = 0; i < objs.length; i++) {
        fileContent += objTorow(objs[i]);
    }

    fs.writeFileSync('shifts.txt', fileContent, 'utf8');
    return shiftObj;

    // TODO: Implement this function
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};



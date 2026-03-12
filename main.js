const fs = require("fs");


//Helper functions
function convertTimeToSec(givenTime){
    let[timePart,APM]=givenTime.split(" ");
    let timeArr=timePart.split(":");
    let hours=Number(timeArr[0]);
    let minutes=Number(timeArr[1]);
    let seconds=Number(timeArr[2]);
    if(APM==="am" && hours===12){
        hours=0;
    }else if(APM==="pm" && hours!==12){
        hours+=12;
    }

    return hours*3600 + minutes*60 + seconds;
}
function convertSecondsToTime(timeInSeconds){
    let hours=parseInt(timeInSeconds/3600);
    timeInSeconds=timeInSeconds-(hours*3600);
    let minutes=parseInt(timeInSeconds/60);
    let seconds=timeInSeconds-(minutes*60);
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    
    return hours + ":" + formattedMinutes + ":" + formattedSeconds;
}
function convertTimeToSeconds(time){
    let timeArr=time.split(":"); 
    let hours=Number(timeArr[0]); 
    let minutes=Number(timeArr[1]); 
    let seconds=Number(timeArr[2]); 
    return hours*3600 + minutes*60 + seconds;
}
function getDayOff(rateFile, driverID) {
    let content = fs.readFileSync(rateFile, "utf8").trim();
    let lines=content.split("\n");

    for (let i = 0; i < lines.length; i++) {
        let parts = lines[i].split(",");
        if (parts[0] === driverID) {
            return parts[1]; 
        }
    }
    return null;
}

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
    let start=convertTimeToSec(startTime);
    let end=convertTimeToSec(endTime);

    let duration=end-start;
    if(duration<0){
        duration=(3600*24)-start+end;
    }
    return convertSecondsToTime(duration);
}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
    // TODO: Implement this function
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    // TODO: Implement this function
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
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
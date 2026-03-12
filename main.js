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
    let start=convertTimeToSec(startTime);
    let end=convertTimeToSec(endTime);
    const deliveryStartTime=convertTimeToSec("08:00:00 am");
    const deliveryEndTime=convertTimeToSec("10:00:00 pm");
    let idleTime=0;
    
    if(start<deliveryStartTime){
        idleTime+=deliveryStartTime-start;
    }
    if(end>deliveryEndTime){
        idleTime+=end-deliveryEndTime;
    }
    return convertSecondsToTime(idleTime);
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    let start=convertTimeToSec(startTime);
    let end=convertTimeToSec(endTime);
    const deliveryStartTime=convertTimeToSec("08:00:00 am");
    const deliveryEndTime=convertTimeToSec("10:00:00 pm");
    let idleTime=0;
    
    if(start<deliveryStartTime){
        idleTime+=deliveryStartTime-start;
    }
    if(end>deliveryEndTime){
        idleTime+=end-deliveryEndTime;
    }
    return convertSecondsToTime(idleTime);
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    let dailyQuota=0;
    if(date>="2025-04-10" && date<="2025-04-30"){
        dailyQuota=convertTimeToSeconds("06:00:00");
    }else{
        dailyQuota=convertTimeToSeconds("08:24:00");
    }
    let active=convertTimeToSeconds(activeTime);
    if(active<dailyQuota){
        return false;
    }else{
        return true;
    }
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    let content = fs.readFileSync(textFile, "utf8").trim();
    let lines =content.split("\n");
    let header = lines[0];
    let dataLines = lines.slice(1);
    
    for(let i=0;i<dataLines.length;i++){
        let parts=dataLines[i].split(",");
        if(parts[0]===shiftObj.driverID && parts[2]===shiftObj.date){
            return {};
        }
    }
    
    let shiftDuration=getShiftDuration(shiftObj.startTime,shiftObj.endTime);
    let idleTime=getIdleTime(shiftObj.startTime,shiftObj.endTime);
    let activeTime=getActiveTime(shiftDuration,idleTime);
    let quotaMet=metQuota(shiftObj.date,activeTime);
    
    let newRecord = {
    driverID: shiftObj.driverID,
    driverName: shiftObj.driverName,
    date: shiftObj.date,
    startTime: shiftObj.startTime,
    endTime: shiftObj.endTime,
    shiftDuration: shiftDuration,
    idleTime: idleTime,
    activeTime: activeTime,
    quotaMet: quotaMet,//the variable name metQuota collides with the function name so I changed it to quotaMet
    hasBonus: false
    };
    let newLine = [
        newRecord.driverID,
        newRecord.driverName,
        newRecord.date,
        newRecord.startTime,
        newRecord.endTime,
        newRecord.shiftDuration,
        newRecord.idleTime,
        newRecord.activeTime,
        newRecord.metQuota,
        newRecord.hasBonus
    ].join(",");
    let insertIndex = dataLines.length;

    for (let i = 0; i < dataLines.length; i++) {
        let currentID = dataLines[i].split(",")[0];

        if (currentID === shiftObj.driverID) {
            insertIndex = i + 1;
        }
    }
    dataLines.splice(insertIndex, 0, newLine);

    let finalLines = [header, ...dataLines];
    fs.writeFileSync(textFile, finalLines.join("\n"));

    return newRecord;

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
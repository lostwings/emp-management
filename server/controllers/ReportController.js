const Timesheet = require('../models/Timesheet');
const LeaveRequest = require('../models/LeaveRequest');
const HasProject = require('../models/HasProject');
const Project = require('../models/Project');
const EmployeeInfo = require('../models/EmployeeInfo');
const Holiday = require('../models/Holiday');
const Excel = require('exceljs');
const moment = require('moment');

const getProjectDetail = excelType => new Promise(async (resolve, reject) => {
  try {
    const project = await HasProject.findByProjectIdAndUserId(excelType.projectId, excelType.userId);
    project.detail = await Project.findById(excelType.projectId);
    project.user = await EmployeeInfo.findById(excelType.userId);
    project.timesheet = await Timesheet.findTimesheetInProject(excelType.year, excelType.month, excelType.projectId, excelType.userId);
    project.leave = await LeaveRequest.findByYearAndMonth(excelType.year, excelType.month, excelType.userId);
    project.holiday = await Holiday.findByYearAndMonth(excelType.year, excelType.month);
    resolve(project);
  }
  catch (error) {
    reject(error);
  }
});

const fillRow = (worksheet, day) => {
  const column = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  for (let i = 0; i < column.length; i += 1) {
    const cell = worksheet.getCell(`${column[i]}${day + 7}`);
    cell.style = Object.create(cell.style);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'B8CCE4' }
    };
  }
};

const fillBorderAllRow = (worksheet, row) => {
  const column = ['B', 'C', 'D', 'F', 'I', 'L', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
  for (let i = 0; i < column.length; i += 1) {
    worksheet.getCell(`${column[i]}${row}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
};

const calHolidayWorkHour = (timeIn, timeOut) => new Promise((resolve, reject) => {
  try {
    switch (timeIn) {
      case '12:30':
        timeIn = '13:00';
        break;
      case '18:30':
        timeIn = '19:00';
        break;
      default:
        break;
    }
    switch (timeOut) {
      case '12:30':
        timeOut = '12:00';
        break;
      case '18:30':
        timeOut = '18:00';
        break;
      default:
        break;
    }
    const totalhours = {};
    let startTime = moment.duration(timeIn, 'HH:mm');
    let endTime = moment.duration(timeOut, 'HH:mm');
    const timeInHour = moment(timeIn, 'HH:mm').hour();
    const timeOutHour = moment(timeOut, 'HH:mm').hour();
    if (timeOutHour >= 19) {
      endTime = moment.duration('18:00', 'HH:mm');
      if (timeInHour <= 12) {
        const diff1 = endTime.subtract(startTime);
        const hour1 = diff1.hours() - 1;
        const min1 = diff1.minutes() / 60;
        totalhours.holidayWork = hour1 + min1;
        startTime = moment.duration('19:00', 'HH:mm');
        endTime = moment.duration(timeOut, 'HH:mm');
        const diff2 = endTime.subtract(startTime);
        const min2 = diff2.minutes() / 60;
        totalhours.holidayNonWork = diff2.hours() + min2;
      }
      else if (timeInHour >= 13 && timeInHour < 19) {
        const diff1 = endTime.subtract(startTime);
        const min1 = diff1.minutes() / 60;
        totalhours.holidayWork = diff1.hour() + min1;
        startTime = moment.duration('19:00', 'HH:mm');
        endTime = moment.duration(timeOut, 'HH:mm');
        const diff2 = endTime.subtract(startTime);
        const min2 = diff2.minutes() / 60;
        totalhours.holidayNonWork = diff2.hours() + min2;
      }
      else if (timeInHour >= 19) {
        endTime = moment.duration(timeOut, 'HH:mm');
        const diff = endTime.subtract(startTime);
        const min = diff.minutes() / 60;
        totalhours.holidayNonWork = diff.hours() + min;
      }
    }
    else if (timeOutHour <= 18) {
      const diff = endTime.subtract(startTime);
      const min = (diff.minutes() / 60);
      if (timeInHour <= 12 && timeOutHour <= 12) {
        totalhours.holidayWork = diff.hours() + min;
      }
      else if (timeInHour <= 12 && timeOutHour <= 18) {
        const hour = diff.hours() - 1;
        totalhours.holidayWork = hour + min;
      }
      else if (timeInHour >= 13 && timeOutHour <= 18) {
        totalhours.holidayWork = diff.hours() + min;
      }
    }
    resolve(totalhours);
  }
  catch (error) {
    reject(error);
  }
});

const writeSpecialTimesheet = (excelType, holidayDates, worksheet) => new Promise((resolve, reject) => {
  try {
    if (excelType.reportType === 'Timesheet (Special)') {
      for (let i = 0; i < holidayDates.length; i += 1) {
        if (worksheet.getCell(`D${holidayDates[i] + 7}`).value && worksheet.getCell(`E${holidayDates[i] + 7}`).value) {
          calHolidayWorkHour(worksheet.getCell(`D${holidayDates[i] + 7}`).value, worksheet.getCell(`E${holidayDates[i] + 7}`).value)
            .then((holidayWorkHour) => {
              console.log(holidayWorkHour);
              worksheet.getCell(`H${holidayDates[i] + 7}`).value = holidayWorkHour.holidayWork;
              worksheet.getCell(`I${holidayDates[i] + 7}`).value = holidayWorkHour.holidayNonWork;
            });
        }
      }
      resolve(worksheet);
    }
    else if (excelType.reportType === 'Timesheet (Normal)') {
      resolve(worksheet);
    }
  }
  catch (error) {
    reject(error);
  }
});

exports.createReport = (req, res, next) => {
  const { excelType } = req.body;
  if (excelType.reportType === 'Timesheet (Normal)' || excelType.reportType === 'Timesheet (Special)') {
    const filename = 'server/storage/private/report/Playtorium_Timesheet.xlsx';
    getProjectDetail(excelType)
      .then((project) => {
        const { holiday } = project;
        const { timesheet } = project;
        const { leave } = project;
        const holidayDates = [];
        const workbook = new Excel.Workbook();
        workbook.xlsx.readFile(filename)
          .then(() => {
            const worksheet = workbook.getWorksheet('Timesheet');
            const yearMonth = `${excelType.year}-${excelType.month}`;
            const numberOfDayInMonth = moment(yearMonth, 'YYYY-MM').daysInMonth();
            const logo = workbook.addImage({
              filename: 'server/storage/private/logo/playtorium.png',
              extension: 'png'
            });
            // write report header
            if (excelType.reportType === 'Timesheet (Normal)') {
              worksheet.getCell('C1').value = 'TIMESHEET';
            }
            else if (excelType.reportType === 'Timesheet (Special)') {
              worksheet.getCell('C1').value = 'TIMESHEET S';
            }
            worksheet.addImage(logo, 'A1:B1');
            worksheet.getCell('B2').value = `${project.user.firstName} ${project.user.lastName}`;
            worksheet.getCell('E2').value = excelType.userId;
            worksheet.getCell('B3').value = project.role;
            worksheet.getCell('E3').value = `1 - ${numberOfDayInMonth} ${moment(excelType.month, 'MM').format('MMMM')} ${excelType.year}`;
            worksheet.getCell('C4').value = project.detail.customer;
            // write day and Saturday, Sunday in report timesheet
            for (let day = 1; day <= numberOfDayInMonth; day += 1) {
              const date = `${yearMonth}-${day}`;
              worksheet.getCell(`A${day + 7}`).value = date;
              if (moment(date, 'YYYY-MM-DD').isoWeekday() === 6 || moment(date, 'YYYY-MM-DD').isoWeekday() === 7) {
                holidayDates.push(day);
                worksheet.getCell(`B${day + 7}`).value = 'Holiday';
                fillRow(worksheet, day);
              }
            }
            // write holiday in Timesheet report
            for (let i = 0; i < holiday.length; i += 1) {
              const { date } = holiday[i];
              const day = parseInt(moment(date).format('DD'), 10);
              holidayDates.push(day);
              fillRow(worksheet, day);
              worksheet.getCell(`C${day + 7}`).value = holiday[i].dateName;
              worksheet.getCell(`B${day + 7}`).value = 'Holiday';
            }
            // write Leave in Timesheet
            for (let j = 0; j < leave.length; j += 1) {
              const { leaveDate } = leave[j];
              const day = parseInt(moment(leaveDate).format('DD'), 10);
              fillRow(worksheet, day);
              worksheet.getCell(`B${day + 7}`).value = 'Leave';
              worksheet.getCell(`C${day + 7}`).value = leave[j].leaveType;
            }
            // write Timesheet
            for (let k = 0; k < timesheet.length; k += 1) {
              const { date } = timesheet[k];
              const day = parseInt(moment(date).format('DD'), 10);
              worksheet.getCell(`B${day + 7}`).value = timesheet[k].task;
              worksheet.getCell(`C${day + 7}`).value = timesheet[k].description;
              worksheet.getCell(`D${day + 7}`).value = timesheet[k].timeIn;
              worksheet.getCell(`E${day + 7}`).value = timesheet[k].timeOut;
              worksheet.getCell(`F${day + 7}`).value = timesheet[k].totalhours;
            }

            // for timesheet special
            writeSpecialTimesheet(excelType, holidayDates, worksheet)
              .then(() => {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename="Timesheet_${excelType.year}_${excelType.month}_${excelType.projectId}.xlsx`);
                workbook.xlsx.write(res);
              })
              .catch(next);
          })
          .catch(next);
      })
      .catch(next);
  }
  else if (excelType.reportType === 'Summary Timesheet') {
    const filename = 'server/storage/private/report/Playtorium_Summary_Timesheet.xlsx';
    const workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
      .then(() => {
        const worksheet = workbook.getWorksheet('Timesheet');
        // Fill each month in year
        const months = moment.monthsShort();
        const monthColumn = ['F', 'I', 'L', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
        for (let i = 0; i < months.length; i += 1) {
          worksheet.getCell(`${monthColumn[i]}3`).value = `${months[i]}-${moment(excelType.year, 'YYYY').format('YY')}`;
        }
        // Fill Each user timesheet
        Timesheet.findSummaryTimesheet(excelType.year)
          .then((timesheets) => {
            console.log(timesheets);
            let user = '';
            let project = '';
            let row = 3;
            timesheets.forEach((timesheet) => {
              if (timesheet.id === user && timesheet.projectId === project) {
                worksheet.getCell(`${monthColumn[timesheet.month - 1]}${row}`).value = timesheet.hours;
              }
              else if (timesheet.id === user && timesheet.projectId !== project) {
                row += 1;
                fillBorderAllRow(worksheet, row);
                worksheet.getCell(`D${row}`).value = timesheet.projectId;
                worksheet.getCell(`${monthColumn[timesheet.month - 1]}${row}`).value = timesheet.hours;
                project = timesheet.projectId;
              }
              else if (timesheet.id !== user) {
                row += 1;
                fillBorderAllRow(worksheet, row);
                worksheet.getCell(`B${row}`).value = timesheet.id;
                worksheet.getCell(`C${row}`).value = timesheet.name;
                row += 1;
                fillBorderAllRow(worksheet, row);
                worksheet.getCell(`D${row}`).value = timesheet.projectId;
                worksheet.getCell(`${monthColumn[timesheet.month - 1]}${row}`).value = timesheet.hours;
                user = timesheet.id;
                project = timesheet.projectId;
              }
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="Timesheet_Summary_${excelType.year}.xlsx`);
            workbook.xlsx.write(res);
          })
          .catch(next);
      })
      .catch(next);
  }
};
// const workbook = new Excel.Workbook();
// workbook.xlsx.readFile('server/storage/report/excel.xlsx')
//   .then(() => {
//     const worksheet = workbook.getWorksheet('Sheet1');
//     worksheet.getCell('A1').value = '12345';
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     workbook.xlsx.write(res);
//   })
//   .catch(next);

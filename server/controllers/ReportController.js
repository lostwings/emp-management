const Timesheet = require('../models/Timesheet');
const LeaveRequest = require('../models/LeaveRequest');
const HasProject = require('../models/HasProject');
const Project = require('../models/Project');
const EmployeeInfo = require('../models/EmployeeInfo');
const Holiday = require('../models/Holiday');const User = require('../models/User');const Excel = require('exceljs');
const moment = require('moment');

const getProjectDetail = excelType => new Promise(async (resolve, reject) => {
  try {
    const project = await HasProject.findByProjectIdAndUserId(excelType.projectId, excelType.userId);
    project.detail = await Project.findById(excelType.projectId);    project.user = await EmployeeInfo.findById(excelType.userId);    project.user = await EmployeeInfo.findAllByUserId(excelType.userId);    project.timesheet = await Timesheet.findTimesheetInProject(excelType.year, excelType.month, excelType.projectId, excelType.userId);
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
  const column = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
  for (let i = 0; i < column.length; i += 1) {
    worksheet.getCell(`${column[i]}${row}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
};

exports.createReport = (req, res, next) => {
  const { excelType } = req.body;
  if (excelType.reportType === 'Timesheet (Normal)' || excelType.reportType === 'Timesheet (Special)') {
    let filename = '';
    if (excelType.reportType === 'Timesheet (Normal)') {
      filename = 'server/storage/private/report/Playtorium_Timesheet_Normal_ver4.xlsx';
    }
    else {
      filename = 'server/storage/private/report/Playtorium_Timesheet_Sepecial_ver4.xlsx';
    }
    getProjectDetail(excelType)
      .then((project) => {
        const { holiday } = project;
        const { timesheet } = project;
        console.log(project);
        const { leave } = project;
        const workbook = new Excel.Workbook();
        workbook.xlsx.readFile(filename)
          .then(() => {
            const worksheet = workbook.getWorksheet('Timesheet');
            const yearMonth = `${excelType.year}-${excelType.month}`;
            const numberOfDayInMonth = moment(yearMonth, 'YYYY-MM').daysInMonth();
            // write report header
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
                worksheet.getCell(`B${day + 7}`).value = 'Holiday';
                fillRow(worksheet, day);
              }
            }
            // write holiday in Timesheet report
            for (let i = 0; i < holiday.length; i += 1) {
              const { date } = holiday[i];
              const day = parseInt(moment(date).format('DD'), 10);
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
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="Timesheet_${excelType.year}_${excelType.month}_${excelType.projectId}.xlsx`);
            workbook.xlsx.write(res);
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
const fillBorderFixColumn = (worksheet, row, column) => {
  for (let i = 0; i < column.length; i += 1) {
    worksheet.getCell(`${column[i]}${row}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
};

const calOT = (timeIn, timeOut) => new Promise((resolve, reject) => {
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

const writeSpecialTimesheet = (excelType, holidayDates, worksheet, numberOfDayInMonth) => new Promise((resolve, reject) => {
  try {
    if (excelType.reportType === 'Timesheet (Special)') {
      for (let day = 1; day <= numberOfDayInMonth; day += 1) {
        if (worksheet.getCell(`D${day + 7}`).value && worksheet.getCell(`E${day + 7}`).value) {
          calOT(worksheet.getCell(`D${day + 7}`).value, worksheet.getCell(`E${day + 7}`).value)
            .then((holidayWorkHour) => {
              if (holidayDates.includes(day)) {
                worksheet.getCell(`H${day + 7}`).value = holidayWorkHour.holidayWork;
                worksheet.getCell(`I${day + 7}`).value = holidayWorkHour.holidayNonWork;
              }
              else {
                worksheet.getCell(`F${day + 7}`).value = holidayWorkHour.holidayWork;
                if (holidayWorkHour.holidayNonWork !== 0) {
                  worksheet.getCell(`G${day + 7}`).value = holidayWorkHour.holidayNonWork;
                }
              }
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

const calSumEachColumn = worksheet => new Promise((resolve, reject) => {
  try {
    worksheet.getCell('F39').value = {
      formula: 'SUM(F8:F38)',
      result: undefined
    };
    worksheet.getCell('G39').value = {
      formula: 'SUM(G8:G38)',
      result: undefined
    };
    worksheet.getCell('H39').value = {
      formula: 'SUM(H8:H38)',
      result: undefined
    };
    worksheet.getCell('I39').value = {
      formula: 'SUM(I8:I38)',
      result: undefined
    };
    worksheet.getCell('F40').value = {
      formula: 'SUM(G39:I39)',
      result: undefined
    };
    worksheet.getCell('F41').value = {
      formula: 'F39/8',
      result: undefined
    };
    resolve(worksheet);
  }
  catch (error) {
    reject(error);
  }
});

const writeSummary = (worksheet, row, monthColumn) => new Promise((resolve, reject) => {
  try {
    row += 1;
    worksheet.mergeCells(`B${row}:D${row}`);
    worksheet.getCell(`B${row}`).alignment = { horizontal: 'center' };
    worksheet.getCell(`B${row}`).value = 'summary';
    for (let i = 0; i < monthColumn.length; i += 1) {
      const sum = `SUM(${monthColumn[i]}4:${monthColumn[i]}${row - 2})`;
      worksheet.getCell(`${monthColumn[i]}${row}`).value = {
        formula: sum,
        result: undefined
      };
    }
    fillBorderAllRow(worksheet, row);
    resolve(row);
  }
  catch (error) {
    reject(error);
  }
});

const writeAllProject = (workbook, year) => new Promise(async (resolve, reject) => {
  try {
    const projects = await Project.findByYear(year);
    const worksheet = workbook.getWorksheet('Project');
    let row = 3;
    const column = ['B', 'C', 'D', 'E', 'F'];
    for (let i = 0; i < projects.length; i += 1) {
      worksheet.getCell(`B${row}`).value = projects[i].id;
      worksheet.getCell(`C${row}`).value = projects[i].customer;
      worksheet.getCell(`D${row}`).value = projects[i].quotationId;
      worksheet.getCell(`E${row}`).value = projects[i].purchasedOrder;
      worksheet.getCell(`F${row}`).value = projects[i].description;
      fillBorderFixColumn(worksheet, row, column);
      row += 1;
    }
    resolve(workbook);
  }
  catch (error) {
    reject(error);
  }
});

const writeAllLeave = (worksheet, leaveRequests, monthColumn, rowColumn) => new Promise((resolve, reject) => {
  try {
    let row = 5;
    let userId = '';
    for (let i = 0; i < leaveRequests.length; i += 1) {
      leaveRequests[i].days = Math.floor(leaveRequests[i].days * 100) / 100;
      if (leaveRequests[i].id === userId) {
        if (leaveRequests[i].leaveType === 'Sick Leave') {
          worksheet.getCell(`${monthColumn[(leaveRequests[i].month - 1) * 4]}${row}`).value = leaveRequests[i].days;
        }
        else if (leaveRequests[i].leaveType === 'Personal Leave') {
          worksheet.getCell(`${monthColumn[((leaveRequests[i].month - 1) * 4) + 1]}${row}`).value = leaveRequests[i].days;
        }
        else if (leaveRequests[i].leaveType === 'Annual Leave') {
          worksheet.getCell(`${monthColumn[((leaveRequests[i].month - 1) * 4) + 2]}${row}`).value = leaveRequests[i].days;
        }
        else if (leaveRequests[i].leaveType === 'Ordination Leave') {
          worksheet.getCell(`${monthColumn[((leaveRequests[i].month - 1) * 4) + 3]}${row}`).value = leaveRequests[i].days;
        }
      }
      else if (leaveRequests[i].id !== userId) {
        row += 1;
        worksheet.getCell(`B${row}`).value = leaveRequests[i].id;
        worksheet.getCell(`C${row}`).value = leaveRequests[i].name;
        worksheet.getCell(`D${row}`).value = leaveRequests[i].nickName;
        worksheet.getCell(`E${row}`).value = leaveRequests[i].mobileNumber;
        worksheet.getCell(`F${row}`).value = leaveRequests[i].startDate;
        fillBorderFixColumn(worksheet, row, rowColumn);
        userId = leaveRequests[i].id;
        if (leaveRequests[i].leaveType === 'Sick Leave') {
          worksheet.getCell(`${monthColumn[(leaveRequests[i].month - 1) * 4]}${row}`).value = leaveRequests[i].days;
        }
        else if (leaveRequests[i].leaveType === 'Personal Leave') {
          worksheet.getCell(`${monthColumn[((leaveRequests[i].month - 1) * 4) + 1]}${row}`).value = leaveRequests[i].days;
        }
        else if (leaveRequests[i].leaveType === 'Annual Leave') {
          worksheet.getCell(`${monthColumn[((leaveRequests[i].month - 1) * 4) + 2]}${row}`).value = leaveRequests[i].days;
        }
        else if (leaveRequests[i].leaveType === 'Ordination Leave') {
          worksheet.getCell(`${monthColumn[((leaveRequests[i].month - 1) * 4) + 3]}${row}`).value = leaveRequests[i].days;
        }
      }
    }
    resolve(row);
  }
  catch (error) {
    reject(error);
  }
});

const writeTimesheet = (worksheet, timesheet) => new Promise((resolve, reject) => {
  try {
    for (let k = 0; k < timesheet.length; k += 1) {
      const { date } = timesheet[k];
      const day = parseInt(moment(date).format('DD'), 10);
      worksheet.getCell(`B${day + 7}`).value = timesheet[k].task;
      worksheet.getCell(`C${day + 7}`).value = timesheet[k].description;
      worksheet.getCell(`D${day + 7}`).value = moment(timesheet[k].timeIn, 'HH:mm:ss').format('HH:mm');
      worksheet.getCell(`E${day + 7}`).value = moment(timesheet[k].timeOut, 'HH:mm:ss').format('HH:mm');
      worksheet.getCell(`F${day + 7}`).value = timesheet[k].totalhours;
    }
    resolve(worksheet);
  }
  catch (error) {
    reject(error);
  }
});

const calTotalLeave = (worksheet, row) => new Promise((resolve, reject) => {
  try {
    for (let i = 6; i <= row; i += 1) {
      worksheet.getCell(`G${i}`).value = {
        formula: `SUM(K${i},O${i},S${i},W${i},AA${i},AE${i},AI${i},AM${i},AQ${i},AU${i},AY${i},BC${i})`,
        result: undefined
      };
      worksheet.getCell(`H${i}`).value = {
        formula: `SUM(L${i},P${i},T${i},X${i},AB${i},AF${i},AJ${i},AN${i},AR${i},AV${i},AZ${i},BD${i})`,
        result: undefined
      };
      worksheet.getCell(`I${i}`).value = {
        formula: `SUM(M${i},Q${i},U${i},Y${i},AC${i},AG${i},AK${i},AO${i},AS${i},AW${i},BA${i},BE${i})`,
        result: undefined
      };
      worksheet.getCell(`J${i}`).value = {
        formula: `SUM(N${i},R${i},V${i},Z${i},AD${i},AH${i},AL${i},AP${i},AT${i},AX${i},BB${i},BF${i})`,
        result: undefined
      };
    }
    resolve(worksheet);
  }
  catch (error) {
    reject(error);
  }
});

const writeHoliday = (workbook, excelType) => new Promise(async (resolve, reject) => {
  try {
    const worksheet = workbook.getWorksheet('Holiday');
    const holidays = await Holiday.findByYear(excelType.year);
    const column = ['B', 'C', 'D'];
    let row = 4;
    let index = 1;
    holidays.forEach((holiday) => {
      worksheet.getCell(`B${row}`).value = index;
      worksheet.getCell(`C${row}`).value = moment(holiday.date, 'YYYY-MM-DD').format('D MMMM YYYY');
      worksheet.getCell(`D${row}`).value = holiday.dateName;
      fillBorderFixColumn(worksheet, row, column);
      index += 1;
      row += 1;
    });
    resolve(workbook);
  }
  catch (error) {
    reject(error);
  }
});

const findEachAvailableDate = (excelType, userId) => new Promise(async (resolve, reject) => {
  try {
    const end = '';
    let avialableDate = '';
    await HasProject.findWorkProjectDate(excelType.year, excelType.month, userId)
      .then((hasProjects) => {
        for (let i = 0; i < hasProjects.length; i += 1) {
          if (hasProjects.length === 1) {
            if (hasProjects[i].projectId === null) {
              avialableDate += `${moment(`${excelType.year}-${excelType.month}-01`).format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
            }
            else if ((hasProjects[i].projectId !== null)) {
              if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') === moment(`${excelType.year}-${excelType.month}-01`).format('YYYY-MM-DD')) {
                avialableDate += `${moment(`${excelType.year}-${excelType.month}-02`).format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
              }
              else if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') <= moment(`${excelType.year}-${excelType.month}-01`).format('YYYY-MM-DD')) {
                if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') < moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
                  avialableDate += `${moment(hasProjects[i].endDate).add(1, 'days').format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
                }
                else if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') === moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
                  avialableDate += `${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
                }
              }
              else if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') === moment(`${excelType.year}-${excelType.month}-02`).format('YYYY-MM-DD')) {
                avialableDate += `${moment(`${excelType.year}-${excelType.month}-01`).format('DD/MM/YY')}`;
                if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') < moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
                  avialableDate += `${moment(hasProjects[i].endDate).add(1, 'days').format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
                }
                else if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') === moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
                  avialableDate += `${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
                }
              }
              else if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') > moment(`${excelType.year}-${excelType.month}-02`).format('YYYY-MM-DD')) {
                avialableDate += `${moment(`${excelType.year}-${excelType.month}-01`).format('DD/MM/YY')}-${moment(hasProjects[i].startDate).add(-1, 'days').format('DD/MM/YY')}`;
                if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') < moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
                  avialableDate += `${moment(hasProjects[i].endDate).add(1, 'days').format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
                }
                else if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') === moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
                  avialableDate += `${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
                }
              }
            }
          }
          // if (hasProjects.length === 1 && hasProjects[i].projectId !== null) {
          //   if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') <= moment(`${excelType.year}-${excelType.month}-01`).format('YYYY-MM-DD')) {
          //     if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') === moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
          //       avialableDate += `${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
          //     }
          //     else if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') !== moment(`${excelType.year}-12-31`).format('YYYY-MM-DD')) {
          //       avialableDate += `${moment(hasProjects[i].endDate).add(1, 'days').format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
          //     }
          //   }
          //   else if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') === moment(`${excelType.year}-${excelType.month}-02`).format('YYYY-MM-DD')) {
          //     if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') === moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
          //       avialableDate += `${moment(`${excelType.year}-${excelType.month}-1`).format('DD/MM/YY')} ${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
          //     }
          //     else if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') !== moment(`${excelType.year}-12-31`).format('YYYY-MM-DD')) {
          //       avialableDate += `${moment(`${excelType.year}-${excelType.month}-1`).format('DD/MM/YY')} ${moment(hasProjects[i].endDate).add(1, 'days').format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
          //     }
          //   }
          //   else if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') >= moment(`${excelType.year}-${excelType.month}-03`).format('YYYY-MM-DD')) {
          //     if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') === moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
          //       avialableDate += `${moment(`${excelType.year}-${excelType.month}-1`).format('DD/MM/YY')}-${moment(hasProjects[i].startDate).add(-1, 'days').format('DD/MM/YY')} ${moment(`${excelType.year}-${excelType.month}-1`).format('DD/MM/YY')} ${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
          //     }
          //     else if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') !== moment(`${excelType.year}-12-31`).format('YYYY-MM-DD')) {
          //       avialableDate += `${moment(`${excelType.year}-${excelType.month}-1`).format('DD/MM/YY')}-${moment(hasProjects[i].startDate).add(-1, 'days').format('DD/MM/YY')} ${moment(hasProjects[i].endDate).add(1, 'days').format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
          //     }
          //   }
          // }
          // else if (i === 0 && hasProjects.length !== 1) {
          //   if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') === moment(`${excelType.year}-${excelType.month}-02`).format('YYYY-MM-DD')) {
          //     avialableDate += `${moment(`${excelType.year}-${excelType.month}-2`).format('DD/MM/YY')}`;
          //     end = hasProjects[i].endDate;
          //   }
          //   else if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') <= moment(`${excelType.year}-${excelType.month}-01`).format('YYYY-MM-DD')) {
          //     end = hasProjects[i].endDate;
          //   }
          //   else {
          //     avialableDate += `${moment(`${excelType.year}-${excelType.month}-01`).format('DD/MM/YY')}-${moment(hasProjects[i].startDate).add(-1, 'days').format('DD/MM/YY')} `;
          //     end = hasProjects[i].endDate;
          //   }
          // }
          // else if (i === hasProjects.length - 1 && hasProjects.length !== 1) {
          //   if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') === moment(`${excelType.year}-12-30`).format('YYYY-MM-DD')) {
          //     avialableDate += `${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
          //   }
          //   else if (moment(hasProjects[i].endDate).format('YYYY-MM-DD') !== moment(`${excelType.year}-12-31`).format('YYYY-MM-DD')) {
          //     avialableDate += `${moment(hasProjects[i].endDate).add(1, 'days').format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
          //   }
          // }
          // else if (i !== 0 && i !== hasProjects.length - 1) {
          //   if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') <= moment(end).format('YYYY-MM-DD') && moment(hasProjects[i].endDate).format('YYYY-MM-DD') >= moment(end).format('YYYY-MM-DD')) {
          //     end = hasProjects[i].endDate;
          //   }
          //   else if (moment(hasProjects[i].startDate).format('YYYY-MM-DD') > moment(end).format('YYYY-MM-DD')) {
          //     if (moment(hasProjects[i].startDate).add(-2, 'days').format('YYYY-MM-DD') === moment(end).format('YYYY-MM-DD')) {
          //       avialableDate += `${moment(end).add(1, 'days').format('DD/MM/YY')}`;
          //       end = hasProjects[i].endDate;
          //     }
          //     else {
          //       avialableDate += `${moment(end).add(1, 'days').format('DD/MM/YY')}-${moment(hasProjects[i].startDate).add(-1, 'days').format('DD/MM/YY')}`;
          //       end = hasProjects[i].endDate;
          //     }
          //   }
          // }
          // else {
          //   avialableDate += `${moment(`${excelType.year}-${excelType.month}-1`).format('DD/MM/YY')}-${moment(`${excelType.year}-12-31`).format('DD/MM/YY')}`;
          // }
        }
      });
    resolve(avialableDate);
  }
  catch (error) {
    reject(error);
  }
});

const writeAvailableDate = (worksheet, excelType, column) => new Promise(async (resolve, reject) => {
  try {
    const users = await User.findAll();
    let index = 1;
    let row = 6;
    users.forEach((user) => {
      findEachAvailableDate(excelType, user.id)
        .then((avialableDate) => {
          if (avialableDate !== '') {
            console.log(avialableDate);
            worksheet.getCell(`B${row}`).value = index;
            worksheet.getCell(`C${row}`).value = `${user.firstName} ${user.lastName}`;
            worksheet.getCell(`D${row}`).value = user.nickName;
            worksheet.getCell(`E${row}`).value = user.positionName;
            worksheet.getCell(`F${row}`).value = avialableDate;
            fillBorderFixColumn(row, column);
            index += 1;
            row += 1;
          }
        });
    });
    resolve(worksheet);
  }
  catch (error) {
    reject(error);
  }
});

exports.createReport = (req, res, next) => {
  const excelType = {};
  excelType.reportType = req.query.reportType;
  excelType.projectId = req.query.projectId;
  excelType.userId = req.query.userId;
  excelType.year = req.query.year;
  excelType.month = req.query.month;
  excelType.template = req.query.template;
  if (excelType.reportType === 'Timesheet (Normal)' || excelType.reportType === 'Timesheet (Normal) per Person') {
    if (req.accessControl.reportTimesheetNormalAll) {
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
              let logo = '';
              if (excelType.template === 'Playtorium') {
                logo = workbook.addImage({
                  filename: 'server/storage/private/logo/Playtorium.png',
                  extension: 'png'
                });
              }
              else if (excelType.template === 'MFEC') {
                logo = workbook.addImage({
                  filename: 'server/storage/private/logo/MFEC.png',
                  extension: 'png'
                });
              }
              // write report header
              worksheet.getCell('C1').value = 'TIMESHEET';
              worksheet.addImage(logo, 'A1:B1');
              worksheet.getCell('B2').value = `${project.user.firstName} ${project.user.lastName}`;
              worksheet.getCell('E2').value = excelType.userId;
              worksheet.getCell('B3').value = project.role;
              worksheet.getCell('E3').value = `1 - ${numberOfDayInMonth} ${moment(excelType.month, 'MM').format('MMMM')} ${excelType.year}`;
              worksheet.getCell('C4').value = project.detail.customer;
              worksheet.getCell('C53').value = `${project.user.firstName} ${project.user.lastName}`;
              // write day and Saturday, Sunday in report timesheet
              for (let day = 1; day <= numberOfDayInMonth; day += 1) {
                const date = `${yearMonth}-${day}`;
                worksheet.getCell(`A${day + 7}`).value = moment(date).format('DD/MM/YY');
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
              // write timesheet
              writeTimesheet(worksheet, timesheet)
                .then(() => {
                  calSumEachColumn(worksheet)
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
        })
        .catch(next);
    }
    else if (req.accessControl.reportTimesheetNormalOwn) {
      if (parseInt(excelType.userId, 10) === req.user.id) {
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
                let logo = '';
                if (excelType.template === 'Playtorium') {
                  logo = workbook.addImage({
                    filename: 'server/storage/private/logo/Playtorium.png',
                    extension: 'png'
                  });
                }
                else if (excelType.template === 'MFEC') {
                  logo = workbook.addImage({
                    filename: 'server/storage/private/logo/MFEC.png',
                    extension: 'png'
                  });
                }
                // write report header
                worksheet.getCell('C1').value = 'TIMESHEET';
                worksheet.addImage(logo, 'A1:B1');
                worksheet.getCell('B2').value = `${project.user.firstName} ${project.user.lastName}`;
                worksheet.getCell('E2').value = excelType.userId;
                worksheet.getCell('B3').value = project.role;
                worksheet.getCell('E3').value = `1 - ${numberOfDayInMonth} ${moment(excelType.month, 'MM').format('MMMM')} ${excelType.year}`;
                worksheet.getCell('C4').value = project.detail.customer;
                worksheet.getCell('C53').value = `${project.user.firstName} ${project.user.lastName}`;
                // write day and Saturday, Sunday in report timesheet
                for (let day = 1; day <= numberOfDayInMonth; day += 1) {
                  const date = `${yearMonth}-${day}`;
                  worksheet.getCell(`A${day + 7}`).value = moment(date).format('DD/MM/YY');
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
                // write timesheet
                writeTimesheet(worksheet, timesheet)
                  .then(() => {
                    calSumEachColumn(worksheet)
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
          })
          .catch(next);
      }
      else {
        res.status(401).json({
          message: `You don't have permission to do this.`
        });
      }
    }
  }
  else if (excelType.reportType === 'Timesheet (Special)' || excelType.reportType === 'Timesheet (Special) per Person') {
    if (req.accessControl.reportTimesheetSpecialAll) {
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
              let logo = '';
              if (excelType.template === 'Playtorium') {
                logo = workbook.addImage({
                  filename: 'server/storage/private/logo/Playtorium.png',
                  extension: 'png'
                });
              }
              else if (excelType.template === 'MFEC') {
                logo = workbook.addImage({
                  filename: 'server/storage/private/logo/MFEC.png',
                  extension: 'png'
                });
              }
              // write report header
              worksheet.getCell('C1').value = 'TIMESHEET S';
              worksheet.addImage(logo, 'A1:B1');
              worksheet.getCell('B2').value = `${project.user.firstName} ${project.user.lastName}`;
              worksheet.getCell('E2').value = excelType.userId;
              worksheet.getCell('B3').value = project.role;
              worksheet.getCell('E3').value = `1 - ${numberOfDayInMonth} ${moment(excelType.month, 'MM').format('MMMM')} ${excelType.year}`;
              worksheet.getCell('C4').value = project.detail.customer;
              worksheet.getCell('C53').value = `${project.user.firstName} ${project.user.lastName}`;
              // write day and Saturday, Sunday in report timesheet
              for (let day = 1; day <= numberOfDayInMonth; day += 1) {
                const date = `${yearMonth}-${day}`;
                worksheet.getCell(`A${day + 7}`).value = moment(date).format('DD/MM/YY');
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
                worksheet.getCell(`D${day + 7}`).value = moment(timesheet[k].timeIn, 'HH:mm:ss').format('HH:mm');
                worksheet.getCell(`E${day + 7}`).value = moment(timesheet[k].timeOut, 'HH:mm:ss').format('HH:mm');
              }
              // special timesheet
              writeSpecialTimesheet(excelType, holidayDates, worksheet, numberOfDayInMonth)
                .then(() => {
                  calSumEachColumn(worksheet)
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
        })
        .catch(next);
    }
    else if (req.accessControl.reportTimesheetSpecialOwn) {
      if (parseInt(excelType.userId, 10) === req.user.id) {
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
                let logo = '';
                if (excelType.template === 'Playtorium') {
                  logo = workbook.addImage({
                    filename: 'server/storage/private/logo/Playtorium.png',
                    extension: 'png'
                  });
                }
                else if (excelType.template === 'MFEC') {
                  logo = workbook.addImage({
                    filename: 'server/storage/private/logo/MFEC.png',
                    extension: 'png'
                  });
                }
                // write report header
                worksheet.getCell('C1').value = 'TIMESHEET S';
                worksheet.addImage(logo, 'A1:B1');
                worksheet.getCell('B2').value = `${project.user.firstName} ${project.user.lastName}`;
                worksheet.getCell('E2').value = excelType.userId;
                worksheet.getCell('B3').value = project.role;
                worksheet.getCell('E3').value = `1 - ${numberOfDayInMonth} ${moment(excelType.month, 'MM').format('MMMM')} ${excelType.year}`;
                worksheet.getCell('C4').value = project.detail.customer;
                worksheet.getCell('C53').value = `${project.user.firstName} ${project.user.lastName}`;
                // write day and Saturday, Sunday in report timesheet
                for (let day = 1; day <= numberOfDayInMonth; day += 1) {
                  const date = `${yearMonth}-${day}`;
                  worksheet.getCell(`A${day + 7}`).value = moment(date).format('DD/MM/YY');
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
                  worksheet.getCell(`D${day + 7}`).value = moment(timesheet[k].timeIn, 'HH:mm:ss').format('HH:mm');
                  worksheet.getCell(`E${day + 7}`).value = moment(timesheet[k].timeOut, 'HH:mm:ss').format('HH:mm');
                }
                // special timesheet
                writeSpecialTimesheet(excelType, holidayDates, worksheet, numberOfDayInMonth)
                  .then(() => {
                    calSumEachColumn(worksheet)
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
          })
          .catch(next);
      }
      else {
        res.status(401).json({
          message: `You don't have permission to do this.`
        });
      }
    }
  }
  else if (excelType.reportType === 'Summary Timesheet (Year)') {
    if (req.accessControl.reportSummaryTimesheetYear) {
      const filename = 'server/storage/private/report/Playtorium_Summary_Timesheet.xlsx';
      const workbook = new Excel.Workbook();
      workbook.xlsx.readFile(filename)
        .then(() => {
          const worksheet = workbook.getWorksheet('Timesheet');
          // Fill each month in year
          const months = moment.monthsShort();
          const monthColumn = ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
          for (let i = 0; i < months.length; i += 1) {
            worksheet.getCell(`${monthColumn[i]}3`).value = `${months[i]}-${moment(excelType.year, 'YYYY').format('YY')}`;
          }
          // Fill Each user timesheet
          Timesheet.findSummaryTimesheet(excelType.year)
            .then((timesheets) => {
              let user = '';
              let project = '';
              let row = 3;
              timesheets.forEach((timesheet) => {
                timesheet.days = Math.ceil(timesheet.days * 100) / 100;
                if (timesheet.id === user && timesheet.projectId === project) {
                  worksheet.getCell(`${monthColumn[timesheet.month - 1]}${row}`).value = timesheet.days;
                }
                else if (timesheet.id === user && timesheet.projectId !== project) {
                  row += 1;
                  fillBorderAllRow(worksheet, row);
                  worksheet.getCell(`D${row}`).value = timesheet.projectId;
                  worksheet.getCell(`${monthColumn[timesheet.month - 1]}${row}`).value = timesheet.days;
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
                  worksheet.getCell(`${monthColumn[timesheet.month - 1]}${row}`).value = timesheet.days;
                  user = timesheet.id;
                  project = timesheet.projectId;
                }
              });
              row += 1;
              fillBorderAllRow(worksheet, row);
              writeSummary(worksheet, row, monthColumn)
                .then(() => {
                  writeAllProject(workbook, excelType.year)
                    .then(() => {
                      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                      res.setHeader('Content-Disposition', `attachment; filename="Timesheet_Summary_${excelType.year}.xlsx`);
                      workbook.xlsx.write(res);
                    })
                    .catch(next);
                })
                .catch(next);
            })
            .catch(next);
        })
        .catch(next);
    }
    else {
      res.status(401).json({
        message: `You don't have permission to do this.`
      });
    }
  }
  else if (excelType.reportType === 'Summary Leave') {
    if (req.accessControl.reportSummaryLeave) {
      const filename = 'server/storage/private/report/Playtorium_Summary_Leave.xlsx';
      const workbook = new Excel.Workbook();
      workbook.xlsx.readFile(filename)
        .then(() => {
          const worksheet = workbook.getWorksheet('Leave');
          const rowColumn = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ',
            'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG'];
          const monthColumn = ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ',
            'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF'];
          worksheet.getCell('D1').value = excelType.year;
          const time = moment();
          worksheet.getCell('D2').value = `${time.format('DD/MM/YY')} ${time.format('HH:mm')}`;
          LeaveRequest.findSummaryLeave(excelType.year)
            .then((leaveRequests) => {
              writeAllLeave(worksheet, leaveRequests, monthColumn, rowColumn)
                .then((row) => {
                  calTotalLeave(worksheet, row)
                    .then(() => {
                      writeHoliday(workbook, excelType)
                        .then(() => {
                          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                          res.setHeader('Content-Disposition', `attachment; filename="Timesheet_Summary_${excelType.year}.xlsx`);
                          workbook.xlsx.write(res);
                        })
                        .catch(next);
                    })
                    .catch(next);
                })
                .catch(next);
            })
            .catch(next);
        })
        .catch(next);
    }
    else {
      res.status(401).json({
        message: `You don't have permission to do this.`
      });
    }
  }
  else if (excelType.reportType === 'Resource Available') {
    const filename = 'server/storage/private/report/Resource_Available.xlsx';
    const workbook = new Excel.Workbook();
    const column = ['B', 'C', 'D', 'E', 'F', 'G'];
    workbook.xlsx.readFile(filename)
      .then(() => {
        const worksheet = workbook.getWorksheet('Resource Available');
        const yearMonth = `${excelType.year}-${excelType.month}`;
        worksheet.getCell('C3').value = `${moment(yearMonth, 'YYYY-MM').format('MMMM YYYY')}`;
        const time = moment();
        worksheet.getCell('C4').value = `${time.format('DD/MM/YY')} ${time.format('HH:mm')}`;
        writeAvailableDate(worksheet, excelType, column)
          .then(() => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="Timesheet_Summary_${excelType.year}.xlsx`);
            workbook.xlsx.write(res);
          })
          .catch(next);
        // let row = 4;
        // User.findAll()
        //   .then(async (users) => {
        //     for (let i = 0; i < users.length; i += 1) {
        //       // write user
        //       const employeeInfo = await EmployeeInfo.findById(users[i].id);
        //       worksheet.getCell(`B${row}`).value = employeeInfo.userId;
        //       worksheet.getCell(`C${row}`).value = `${employeeInfo.firstName} ${employeeInfo.lastName}`;
        //       fillBorderAllRow(worksheet, row);
        //       row += 1;
        //       // write each project
        //       const projects = await HasProject.findByUserIdAndYear(users[i].id, excelType.year);
        //       for (let j = 0; j < projects.length; j += 1) {
        //         worksheet.getCell(`D${row}`).value = projects[j].id;
        //         // write sum day each month
        //         for (let k = 1; k <= 12; k += 1) {
        //           const totalDays = await Timesheet.findTimesheetInProject(excelType.year, k, projects[j].id, users[i].id);
        //           worksheet.getCell(`${monthColumn[k - 1]}${row}`).value = totalDays;
        //         }
        //         fillBorderAllRow(worksheet, row);
        //         row += 1;
        //       }
        //     }
        //   })
        //   .catch(next);
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

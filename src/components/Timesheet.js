import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Table, Grid, Progress, Button, Modal } from 'semantic-ui-react';
import moment from 'moment';
import PageHeader from './PageHeader';
import { Icon, Table, Grid, Progress, Button, Select, Popup, Segment } from 'semantic-ui-react';
import moment from 'moment';
import PageHeader from './PageHeader';
import history from '../history';
import { getYearOptions, getMonthOptions } from '../utils/options';

class Timesheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      holidaycolor: 'rgb(221, 225, 230)',
      ButtonRedcolor: '#FF0000',
      textWorkcolor: '#2185CD',
      textHolidaycolor: '#999999',
      iconRedcolor: 'red',
      iconBluecolor: 'blue',
      date: moment(),
      lastholiday: { date: '', name: '' },
      holidays: [
        { date: '2018-06-14', name: 'Compensatory day' },
        { date: '2018-06-22', name: 'test day' },
        { date: '2018-06-29', name: 'test 2 day' }
      ]
    };
    this.anotherMonthCell = this.anotherMonthCell.bind(this);
    this.holidayCell = this.holidayCell.bind(this);
    this.workdayCell = this.workdayCell.bind(this);
    this.drawCell = this.drawCell.bind(this);
    this.addHolidayName = this.addHolidayName.bind(this);
    this.isHoliday = this.isHoliday.bind(this);
    this.buttonOfHoliday = this.buttonOfHoliday.bind(this);
  }

  drawCell(date, hour) {
    if (date.format('M') !== this.state.date.format('M')) {
      return (this.anotherMonthCell(date.format('D')));
    }
    else if (this.isHoliday(date)) {
      return (this.holidayCell(date.format('D'), hour));
    }
    else if (date.format('d') === '0' || date.format('d') === '6') {
      return (this.holidayCell(date.format('D'), hour));
    }
    return (this.workdayCell(date.format('D'), hour));
  }

  isHoliday(date) {
    for (let i = 0; i < this.state.holidays.length; i += 1) {
      if (moment(date).format('YYYY-MM-DD') === this.state.holidays[i].date) {
        this.state.lastholiday = this.state.holidays[i];
        return true;
      }
    }
    return false;
  }
  editButtonWorkday(hour) {
    let color = '';
    let iconcolor = '';
    if (hour !== 8) { color = this.state.ButtonRedcolor; iconcolor = this.state.iconRedcolor; }
    else if (hour === 0) {
      return (
        <Grid.Row textAlign="center">
          <Button animated="fade" style={{ borderStyle: 'solid', borderColor: color, backgroundColor: 'white', borderWidth: '1px' }} >
            <Button.Content visible><font color={color} >Add new</font></Button.Content>
            <Button.Content hidden > <Icon color={iconcolor} name="pencil alternate" /> </Button.Content>
          </Button>
        </Grid.Row>

      );
    }
    else { color = this.state.textWorkcolor; iconcolor = this.state.iconBluecolor; }
    return (
      <Grid.Row textAlign="center">
        <Button animated="fade" style={{ borderStyle: 'solid', borderColor: color, backgroundColor: 'white', borderWidth: '1px' }} >
          <Button.Content visible><font color={color} >{hour} Hour</font></Button.Content>
          <Button.Content hidden > <Icon color={iconcolor} name="pencil alternate" /> </Button.Content>
        </Button>
      </Grid.Row>
    );
  }
  anotherMonthCell(day) {
    return (
      <Table.Cell style={{ backgroundColor: this.state.holidaycolor }} >
        <Grid.Column>
          <Grid.Row textAlign="right" >
            <font color={this.state.textHolidaycolor} size="3" ><b>{day}</b></font>
          </Grid.Row>
          <Grid.Row style={{ height: '7.5em' }} />
        </Grid.Column>
      </Table.Cell>
    );
  }
  holidayCell(day, hour) {
    return (
      <Table.Cell style={{ backgroundColor: this.state.holidaycolor, maxWidth: '10em' }} >
        <Grid.Column>
          <Grid.Row textAlign="right" >
            <font size="3" ><b>{day}</b></font>
          </Grid.Row>
          {this.addHolidayName(day)}
          {this.buttonOfHoliday(hour)}
        </Grid.Column>
      </Table.Cell>
    );
  }
  buttonOfHoliday(hour) {
    if (hour !== 0) {
      return (
        <Grid.Row textAlign="center">
          <Button animated="fade" style={{ borderStyle: 'solid', borderColor: this.state.textWorkcolor, backgroundColor: 'white', borderWidth: '1px' }} >
            <Button.Content visible><font color={this.state.textWorkcolor}>{hour} Hour</font></Button.Content>
            <Button.Content hidden > <Icon color="blue" name="pencil alternate" /> </Button.Content>
          </Button>
        </Grid.Row>
      );
    }
    return (
      <Grid.Row style={{ height: '2.5em' }} />
    );
  }
  addHolidayName(day) {
    if (day === moment(this.state.lastholiday.date).format('D')) {
      return (
        <Grid.Row style={{ height: '5em' }}>
          <font color={this.state.textHolidaycolor}>- {this.state.lastholiday.name}</font>
        </Grid.Row>
      );
    }
    return (<Grid.Row style={{ height: '5em' }} />);
  }
  workdayCell(day, hour) {
    return (
      <Table.Cell >
        <Grid.Column>
          <Grid.Row textAlign="right" >
            <font size="3" ><b>{day}</b></font>
          </Grid.Row>
          <Grid.Row style={{ height: '5em' }} />
          {this.editButtonWorkday(hour)}
          {console.log(hour)}
        </Grid.Column>
      </Table.Cell>
    );
      textAnotherDay: '#999999',
      iconRedcolor: 'red',
      iconBluecolor: 'blue',
      lastholiday: { date: '', name: '' },
      lastleaveday: { date: '', status: '' }
    };
    this.anotherMonthCell = this.anotherMonthCell.bind(this);
    this.workdayCell = this.workdayCell.bind(this);
    this.drawCell = this.drawCell.bind(this);
    this.addHolidayName = this.addHolidayName.bind(this);
    this.buttonOfHoliday = this.buttonOfHoliday.bind(this);
    this.leavedayCell = this.leavedayCell.bind(this);
    this.popUpEdit = this.popUpEdit.bind(this);
  }
  drawCell(arrayDate) {
    if (moment(arrayDate[0].date).format('MM') !== this.props.month) {
      return (this.anotherMonthCell(moment(arrayDate[0].date).format('D')));
    }
    else if (this.isLeaveday(arrayDate[0].date)) {
      return (this.leavedayCell(arrayDate));
    }
    else if (this.isHoliday(arrayDate[0].date)) {
      return (this.holidayCell(arrayDate));
    }
    else if (moment(arrayDate[0].date).format('d') === '0' || moment(arrayDate[0].date).format('d') === '6') {
      return (this.holidayCell(arrayDate));
    }
    return (this.workdayCell(arrayDate));
  }
  isLeaveday(date) {
    return this.props.leaves.some(((leaveDay) => {
      if (leaveDay.leaveDate === date) {
        this.state.lastleaveday = leaveDay;
        return (true);
      }
      return (false);
    }));
  }
  addStatusLeaveday(arrayDate) {
    if (this.state.lastleaveday.totalhours < 8) {
      return (
        <div>
          <Grid.Row style={{ height: '5em' }}>
            <font color={this.state.textAnotherDay}>- {this.state.lastleaveday.leaveType}</font>
            <br />
            <font color={this.state.textAnotherDay}>{this.state.lastleaveday.startTime}-{this.state.lastleaveday.endTime}</font>
          </Grid.Row>
          {this.editButtonWorkday(arrayDate)}
        </div>
      );
    }
    return (
      <div>
        <Grid.Row style={{ height: '5em' }}>
          <font color={this.state.textAnotherDay}>- {this.state.lastleaveday.leaveType}</font>
        </Grid.Row>
        {this.buttonOfHoliday(arrayDate)}
      </div>
    );
  }
  leavedayCell(arrayDate) {
    return (
      <Table.Cell style={{ backgroundColor: this.state.holidaycolor, maxWidth: '10em' }} >
        <Grid.Column>
          <Grid.Row textAlign="right" >
            <font size="3" ><b>{moment(arrayDate[0].date).format('D')}</b></font>
          </Grid.Row>
          {this.addStatusLeaveday(arrayDate)}
        </Grid.Column>
      </Table.Cell>
    );
  }
  workdayCell(arrayDate) {
    return (
      <Table.Cell >
        <Grid.Column>
          <Grid.Row textAlign="right" >
            <font size="3" ><b>{moment(arrayDate[0].date).format('D')}</b></font>
          </Grid.Row>
          <Grid.Row style={{ height: '5em' }} />
          {this.editButtonWorkday(arrayDate)}
        </Grid.Column>
      </Table.Cell>
    );
  }
  editButtonWorkday(arrayDate) {
    let color = '';
    let iconcolor = '';
    let hour = 0;
    arrayDate.forEach((date) => { hour += date.totalhours; });
    if (hour !== 8) { color = this.state.ButtonRedcolor; iconcolor = this.state.iconRedcolor; }
    if (hour === 0) {
      return (
        <Grid.Row textAlign="center">
          <Button
            animated="fade"
            style={{ borderStyle: 'solid', borderColor: color, backgroundColor: 'white', borderWidth: '1px' }}
            onClick={() => this.props.onAddClick(arrayDate[0].date)}
          >
            <Button.Content visible><font color={color} >Add new</font></Button.Content>
            <Button.Content hidden > <Icon color={iconcolor} name="pencil" /> </Button.Content>
          </Button>
        </Grid.Row>
      );
    }
    else if (hour >= 8) { color = this.state.textWorkcolor; iconcolor = this.state.iconBluecolor; }
    return (
      <Grid.Row textAlign="center">
        <Button.Group>
          <Popup
            trigger={
              <Button
                animated="fade"
                style={{ borderStyle: 'solid', borderColor: color, backgroundColor: 'white', borderWidth: '1px' }}
              >
                <Button.Content visible><font color={color} >{Math.ceil(hour * 100) / 100} Hours</font></Button.Content>
                <Button.Content hidden > <Icon color={iconcolor} name="pencil alternate" /> </Button.Content>
              </Button>}
            flowing
            on="click"
          >
            {this.popUpEdit(arrayDate)}
          </Popup>

          <Button
            icon
            color={iconcolor}
            onClick={() => this.props.onAddClick(arrayDate[0].date)}
          >
            <Icon name="add" />
          </Button>
        </Button.Group>
      </Grid.Row>
    );
  }
  anotherMonthCell(day) {
    return (
      <Table.Cell style={{ backgroundColor: this.state.holidaycolor }} >
        <Grid.Column>
          <Grid.Row textAlign="right" >
            <font color={this.state.textAnotherDay} size="3" ><b>{day}</b></font>
          </Grid.Row>
          <Grid.Row style={{ height: '7.5em' }} />
        </Grid.Column>
      </Table.Cell>
    );
  }
  isHoliday(date) {
    for (let i = 0; i < this.props.holidays.length; i += 1) {
      if (date === this.props.holidays[i].date) {
        this.state.lastholiday = this.props.holidays[i];
        return true;
      }
    }
    return false;
  }
  holidayCell(arrayDate) {
    return (
      <Table.Cell style={{ backgroundColor: this.state.holidaycolor, maxWidth: '10em' }} >
        <Grid.Column>
          <Grid.Row textAlign="right" >
            <font size="3" ><b>{moment(arrayDate[0].date).format('D')}</b></font>
          </Grid.Row>
          {this.addHolidayName(moment(arrayDate[0].date).format('D'))}
          {this.buttonOfHoliday(arrayDate)}
        </Grid.Column>
      </Table.Cell>
    );
  }
  buttonOfHoliday(arrayDate) {
    let hour = 0;
    arrayDate.forEach((date) => { hour += date.totalhours; });
    if (hour !== 0) {
      return (
        <Grid.Row textAlign="center">
          <Button.Group>
            <Popup
              trigger={
                <Button
                  animated="fade"
                  style={{ borderStyle: 'solid', borderColor: this.state.textWorkcolor, backgroundColor: 'white', borderWidth: '1px' }}
                >
                  <Button.Content visible><font color={this.state.textWorkcolor}>{Math.ceil(hour * 100) / 100} Hours</font></Button.Content>
                  <Button.Content hidden > <Icon color={this.state.iconBluecolor} name="pencil alternate" /> </Button.Content>
                </Button>}
              flowing
              on="click"
            >
              {this.popUpEdit(arrayDate)}
            </Popup>
            <Button
              icon
              color={this.state.iconBluecolor}
              onClick={() => this.props.onAddClick(arrayDate[0].date)}
            >
              <Icon name="add" />
            </Button>
          </Button.Group>
        </Grid.Row>
      );
    }
    return (
      <Grid.Row textAlign="center">
        <Button
          animated="fade"
          style={{ backgroundColor: this.state.holidaycolor }}
          onClick={() => this.props.onAddClick(arrayDate[0].date)}
        >
          <Button.Content visible><font color={this.state.textAnotherDay}>Add new</font></Button.Content>
          <Button.Content hidden > <Icon color="grey" name="pencil" /> </Button.Content>
        </Button>
      </Grid.Row>
    );
  }
  addHolidayName(day) {
    if (day === moment(this.state.lastholiday.date).format('D')) {
      return (
        <Grid.Row style={{ height: '5em' }}>
          <font color={this.state.textAnotherDay}>- {this.state.lastholiday.dateName}</font>
        </Grid.Row>
      );
    }
    return (<Grid.Row style={{ height: '5em' }} />);
  }
  popUpEdit(arrayDate) {
    return (
      <div style={{ maxWidth: '220px' }}>
        <Grid celled="internally" >
          {arrayDate.map(onesheet => (
            <Grid.Row style={{ cursor: 'pointer' }} onClick={() => this.props.onEditClick(onesheet.id)}>
              <h3 style={{ margin: '0', marginTop: '10px' }}>{onesheet.name}</h3><br />
              <h3 style={{ margin: '0', marginBottom: '10px' }}>{onesheet.timeIn} - {onesheet.timeOut}</h3>
            </Grid.Row>
          ))}
        </Grid>
      </div>
    );
  }
  render() {

    const progressBar = percentWork => <div> <Progress percent={percentWork} active color="blue" progress /> </div>;

    return (
      <div>
        <PageHeader text="Timesheet" icon="calendar alternate" />
        {progressBar(20)}
        <Table celled structured fixed>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="7"><font size="3">{this.state.date.format('MMMM')}</font> {this.state.date.format('YYYY')}</Table.HeaderCell>
            </Table.Row>
            <Table.Row textAlign="center">
              {this.state.days.map(day => <Table.HeaderCell>{day}</Table.HeaderCell>)}
            </Table.Row>
          </Table.Header>
          <Table.Body >
            { this.props.timesheets.map((timesheet, i) => (
                i % 7 === 0 &&
                <Table.Row style={{ height: '10em' }} >
                  {this.drawCell(moment(this.props.timesheets[i].date), this.props.timesheets[i].totalHours)}
                  {this.drawCell(moment(this.props.timesheets[i + 1].date), this.props.timesheets[i + 1].totalhours)}
                  {this.drawCell(moment(this.props.timesheets[i + 2].date), this.props.timesheets[i + 2].totalhours)}
                  {this.drawCell(moment(this.props.timesheets[i + 3].date), this.props.timesheets[i + 3].totalhours)}
                  {this.drawCell(moment(this.props.timesheets[i + 4].date), this.props.timesheets[i + 4].totalhours)}
                  {this.drawCell(moment(this.props.timesheets[i + 5].date), this.props.timesheets[i + 5].totalhours)}
                  {this.drawCell(moment(this.props.timesheets[i + 6].date), this.props.timesheets[i + 6].totalhours)}
                </Table.Row>
              ))
            }
    let progressColor;
    if (this.props.percent < 30) progressColor = 'red';
    else if (this.props.percent < 70) progressColor = 'yellow';
    else progressColor = 'blue';
    return (
      <div>
        <PageHeader text="Timesheet" icon="calendar" />
        <Progress percent={this.props.percent} active color={progressColor} progress />
        <Grid stackable doubling relaxed >
          <Grid.Row>
            <Grid.Column computer={8} >
              <Select placeholder="Year" defaultValue={this.props.year} options={getYearOptions()} onChange={(e, { value }) => this.props.fetchTimesheet(this.props.userId, value, this.props.month)} />
              <Select style={{ marginLeft: '10px' }} placeholder="Month" defaultValue={this.props.month} options={getMonthOptions()} onChange={(e, { value }) => this.props.fetchTimesheet(this.props.userId, this.props.year, value)} />
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button floated="right" onClick={() => history.push('/timesheet/new')} color="blue" >
                New Task
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table celled stackable fixed>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="7"><font size="3">{moment.months()[this.props.month - 1]}</font> {this.props.year}</Table.HeaderCell>
            </Table.Row>
            <Table.Row textAlign="center">
              {this.state.days.map(day => <Table.HeaderCell key={day}>{day}</Table.HeaderCell>)}
            </Table.Row>
          </Table.Header>
          <Table.Body >
            {this.props.timesheets.map((timesheet, i) => (
              i % 7 === 0 &&
              <Table.Row key={timesheet.id} style={{ height: '10em' }} >
                {this.drawCell(this.props.timesheets[i])}
                {this.drawCell(this.props.timesheets[i + 1])}
                {this.drawCell(this.props.timesheets[i + 2])}
                {this.drawCell(this.props.timesheets[i + 3])}
                {this.drawCell(this.props.timesheets[i + 4])}
                {this.drawCell(this.props.timesheets[i + 5])}
                {this.drawCell(this.props.timesheets[i + 6])}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Modal trigger={<Button>New Task</Button>} />
      </div>
    );
  }
}

Timesheet.propTypes = {
  timesheets: PropTypes.array.isRequired
  timesheets: PropTypes.array.isRequired,
  leaves: PropTypes.array.isRequired,
  holidays: PropTypes.array.isRequired,
  fetchTimesheet: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  year: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired
};

export default Timesheet;

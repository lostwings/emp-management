import React from 'react';
import './css/EmployeeInfoComponent.css'
import moment from 'moment';

const validationMessage = {
    endProbationDateValidation: "Probation End Date must not before Probation Start Date."
};

class EmployeeInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props,
            startDate: moment(this.props.startDate),
            endProbationDate: this.props.endProbationDate || moment(this.props.startDate).add(120, 'day').format('YYYY-MM-DD'),
            showEndProDate: props.showEndProDate && true
        };
    }


    componentWillReceiveProps(props) {
        this.setState({ endProbationDate: props.endProbationDate })
    }

    render() {
        return (
            <div className='info-container' >
                <table>
                    <tr>
                        <td colSpan='4' className='underline'>
                            <span className='blue-text'>Information</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Name:</td>
                        <td>{this.state.name}</td>
                        <td>Department:</td>
                        <td>{this.state.department}</td>
                    </tr>
                    <tr>
                        <td>Position:</td>
                        <td>{this.state.position}</td>
                        <td>EmployeeID:</td>
                        <td>{this.state.employeeID}</td>
                    </tr>
                    <tr>
                        <td>Level:</td>
                        <td>{this.state.level}</td>
                        <td>{this.state.showEndProDate ? 'Probatoin ' : ''} Start Date</td>
                        <td>{this.state.startDate.format('DD/MM/YYYY')}</td>
                    </tr>
                    <tr>
                        <td>Supervisor:</td>
                        <td>{this.state.supervisor}</td>
                        <td>{this.state.showEndProDate ? 'Probation End Date:' : ''}</td>
                        <td>{this.state.showEndProDate ? <input type='date' value={this.state.endProbationDate} onChange={(event) => {
                            console.log("test1");
                            console.log(event.target.value);
                            if (event.target.value == '' || moment(event.target.value).isBefore(this.state.startDate))
                                alert(validationMessage.endProbationDateValidation);
                            else
                                this.props.onChange(event.target.value);
                        }} disabled={this.props.mode != 'edit'} /> : ''}</td>
                    </tr>
                </table>
            </div>
        );
    }
};

export default EmployeeInfo;

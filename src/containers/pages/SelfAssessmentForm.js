import React from 'react';
import EmployeeInfo from './components/EmployeeInfoComponent';
import GoalComponent from './components/GoalCompanent';
import './css/SelfAssessmentForm.css'
import logoBack from './pic/logo2.png'
import logo from './pic/logo.png'

const requiredMessage = <a style={{ color: 'red' }}>(Please enter your answer.)</a>

class SelfAssessmentForm extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     name: this.props.profile.general.firstName + ' ' + this.props.profile.general.lastName,
        //     department: this.props.profile.work.departmentName || '-',
        //     position: this.props.profile.work.positionName || '-',
        //     employeeID: this.props.profile.work.userId || '-',
        //     level: this.props.profile.work.levelId || '-',
        //     startDate: this.props.profile.work.startDate || '-',
        //     supervisor: this.props.profile.work.bossname || '-',
        //     currentPage: 0
        // }

        // for test
        this.state = {
            name: this.props.profile.general.firstName + ' ' + this.props.profile.general.lastName || '-',
            department: this.props.profile.work.departmentName || '-',
            position: this.props.profile.work.positionName || '-',
            employeeID: this.props.profile.work.userId || '-',
            level: this.props.profile.work.levelId || '-',
            startDate: this.props.profile.work.startDate || '-',
            supervisor: this.props.profile.work.bossname || '-',
            majorResponsibilities: '',
            significantAccomplishments: '',
            contribution: '',
            strengths: '',
            improvements: '',
            goal1: ['', '', '', '', ''],
            goal2: ['', '', '', '', ''],
            goal3: ['', '', '', '', ''],
            currentPage: 0
        }

        this.animateChangePage = this.animateChangePage.bind(this);
        this.goalOneHandler = this.goalOneHandler.bind(this);
        this.goalTwoHandler = this.goalTwoHandler.bind(this);
        this.goalThreeHandler = this.goalThreeHandler.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    componentWillMount() {
        if (this.props.profile.selfInfo) {
            this.setState({
                majorResponsibilities: this.props.profile.selfInfo.responsibilities,
                significantAccomplishments: this.props.profile.selfInfo.accomplishments,
                contribution: this.props.profile.selfInfo.activities,
                strengths: this.props.profile.selfInfo.strengths,
                improvements: this.props.profile.selfInfo.improvements,
                goal1: this.props.profile.selfInfo.goal1,
                goal2: this.props.profile.selfInfo.goal2,
                goal3: this.props.profile.selfInfo.goal3,
            })
        }
    }

    goalOneHandler(newGoal) {
        this.setState({ goal1: newGoal });
    }

    goalTwoHandler(newGoal) {
        this.setState({ goal2: newGoal });
    }

    goalThreeHandler(newGoal) {
        this.setState({ goal3: newGoal });
    }

    validateField() {
        let isValid = true;

        if (!this.state.majorResponsibilities)
            isValid = false;

        if (!this.state.significantAccomplishments)
            isValid = false;

        if (!this.state.contribution)
            isValid = false;

        if (!this.state.strengths)
            isValid = false;

        if (!this.state.improvements)
            isValid = false;

        if (!this.state.goal1 || this.state.goal1.length != 5)
            isValid = false;

        for (let i = 0; i < this.state.goal1.length; i++) {
            if (!this.state.goal1[i]) {
                isValid = false;
                break;
            }
        }

        this.setState({ validate: isValid });
    }

    animateChangePage() {
        document.getElementsByClassName('pages-contrainer')[0].style.left = this.state.currentPage * (-100) + '%';
    }

    componentDidUpdate() {
        this.animateChangePage();
        this.validateField();
        this.props.test(this.state);
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.item.currentPage != this.props.item.currentPage){
        this.setState({currentPage: nextProps.item.currentPage},this.animateChangePage());
      }
    }
    shouldComponentUpdate(nextProps, nextState) {
        let arrayCheck = true;
        if (nextState.goal1.length != this.state.goal1.length ||
            nextState.goal2.length != this.state.goal2.length ||
            nextState.goal3.lenght != this.state.goal3.lenght) {
            arrayCheck = false;
        } else {
            for (let i = 0; i < nextState.goal1.length; i++) {
                if (nextState.goal1[i] != this.state.goal1[i]) {
                    arrayCheck = false;
                }
            }

            for (let i = 0; i < nextState.goal2.length; i++) {
                if (nextState.goal2[i] != this.state.goal2[i]) {
                    arrayCheck = false;
                }
            }

            for (let i = 0; i < nextState.goal3.length; i++) {
                if (nextState.goal3[i] != this.state.goal3[i]) {
                    arrayCheck = false;
                }
            }
        }
        console.log(!arrayCheck)
        return (
            nextState.currentPage != this.state.currentPage ||
            nextState.majorResponsibilities != this.state.majorResponsibilities ||
            nextState.significantAccomplishments != this.state.significantAccomplishments ||
            nextState.contribution != this.state.contribution ||
            nextState.strengths != this.state.strengths ||
            nextState.improvements != this.state.improvements ||
            nextState.validate != this.state.validate ||
            !arrayCheck
        );
    }

    render() {
        return (
            <div className='self-assessment-form'>
                {/*<button onClick={() => {
                    this.setState({ currentPage: (this.state.currentPage + 1) % 4 });
                }}>
                    click
                </button>*/}
                <img className="logo_back" src={logoBack} />
                <div style={{textAlign: 'center',marginBottom: '30px'}}>
                    <img className="logo" src={logo} />
                    <h1>Self Assessment Form</h1>
                </div>
                <table className='pages-contrainer'>
                    <tr>
                        {/* Page One */}
                        <td>
                            <div style={{padding: '0px 10px'}}>
                                <table className='major-respon-table'>
                                    <tr><th><span className='blue-text'>Major Responsibilities</span>
                                        {!this.state.majorResponsibilities ? requiredMessage : ''}</th></tr>
                                    <tr><td><textarea tabIndex='-1' onChange={(event) => {
                                        this.setState({ majorResponsibilities: event.target.value });
                                    }}>{this.state.majorResponsibilities}</textarea></td></tr>
                                </table>
                            </div>
                            <div style={{padding: '0px 10px'}}>
                                <table className='sign-accom-table'>
                                    <tr><th><span className='blue-text'>Significant Accomplishments</span>
                                        {!this.state.significantAccomplishments ? <a style={{ color: 'red'}}>(Please enter your answer.)</a> : ''}</th></tr>
                                    <tr><td><textarea tabIndex='-1' onChange={(event) => {
                                        this.setState({ significantAccomplishments: event.target.value });
                                    }}>{this.state.significantAccomplishments}</textarea></td></tr>
                                </table>
                            </div>
                            <div style={{padding: '0px 10px'}}>
                                <table className='con-com-table'>
                                    <tr><th><span className='blue-text'>Contribution/ Company Activities</span>
                                        {!this.state.contribution ? <a style={{ color: 'red' }}>(Please enter your answer.)</a> : ''}</th></tr>
                                    <tr><td><textarea tabIndex='-1' onChange={(event) => {
                                        this.setState({ contribution: event.target.value });
                                    }}>{this.state.contribution}</textarea></td></tr>
                                </table>
                            </div>
                            <div style={{padding: '0px 10px'}}>
                                <table className='str-improve-table'>
                                    <tr>
                                        <th colSpan='2'><span className='blue-text'>Strengths/ Improvements</span></th>
                                    </tr>
                                    <tr>
                                        <td><span>Strengths</span>
                                            {!this.state.strengths ? <a style={{ color: 'red' }}>(Please enter your answer.)</a> : ''}
                                            <textarea tabIndex='-1' onChange={(event) => {
                                                this.setState({ strengths: event.target.value });
                                            }}>{this.state.strengths}</textarea></td>
                                        <td><span>Improvements</span>
                                            {!this.state.improvements ? <a style={{ color: 'red' }}>(Please enter your answer.)</a> : ''}
                                            <textarea tabIndex='-1' onChange={(event) => {
                                                this.setState({ improvements: event.target.value });
                                            }
                                            }>{this.state.improvements}</textarea></td>
                                    </tr>
                                </table>
                            </div>
                        </td>


                        {/* Page Two */}
                        <td>
                            <div style={{padding: '0px 10px'}}>
                                <GoalComponent header='Goal 1 The Most Important * เป้าหมายสำคัญอันดับที่ 1' goal={this.state.goal1} onChange={this.goalOneHandler} require={true} />
                            </div>
                        </td>

                        {/* Page Three */}
                        <td>
                            <div style={{padding: '0px 10px'}}>
                                <GoalComponent header='Goal 2 More Important * เป้าหมายสำคัญอันดับที่ 2' goal={this.state.goal2} onChange={this.goalTwoHandler} />
                            </div>
                        </td>

                        {/* Page Four */}
                        <td>
                            <div style={{padding: '0px 10px'}}>
                                <GoalComponent header='Goal 3 Less Important * เป้าหมายสำคัญอันดับที่ 3' goal={this.state.goal3} onChange={this.goalThreeHandler} />
                            </div>
                        </td>
                    </tr >
                </table >
            </div >
        );
    }
}

export default SelfAssessmentForm;

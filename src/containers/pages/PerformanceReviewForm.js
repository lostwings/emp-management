import React from 'react';
import './css/PerformanceReviewForm.css';
import ScoreTableManager from './components/ScoreTableManager';
import EmployeeInfo from './components/EmployeeInfoComponent';
import SignatureComponent from './components/SignatureComponent';
import SupervisorCommentComponent from './components/SupervisorCommentComponent';
import logoBack from './pic/logo2.png'
import logo from './pic/logo.png'

const questions = ['ความรู้ในงานและการพัฒนาตัวเอง (Knowledge and Improvement)',
    'คุณภาพงาน (Quality of Work)',
    'ปริมาณงาน (Quantity of Work)',
    'การทำงานร่วมกับผู้อื่น (Co-operation with Colleagues)',
    'การปฏิบัติตาม Playtorium Culture',
    'ความสามารถทางด้านภาษาอังกฤษ (TOEIC)',
    'ประกาศนียบัตรตามสายงาน (Certificate)'];

const weightType = {
    engLv2: [20, 15, 15, 20, 15, 15],
    engLv3orMore: [15, 15, 15, 15, 15, 15, 10],
    noEng: [20, 20, 20, 20, 20]
}

class PerformanceReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.profile.general.firstName + ' ' + this.props.profile.general.lastName,
            department: this.props.profile.work.departmentName || '-',
            position: this.props.profile.work.positionName || '-',
            employeeID: this.props.profile.work.userId || '-',
            level: this.props.profile.work.levelId || '-',
            startDate: this.props.profile.work.startDate || '-',
            supervisor: this.props.profile.work.bossname || '-',
            expectedScore: null,
            score: null,
            employeeSignDate: null,
            supervisorSignDate: null,
            MDSignDate: null
        };

        this.scoreTableStateHandler = this.scoreTableStateHandler.bind(this);
        this.supervisorCommentHandler = this.supervisorCommentHandler.bind(this);
        this.signatureHandler = this.signatureHandler.bind(this);
    }

    scoreTableStateHandler(newScore, newExpectedScore) {
        this.setState({
            score: newScore,
            expectedScore: newExpectedScore
        });
    }

    componentWillMount() {
        if (this.props.profile.perfInfo != null) {
            this.setState({
                expectedScore: this.props.profile.perfInfo.expectedScore,
                score: this.props.profile.perfInfo.score,
                supervisorComment: this.props.profile.perfInfo.supComment,
                employeeSignDate: this.props.profile.perfInfo.emSignDate,
                supervisorSignDate: this.props.profile.perfInfo.supSignDate,
                MDSignDate: this.props.profile.perfInfo.mdSignDate,
                performanceId: this.props.profile.perfInfo.performanceId,
                level: this.props.profile.perfInfo.levelId
            })
        }
    }


    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.score != this.state.score ||
            nextState.expectedScore != this.state.expectedScore
        )
    }

    componentDidUpdate() {
        this.props.test(this.state);
    }

    supervisorCommentHandler(newComment) {
        this.state = { ...this.state, supervisorComment: newComment };
        this.props.test(this.state);
    }

    signatureHandler(newEmployeeSignDate, newSupervisorSignDate, newMDSignDate) {
        this.state = {
            ...this.state,
            employeeSignDate: newEmployeeSignDate,
            supervisorSignDate: newSupervisorSignDate,
            MDSignDate: newMDSignDate
        };
        this.props.test(this.state);
    }

    render() {
        return (
            <div className='main-container'>
              <img className="logo_back" src={logoBack} />
                <div className='profile'>
                    <img className="logo" src={logo} />
                    <h1>Employee Performance Review Form</h1>
                </div>
                <EmployeeInfo {...this.state} mode={this.props.mode} />
                <br />
                <div>
                    <ScoreTableManager {...this.state} questions={questions} numOfQuestion={this.props.profile.work.engineer ? this.state.level >= 3 ? 7 : 6 : 5}
                        weight={this.props.profile.work.engineer ? this.state.level >= 3 ? weightType.engLv3orMore : weightType.engLv2 : weightType.noEng}
                        score={this.state.score} onChange={this.scoreTableStateHandler} mode={this.props.mode} />
                </div>
                <br />
                <SupervisorCommentComponent {...this.state} onChange={this.supervisorCommentHandler} mode={this.props.mode} />
                <br />
                <SignatureComponent {...this.state} role={this.props.role} onChange={this.signatureHandler} />
            </div>
        );
    }
}
export default PerformanceReviewForm;

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment,Grid , Header, Icon, Button, Dropdown, Container, Divider} from 'semantic-ui-react';
import ProfileBox from '../components/ProfileBox';
import { openModal } from '../actions/modal';
import { fetchProbationRequest, fetchPerformanceRequest, fetchSelfAssessmentRequest} from '../actions/profile';
import * as modalNames from '../constants/modalNames';
import './pages/css/EvaProfileBox.css'

const AngleDownButton = (
  <Button icon="angle down" ></Button>
)

const EvaProfileBox = ({performanceProfile, evaProfile, selfProfile, openProbationModal, id, openPerformanceModal, type, fetchProbation, profileId, fetchPerformance, openSelfAssessmentModal, fetchSelfAssessment}) => {
  console.log(evaProfile);
  const optionsPerf = [
    {
      key: 'user',
      text: (
        <span>
          Year
        </span>
      ),
      disabled: true,
    }
  ]
  const optionsPro = [
    {
      text: 'Probation List',
      disabled: true
    }
  ]

  performanceProfile.map(perf =>
    optionsPerf.push({text: perf.year ,onClick: () => {fetchPerformance(profileId,perf.year);openPerformanceModal()}})
  )
  // evaProfile.map(pro =>
  //   optionsPro.push({text: pro.probationId ,onClick: () => {fetchProbation(profileId,pro.probationId);openProbationModal()}})
  // )

  for(let i = 0;i<evaProfile.length;i++){
    if(i==evaProfile.length-1){
      console.log()
      optionsPro.push({text: 'Probation', onClick: () =>{fetchProbation(profileId,evaProfile[i].probationId);openProbationModal();}})
    }
    else optionsPro.push({text: 'Continued Probation '+ (evaProfile.length-i-1),onClick: () => {fetchProbation(profileId,evaProfile[i].probationId);openProbationModal();}})
  }

  return (

    <Segment.Group raised size="large">
      <Segment padded>
        <Grid>
          <Grid.Column>
            <Header as="h2">
              <Icon name="columns" />
              <Header.Content>
                Evaluation
              </Header.Content>
            </Header>
          </Grid.Column>

        </Grid>
      </Segment>
      <Segment raised padded size="large">
        <div className="buttonGroup">
            <Button.Group
              color={
                performanceProfile.length==0 || performanceProfile[0].year<(new Date()).getFullYear() ? 'green' : 'blue'
              }
            >
              <Dropdown trigger={AngleDownButton} options={optionsPerf} />
              <Button onClick={() => {fetchPerformance(profileId,(new Date()).getFullYear());openPerformanceModal();}}
                disabled={type!='admin' && performanceProfile.length==0}>
                {performanceProfile.length==0 || performanceProfile[0].year<(new Date()).getFullYear() ? 'Add Performance' : 'Performance'}
              </Button>
            </Button.Group>
        </div>
        <div className="buttonGroup">
            <Button.Group
              color={
                evaProfile.length==0 && type=='admin' ? 'green':
                evaProfile.length!=0 && type=='admin' && evaProfile[0].passPro==false && evaProfile[0].continued==true && evaProfile[0].mdSignDate!=null ? 'green' : 'blue'
              }
            >
              <Dropdown trigger={AngleDownButton} options={optionsPro} />
              <Button onClick={() => {
                  if(!(evaProfile.length==0 && type=='admin') && !(evaProfile.length!=0 && type=='admin' && evaProfile[0].passPro==false && evaProfile[0].continued==true && evaProfile[0].mdSignDate!=null))
                    fetchProbation(profileId,evaProfile[0].probationId);
                  openProbationModal();}
                }
                disabled={(type!='admin' && evaProfile.length==0) || !selfProfile}>
                {
                  evaProfile.length==0 && type=='admin' ? 'Create Probation':
                  evaProfile.length!=0 && type=='admin' && evaProfile[0].passPro==false && evaProfile[0].continued==true && evaProfile[0].mdSignDate!=null ? 'Create Continue Probation' : 'View Probation'
                }
              </Button>
            </Button.Group>
        </div>
            <Button icon labelPosition='left' icon={'angle right'} content={selfProfile ? 'Self Assessment' : 'Add Self Assessment'} onClick={()=>{if(selfProfile!=null)fetchSelfAssessment(profileId);openSelfAssessmentModal()}} color={selfProfile ? 'yellow':'green'}/>

      </Segment>


    </Segment.Group>

  );
};

EvaProfileBox.defaultProps = {
  evaProfile: null
};

EvaProfileBox.propTypes = {
  evaProfile: PropTypes.array,
  openProbationModal: PropTypes.func.isRequired
};
// <Button icon labelPosition='left' disabled={type!='admin' && !evaProfile} icon={evaProfile==null ? 'plus':'angle right'} content={!evaProfile && type=='admin' ? 'Create Probation':'View Probation'} onClick={()=>{fetchProbation(profileId);openProbationModal()}} color={!evaProfile && type=='admin' ? 'green':'blue'}/>
const mapStateToProps = state => ({
  profileId: state.profile.id,
  id: state.auth.id,
  type: state.auth.type
})

const mapDispatchToProps = dispatch =>({
  openPerformanceModal: () => dispatch(openModal(modalNames.ADD_PERFORMANCE)),
  openSelfAssessmentModal: () => dispatch(openModal(modalNames.ADD_SELFASSESSMENT)),
  openProbationModal: () => dispatch(openModal(modalNames.ADD_PROBATION)),
  fetchProbation: (id,probationId) => dispatch(fetchProbationRequest(id,probationId)),
  fetchPerformance: (id,year) => dispatch(fetchPerformanceRequest(id,year)),
  fetchSelfAssessment: (id) => dispatch(fetchSelfAssessmentRequest(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(EvaProfileBox);

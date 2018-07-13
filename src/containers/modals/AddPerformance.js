import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal';
import { updateProfileRequest, updateProbationStore, clearProbationStore} from '../../actions/profile';
import Modal from '../../components/EvaluationModal';
import A from '../pages/PerformanceReviewForm'
import Loader from '../../components/Loader';


class AddPerformance extends React.Component{
  constructor(props){
    super(props);
    this.state = props;
    this.type = (!this.props.profile.perfInfo ? 'addPerformance':'updatePerformance')
  }
  componentDidMount(){
    console.log(this.state.submitting);
  }
  render(){
    return(
      <div>
        {this.props.fetching ? <Loader/> :
          <Modal
            header={!this.props.profile.perfInfo ? 'Add Performance':'View Performance'}
            onClose={()=>{this.props.onClose();this.props.clear();}}
            onClick={()=>this.props.onSubmit(this.props.item,(!this.props.profile.perfInfo ? 'addPerformance':'updatePerformance'))}
            submitting={this.props.submitting}
            size="large"
            disable={!this.props.edited}
          >
            <A test={this.props.onChange} profile={this.props.profile} mode={!this.props.profile.perfInfo || (this.props.type=='admin' && !this.props.profile.perfInfo.emSignDate) ? 'edit' : 'view'} role={this.props.type == 'admin' ? 'supervisor':this.props.type =='md' ? 'md':'employee'}/>
          </Modal>
        }
      </div>
    );
  }
}

AddPerformance.defaultProps = {
  submitting: false
};

AddPerformance.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  type: state.auth.type,
  item: state.profile.item,
  modalName: state.modal.name,
  profile: state.profile,
  submitting: state.profile.submitting,
  edited: state.profile.edited,
  fetching: state.profile.proFetching
});

const mapDispatchToProps = dispatch => ({
  clear: () => dispatch(clearProbationStore()),
  onClose: () => dispatch(closeModal()),
  onSubmit: (item,type) =>  (new Promise((resolve,reject)=> (
    dispatch(updateProfileRequest(item,resolve,reject,type))
  ))),

  onClick: () => dispatch(submit('addProbationProfile')),
  onChange: (item) => dispatch(updateProbationStore(item,'performance'))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPerformance);

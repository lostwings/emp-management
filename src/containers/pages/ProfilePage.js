import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { fetchProfileRequest } from '../../actions/profile';
import Profile from '../../components/Profile';
import Loader from '../../components/Loader';

const ProfilePage = ({ profile, can }) => (
  <div>
    {profile.isFetching ? <Loader /> : <Profile profile={profile} can={can} />}
  </div>
);

ProfilePage.propTypes = {
  profile: PropTypes.object.isRequired,
  can: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  profile: state.profile,
  can: state.accessControl
});

const mapDispatchToProps = dispatch => ({
  fetchProfile: userId => dispatch(fetchProfileRequest(userId))
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      const { fetchProfile, match: { params } } = this.props;
      fetchProfile(Number(params.id));
    },
    componentDidUpdate(prevProps) {
      const { fetchProfile, match: { params } } = this.props;
      if (params.id !== prevProps.match.params.id) {
        fetchProfile(Number(params.id));
      }
    }
  })
);

export default enhance(ProfilePage);

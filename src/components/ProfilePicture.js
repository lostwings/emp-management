import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { Image, Icon, Transition } from 'semantic-ui-react';

const wrapper = {
  position: 'relative',
  maxWidth: '150px',
  marginLeft: 'auto',
  marginRight: 'auto',
  cursor: 'pointer'
};

const overlay = {
  position: 'absolute',
  top: '75%',
  bottom: '0%',
  left: '0%',
  right: '0%',
  height: '25%',
  width: '100%',
  zIndex: '2',
  opacity: '0.75',
  backgroundColor: 'black'
};

const stylecon = {
  position: 'absolute',
  color: 'white',
  zIndex: '2',
  width: '100%',
  marginTop: '10px'
};

const ProfilePicture = ({ image, isHover, onMouseEnter, onMouseLeave, onProfilePictureClick, onEditProfilePictureClick }) => (
  <div style={wrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
const ProfilePicture = ({ image, isHover, onMouseEnter, onMouseLeave, onProfilePictureClick, onEditProfilePictureClick, editted }) => (
  <div style={wrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {editted &&
    <Transition visible={isHover} animation="fade" duration={500}>
      <div style={overlay}>
        <Icon style={stylecon} name="photo" onClick={onEditProfilePictureClick}>&nbsp; Update Picture</Icon>
      </div>
    </Transition>
    </Transition>}
    <Image style={{ display: 'block' }} src={image} size="small" centered onClick={onProfilePictureClick} />
  </div>
);

ProfilePicture.propTypes = {
  image: PropTypes.string.isRequired,
  isHover: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onProfilePictureClick: PropTypes.func.isRequired,
  onEditProfilePictureClick: PropTypes.func.isRequired
  onEditProfilePictureClick: PropTypes.func.isRequired,
  editted: PropTypes.bool.isRequired
};

const enhance = compose(
  withState('isHover', 'setHover', false),
  withHandlers({
    onMouseEnter: props => () => props.setHover(true),
    onMouseLeave: props => () => props.setHover(false)
  })
);

export default enhance(ProfilePicture);

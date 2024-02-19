import { React } from 'react';
import PropTypes from 'prop-types';

export default function EntityModal({ entity, visible, close }) {
  return (
    <div
      className={`modal modal_entities
        ${visible ? 'modal-visible' : 'modal-hidden'}`}
    >
      <div className='modal_header'>
        <h3 className='modal_entities_header'>{entity.NAME}</h3>
        <button
          onClick={close}
          className='modal_close'
          type='button'
          aria-label='close modal'
        />
      </div>
      <div> kek </div>
    </div>
  );
}

EntityModal.propTypes = {
  entity: PropTypes.shape({
    NAME: PropTypes.string,
  }),
  visible: PropTypes.bool,
  close: PropTypes.func,
};

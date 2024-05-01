import { React } from 'react';
import PropTypes from 'prop-types';

export default function EntityModal({ entity, visible, close }) {
  return (
    <div
      className={`modal modal_entities
        ${visible ? 'modal-visible' : 'modal-hidden'}`}
    >
      <div className='modal_header'>
        <h3 className='modal_entities_header'>{entity.entity}</h3>
        <button
          onClick={close}
          className='modal_entity_close'
          type='button'
          aria-label='close modal'
        />
      </div>
      <div> Information to be shown... </div>
    </div>
  );
}

EntityModal.propTypes = {
  entity: PropTypes.shape({
    entity: PropTypes.string,
  }),
  visible: PropTypes.bool,
  close: PropTypes.func,
};

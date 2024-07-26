import React from 'react';
import PropTypes from 'prop-types';

function EntityMessage({ message }) {
  console.log('--enity message---', message);
  return (
    <div className=' chat_message chat_message-entity entity-message-container'>
      <h3>{message.answer['Entity Title']}</h3>

      <p>{message.answer.Description}</p>
    </div>
  );
}

EntityMessage.propTypes = {
  message: PropTypes.shape({
    answer: PropTypes.shape({
      'Entity Title': PropTypes.string.isRequired,
      Description: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default EntityMessage;

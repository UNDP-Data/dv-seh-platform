import { React } from 'react';
import PropTypes from 'prop-types';

export default function UserMessage({ message }) {
  return (
    <div className='chat_message chat_message-user chat_message_content'>
      <div className='message_icon' />
      <div className='message_text'>{message.answer}</div>
    </div>
  );
}

UserMessage.propTypes = {
  message: PropTypes.shape({
    query: PropTypes.string,
    answer: PropTypes.string,
  }),
};

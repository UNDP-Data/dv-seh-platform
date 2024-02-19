import { React } from 'react';
import PropTypes from 'prop-types';

export default function ApiMessage({ message }) {
  return (
    <div className='chat_message chat_message-api'>
      <div className='message_icon' />
      <div
        className='message_text'
        dangerouslySetInnerHTML={{ __html: message.answer }}
      />
      <div className='message_interactions'>
        <button
          type='button'
          aria-label='like responce'
          className='message_interaction_button message_interactions_button-like'
        />
        <button
          type='button'
          aria-label='dislike responce'
          className='message_interaction_button message_interactions_button-dislike'
        />
      </div>
    </div>
  );
}

ApiMessage.propTypes = {
  message: PropTypes.shape({
    query: PropTypes.string,
    answer: PropTypes.string,
  }),
};

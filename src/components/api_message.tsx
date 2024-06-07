/* eslint-disable */
import { React, useState } from 'react';
import { Flex } from 'antd';
import PropTypes from 'prop-types';

//import SourcesModal from './sources_modal';

export default function ApiMessage({ message }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };
  return (
    <div className='chat_message chat_message-api'>
      <div className='chat_message_content'>
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
      <Flex className='margin-top-04' justify='end' align='center'>
        View sources
        <button
          onClick={togglePopup}
          label='sources'
          type='button'
          className='sources_button margin-left-02'
        />
      </Flex>
{/*       <SourcesModal
        close={togglePopup}
        visible={popupVisible}
        message={message}
      /> */}
    </div>
  );
}

ApiMessage.propTypes = {
  message: PropTypes.shape({
    query: PropTypes.string,
    answer: PropTypes.string,
  }),
};

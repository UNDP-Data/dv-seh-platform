import { React, useState, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Flex, Row, Col, Dropdown } from 'antd';
import { useLocation } from 'react-router-dom';
import service from '../services';

function Message({ content, source }) {
  return (
    <div className={`chat_message chat_message-${source}`}>
      <div className='message_icon' />
      <div className='message_text'>{content}</div>
      <div className='message_interactions'>
        {source === `api` ? (
          <>
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
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

Message.propTypes = {
  content: PropTypes.string,
  source: PropTypes.string,
};

export default function Landing() {
  const { state } = useLocation();

  const [messages, setMessages] = useState(() => {
    return state.messages ? state.messages : [];
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = event => {
    setMessage(event.target.value);
  };

  const messagesEndRef = createRef();

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => scrollToBottom(), [messages]);

  async function postMessage(userMessage) {
    setLoading(true);
    let newMessages = messages.concat([
      {
        content: userMessage,
        source: 'user',
      },
    ]);
    setMessages(newMessages);
    const responce = await service.askQuestion(userMessage);
    newMessages = newMessages.concat([
      {
        content: responce,
        source: 'api',
      },
    ]);
    setMessages(newMessages);
    setLoading(false);
    setMessage('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (message === '') return;
    postMessage(message);
  }

  let items;

  function selectSuggestion(e) {
    postMessage(items[e.key].label);
  }

  items = [
    {
      key: '0',
      onClick: selectSuggestion,
      label:
        'What is the sum of budgets for active energy-related project for the Latin America and Caribbean region?',
    },
    {
      key: '1',
      onClick: selectSuggestion,
      label: 'What renewable energy sources are used in China?',
    },
    {
      key: '2',
      onClick: selectSuggestion,
      label: 'What legal acts regulate European green energy?',
    },
  ];

  return (
    <Flex
      className='search-bg'
      vertical
      style={{ width: '100%', minHeight: '100vh' }}
    >
      <Row>
        <Col className='ai_chat_block' span={12}>
          <Row align='middle'>
            <Col offset={1} span={5}>
              <img
                className='chat_logo'
                width='220'
                alt='Sustainable Energy Hub'
                src='/logo-white-regular.png'
              />
            </Col>
            <Col span={18}>
              <h1 className='header_header margin-bottom-00'>
                Energy Moonshot AI
              </h1>
            </Col>
          </Row>
          <Row className='chat'>
            <Col span={24}>
              <div className='padding-left-08'>
                {messages.map(({ source, content }, i) => {
                  return <Message source={source} content={content} key={i} />;
                })}
              </div>
            </Col>
            <div ref={messagesEndRef} />
          </Row>
          <Row>
            <Col
              span={24}
              className='padding-left-08 padding-bottom-06 padding-top-04'
            >
              <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                <input
                  onChange={handleChange}
                  disabled={loading}
                  value={message}
                  className={`search_input search_input_chat
                    ${loading ? 'search_input-loading' : ''}`}
                  type='search'
                />
                <button
                  onClick={handleSubmit}
                  aria-label='search'
                  type='button'
                  className={`search_button
                    ${loading ? 'search_button-loading' : ''}`}
                />
                <Dropdown placement='top' menu={{ items }}>
                  <button
                    aria-label='prompt ideas'
                    type='button'
                    className='search_ideas'
                    onClick={e => e.preventDefault()}
                  >
                    Prompt Ideas
                  </button>
                </Dropdown>
              </form>
            </Col>
          </Row>
        </Col>
        <Col span={12}>lang</Col>
      </Row>
    </Flex>
  );
}

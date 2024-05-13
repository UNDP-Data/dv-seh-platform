import { React, useState, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
/* eslint-disable react/forbid-prop-types */
import { Flex, Row, Col, Dropdown } from 'antd';
import { useLocation } from 'react-router-dom';
import service from '../services';
import DataGraph from '../components/data_graph.tsx';
import ApiMessage from '../components/api_message.tsx';
import UserMessage from '../components/user_message.tsx';
import EntityModal from '../components/entity_modal.tsx';

function Message({ message, source }) {
  return source === `api` ? (
    <ApiMessage message={message} />
  ) : (
    <UserMessage message={message} />
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    answer: PropTypes.string,
  }),
  source: PropTypes.string,
};

function DataGraphContainer({ activeEnteties, setPopupData, setPopupVisible }) {
  return (
    <Col xs={0} lg={12}>
      <DataGraph
        activeEnteties={activeEnteties}
        setPopupData={setPopupData}
        setPopupVisible={setPopupVisible}
      />
    </Col>
  );
}

DataGraphContainer.propTypes = {
  activeEnteties: PropTypes.arrayOf(PropTypes.object),
  setPopupData: PropTypes.func,
  setPopupVisible: PropTypes.func,
};

export default function Landing() {
  const { state } = useLocation();
  const [popupData, setPopupData] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [messages, setMessages] = useState(() => {
    return state.messages ? state.messages : [];
  });

  const [promptSuggestions, setPromptSuggestions] = useState(() => {
    return state.messages
      ? state.messages[1].message.query_ideas.map((query_ideas, index) => {
          return {
            key: index.toString(),
            label: query_ideas,
          };
        })
      : [];
  });

  const [activeEnteties, setActiveEnteties] = useState(() => {
    return state.messages ? state.messages[1].message.kg_data : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      const fullResponse = await service.askQuestion(
        state.messages[0].message.answer,
        'full',
      );
      const updatedMessages = state.messages.map((msg, index) =>
        index === 1 ? { ...msg, message: fullResponse } : msg,
      );

      setMessages(updatedMessages);
    };
    fetchData();
  }, []);

  const [chatBoxMessage, setChatBoxMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    setPopupVisible(false);
  };
  const handleChange = event => {
    setChatBoxMessage(event.target.value);
  };

  const messagesEndRef = createRef();

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => scrollToBottom(), [messages]);

  async function postMessage(userMessage) {
    // console.log(promptSuggestions);
    setLoading(true);
    let newMessages = messages.concat([
      {
        message: {
          answer: userMessage,
        },
        source: 'user',
      },
    ]);
    setMessages(newMessages);
    let responce;
    let partialResponse;
    try {
      partialResponse = await service.askQuestion(userMessage, 'partial');
      await setActiveEnteties(partialResponse.kg_data);
      responce = await service.askQuestion(userMessage, 'full');
    } catch (e) {
      setLoading(false);
    }
    newMessages = newMessages.concat([
      {
        message: responce,
        source: 'api',
      },
    ]);

    setPromptSuggestions(
      responce.query_ideas.map((query_ideas, index) => {
        return {
          key: index.toString(),
          label: query_ideas,
        };
      }),
    );
    setMessages(newMessages);
    setLoading(false);
    setChatBoxMessage('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (chatBoxMessage === '') return;
    postMessage(chatBoxMessage);
  }

  function selectSuggestion(e) {
    postMessage(promptSuggestions[e.key].label);
  }

  return (
    <Flex
      className='search-bg'
      vertical
      style={{ width: '100%', minHeight: '100vh' }}
    >
      <Row>
        <Col className='ai_chat_block' xs={24} lg={12}>
          <Row align='middle'>
            <Col offset={1} xs={6} lg={4} xl={4}>
              <img
                className='chat_logo'
                width='220'
                alt='Sustainable Energy Hub'
                src='/logo-white-regular.png'
              />
            </Col>
            <Col xs={17} lg={19} xl={19}>
              <h1 className='header_header-chat header_header margin-bottom-00'>
                Energy Moonshot AI
              </h1>
            </Col>
          </Row>
          <div className='chat-modal-wrap'>
            <Row className='chat'>
              <Col xs={24} lg={{ span: 23, offset: 1 }}>
                <div>
                  {messages.map(({ source, message }, i) => {
                    return (
                      <Message source={source} message={message} key={i} />
                    );
                  })}
                </div>
              </Col>
              <div ref={messagesEndRef} />
            </Row>
            <EntityModal
              visible={popupVisible}
              entity={popupData}
              close={handleCancel}
            />
          </div>
          <Row>
            <Col
              span={22}
              offset={1}
              className='padding-bottom-06 padding-top-04'
            >
              <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                <input
                  onChange={handleChange}
                  disabled={loading}
                  value={chatBoxMessage}
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
                <Dropdown
                  placement='top'
                  menu={{ items: promptSuggestions, onClick: selectSuggestion }}
                >
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
        <DataGraphContainer
          activeEnteties={activeEnteties}
          setPopupData={setPopupData}
          setPopupVisible={setPopupVisible}
        />
      </Row>
    </Flex>
  );
}

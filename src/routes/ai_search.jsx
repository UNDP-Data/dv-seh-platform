import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

import service from '../services';

function Card({ title, text, icon }) {
  return (
    <div className='search-card'>
      <img className='search-card_icon' src={`/${icon}.svg`} alt={title} />
      <div className='search-card_title'>{title}</div>
      <div className='search-card_text'>{text}</div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.string,
};

export default function Landing() {
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');

  const handleChange = event => {
    setMessage(event.target.value);
  };
  const toggleLoading = () => {
    setLoading(!loading);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    toggleLoading();
    const responce = await service.askQuestion(message);
    navigate('/chat', {
      state: {
        messages: [
          {
            content: message,
            source: 'user',
          },
          {
            content: responce,
            source: 'api',
          },
        ],
      },
    });
  }

  return (
    <Flex
      className='search-bg'
      vertical
      style={{ width: '100%', minHeight: '100vh' }}
    >
      <Row>
        <Col span={5}>
          <img
            width='220'
            alt='Sustainable Energy Hub'
            src='/logo-white-regular.png'
          />
        </Col>
        <Col offset={14} span={5}>
          lang
        </Col>
      </Row>
      <Row className='margin-top-auto margin-bottom-0'>
        <Col offset={6} span={12}>
          <div className='header'>
            <div className='header_welcome'>Welcome to the</div>
            <h1 className='header_header'>Energy Moonshot AI</h1>
            <div className='header_small'>
              Accelerating the sustainable and just energy transition
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <input
              className={`search_input
                ${loading ? 'search_input-loading' : ''}`}
              type='search'
              disabled={loading}
              onChange={handleChange}
              value={message}
              placeholder='Example : “How many beneficiaries are there per region for UNDP energy projects active in 2022?”'
            />
            <button
              onClick={handleSubmit}
              aria-label='search'
              type='button'
              className={`search_button
                ${loading ? 'search_button-loading' : ''}`}
            />
          </form>
        </Col>
      </Row>
      <Row className='margin-bottom-auto margin-top-auto padding-top-06'>
        <Col offset={5} span={4}>
          <Card
            title='Data Insights'
            text='Ask data science questions about the UNDP Energy Portfolio or country-level statistics and generate analysis, tables, and graphs'
            icon='insights'
          />
        </Col>
        <Col offset={1} span={4}>
          <Card
            title='Personalized answers'
            text='Answers are based on your unique questions, and our vast database of information'
            icon='answers'
          />
        </Col>
        <Col offset={1} span={4}>
          <Card
            title='Generative Text'
            text='Get custom text generated for energy policies, NDCs,  targets, or other documents on renewable energy and the just energy transition'
            icon='generative'
          />
        </Col>
      </Row>
    </Flex>
  );
}

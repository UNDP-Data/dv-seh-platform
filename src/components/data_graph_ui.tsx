import { SearchOutlined } from '@ant-design/icons';
import { Tooltip, Popover, Input, Space, Button } from 'antd';
import PropTypes from 'prop-types';

import { React, useState } from 'react';
import { FaSearch, FaInfoCircle } from 'react-icons/fa';

export default function DataGraphUi({ graphSearch }) {
  const [searchMessage, setSearchMessage] = useState('');

  const handleSearchMessageChange = event => {
    setSearchMessage(event.target.value);
  };

  const submitSearch = () => {
    graphSearch(searchMessage);
  };

  const searchInput = () => {
    return (
      <Space.Compact style={{ width: '100%' }}>
        <Input
          onPressEnter={submitSearch}
          onChange={handleSearchMessageChange}
          value={searchMessage}
          placeholder='Search'
        />
        <Button
          onClick={submitSearch}
          type='primary'
          icon={<SearchOutlined />}
        />
      </Space.Compact>
    );
  };

  return (
    <div className='graph-ui'>
      <Popover
        rootClassName='popup-no-padding'
        content={searchInput}
        placement='left'
        trigger='click'
      >
        <Tooltip placement='left' title='Search graph'>
          <button
            type='button'
            aria-label='Search graph'
            className='graph-ui_button graph-ui_button-search'
          >
            Search
            <FaSearch />
          </button>
        </Tooltip>
      </Popover>
      <Tooltip placement='left' title='About graph'>
        <button
          type='button'
          aria-label='About graph'
          className='graph-ui_button graph-ui_button-about'
        >
          About
          <FaInfoCircle style={{ marginLeft: '8px' }} />
        </button>
      </Tooltip>
    </div>
  );
}

DataGraphUi.propTypes = {
  graphSearch: PropTypes.func,
};

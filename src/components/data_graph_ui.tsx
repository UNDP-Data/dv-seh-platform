import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, Popover, Input, Space, Button } from 'antd';

const searchInput = function searchInput() {
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input placeholder='Search' />
      <Button type='primary' icon={<SearchOutlined />} />
    </Space.Compact>
  );
};

export default function DataGraphUi() {
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
            <SearchOutlined />
          </button>
        </Tooltip>
      </Popover>
      <Tooltip placement='left' title='About graph'>
        <button
          type='button'
          aria-label='About graph'
          className='graph-ui_button graph-ui_button-about'
        >
          <InfoCircleOutlined />
        </button>
      </Tooltip>
    </div>
  );
}

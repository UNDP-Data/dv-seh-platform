import { React } from 'react';
import { createPortal } from 'react-dom';
import { PiGraphThin } from 'react-icons/pi';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import defaultImage from '../../public/bg-landing-main.jpg';

function Source({ source }) {
  return (
    <div className='modal_sources_item'>
      <h4 className='modal_sources_title'>
        <a
          style={{ color: 'blue' }}
          target='_blank'
          rel='noreferrer'
          href={source.document_link}
        >
          {source.document_title}
        </a>
      </h4>
      <div className='modal_sources_content'>
        <Row>
          <Col xs={16}>
            <p> {source.summary} </p>
          </Col>
          <Col xs={8}>
            <a
              className='modal_sources_thumbnail'
              target='_blank'
              rel='noreferrer'
              href={source.document_link}
            >
              <img
                className='modal_sources_thumbnail-img'
                alt={source.document_title}
                src={
                  source.document_thumbnail
                    ? `data:image/jpeg;base64,${source.document_thumbnail}`
                    : defaultImage
                }
              />
            </a>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: '18px',
              }}
            >
              <button type='button' className='knowledge-graph-btn'>
                knowledge Graph
                <PiGraphThin style={{ marginLeft: '10px' }} />
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default function SourcesModal({ message, visible, close }) {
  const sources = Object.values(message.excerpts_dict);
  return (
    <>
      {createPortal(
        <div
          className={`modal modal_sources
            ${visible ? 'modal-visible' : 'modal-hidden'}`}
        >
          <div className='modal_header'>
            <h3 className='modal_sources_header'>Sources</h3>
            <button
              onClick={close}
              className='modal_close'
              type='button'
              aria-label='close modal'
            />
          </div>
          <div>
            {sources.map((source, i) => {
              return <Source source={source} key={i} />;
            })}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

SourcesModal.propTypes = {
  message: PropTypes.shape({
    query: PropTypes.string,
    answer: PropTypes.string,
    excerpts_dict: PropTypes.shape({}),
  }),
  visible: PropTypes.bool,
  close: PropTypes.func,
};

Source.propTypes = {
  source: PropTypes.shape({
    document_link: PropTypes.string,
    document_title: PropTypes.string,
    summary: PropTypes.string,
    document_thumbnail: PropTypes.string,
  }),
};

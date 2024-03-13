import { React } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

function Source({ source }) {
  return (
    <div className='modal_sources_item'>
      <h4 className='modal_sources_title'>
        <a target='_blank' rel='noreferrer' href={source.link}>
          {source.title}
        </a>
      </h4>
      <div className='modal_sources_content'>
        <p> {source.extract} </p>
        <a
          className='modal_sources_thumbnail'
          target='_blank'
          rel='noreferrer'
          href={source.link}
        >
          <img
            className='modal_sources_thumbnail-img'
            alt={source.title}
            src={source.thumbnail}
          />
        </a>
      </div>
    </div>
  );
}

export default function SourcesModal({ message, visible, close }) {
  const sources = Object.values(message.sources);
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
    sources: PropTypes.shape({}),
  }),
  visible: PropTypes.bool,
  close: PropTypes.func,
};

Source.propTypes = {
  source: PropTypes.shape({
    link: PropTypes.string,
    title: PropTypes.string,
    extract: PropTypes.string,
    thumbnail: PropTypes.string,
  }),
};

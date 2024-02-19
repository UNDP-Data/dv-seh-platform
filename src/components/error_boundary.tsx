import { Component } from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error) {
    this.setState({ error: `${error.name}: ${error.message}` });
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;
    if (error) {
      return (
        <>
          {error}
          {children}
        </>
      );
    }
    return (
      <>
        kek
        {children}
      </>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element,
};

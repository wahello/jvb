import React, { PropTypes } from 'react';

const HomePageReactTitle = ({ title }) => {
  const homeURL = window.Django.url('home');

  return <h2>TESTING</h2>;
};

HomePageReactTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HomePageReactTitle;

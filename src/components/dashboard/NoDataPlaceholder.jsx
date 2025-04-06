import React from 'react';
import PropTypes from 'prop-types';
import { FaInbox } from 'react-icons/fa';

const NoDataPlaceholder = ({ message }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <FaInbox className="text-gray-400 text-5xl mx-auto mb-4" />
      <p className="text-xl text-gray-500">{message}</p>
    </div>
  );
};

NoDataPlaceholder.propTypes = {
  message: PropTypes.string.isRequired,
};

export default NoDataPlaceholder;

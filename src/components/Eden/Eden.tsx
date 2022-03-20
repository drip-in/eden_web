import React from 'react';
import './Eden.scss';
import img from '../../common/imgs/eden.png';

interface EdenPropsType {
  message: string;
}

const Eden: React.FC<EdenPropsType> = ({ message }) => (
  <div className="wrapper">
    <img className="App-logo" src={img} alt="eden" />
    <p>{message}</p>
  </div>
);

export default Eden;

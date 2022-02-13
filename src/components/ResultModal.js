import React from 'react';
import { Modal } from 'antd';

function ResultModal({ isModalVisible, setIsModalVisible, result, winningURL }) {
  return (
    <Modal title="You Won" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => setIsModalVisible(false)}>
      <p>{result}</p>
      <p>
        Make a <a href={`https://twitter.com/intent/tweet?text=I%20won%20prize%20at%20Stake%20Wheel&url=${winningURL}`} target="_blank" rel="noopener noreferrer">Tweet</a> about your winning
      </p>
    </Modal>
  )
}

export default ResultModal;

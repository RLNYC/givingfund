import React from 'react';
import { Modal } from 'antd';

function ResultModal({ isModalVisible, setIsModalVisible, result, winningURL }) {
  return (
    <Modal title={result === "Nothing" ? "Try Again" : "You Won"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => setIsModalVisible(false)}>
      <p>{result}</p>
      {result === "Nothing"
        ? <p>Sorry, try again</p>
        : <p>
            Make a <a href={`https://twitter.com/intent/tweet?text=I%20won%20prize%20at%20Giving%20Fund&url=${winningURL}`} target="_blank" rel="noopener noreferrer">Tweet</a> about your winning
          </p>
      }
    </Modal>
  )
}

export default ResultModal;

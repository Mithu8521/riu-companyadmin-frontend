import React from "react";
import image from '../../../../../img/Close.svg'
import "./FrameworkModal.css"; // Add CSS for styling the modal

const FrameworkModal = ({ frameworks, onSelectFramework, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-headerrrr ">
          Subscribed Frameworks
          <button className="close-button ms-4" onClick={onClose}>
            <img src={image}></img>{" "}

          </button>
        </div>
        <div className="modal-body">
          {frameworks?.length > 0 ? (
            frameworks.map((framework) => (
              <div key={framework.id} className="framework-item">
                <span>{framework.title}</span>
                <button onClick={() => onSelectFramework(framework)}>
                  Select
                </button>
              </div>
            ))
          ) : (
            <p>No frameworks available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrameworkModal;

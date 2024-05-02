

const Popup = ({ onClose, title, content, buttons }) => {
    return (
      <div className="popup-overlay">
        <div className="popup">
          <div className="popup-content">
            {title && <h2>{title}</h2>}
            {content && <div>{content}</div>}
            {buttons && buttons.map((button, index) => (
              <button key={index} onClick={button.onClick}>{button.label}</button>
            ))}
            <br/>
            <br/>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };


  export default Popup
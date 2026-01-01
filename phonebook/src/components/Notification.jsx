// src/components/Notification.jsx
const Notification = ({ message, type }) => {
  if (!message) return null;

  const style = {
    color: type === 'success' ? 'green' : 'red',
    background: '#f0f0f0',
    fontSize: 16,
    border: `2px solid ${type === 'success' ? 'green' : 'red'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={style}>{message}</div>;
};

export default Notification;

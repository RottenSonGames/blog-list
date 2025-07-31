const Message = ({ message, success}) => {
  if (!message) return null

  const baseStyle = {
    background: 'lightgray',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    fontStyle: 'italic',
    fontSize: 20
  }

  const style = {
    ...baseStyle,
    color: success ? 'green' : 'red'
  }

  return <div style={style}>{message}</div>
}

export default Message
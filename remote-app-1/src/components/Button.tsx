function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      style={{ padding: '10px 20px', cursor: 'pointer' }}
    >
      {label}
    </button>
  )
}

export default Button

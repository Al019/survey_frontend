import { Button } from "@material-tailwind/react"

const Btn = ({ label, onClick, icon, loading, className, ...rest }) => {
  return (
    <Button onClick={onClick} loading={loading} {...rest} className={`flex items-center justify-center gap-2 ${className}`}>
      {icon && (
        <div className={`${loading ? 'hidden' : ''}`}>
          {icon}
        </div>
      )}
      <span>{label}</span>
    </Button>
  )
}

export default Btn
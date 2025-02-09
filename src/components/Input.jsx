import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { Button, Input } from "@material-tailwind/react"
import { useState } from "react"

const Inpt = ({ label, onChange, secureTextEntry, ...rest }) => {
  const [toogle, setToogle] = useState(false)

  return (
    <Input onChange={onChange} label={label} type={secureTextEntry && !toogle ? 'password' : 'text'} color="green" icon={secureTextEntry && (
      <div className='absolute inset-y-0 flex items-center'>
        <Button onClick={() => setToogle(!toogle)} variant="text" size="sm" className="flex items-center rounded-full p-1 text-blue-gray-500" tabIndex={-1}>
          {!toogle ? (
            <EyeSlashIcon className="size-5" />
          ) : (
            <EyeIcon className="size-5" />
          )}
        </Button>
      </div>
    )} {...rest} />
  )
}

export default Inpt
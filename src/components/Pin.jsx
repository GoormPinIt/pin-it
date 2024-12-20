import React from 'react'
import Button from './Button'
import { IoShareOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";

const Pin = ({src}) => {
  return (
    <div className="relative hover:bg-blend-darken ">
      
      <img src={src} className="w-full object-cover rounded-3xl"/>
      <div className=" absolute inset-0 hover:bg-black hover:bg-opacity-50 w-full rounded-3xl opacity-0 hover:opacity-100">
      <Button className='absolute top-3 right-3'>Save</Button>
      <div className="absolute bottom-3 right-3 w-96 justify-around">
        <Button className="bg-slate-200 hover:bg-slate-300">
            <IoShareOutline className="text-neutral-900 mx-2" />
        </Button>
        <Button className="bg-slate-200 hover:bg-slate-300">
          <IoIosMore className="text-neutral-900" />
        </Button>
      </div>
      </div>
    </div>
  )
}

export default Pin

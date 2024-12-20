import React from 'react'
import Button from '../../../components/Button'
const Head = () => {
  return (
    <div className='fixed top-0 w-full h-24 flex justify-between bg-white z-50'>
      <div>
        <img
          className="object-fill w-24 h-24 "  
          src="https://media.discordapp.net/attachments/1316210767606972523/1318009107072159784/2024-12-13_10.06.56.png?ex=6762bd62&is=67616be2&hm=fc24e6fce869bae7e28cd9912fdb34479308db6f242877cbe768602740f73d1d&=&format=webp&quality=lossless&width=1668&height=1112"/>
      </div>

      <div className="flex w-2/5 justify-around items-center">
        <p className="text-xl font-semibold hover:text-gray-600 duration-75">About</p>
        <p className="text-xl font-semibold hover:text-gray-600 duration-75">Business</p>
        <p className="text-xl font-semibold hover:text-gray-600 duration-75">Blog</p>
        <div className="flex justify-around w-1/3"> 
          <Button>Log in</Button>
          <Button className="bg-gray-200 text-black hover:bg-gray-300">Sign up</Button>
        </div>
      </div>
    </div>
  )
}

export default Head

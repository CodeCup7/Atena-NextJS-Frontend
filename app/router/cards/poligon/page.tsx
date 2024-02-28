import React from 'react'

const Poligon = () => (
  <div>

    <div className='flex flex-col border-2 border-info rounded-lg justify-center'>
      <div className='flex m-2 gap-2'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <h1 className='text-info text'>Waga</h1>
      </div>
      <div>
        <hr className=" h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
      </div>
      <div className='flex items-center justify-center'>
        <h1 className='text-info text-3xl'>20%</h1>
      </div>
    </div>
    <div className='flex flex-col border-2 border-info rounded-lg justify-center'>
      <div className='flex m-2 gap-2'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>

        <h1 className='text-info text'>Ocena</h1>
      </div>
      <div>
        <hr className=" h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
      </div>
      <div className='flex items-center justify-center'>
        <h1 className='text-info text-3xl'>20%</h1>
      </div>
    </div>


  </div>
)

export default Poligon
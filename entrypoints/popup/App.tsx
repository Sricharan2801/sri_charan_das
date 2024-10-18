
function App() {

  return (
    <>

      <div className='flex flex-col items-center p-[20px] gap-3'> <img src="/wxt.svg" alt="" className='h-8 w-8 bg-black rounded-full ' />
        <h1 className='text-lg font-bold'>ChatGpt Writer</h1>
      </div>
      <div className='pl-[30px] pr-[30px] '>
        <p className='text-sm text-center'>ChatGPT Writer is a Chrome extension designed to help you craft messages quickly and efficiently. By leveraging AI, it provides text suggestions as you type, allowing you to focus more on your core tasks and less on the typing itself.</p>
        <div className='mt-2 mb-2 flex justify-center items-center'>
          <button className='bg-green-600 text-white font-semibold pb-[6px] pt-[6px] w-52 rounded-md hover:font-bold'>Get Started</button>
        </div>
      </div>

    </>
  );
}

export default App;
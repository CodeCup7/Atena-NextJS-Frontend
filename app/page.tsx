import Image from 'next/image'

export default function Home() {

  return (
    <div className="container mx-auto w-full items-center justify-center 2xl:border-x-8 2xl:border-neutral-focus">

      <div className="flex flex-row items-center justify-center m-10">
        <Image className='items-center' src={'/logo.png'} alt="Logo" width={600} height={600} priority />
      </div>

      <h1 className="text-center text-2xl text-info m-10">Centralny system monitorowania jakości</h1>
    </div>
  )
}
// ================= Losowa zmiana obrazka ============================

// const images = useMemo(() => ['/logo.png', '/logo.png'], []);
// const [currentIndex, setIndex] = useState(0);

// useEffect(() => {
//   const intervalId = setInterval(() => {
//     const newIndex = Math.floor(Math.random() * images.length);
//     setIndex(newIndex);
//   }, 1000);
// return () => clearInterval(intervalId); // Wyczyszczenie interwału po odmontowaniu komponentu
// }, [currentIndex, images]);

// <Image className='items-center' src={images[currentIndex]} alt="Logo" width={600} height={600} priority />

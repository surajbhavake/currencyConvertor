import { useState ,useEffect, use} from 'react'
import useCurrencyInfo from './hooks/useCurrencyInfo'
import './App.css'
import {InputBox} from './components'

function App() {
  const [amount,setAmount] = useState("")
  const [from,setFrom] = useState("usd")
  const [to,setTo] = useState("inr")

  const [convertedAmount,setConvertedAmount] = useState(0)

  const { data: currencyInfo, loading ,error } = useCurrencyInfo(from)
  

  const options = Object.keys(currencyInfo)

  // swapping

  const [isSwapping,setIsSwapping] = useState(false)
  const swap = () =>{
    setIsSwapping(true)
    
    setTimeout(()=>{
      const temp = from
      setFrom(to)
      setTo(temp)
      setAmount(convertedAmount)
      
      setIsSwapping(false)
    },300)
  }
  

const [history,setHistory] = useState([])
useEffect(() => {
  if (amount && currencyInfo[to]) {
    const result = Number(amount) * currencyInfo[to]
    setConvertedAmount(result)
  }
}, [amount, to, currencyInfo])

const [triggerConvert,setTriggerConvert] = useState(false)

const handelConvert = () => {
    setTriggerConvert(true)
}

useEffect(()=>{
    if(!triggerConvert) return
    if(!amount || !currencyInfo[to]) return

    const result = Number(amount) * currencyInfo[to]

    const newEntry = {
        amount : amount,
        from : from,
        to : to,
        result : result,
    }

    setHistory((prev) => [newEntry,...prev.slice(0,4)])

    setTriggerConvert(false)
},[triggerConvert])


//Local Storage

const [isLoaded,setIsLoaded] = useState(false)


//load

useEffect(()=>{
    const saved = localStorage.getItem("history")
    
    if(saved){
        setHistory(JSON.parse(saved))
    }
    setIsLoaded(true)
},[])

//save
useEffect(()=>{
    if(!isLoaded) return
    localStorage.setItem("history",JSON.stringify(history))
},[history , isLoaded])



//Dark mode 

const [darkMode, setDarkMode] = useState(false)
const [darkLoaded,setDarkLoaded] = useState(false)

useEffect(()=>{
    const saved = localStorage.getItem("darkMode")

    if(saved){
        setDarkMode(JSON.parse(saved))
    }
    setDarkLoaded(true)
},[])

useEffect(()=>{
    if(!darkLoaded) return
    localStorage.setItem("darkMode",JSON.stringify(darkMode))
},[darkMode])

if (loading) return <p>Loading...</p>
if(error) return <p>{error}</p>

   return (
        <div
            className={`w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat
                ${darkMode ? "bg-gray-900 " : "bg-white/30 text-black"}`} 
            style={{
                backgroundImage: `url('https://pixabay.com/illustrations/backpacker-road-walk-anime-7628303/')`,
            }}
        >
            <div className="w-full">
                
              <div className={`transition-all duration-300 ${isSwapping ? "scale-95" : ""}`}>
                
                <div className="w-[350px]  mx-auto   rounded-3xl p-6 backdrop-blur-xl shadow-xl bg-gray-200">

               
                
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                           
                           
                        }}
                    >
                        <div className="w-full mb-1">
                            <InputBox
                            className='text-black  '
                                label="From"
                                amount={amount}
                                currencyOptions={options}
                                selectCurrency={from}
                                onAmountChange={(amount)=> setAmount(amount)}
                                onCurrencyChange={(currency) => setFrom(currency)}
                                
                            />
                        </div>
                        <div className="relative w-full h-0.5">
                         
                            <button
                                type="button"
                                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-full text-sm bg-black text-white cursor-pointer font-semibold px-3 py-1 hover:scale-105 transition"
                                onClick={swap}
                            >
                                swap
                            </button>
                        
                        </div>
                        <div className="w-full mt-1 mb-4">
                            <InputBox
                            className='text-black'
                                label="To"
    
                                amount={convertedAmount.toFixed(2)}
                                currencyOptions={options}
                                selectCurrency={to}
                               amountDisable
                                onCurrencyChange={(currency) => setTo(currency)}
                                
                            />
                        </div>
                        <button 
                        onClick={handelConvert}
                        type="button" className="w-full mt-4 py-3 rounded-full 
bg-black text-white font-semibold 
hover:scale-105 transition cursor-pointer">
                            Convert {from.toUpperCase()} to {to.toUpperCase()}
                        </button>
                    </form>

                     <div className='mt-4 p-2 bg-white rounded-2xl '>
                    <h2 className='text-lg font-bold p-2'>History</h2>

                    {history.map((item,index)=>(
                        <div key={index}
                        className='max-w-100 text-sm bg-gray-400/50 p-3  rounded-2xl mb-1.5 cursor-pointer hover:bg-gray-400/75 hover:scale-101  transition font-semibold'
                        onClick={()=>{
                            setAmount(item.amount)
                            setFrom(item.from)
                            setTo(item.to)
                        }}
                        >
                            {item.amount} {item.from.toUpperCase()} → {item.result.toFixed(2)} {item.to.toUpperCase()}
                        </div>
                    ))}

                    <button className='text-white  font-semibold
hover:scale-105 transition text-sm mt-2 bg-black px-3 py-2 rounded-2xl  cursor-pointer'
                    onClick={()=>(setHistory([]))}>Clear History</button>
                         <button
                onClick={()=> setDarkMode(!darkMode)}
                className={`mb-4 px-3 py-1 font-semibold hover:scale-105 transitionhover:scale-105 transition   rounded-2xl  ml-3 mt-3  cursor-pointer
                    ${darkMode ? "bg-white text-black border border-black " :"bg-black text-white"}
                    `
                    
                }


                >
                    {darkMode ? "☀️" : "🌙"}
                </button>
                </div>
                    
                </div>
            </div>
            <div>
           
            </div>
            
            </div>
        </div>
    );
}

export default App

import { useState ,useEffect} from 'react'
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
      setTo(from)
      setAmount(convertedAmount)
      setConvertedAmount(amount)
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




if (loading) return <p>Loading...</p>
if(error) return <p>{error}</p>

   return (
        <div
            className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat " 
            style={{
                backgroundImage: `url('https://pixabay.com/illustrations/backpacker-road-walk-anime-7628303/')`,
            }}
        >
            <div className="w-full">
                
              <div className={`transition-all duration-300 ${isSwapping ? "scale-95" : ""}`}>
                
                <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">

               
                
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                           
                           
                        }}
                    >
                        <div className="w-full mb-1">
                            <InputBox
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
                                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
                                onClick={swap}
                            >
                                swap
                            </button>
                        
                        </div>
                        <div className="w-full mt-1 mb-4">
                            <InputBox
                                label="To"
    
                                amount={convertedAmount}
                                currencyOptions={options}
                                selectCurrency={to}
                               amountDisable
                                onCurrencyChange={(currency) => setTo(currency)}
                                
                            />
                        </div>
                        <button 
                        onClick={handelConvert}
                        type="button" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg">
                            Convert {from.toUpperCase()} to {to.toUpperCase()}
                        </button>
                    </form>
                    
                </div>
            </div>
             <div className='mt-4 p-2'>
                    <h2 className='text-lg font-bold'>History</h2>

                    {history.map((item,index)=>(
                        <div key={index}
                        className='max-w-100 text-sm bg-gray-400/50 p-2 rounded mb-1 cursor-pointer hover:bg-gray-400/75'
                        onClick={()=>{
                            setAmount(item.amount)
                            setFrom(item.from)
                            setTo(item.to)
                        }}
                        >
                            {item.amount} {item.from.toUpperCase()} → {item.result.toFixed(2)} {item.to.toUpperCase()}
                        </div>
                    ))}

                    <button className='text-white text-sm mt-2 bg-blue-600 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-800'
                    onClick={()=>(setHistory([]))}>Clear History</button>
                </div>
            </div>
        </div>
    );
}

export default App

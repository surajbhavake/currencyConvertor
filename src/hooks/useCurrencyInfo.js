import { useState ,useEffect} from "react";

function useCurrencyInfo(currency){

    const [data,setData] = useState({})
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)
    useEffect(()=>{
        setLoading(true)
        setError(null)
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
        .then(((res)=> res.json()))
        .then((res)=>{
            setData(res[currency])
            setLoading(false)
        }
    )
    .catch(()=>{
        setError("Failed to fetch data")
        setLoading(false)
    })
    },[currency])
    console.log(data)
    return {data,loading,error}
}

export default useCurrencyInfo
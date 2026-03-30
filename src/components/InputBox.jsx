import React from 'react'
import { useId } from 'react';
import currencyData from '../data/currencyData';


function InputBox({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions=[],
    selectCurrency = "usd",
    amountDisable = false,
    currecyDisable = false,

    
    className = "",
}) {
   
    const amountInputId = useId()

    return (
        <div className={`bg-white p-3 rounded-2xl text-sm flex ${className}`}>
            <div className="w-1/2">
                <label htmlFor={amountInputId}  className="text-black/40 mb-2 inline-block font-semibold">
                    {label}
                </label>
                <input
                    id={amountInputId}
                    className="outline-none w-full bg-transparent py-1 font-semibold "
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e)=>{
                        const value = e.target.value

                        if(value< 0 ) return
                        if(value.length > 10) return
                        
                        onAmountChange && onAmountChange(value)
                    }}
                    disabled={amountDisable}
                    
                />
            </div>
            <div className="w-1/2 flex flex-wrap justify-end text-right">
                <p className="text-black/40 mb-2 w-full font-semibold">Currency Type</p>
                <select
                    className="rounded-2xl px-1.5 text-center py-2 font-semibold mb-2 bg-gray-300 cursor-pointer outline-none"
                    value={selectCurrency}
                    onChange={(e)=>(onCurrencyChange && onCurrencyChange(e.target.value))}
                    disabled={currecyDisable}
                    
                    
                >
                    
                        {currencyOptions.map((currency)=>(
                            <option key={currency} value={currency}>
                            {currencyData[currency]?.flag} {currency.toUpperCase()} - {currencyData[currency]?.name}
                        </option>
                
                        ))}
                </select>
            </div>
        </div>
    );
}

export default InputBox;

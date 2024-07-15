import React from 'react';

const InputField = ({inputString, setInputString, isAccepted}) => {
    return (
        <div className="updatenode_checkboxwrapper flex" style={{ alignContent: 'center', dispaly: 'flex' }}>
          <input 
            style={{ width: '70%'}} 
            class={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 
              ${isAccepted ? 'bg-green-100 border-green-500' : ''}`}
            value={inputString} 
            onChange={(evt) => setInputString(evt.target.value)} />
        </div>
    )
}

export default InputField;
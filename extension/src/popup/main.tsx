import React from 'react'
import ReactDOM from 'react-dom/client'

import Popup from './Popup'
import '../../../index.css' // Import global styles from parent

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>,
)

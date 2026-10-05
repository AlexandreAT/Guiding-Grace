import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Home from './pages/Home/Home.tsx'
import Select from './pages/Select/Select.tsx'
import Guide from './pages/Guide/Guide.tsx'
import Mechanics from './pages/Mechanics/Mechanics.tsx'
import Info from './pages/Info/Info.tsx'
import NotFound from './pages/NotFound/NotFound.tsx'

// Importações
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/select/:categoryId',
        element: <Select />
      },
      {
        path: '/guide/:buildId',
        element: <Guide />
      },
      {
        path: '/mechanics/:mechanicId',
        element: <Mechanics />
      },
      {
        path: '/info/:pageId',
        element: <Info />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

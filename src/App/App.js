import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import CalendarForm from './pages/CalendarForm'; 

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route index element={<Home />} />
      <Route path="form" element={<CalendarForm/>} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}


export default App;
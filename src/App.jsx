import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css'
import Home from './components/Home/Home';
import Login from "./components/Auth/RegisterAndLogin";


const Root = () => {
  return (
    <>
      <div className='Outlet'>
        <Outlet />
      </div>
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path='/' index element={<Login />} />
      <Route path='/home' element={<Home />} />
    </Route>
  )
);

function App() {

  return (
    <div>
      <div className="app">
        <RouterProvider router={router} />
      </div>
    </div>
  )


}

export default App

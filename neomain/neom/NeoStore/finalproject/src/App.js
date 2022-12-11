import React,{Suspense} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import ProductDetails from './Components/ProductDetails';
import Profile from './Components/Profile';
import Address from './Components/Address';
import ChangePassword from './Components/ChangePassword';
import Pdf from './Components/Pdf';
import SnackbarProvider from 'react-simple-snackbar'
import NotFound from './Components/NotFound';
import ThankuPage from './Components/ThankuPage';
// import loading from 'lazyloading.gif'
const PageHeader=React.lazy(()=>import('./Components/PageHeader'))
const LoginPage=React.lazy(()=>import('./Components/LoginPage'))
const PageFooter=React.lazy(()=>import('./Components/PageFooter'))
const RegisterPage=React.lazy(()=>import('./Components/RegisterPage'))
const ServerError=React.lazy(()=>import('./Components/ServerError'))
const Forgetten=React.lazy(()=>import('./Components/Forgetten'))
const MyAccount=React.lazy(()=>import('./Components/MyAccount'))
const Order=React.lazy(()=>import('./Components/Order'))
const Dashborad=React.lazy(()=>import('./Components/Dashborad'))
const Product=React.lazy(()=>import('./Components/Product'))
const Cart=React.lazy(()=>import('./Components/Cart'))
const CheckOut=React.lazy(()=>import('./Components/CheckOut'))
// const ProductDetails=React.lazy(()=>import('./Components/ProductDetails'))
// import LoginPage from './Components/LoginPage';
// import PageHeader from './Components/PageHeader';
// import PageFooter from './Components/PageFooter';
// import RegisterPage from './Components/RegisterPage';
// import ServerError from './Components/ServerError'
// import Forgetten from './Components/Forgetten';
// import MyAccount from './Components/MyAccount';
// import Order from './Components/Order';
// import Dashborad from './Components/Dashborad';
// import Product from './Components/Product';
function App() {
  return (
    <  >
    <Suspense fallback={<div className='Center'><img src='/Image/lazyloading.gif' /></div>}>
      <Router>
        <SnackbarProvider>
        <PageHeader/>
                <Routes>
                  <Route path='' exact element={<Dashborad/>}/>
                    <Route path='/LoginPage' exact element={<LoginPage/>}/>
                    <Route path='/RegisterPage' exact element={<RegisterPage/>}/>
                    <Route path='/ServerError' exact element={<ServerError/>}/>
                    <Route path='/Forgotten' exact element={<Forgetten/>}/>
                    <Route path='/Product' exact element={<Product/>}/>
                    <Route path='/CheckOut' exact element={<CheckOut/>}/>
                    <Route path='/Order' exact element={<Order/>}/>
                    <Route path='/ProductDetails' exact element={<ProductDetails/>}/>
                    <Route path='/Cart' exact element={<Cart/>}/>
                    <Route path='/Pdf' exact  element={<Pdf/>}/>
                    <Route path='/ThankYou' exact element={<ThankuPage/>}/>
                    <Route path='/MyAccount' exact element={<MyAccount/>}>
                                    <Route path='' exact element={<Order/>}/>
                                    <Route path='Profile' exact element={<Profile/>}/>
                                    <Route path='Address' exact element={<Address/>}/>
                                    <Route path='ChangePassword' exact element={<ChangePassword/>}/>
                    </Route>
                    <Route path="*" exact element={<NotFound/>}/>
                    </Routes>
                    <PageFooter/>
                    </SnackbarProvider>
            </Router>
            </Suspense>
    </>
  );
}

export default App;

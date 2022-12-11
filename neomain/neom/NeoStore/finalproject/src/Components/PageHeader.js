import React, { useEffect, useState } from 'react'
import { Nav, Navbar, Form, FormControl, Button, Dropdown, DropdownButton } from 'react-bootstrap'
import { Cart, PersonBadgeFill, Search } from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid'
import { GETCARTCOUNT } from '../config/myService'
import '../Css/PageHeader.css'
import '../Css/PageHeaderResponsive.css'
import { loginEnable, loginDisable } from '../State/actions/loginAction'
import { cartActions } from '../State/actions/cartActions'
import { GET_CART } from '../State/actions/getCartAction'
import { SearchAction } from '../State/actions/searchActions'
export default function PageHeader() {
    const history = useNavigate()
    const dispatch = useDispatch()
    const Logged = useSelector(state => state.loginReducer.Login)
    const [CartCount, setCartCount] = useState(0)
    const Uuid = useSelector(state => state.loginReducer.uuid)
    const cart = useSelector(state => state.cartReducer.cart)
    useEffect(() => {
        if (localStorage.getItem('_token')) {
            dispatch(loginEnable())
            let token = localStorage.getItem('_token')
            let decode = jwt_decode(token);
            let data = { id: decode.uid[0]._id }
            dispatch(GET_CART(data))
            // GETCARTCOUNT(data)
            //     .then(res => {
            //         setCartCount(res.data.count)
            //     })
            //     .catch(err => {
            //         if (err) {
            //             history('/ServerError')
            //         }
            //     })

        }
        else if (localStorage.getItem('uuid')) {
            let uuid = localStorage.getItem('uuid')
            dispatch(loginDisable(uuid))
            // dispatch({ type: 'disable', payload: uuid })
            let data = { id: uuid }
            dispatch(GET_CART(data))
            // GETCARTCOUNT(data)
            //     .then(res => {
            //         setCartCount(res.data.count)
            //         dispatch(cartActions( res.data.count))
            //         // dispatch({ type: 'cart', payload: res.data.count })
            //     })
            //     .catch(err => {
            //         if (err) {
            //             history('/ServerError')
            //         }
            //     })
        }
        else {
            let uuid = uuidv4()
            localStorage.setItem('uuid', uuid)
            dispatch(loginDisable(uuid))
            // dispatch({ type: 'disable', payload: uuid })
        }
    }, [])
    useEffect(() => {
        if (cart >= 0) {
            setCartCount(cart)
        }
        // if (localStorage.getItem('_token')) {
        //     let token = localStorage.getItem('_token')
        //     let decode = jwt_decode(token);
        //     let data = { id: decode.uid[0]._id }
        //     GETCARTCOUNT(data)
        //         .then(res => {
        //             setCartCount(res.data.count)
        //             dispatch( cartActions(res.data.count))
        //             dispatch({ type: 'cart', payload: res.data.count })
        //         })
        //         .catch(err => {
        //             if (err) {
        //                 history('/ServerError')
        //             }
        //         })
        // }
        // else if (Uuid) {
        //     let data = { id: Uuid }
        //     console.log(Uuid);
        //     GETCARTCOUNT(data)
        //         .then(res => {
        //             setCartCount(res.data.count)
        //         })
        //         .catch(err => {
        //             if (err) {
        //                 history('/ServerError')
        //             }
        //         })

        // }

    }, [cart])
    const LogoutUser = () => {
        localStorage.clear();
        let uuid = uuidv4()
        console.log(uuid);
        localStorage.setItem('uuid', uuid)
        dispatch(loginDisable(uuid))
        // dispatch({ type: 'disable', payload: uuid })
        history('/')
    }
    const searchbar = (event) => {
        // history('/Product')
        const value = event.target.value
        dispatch(SearchAction(value))
        // dispatch({ type: 'search', payload: value })
    }
    const navigate = () => {
        history('/Product')
    }
    const ShowCart = () => {
        history('/Cart')
    }
    return (
        <div >
            <Navbar bg="dark" expand="lg" className='container-fluid'>
                <Navbar.Brand href="/"><big><b><span className='text-white'>Neo</span><font color="#cc0000">STORE</font></b></big></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className='btn-light text-light bg-light' />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to='/' className='navlink '>Home</Link>
                        <Link to='/Product' className='navlink'>Product</Link>
                        {
                            Logged ? <Link to='/Order' className='navlink'>Order</Link> :
                                <Link to='/LoginPage' className='navlink' >Order</Link>
                        }
                    </Nav>
                    <Nav className=" endpart">
                        <Form className="d-flex ml-2 mr-2">
                            <FormControl
                                onChange={searchbar}
                                type="search"
                                placeholder='Search...'
                                className="me-2 formwidth"
                                aria-label="Search"
                                onFocus={navigate}
                            />
                        </Form>
                        <div className='prfil'>
                            <Button variant='light' className='cartbutton' onClick={ShowCart}> <Cart /><sup className='sup' > {CartCount} </sup> Cart</Button>
                            {Logged ?
                                <DropdownButton id="dropdown-basic-button" drop='start' title={<PersonBadgeFill />} variant="light" className='dropdownbtn' >
                                    <Dropdown.Item href="/MyAccount" className='dropitem'>My Account</Dropdown.Item>
                                    <Dropdown.Item href="/" className='dropitem' onClick={LogoutUser}>Logout</Dropdown.Item>

                                </DropdownButton> :
                                <DropdownButton id="dropdown-basic-button" drop='start' title={<PersonBadgeFill />} variant="light" className='dropdownbtn' >
                                    <Dropdown.Item href="/LoginPage" className='dropitem' >Login</Dropdown.Item>
                                </DropdownButton>
                            }

                        </div>

                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

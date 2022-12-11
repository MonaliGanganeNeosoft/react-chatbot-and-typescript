import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import { GETORDER } from '../config/myService'
import { Button, Container, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../Css/Order.css'
import { useSnackbar } from 'react-simple-snackbar'
import { loginDisable } from '../State/actions/loginAction'
import { Get_Order } from '../State/actions/getOrderAction'
import { GET_CART } from '../State/actions/getCartAction'
import { cartActions } from '../State/actions/cartActions'
const options = {
    position: 'top-center',
    style: {
        fontSize: '20px',
        textAlign: 'center',
        color: 'white',
    },
    closeStyle: {
        color: 'lightcoral',
        fontSize: '16px',
    },
}
export default function Order() {
    const [Order, setOrder] = useState('')
    const dispatch = useDispatch()
    const history = useNavigate()
    const [openSnackbar] = useSnackbar(options)
    const OrderData = useSelector(state => state.getOrderReducer.Order)
    const CartDAta = useSelector(state => state.getCartReducer.cartData)
    useEffect(() => {
        let token = localStorage.getItem('_token')
        let decode = jwt_decode(token);
        let data = decode.uid[0]._id;
        let id = { id: data }
        dispatch(Get_Order(id))
        dispatch(GET_CART(id))
        // GETORDER(id)
        //     .then(res => {
        //         console.log(res.data);
        //         setOrder(res.data.order)
        //     })
        //     .catch(err => {
        //         console.log(err.message);
        //         if (err.message != 'Network Error') {
        //             localStorage.clear()
        //             dispatch(loginDisable(''))
        //             // dispatch({ type: 'disable' })
        //             openSnackbar('Session expired Login again please')
        //             history('/LoginPage')
        //         }
        //         else {
        //             history('/ServerError')
        //         }
        //     })
    }, [])
    useEffect(() => {
        if (OrderData.order) {
            setOrder(OrderData.order)
        }
    }, [OrderData.order]);

    useEffect(() => {
        if (CartDAta) {
            dispatch(cartActions(CartDAta.cartData.length))
        }
    }, [CartDAta.cartData]);
    const OpenPdf = (ele) => {
        history('/Pdf', { state: ele })
    }
    return (
        <div className='allpadding'>
            <Container fluid >
                <Table responsive >
                    <thead>
                        <tr>
                            <td>
                                Product
                            </td>
                            <td>
                                Delivery Address
                            </td>
                            <td>
                                Delivery Status
                            </td>
                            <td>
                                Total Amount
                            </td>
                            <td>
                                Product book date
                            </td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {Order && Order.map((ele) =>
                            <tr key={ele._id}>
                                <td width='350px'>
                                    {ele.product_id.map((element) =>
                                        <span key={element._id}>
                                            <img src={`/Image/${element.product_id.product_image}`} className='orderimg m-1' />
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <p>{ele.delivery_address.address}</p>
                                    <p>{ele.delivery_address.City}-{ele.delivery_address.PinCode}</p>
                                    <p>{ele.delivery_address.State},{ele.delivery_address.Country}</p>
                                </td>
                                <td>{ele.isDelivered ? <span style={{ color: 'Green' }}>True</span> : <span style={{ color: 'red' }}>False</span>}</td>
                                <td>
                                    Rs. {ele.total_Productcost}
                                </td>
                                <td>{ele.order_date}</td>
                                <td>
                                    <Button onClick={() => OpenPdf(ele)} >Open Pdf</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}

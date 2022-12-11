import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'
import { ArrowLeftSquare, Download } from 'react-bootstrap-icons'
import ReactToPdf from 'react-to-pdf'
import '../Css/Pdf.css'
import jwt_decode from 'jwt-decode'
const options = {
    orientation: 'landscape',
    unit: 'in',
    format: 'A4'
};
export default function Pdf() {
    const location = useLocation()
    const [OrderDetails, setOrderDetails] = useState('')
    const [UserData, setUserData] = useState('')
    const ref = React.createRef();
    const history = useNavigate()
    useEffect(() => {
        console.log(location.state);
        let token = localStorage.getItem('_token')
        let decode = jwt_decode(token);
        setOrderDetails(location.state)
        setUserData(decode.uid[0])

    }, [])
    const backtoorder = () => {
        history('/Order')
    }
    return (
        <div className='m-5 pdfclass'>
            <Container fluid >
                <Row className='pdfmargin'>

                    <Col lg={12} ref={ref}>
                        <Row>
                            <Col lg={6}>
                                <h3><big><b>Neo<font color="#cc0000">STORE</font></b></big></h3>
                            </Col>
                            <Col lg={6} className='text-end'>
                                <h4>Tracker No.</h4>
                                <p> {OrderDetails._id} </p>

                            </Col>
                            <hr />
                            <Col lg={12} className='text-end'>
                                <h4>Valuable Customer</h4>
                                <p> {UserData.firstname} {UserData.lastname} </p>
                                <p>{UserData.email}</p>
                                <p>Mobile no. {UserData.mobileno ? <span> {UserData.mobileno} </span> : <span>-</span>}</p>
                                <p>Order on : {OrderDetails.order_date}</p>
                                <p>Is Delivered: {OrderDetails.isDelivered ? <span style={{ color: 'Green' }}>True</span> : <span style={{ color: 'red' }}>False</span>} </p>
                            </Col>
                            <Col lg={12}>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr className='text-center'>
                                            <th>Product</th>
                                            <th width='280px'>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Product Cost</th>
                                            <th>Product Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {OrderDetails.product_id && OrderDetails.product_id.map((ele) =>
                                            <tr key={ele._id} className='text-center'>
                                                <td>

                                                    <img src={`/Image/${ele.product_id.product_image}`} height='80px' width='80px' />
                                                </td>
                                                <td className='productname'>
                                                    {ele.product_id.product_name}
                                                </td>
                                                <td>
                                                    {ele.quantity}
                                                </td>
                                                <td >
                                                    {ele.product_id.product_cost}
                                                </td>
                                                <td >
                                                    {ele.total_Productcost}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <div className='text-end'>
                                    Total Amount: {OrderDetails.total_Productcost}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            <div className='text-center'>
                <Button onClick={backtoorder} className='me-2'> <ArrowLeftSquare /> Orders</Button>
                <ReactToPdf targetRef={ref} filename={`${OrderDetails.order_date}.pdf`} options={options} x={0} y={0} scale={0.8}>
                    {({ toPdf }) => (
                        <Button onClick={toPdf}> <Download />  Download pdf</Button>
                    )}
                </ReactToPdf>
            </div>
        </div>
    )
}

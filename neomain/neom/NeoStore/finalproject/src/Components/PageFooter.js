import React, { useRef } from 'react'
import { Button, Col, Form, FormControl, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import  { useSnackbar }  from 'react-simple-snackbar'
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
export default function PageFooter() {
    const [openSnackbar] = useSnackbar(options)
    const Email = useRef('')
    const history=useNavigate()
    const subscribeSSS=()=>{
        if(Email.current.value==''){
            openSnackbar('Enter Email please')
        }
        else{
            history('/ThankYou')
        }
    }
    return (
        <div className='container-fluid '  >
            <Row style={{ background: '#212529' }} className='text-light pagefooter' >
                <Col lg={4} className='text-center  '>
                    <h4>About Company</h4>
                    <p >NeoSOFT Technologies is here at your quick and easy service for shooping</p>
                    <p>Contact information</p>
                    <p>Email:contact@neosofttech.com</p>
                    <p>Phone: +91 0000000000</p>
                    <p>PUNE,INDIA</p>
                </Col>
                <Col lg={4} className='text-center '>
                    <h4>Information </h4>
                    <p > <a href='termsandcondition.pdf' target='_blank' className='pdf'> Terms and Condition</a></p>
                    <p>Gurantee and Return Policy </p>
                    <p> <a className='pdf' href="Tel: 123-456-7890" >Contact Us</a> </p>
                    <p>Privacy Policy</p>
                    <p><a href="https://www.google.com/maps/place/NeoSOFT+Technologies/@18.5790021,73.7387793,15z/data=!4m5!3m4!1s0x0:0x316090d140dfd0b3!8m2!3d18.579388!4d73.7388023" target='_blank' className='pdf'>Locate Us</a></p>
                </Col>
                <Col lg={4} className='text-center paddingissue'>
                    <h4>Newsletter </h4>
                    <p >Signup to get exclusive offer from our favorite brands and to be well up in the news</p>
                    <Form>
                        <FormControl type='email' placeholder='your email...' ref={Email} />
                        <Button variant='light' className="mt-3" onClick={subscribeSSS}>Subscribe</Button>
                    </Form>
                </Col>
                <Col lg={12} className='text-center mt-1'>
                    Copyright 2017 NeoSOFT Technologies All rights reserved | Design By Vinayak Deulkar
                </Col>
            </Row>
        </div>
    )
}

import React from 'react'
import { Container } from 'react-bootstrap'
import '../Css/ServerError.css'
export default function NotFound() {
    return (
        <div className='allpadding'>
            <Container className='m-4 p-5 bg-light'>
                <h1 className=' text-center servererror words word-1'>
                    <span>! </span>
                    <span>4</span>
                    <span>0</span>
                    <span>4</span>
                </h1>
                <p className=' text-center servererror words word-1'>
                    <span>N </span>
                    <span>O</span>
                    <span>T</span>
                    <span>F</span>
                    <span>O </span>
                    <span>U</span>
                    <span>N</span>
                    <span>D</span>
                </p>
            </Container>
        </div>
    )
}

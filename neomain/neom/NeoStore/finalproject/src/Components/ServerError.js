import React from 'react'
import { Container } from 'react-bootstrap'
import '../Css/ServerError.css'
export default function ServerError() {
    return (
        <div className='allpadding'>
            <Container className='m-4 p-5 bg-light'>
                <h1 className=' text-center servererror words word-1'>
                    <span>! </span>
                    <span>5</span>
                    <span>0</span>
                    <span>0</span>
                </h1>
                <p className=' text-center servererror words word-1'>
                    <span>S </span>
                    <span>E</span>
                    <span>R</span>
                    <span>V</span>
                    <span>E </span>
                    <span>R</span>
                    <span>E</span>
                    <span>R</span>
                    <span>R</span>
                    <span>O</span>
                    <span>R</span>
                </p>
            </Container>
        </div>
    )
}

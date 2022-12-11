import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
  FormLabel,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  Google,
  Mailbox,
  Phone,
  TextareaT,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { AddUser } from "../config/myService";
import jwt_decode from "jwt-decode";
// import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import { ADD_USER } from "../State/actions/AddUserAction";

const options = {
  position: "top-center",
  style: {
    fontSize: "20px",
    textAlign: "center",
    color: "white",
  },
  closeStyle: {
    color: "lightcoral",
    fontSize: "16px",
  },
};
export default function RegisterPage() {
  const FirstName = useRef("");
  const LastName = useRef("");
  const Email = useRef("");
  const Password = useRef("");
  const ConfirmPassword = useRef("");
  const MobileNo = useRef("");
  // const [openSnackbar] = useSnackbar(options);
  const regForEmail = RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
  const regForPassword = RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
  );
  const regFoMob = RegExp(/^[0-9]{10}$/);
  const regForName = RegExp(/[A-Za-z ]+/);
  const history = useNavigate();
  const dispatch = useDispatch();
  const ADDUSER = useSelector((state) => state.addUserReducer);
  const [ErrorRegister, setErrorRegister] = useState({
    Errorfirstname: "",
    Errorlastname: "",
    ErrorEmail: "",
    ErrorPassword: "",
    ErrorConfirm: "",
    ErrorMobile: "",
  });
  const handle = (event) => {
    const name = event.target.name;
    switch (name) {
      case "FirstName":
        let error_for_firstname = regForName.test(FirstName.current.value)
          ? ""
          : "Enter Valid First Name";
        setErrorRegister({
          ...ErrorRegister,
          Errorfirstname: error_for_firstname,
        });
        break;
      case "LastName":
        let error_for_lastname = regForName.test(LastName.current.value)
          ? ""
          : "Enter Valid Last  Name";
        setErrorRegister({
          ...ErrorRegister,
          Errorlastname: error_for_lastname,
        });
        break;
      case "MobileNo":
        let error_for_mobile = regFoMob.test(MobileNo.current.value)
          ? ""
          : "Enter Valid mobile number";
        setErrorRegister({
          ...ErrorRegister,
          ErrorMobile: error_for_mobile,
        });
        break;
      case "ConfirmPassword":
        let error_for_confirm =
          Password.current.value === ConfirmPassword.current.value
            ? ""
            : "Password must be match";
        setErrorRegister({
          ...ErrorRegister,
          ErrorConfirm: error_for_confirm,
        });
        break;
      case "Email":
        let error_for_email = regForEmail.test(Email.current.value)
          ? ""
          : "Enter Valid Email";
        setErrorRegister({
          ...ErrorRegister,
          ErrorEmail: error_for_email,
        });
        break;
      case "Password":
        let error_for_password = regForPassword.test(Password.current.value)
          ? ""
          : "Enter Valid patterin ";
        setErrorRegister({
          ...ErrorRegister,
          ErrorPassword: error_for_password,
        });
        break;
    }
  };
  const setnull = (event) => {
    const name = event.target.name;
    switch (name) {
      case "FirstName":
        setErrorRegister({
          ...ErrorRegister,
          Errorfirstname: "",
        });
        break;
      case "LastName":
        setErrorRegister({
          ...ErrorRegister,
          Errorlastname: "",
        });
        break;
      case "MobileNo":
        setErrorRegister({
          ...ErrorRegister,
          ErrorMobile: "",
        });
        break;
      case "ConfirmPassword":
        setErrorRegister({
          ...ErrorRegister,
          ErrorConfirm: "",
        });
        break;
      case "Email":
        setErrorRegister({
          ...ErrorRegister,
          ErrorEmail: "",
        });
        break;
      case "Password":
        setErrorRegister({
          ...ErrorRegister,
          ErrorPassword: "",
        });
        break;
    }
  };
  useEffect(() => {
    if (ADDUSER.success) {
      // openSnackbar(ADDUSER.msg.msg);
      history("/LoginPage");
    } else if (ADDUSER.success == false && ADDUSER.msg) {
      // openSnackbar(ADDUSER.msg.msg);
    }
  }, [ADDUSER.success]);
  const RegisterUser = () => {
    let data = {
      firstname: FirstName.current.value,
      lastname: LastName.current.value,
      email: Email.current.value,
      password: Password.current.value,
      mobileno: MobileNo.current.value,
    };
    console.log(data);
    if (
      ErrorRegister.ErrorConfirm == "" &&
      ErrorRegister.ErrorEmail == "" &&
      ErrorRegister.ErrorPassword == "" &&
      ErrorRegister.Errorfirstname == "" &&
      ErrorRegister.Errorlastname == "" &&
      ErrorRegister.ErrorMobile == ""
    ) {
      dispatch(ADD_USER(data));
    }
  };

  return (
    <>
      <div className=" container-fluid allpadding">
        <Row className="padding marginlogin mt-3">
          <Col lg={3} />
          <Col lg={6} className="formdata">
            <Card className="bg-light">
              <Form className="p-3 formdata">
                <FormLabel>
                  <h3>Register To NeoSTORE</h3>
                </FormLabel>
                <InputGroup className=" mt-2 mb-2">
                  <FormControl
                    type="text"
                    placeholder="First Name"
                    aria-describedby="basic-addon2"
                    name="FirstName"
                    /* className=' mt-2 mb-2' */ ref={FirstName}
                    onBlur={handle}
                    onFocus={setnull}
                  />
                  <InputGroup.Text id="basic-addon2" className="bg-light">
                    <TextareaT />
                  </InputGroup.Text>
                </InputGroup>
                {ErrorRegister.Errorfirstname ? (
                  <FormLabel style={{ color: "red" }}>
                    {ErrorRegister.Errorfirstname}
                  </FormLabel>
                ) : (
                  ""
                )}
                <InputGroup className=" mt-2 mb-2">
                  <FormControl
                    type="text"
                    placeholder="Last Name "
                    name="LastName"
                    /* className='p-2 mt-2 mb-2' */ ref={LastName}
                    onBlur={handle}
                    onFocus={setnull}
                  />
                  <InputGroup.Text id="basic-addon2" className="bg-light">
                    {" "}
                    <TextareaT />{" "}
                  </InputGroup.Text>
                </InputGroup>
                {ErrorRegister.Errorlastname ? (
                  <FormLabel style={{ color: "red" }}>
                    {ErrorRegister.Errorlastname}
                  </FormLabel>
                ) : (
                  ""
                )}
                <InputGroup className=" mt-2 mb-2">
                  <FormControl
                    type="text"
                    placeholder="Email Address "
                    name="Email"
                    /* className='p-2 mt-2 mb-2' */ ref={Email}
                    onBlur={handle}
                    onFocus={setnull}
                  />
                  <InputGroup.Text id="basic-addon2" className="bg-light">
                    <Mailbox />
                  </InputGroup.Text>
                </InputGroup>
                {ErrorRegister.ErrorEmail ? (
                  <FormLabel style={{ color: "red" }}>
                    {ErrorRegister.ErrorEmail}
                  </FormLabel>
                ) : (
                  ""
                )}{" "}
                <InputGroup className="mt-2 mb-2">
                  <FormControl
                    type="password"
                    placeholder="Password "
                    name="Password"
                    /* className='p-2 mt-2 mb-2' */ ref={Password}
                    onBlur={handle}
                    onFocus={setnull}
                  />
                </InputGroup>
                {ErrorRegister.ErrorPassword ? (
                  <FormLabel style={{ color: "red" }}>
                    {ErrorRegister.ErrorPassword}
                  </FormLabel>
                ) : (
                  ""
                )}
                <InputGroup className="mt-2 mb-2">
                  <FormControl
                    type="password"
                    placeholder="Confirm Password "
                    name="ConfirmPassword"
                    /* className='p-2 mt-2 mb-2' */ ref={ConfirmPassword}
                    onBlur={handle}
                    onFocus={setnull}
                  />
                </InputGroup>
                {ErrorRegister.ErrorConfirm ? (
                  <FormLabel style={{ color: "red" }}>
                    {ErrorRegister.ErrorConfirm}
                  </FormLabel>
                ) : (
                  ""
                )}{" "}
                <InputGroup className=" mt-2 mb-2">
                  <FormControl
                    type="text"
                    placeholder="Mobile No. "
                    name="MobileNo"
                    /* className='p-2 mt-2 mb-2' */ ref={MobileNo}
                    onBlur={handle}
                    onFocus={setnull}
                  />
                  <InputGroup.Text id="basic-addon2" className="bg-light">
                    <Phone />{" "}
                  </InputGroup.Text>
                </InputGroup>
                {ErrorRegister.ErrorMobile ? (
                  <FormLabel style={{ color: "red" }}>
                    {ErrorRegister.ErrorMobile}
                  </FormLabel>
                ) : (
                  ""
                )}
                <br />
                <Button onClick={RegisterUser} className="mt-1">
                  Register
                </Button>
              </Form>
              <Link to="/LoginPage" className="nav-link">
                Existing User?
              </Link>
            </Card>
          </Col>
          <Col lg={3} />
        </Row>
      </div>
    </>
  );
}

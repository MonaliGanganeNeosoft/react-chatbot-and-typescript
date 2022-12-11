// import Loader from "react-loaders";
// import AnimatedLetters from "../AnimatedLetters";
// import "./index.scss";
// import { useState, useEffect, useRef } from "react";
// import emailjs from "@emailjs/browser";
// const Contact = () => {
//   const [letterClass, setletterClass] = useState("text-animate");
//   const refForm = useRef;
//   const sendEmail = (e) => {
//     e.preventDefault();
//     emailjs
//       .sendForm("gmail", "template_ebp0duv", refForm.current, "service_ujyad0j")
//       .then(
//         () => {
//           alert("Message successfully sent!");
//           window.location.reload(false);
//         },
//         () => {
//           alert("failed to send message,pls try again");
//         }
//       );
//   };

//   return (
//     <>
//       <div className="container contact-page">
//         <div className="text-zone">
//           <h1>
//             <AnimatedLetters
//               letterClass={letterClass}
//               strArray={["C", "o", "n", "t", "a", "c", "t", " ", "M", "e"]}
//               idx={15}
//             />
//           </h1>
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti
//             dolor eius distinctio labore enim natus maxime optio totam qui vitae
//             quis porro, tempore unde accusantium consequatur explicabo, minima
//             reiciendis impedit?
//           </p>
//           <div className="contact-form">
//             <form>
//               <ul>
//                 <li className="half">
//                   <input type="text" name="name" placeholder="Name" required />
//                 </li>
//                 <li className="half">
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     required
//                   />
//                 </li>
//                 <li>
//                   <input
//                     placeholder="Subject"
//                     type="text"
//                     name="subject"
//                     required
//                   />
//                 </li>
//                 <li>
//                   <textarea
//                     placeholder="Messaage"
//                     name="message"
//                     required
//                   ></textarea>
//                 </li>
//                 <li>
//                   <input type="submit" className="flat-button" value="SEND" />
//                 </li>
//               </ul>
//             </form>
//           </div>
//         </div>
//       </div>
//       <Loader type="paceman" />
//     </>
//   );
// };
// export default Contact;

import { useEffect, useState } from "react";
import Loader from "react-loaders";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import AnimatedLetters from "../AnimatedLetters";
import "./index.scss";

const Contact = () => {
  const [letterClass, setLetterClass] = useState("text-animate");
  const form = useRef();
  const refForm = useRef;

  // useEffect(() => {
  //   return setTimeout(() => {
  //     setLetterClass("text-animate-hover");
  //   }, 3000);
  // }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      // .sendForm("gmail", "template_YeJhZkgb", form.current, "your-token")
      .sendForm("gmail", "template_ebp0duv", e.target, "service_ujyad0j")
      .then(
        () => {
          alert("Message successfully sent!");
          window.location.reload(false);
        },
        () => {
          alert("Failed to send the message, please try again");
        }
      );

    // e.preventDefault();
    // emailjs
    //   .sendForm("gmail", "template_ebp0duv", e.target, "service_ujyad0j")
    //   .then(
    //     function (response) {
    //       console.log("SUCCESS!");
    //     },
    //     function (error) {
    //       console.log("FAILED...", error);
    //     }
    // );
  };

  return (
    <>
      <div className="container contact-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={["C", "o", "n", "t", "a", "c", "t", " ", "m", "e"]}
              idx={15}
            />
          </h1>
          <p>
            I am interested in freelance opportunities - especially on ambitious
            or large projects. However, if you have any other requests or
            questions, don't hesitate to contact me using below form either.
          </p>
          <div className="contact-form">
            <form ref={form} onSubmit={sendEmail}>
              <ul>
                <li className="half">
                  <input placeholder="Name" type="text" name="name" required />
                </li>
                <li className="half">
                  <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    required
                  />
                </li>
                <li>
                  <input
                    placeholder="Subject"
                    type="text"
                    name="subject"
                    required
                  />
                </li>
                <li>
                  <textarea
                    placeholder="Message"
                    name="message"
                    required
                  ></textarea>
                </li>
                <li>
                  <input type="submit" className="flat-button" value="SEND" />
                </li>
              </ul>
            </form>
          </div>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  );
};

export default Contact;

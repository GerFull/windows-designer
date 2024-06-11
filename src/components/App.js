import { BrowserRouter } from "react-router-dom";
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import Routes from '../pages/routes';

import PdfFile from "../pages/PDFFile/pdfFile";
import { Stage, Layer, Rect } from "react-konva";
import { useEffect, useRef, useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


function App() {


  const stageRef = useRef(null)
  const [image, setImage] = useState()



  useEffect(()=>{

    // convertToPDF()

  },[])





  const convertToPDF = () => {
    // capture the element that you want to convert to pdf
    const targetElement = document.getElementById('test-pdf');
    if (targetElement) {
      // convert that Element to canvas
      html2canvas(targetElement, {
        logging: true,
        useCORS: false
      }).then((canvas) => {
        // once the Element has been successfully converted to canvas
        // set the width and height of canvas
        const imgWidth = 500;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        // convert canvas to png image 
        const imgData = canvas.toDataURL('image/png');
        // initialize a new PDF object
        setImage(imgData)
        const pdf = new jsPDF('p', 'mm', 'a4');
        // convert that png image into pdf
        // pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        // download the pdf 
        // pdf.save('name-of-pdf-here');
      });
    }
  };




  return (
    // <div>
    //   <div style={{ padding: '20px', position: 'relative' }}>
    //     <PDFDownloadLink document={<PdfFile image={image} />} filename="FORM">
    //       {({ loading }) => (loading ? <button>Loading Document...</button> : <button>Download</button>)}
    //     </PDFDownloadLink>
    //     <div style={{ padding: '20px',  }} id="test-pdf">
          
    //     </div>


    //     <button onClick={() => convertToPDF()}>CONVERT!</button>

    //   </div>
    //   <div>
    //     <PDFViewer width={500} height={700}>

    //       <PdfFile image={image} />

    //     </PDFViewer>

    //   </div>
    // </div>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  )
}

export default App;

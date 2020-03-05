import ReactDOM from "react-dom";
import React, { PureComponent } from "react";
import ReactResizeDetector from 'react-resize-detector';
import "react-image-crop/dist/ReactCrop.css";

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { StickyContainer, Sticky } from 'react-sticky';





import "./App.css";



class App extends PureComponent {
  state = {
    txtarea: "",
    src: null,
    title: '',
    esporte: '',
    loja: '',
    tagline: 'Tagline',
    last: 'Last',
    colorText: `#0082c3`,
    x: 32,

    y: 446,
    base64Image: null,
    croppedImg: null,
    loading: false,
    templateIndex: 0,
    scrollside: 0,
    heightPercent:1080,
    widthPercent:1,
    widthPercent2:1,
    marginTop: 0,
    scrollsize:0,
    crop: {
      aspect: 1 / 1,




    }
  };


  componentDidMount() {

    window.addEventListener('scroll', this.handleScroll);

  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", (event) =>{

        var imageObj = new Image();
        imageObj.src = event.target.result;
        imageObj.onload = ()=> {
            //TEST IMAGE SIZE
            if (imageObj.height < 1200 || imageObj.width < 1200) {
                alert(`a imagem precisa ter mais que 1200px de altura e mais que 1200px de largura`)
            }else{


              this.setState({ src: reader.result })}
            }
          }


        
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width * 2 && crop.height * 2) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }/*
<div className="PDFCreator" style={{marginRight:20,marginLeft:20}}>
                      {src && (
                      
                      <div style={{flex:1,maxWidth:`none`,maxHeight:"none"}}>
                        <ReactCrop
                          src={src}
                          crop={crop}
                          onImageLoaded={this.onImageLoaded}
                          onComplete={this.onCropComplete}
                          onChange={this.onCropChange}
                          style={{width:'100%',backgroundColor:'#fff'}}
                          imageStyle={{backgroundColor:'#fff'}}
                        />
                        </div>
                      )}

                  </div>



  */



  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");





    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    this.setState({ base64Image: base64Image })
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg", 1);
    });


  }

  printDocument() { //with html2canvas

    console.log('Gerando PDF')
    const input = document.getElementById('elementId');

    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    let scrollHeight = document.documentElement.scrollWidth - document.documentElement.clientWidth;


    console.log(scrollHeight)

    if (this.state.title != '' && this.state.esporte != '' && this.state.loja != '' && this.state.tagline != '' && this.state.last != '' && this.state.src != null) {
      this.setState({ loading: true })
      html2canvas(input, {
        scale: 7,
        scrollY: 0,
        scrollX: 0,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpg');


        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [1020.47, 1899.21],

        });

        pdf.addImage(imgData, 'JPG', 0, 0, 1020.47, 1899.21, 'img', `FAST`)
        pdf.save(`ColaboradorEsportista-Banco_${this.state.title}_${this.state.esporte}_36x67.pdf`, { returnPromise: true }).then(this.setState({ loading: false }));






      })
    }
    else {

      alert('Preencha Todos os campos e selecione uma imagem')

    }

  }
  callback(bool) {

    console.log(bool)


  }
 
  mouseDown() {
    this.isruning = true;
  }

  mouseUp() {
    this.isruning = false;
  }
  isruning = false;
  _crop() {


    this.setState({ base64Image: this.refs.cropper.getCroppedCanvas().toDataURL() })


  }
  lineSize = 0;
  lineWidth = 0;
resize=()=>{
  this.setState({heightPercent: isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight})
  this.setState({widthPercent:document.body.outerWidth})
  this.setState({widthPercent2: isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth})
  this.setState({scrollsize:window.scrollY})



}
handleScroll=()=>{
  
  this.setState({scrollsize:window.scrollY})

}

  height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
  render() {
    try {
      this.lineSize = this.refs.inner.clientHeight + 18
    } catch (error) {

      console.log(error)
    }

    try {
      this.lineWidth = this.refs.inner.clientWidth + 18
    } catch (error) {

      console.log(error)
    }



    if (this.state.src == null) {

      this.setState({ marginTop: 0 })


    } else {

      this.setState({ marginTop: 400 })

    }

   

    return (
   
      <div className="App" style={{ width: '100%' }} onScroll={this.scroll}>
       <ReactResizeDetector handleWidth handleHeight onResize={this.resize} />
    

  
        <div id='elementId' style={{ top: -1000, left: 0, position: "fixed", width: 282.8, height: 526.33333 }}>
          <div className='border' style={{ top: 0, left: 0, position: "absolute", marginTop: 7, borderTopLeftRadius: 10, borderTopRightRadius: 10, marginLeft: 8, borderWidth: '0.1px', borderColor: '#f0f', width: 265, height: 512.4, zIndex: 3 }}>
          </div>
          <div id='txtarea' ref='inner' style={{ whiteSpace: 'pre-wrap', wordBreak: "break-word", position: 'absolute', textShadow: 'rgba(0,0,0,0.5) 0.01em 0.08em 1em', shadowOpacity: 0.25, marginTop: `${this.state.y - ((this.lineSize))}px`, marginLeft: `${this.state.x}px`, zIndex: 8, marginRight: 12, color: this.state.colorText, fontFamily: 'Roboto Condensed', fontWeight: 600 }}>
            {'<< Pratico '}{this.state.esporte}{" há\nmais de "}{this.state.txtarea}{" anos"}{" >>"}
          </div>
          <img style={{ top: 0, left: 0, position: 'absolute', width: 282.8, height: 526.33333, zIndex: 2 }} src={require("./template.png")} />
          <div style={{ position: 'absolute', zIndex: 3, color: '#0082c3', fontStyle: 'bold', marginLeft: 18, textAlign: `left` }}>

            <p className='tituloteste' style={{ lineHeight: 1, marginRight: 18, wordBreak: "break-word", width: 246, fontFamily: 'Roboto Condensed', fontWeight: 700, fontSize: 35, margin: 0, marginTop: 15, marginBottom: 0, textTransform: 'uppercase' }}>{this.state.title}</p>
            <p style={{ fontFamily: 'Roboto Condensed', fontWeight: 700, fontSize: 15, margin: 0, marginBottom: 0 }}>{`Apaixonado por ` + this.state.esporte}</p>
            <p style={{ fontFamily: 'Roboto Condensed', fontSize: 15, margin: 0, marginTop: 0, marginBottom: 0 }}>{'Na sua loja Decathlon ' + this.state.loja}</p>


          </div>

          <div style={{ height: '95%' }}>
           
            {this.state.base64Image && (

              <img alt="Crop" style={{ width: "100%", maxHeight: '100%', marginTop: `61%` }} src={this.state.base64Image} />)}

          </div>

        </div>
        {this.state.loading &&
          <div className='loader'>
            <p style={{ color: '#fff', fontSize: 35, display: "flex", width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center' }}>Gerando PDF Aguarde</p>
          </div>
        }


        <div style={{ backgroundColor: `#0082c3`, height: 45, width: this.state.widthPercent, margin: 0 }}>

        </div>

        <div style={{ marginTop: 40, flex: 1, width: `100%`,textAlign:'left', alignContent: 'center' }}>
          <div className="Body">

            <div style={{ marginLeft: 20, marginTop: 20, marginBottom: 45 }}>
              <h3 style={{ fontSize: 28 }} >Placa Colaborador Esportista - Banco</h3>
              <p style={{ marginLeft: 0, fontSize: 15, marginBottom: 45 }}>Selecione sua foto praticando seu esporte paixão!</p>

              <label for='file'  ><img for="file" src={require("./Escolha.jpg")} style={{ width: 275, marginTop: 25 }} /></label>

              {!!this.state.src &&

                <Cropper
                  id='cropp'
                  ref='cropper'
                  src={this.state.src}
                  style={{ width: 400, height: 400 }}
                  // Cropper.js options
                  aspectRatio={4252 / 4717}
                  guides={false}
                  cropend={this._crop.bind(this)}
                  ready={this._crop.bind(this)}
                  onMouseUp={this.mouseUP}
                  zoomable={false}
                  background={false}
                  autoCropArea={1}
                  aggressiveCallbacks={false} />}


              <h4 >NOME E SOBRENOME</h4>
              <input maxlength="22" placeholder='NOME' style={{ textTransform: 'uppercase', wordBreak: "break-all" }} className='inputfield' type="text" value={this.state.title} onChange={(event) => this.setState({ title: event.target.value.toUpperCase() })} />
              <br />
              <h4>ESPORTE PAIXÃO</h4>
              <input maxlength='14' placeholder='corrida' className='inputfield' type="text" value={this.state.esporte} onChange={(event) => this.setState({ esporte: event.target.value })} />
              <br />
              <h4>LOJA</h4>
              <input maxlength='14' placeholder='morumbi' className='inputfield' type="text" value={this.state.loja} onChange={(event) => this.setState({ loja: event.target.value })} />
              <br />
              <h4>Diga aos esportistas quanto tempo você pratica seu esporte!!</h4>





              <input maxlength='31' wrap='soft' placeholder='5' rows='10' className='inputfield' style={{ resize: 'none', whiteSpace: 'pre-line' }} value={this.state.txtarea} onChange={(event) => this.setState({ txtarea: event.target.value })}></input>


              <h4>Ajuste Lateral | Ajuste Vertical | Cor</h4>

              <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                  <input onChange={(event) => this.setState({ x: event.target.value })} value={this.state.x} type="range" min="12" max={285 - this.lineWidth} ></input>
                  <input onChange={(event) => this.setState({ y: event.target.value })} value={this.state.y} type="range" min={268} max={550 - this.lineSize} ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginLeft: 20, marginTop: 6 }}>
                  <div className='color' id='b' onClick={() => this.setState({ colorText: `#0082c3` })}></div>
                  <div className='color' id='w' onClick={() => this.setState({ colorText: `#FFF` })}></div>
                </div>
              </div>






              <input accept="image/png,image/jpg" name="file" id="file" type="file" className="inputfile" onChange={this.onSelectFile} />


            </div>



            <div style={{ width: 600,marginInline:100 }}>



            </div>
           
              <div className='divtoscale' style={{marginTop:Math.max(0,Math.min(this.state.scrollsize < 130 ? 0:this.state.scrollsize-130, 250)), width:282.8}}>

                <h3 >Preview</h3>

                <div className="PDF" style={{ width: 282.8, height: 526.33333 }}>

                  <div id='elementId' style={{ width: 282.8, height: 526.33333 }}>
                    <div className='border' style={{ position: "absolute", marginTop: 7, borderTopLeftRadius: 10, borderTopRightRadius: 10, marginLeft: 8, borderWidth: '1px', borderColor: '#f0f', width: 265, height: 512.4, zIndex: 3 }}>
                    </div>
                    <div id='txtarea' ref='inner' style={{ whiteSpace: 'pre-wrap', wordBreak: "break-word", position: 'absolute', textShadow: 'rgba(0,0,0,0.6) 0.01em 0.08em 0.2em', shadowOpacity: 0.25, marginTop: `${this.state.y - ((this.lineSize))}px`, marginLeft: `${this.state.x}px`, zIndex: 8, marginRight: 12, color: this.state.colorText, fontFamily: 'Roboto Condensed', fontWeight: 600 }}>
                      {'<< Pratico '}{this.state.esporte!=''?this.state.esporte:`corrida`}{" há\nmais de "}{(this.state.txtarea!=''?this.state.txtarea:`5`)}{" anos"}{" >>"}
                    </div>
                    <img style={{ position: 'absolute', width: 282.8, height: 526.33333, zIndex: 2 }} src={require("./template2.png")} />
                    <div style={{ position: 'absolute', zIndex: 3, color: '#0082c3', fontStyle: 'bold', marginLeft: 18, textAlign: `left` }}>

                      <p className='tituloteste' style={{ lineHeight: 1, marginRight: 18, wordBreak: "break-word", width: 246, fontFamily: 'Roboto Condensed', fontWeight: 700, fontSize: 35, margin: 0, marginTop: 15, marginBottom: 0, textTransform: 'uppercase' }}>{this.state.title!=''?this.state.title:`NOME`}</p>
                      <p style={{ fontFamily: 'Roboto Condensed', fontWeight: 700, fontSize: 15, margin: 0, marginBottom: 0 }}>{`Apaixonado por ` + (this.state.esporte!=''?this.state.esporte:`corrida`)}</p>
                      <p style={{ fontSize: 15, margin: 0, marginTop: 0, marginBottom: 0 }}>{'Na sua loja Decathlon ' + (this.state.loja!=''?this.state.loja:`morumbi`)}</p>


                    </div>

                    <div style={{ height: '95%' }}>
                      {this.state.base64Image && (

                        <img alt="Crop" style={{ width: "100%", maxHeight: '100%', marginTop: `61%` }} src={this.state.base64Image} />)}

                    </div>

                  </div>

                </div>

                <img onMouseDown={() => this.printDocument()} src={require("./pdf.jpg")} style={{ cursor: 'pointer', width: 180, marginTop: 20 }} />

                <p style={{ fontWeight: 900 }}>Este arquivo está pronto para ser enviado para a gráfica.</p>
                <p style={{ fontWeight: 900 }}>Gráfica:rayra@corumdigital.com.br</p>
              </div>


          </div>
        






        </div>
      </div>
    
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

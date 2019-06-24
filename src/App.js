import React, {Component} from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.handleImage = this.handleImage.bind(this);
        this.getImagePosition = this.getImagePosition.bind(this);
        //Zoom ration
        this.ZoomRatio = 10;
        this.position = {};
        this.state = {
            imageUpload: '',
        }
    }
    //event listen
    componentDidMount() {
        this.canvas.addEventListener('mousewheel', this.mouseWheel)//Other Browser
        this.canvas.addEventListener('DomMouseScroll', this.mouseWheel)//Chrome
    }
    //When rerender the UI, remove the event listen
    componentWillUnmount() {
        this.canvas.removeEventListener('mousewheel', this.mouseWheel)//Other Browser
        this.canvas.removeEventListener('DomMouseScroll', this.mouseWheel)//Chrome
    }

    mouseWheel = (e) => {
        if (!this.state.imageUpload)
            return;
        const mousewheel = e.wheelDelta ? e.wheelDelta : e.delta ? e.delta : 0;
        if (mousewheel > 0) {
            this.handleZoomIn();
        } else {
            this.handleZoomOut();
        }
    }
    handleZoomIn = () => {
        if (this.ZoomRatio + 1 > 20)
            return
        this.ZoomRatio = (this.ZoomRatio + 1);
        const position = this.getZoomPosition(this.img, this.ZoomRatio / 10);
        this.canvas.width = position.width;//canvas 像素寬
        this.canvas.height = position.height;//canvas 像素長
        this.canvas.getContext('2d').drawImage(this.img, position.zoom_x, position.zoom_y, position.zoom_width, position.zoom_height);
    };
    handleZoomOut = () => {
        if (this.ZoomRatio - 1 < 0)
            return
        this.ZoomRatio = (this.ZoomRatio - 1);
        const position = this.getZoomPosition(this.img, this.ZoomRatio / 10);
        this.canvas.width = position.width;//canvas 像素寬
        this.canvas.height = position.height;//canvas 像素長
        this.canvas.getContext('2d').drawImage(this.img, position.zoom_x, position.zoom_y, position.zoom_width, position.zoom_height);
    }
    getZoomPosition = (image, ZoomRatio = 1) => {

        this.position.zoom_width = Math.round(image.width * ZoomRatio);
        this.position.zoom_height = Math.round(image.height * ZoomRatio);
        this.position.zoom_x = Math.round((this.position.width - this.position.zoom_width) / 2);
        this.position.zoom_y = Math.round((this.position.height - this.position.zoom_height) / 2);
        return this.position;
    }
    uploadClick = () => {
        this.inputImage.click();
    }


    getCanvasRatio = (width, height) => {
        const canvasRatio = width.replace('px', '').valueOf() / height.replace('px', '').valueOf();
        return canvasRatio

    }
    getImagePosition = (image , canvas  ) => {
        //Get canvas image style ratio from getCanvasRatio
        const canvasScale = this.getCanvasRatio(canvas.style.width , canvas.style.height);
        //Ratio of upload image
        const imageScale = image.width / image.height;

        if(imageScale > canvasScale){
            //Image position
            this.position.width = image.width;
            this.position.height = Math.round((image.width/canvasScale));
            this.position.x = 0;
            this.position.y = Math.round((this.position.height - image.height)/2) ;
        }else{
            //Image position
            this.position.width =  Math.round((image.height*canvasScale));
            this.position.height = image.height;
            this.position.x = Math.round((this.position.width - image.width)/2) ;
            this.position.y = 0 ;
        }

        return this.position
    };
    handleImage(e){
        //FileReader(1)
        // const reader = new FileReader();
        // reader.onload = event => {
        //     this.img = new Image();
        //     this.img.onload = () => {
        //         const position = this.getImagePosition(this.img,this.canvas);
        //         this.canvas.width = position.width;
        //         this.canvas.height = position.height;
        //         this.canvas.getContext('2d').drawImage(this.img, position.x, position.y);
        //     };
        //     this.img.src = event.target.result;
        // };
        // reader.readAsDataURL(e.target.files[0]);
        // this.setState({
        //     imageUpload:e.target.files[0]
        // })

        //FileList(2)
        // create img element
        this.img = new Image();
        this.img.onload = ()=> {
            //setting canvas width and height mapping upload image
            const position = this.getImagePosition(this.img,this.canvas);
            this.canvas.width = position.width;
            this.canvas.height = position.height;
            this.canvas.getContext('2d').drawImage(this.img, position.x , position.y );
        };
        const file = e.target.files[0];
        this.img.src = URL.createObjectURL(file);
        //Display zoomIn zoomOut button
        this.setState({
            imageUpload:e.target.files[0]
        })

    }
  render() {
      const center ={
          textAlign:'center'
      }
      const canvas_Style ={
          width:"640px",
          height:"480px",
          border: '1px solid black'
      }
      const btn_style={

          width: '100px'
      }

    return (
        <div style={center}>
            <canvas ref={r => this.canvas = r}  style={canvas_Style} />
            <br/>
            <input type="file" accept="image/*" ref = {input =>this.inputImage = input}   onChange={event => this.handleImage(event)} hidden/>
            {!this.state.imageUpload  && <button type="button"   style={btn_style} onClick={this.uploadClick}>upload</button>}
            {this.state.imageUpload   &&<button type="button" style={btn_style} onClick={this.handleZoomIn}>zoom in</button>}
            {this.state.imageUpload   &&<button type="button" style={btn_style} onClick={this.handleZoomOut}>zoom out</button>}
        </div>
    );
  }
}

export default App;

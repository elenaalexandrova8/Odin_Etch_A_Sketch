//create color canvas to pick the shade of an argument color
function createPickColorCanvas(color){
    var colorCanvas = document.getElementById('color-canvas');
    var ColorCtx = colorCanvas .getContext('2d');  // This create a 2D context for the canvas

    // Create a Vertical Gradient(white to your color)
    let gradientH = ColorCtx .createLinearGradient(0, 0, ColorCtx .canvas.width, 0);
    gradientH.addColorStop(0, '#fff'); //white
    gradientH.addColorStop(1, color);  //your color
    ColorCtx .fillStyle = gradientH;
    ColorCtx .fillRect(0, 0, ColorCtx .canvas.width, ColorCtx .canvas.height);


    // Create a Vertical Gradient(white to black)
    let gradientV = ColorCtx .createLinearGradient(0, 0, 0, 300);
    gradientV.addColorStop(0, 'rgba(0,0,0,0)'); //white
    gradientV.addColorStop(1, '#000'); //black
    ColorCtx .fillStyle = gradientV;
    ColorCtx .fillRect(0, 0, ColorCtx .canvas.width, 
    ColorCtx .canvas.height); 
}

//extract the picked color value and store it in gridNodeColor. 
//Add marker to the color picker canvas. Redraw canvas, marker each click.
function getPickedColor(event){
        var colorCanvas = document.getElementById('color-canvas');
        var ColorCtx = colorCanvas .getContext('2d');  // This create a 2D context for the canvas
        
        let x = event.clientX-event.target.offsetLeft;  // Get X coordinate
        let y = event.clientY-event.target.offsetTop;  // Get Y coordinate
        console.log(`(${x}, ${y})`);
        let pixel = ColorCtx.getImageData(x,y,1,1)['data'];   // Read pixel Color
        console.log(`current pixel value: ${pixel}`);
        let pixel1 = ColorCtx.getImageData(x,y,1,1);   // Read pixel Color
        console.log(`current pixel no data value: ${pixel1}`);
        gridNodeColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        console.log(`current color ${gridNodeColor}`);

        marker.Xpos=x;
        marker.Ypos=y;

        if (gridNodeColor==null) {
            ColorCtx.drawImage(marker.Sprite, marker.Xpos, marker.Ypos, marker.Width, marker.Height);
        } else {
            ColorCtx.clearRect(0, 0, ColorCtx .canvas.width, ColorCtx .canvas.height);
            createPickColorCanvas(colorPickerColor);
            ColorCtx.drawImage(marker.Sprite, marker.Xpos, marker.Ypos, marker.Width, marker.Height);
        }
}

//color, reduce brightness, color random color grid nodes on mouseover event.
function onMouseOver(event){
    console.log(gridNodeColor);
    let fillColor = (gridNodeColor) ? gridNodeColor : 'aqua';
    if (randomColorFlag) {
        if ((!event.target.style.background) || (event.target.style.background==fillColor)){
            event.target.style.background=getRandomColor();
            event.target.style.filter='brightness(100%)';
        }
        console.log(`random color assigned, fadeFlag= ${fadeFlag}`);
        if (fadeFlag) {
            reduceBrightness(event.target);
            console.log(`brightness reduced`);
        } else{
            event.target.style.filter='brightness(100%)';
        }
    }
    else {
        if (event.target.style.background!=fillColor){
            event.target.style.background=fillColor;
            event.target.style.filter='brightness(100%)';
        } else {
            if (fadeFlag) {
                reduceBrightness(event.target);
            } else{
                event.target.style.filter='brightness(100%)';
            }
        }
    }
}

//build grid of a given grid size
function buildGrid(gridSize) {
    let gridContainer=document.querySelector('.grid-container');
    let numGridElements=gridSize*gridSize;
    if (window.innerWidth <= window.innerHeight) {
        gridContainer.setAttribute('style','display: flex; border: solid black; width: 70vw; height: 70vw;');
        for (let i=0; i<numGridElements; i++){
            let gridNode=document.createElement('div');
            gridNode.id='gridNode';
            gridNode.setAttribute('style','display: flex; flex: 0 0 auto; outline:solid black 1px;padding: 0px; margin:0px;');
            gridNode.style.height=`${GRIDWINDOWPERCENT/gridSize}vw`;
            gridNode.style.width=`${GRIDWINDOWPERCENT/gridSize}vw`;
            gridContainer.appendChild(gridNode);
        }
    } else{
        gridContainer.setAttribute('style','display: flex; border: solid black; width: 70vh; height: 70vh;');
        for (let i=0; i<numGridElements; i++){
            let gridNode=document.createElement('div');
            gridNode.id='gridNode';
            gridNode.setAttribute('style','display: flex; flex: 0 0 auto; outline:solid black 1px;padding: 0px; margin:0px;');
            gridNode.style.height=`${GRIDWINDOWPERCENT/gridSize}vh`;
            gridNode.style.width=`${GRIDWINDOWPERCENT/gridSize}vh`;
            gridContainer.appendChild(gridNode);
        }
    }
}

function removeGrid(){
    let gridContainer=document.querySelector('.grid-container');
    gridContainer.replaceChildren();
}

function changeGridSize(){
    gridSize=this.value;
    removeGrid();
    buildGrid(gridSize);
    let gridNodes=document.querySelectorAll('#gridNode');
    gridNodes.forEach((node)=>node.addEventListener('mouseover', onMouseOver));
}

//return random color
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

//return numerical value of brightness from the argument string
function getBrightness(valueString){
    let regex=/\d/g;
    let numberArray=valueString.match(regex);
    let numberString=numberArray.join('');
    return Number(numberString);
}

//reduce brightness(darken) of the current square by 10%
function reduceBrightness(currentEventTarget){
    let currentBrightness=getBrightness(currentEventTarget.style.filter); //get the number of the current brightness
    let updatedBrightness;
    if (currentBrightness>0){
        updatedBrightness=currentBrightness-10;
    }
    else{
        updatedBrightness=0;
    }
    currentEventTarget.style.filter=`brightness(${updatedBrightness}%)`;
}

//function create a marker for a color picker
function createNewMarker(){
    this.Sprite=new Image();
    this.Sprite.crossOrigin="anonymous";
    this.Width=20;
    this.Height=20;
    this.Xpos=0;
    this.Ypos=0;
}

//create a color picker marker
function createPickColorMarker(){
    let Marker=createNewMarker;
    let marker=new Marker();
    marker.Sprite.src='https://static-00.iconduck.com/assets.00/target-icon-512x512-lub2jcnm.png';
    return marker;
}

//change btn appearance when pressed
function makeBtnPressed(pressedButton){
    pressedButton.classList.toggle("button-pressed");
}

//change btn appearance when unpressed
function makeBtnUnpressed(pressedButton){
    pressedButton.classList.toggle("button-unpressed");
}

//update flag if btn pressed or released
function randomColorBtnPressed(){
    if (!randomColorFlag){
        makeBtnPressed(this);
    } else{
        makeBtnUnpressed(this);
    }
    randomColorFlag=!randomColorFlag;
}

//update flag if btn pressed or released
function fadeBtnPressed(){
    if (!fadeFlag){
        makeBtnPressed(this);
    } else{
        makeBtnUnpressed(this);
    }
    fadeFlag=!fadeFlag;
}

//clear grid
function clearBtnPressed(){
    let gridNodesArray=document.querySelectorAll('#gridNode');
    gridNodesArray.forEach((node)=>{node.style.background='transparent'}); 
}

//get a color from a color slider, store it at colorPickerColor variable
function selectColor(){
    ColorCtx.clearRect(0, 0, ColorCtx .canvas.width, ColorCtx .canvas.height);
    colorPickerColor='hsl(' + multiColorSlider.value + ', 100%, 50%)';
    console.log(colorPickerColor);
    createPickColorCanvas(colorPickerColor);
}


const GRIDWINDOWPERCENT=70;
let colorPickerColor='rgba(0,0,255,1)'; //default color is aqua
let gridNodeColor=null;
let randomColorFlag=false;
let fadeFlag=false;

let multiColorSlider=document.querySelector('.multi-color-slider');
let gridSizeSlider=document.querySelector('.grid-size-slider');
let colorCanvas = document.getElementById('color-canvas');
let ColorCtx = colorCanvas .getContext('2d'); 
let randomColorBtn=document.querySelector(".random-color-button");
let fadeBtn=document.querySelector(".fade-button");
let clearBtn=document.querySelector(".clear-button");
let marker=createPickColorMarker();

createPickColorCanvas(colorPickerColor);

let gridSize=gridSizeSlider.value;
buildGrid(gridSize);
let gridNodes=document.querySelectorAll('#gridNode');

multiColorSlider.addEventListener('input',selectColor);
gridSizeSlider.addEventListener('input', changeGridSize);
colorCanvas.addEventListener('click',getPickedColor);
gridNodes.forEach((node)=>{node.addEventListener('mouseover', onMouseOver);});
randomColorBtn.addEventListener('click', randomColorBtnPressed);
fadeBtn.addEventListener('click', fadeBtnPressed);
clearBtn.addEventListener('click', clearBtnPressed);

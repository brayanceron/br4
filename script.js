/* const [dom, setDom] = useState([<p>Holi!!</p>])
const [domS, setDomS] = useState([{}])
const [elementSelected, setElementSelected] = useState();
const [styles, setStyles] = useState(
    { 'backgroundColor': "green", width: "100px", height: "100px" }
);
 */
/* var tablaPropiedadesCss = document.getElementById("bodyTablaPropiedadesCss")
var tablaPropiedadesHtml = document.getElementById("tablaPropiedadesHtml") */
let canvas = document.getElementById("canvas");
var tablaPropiedadesCss = document.getElementById("tablaPropiedadesCss")
var tablaPropiedadesHtml = document.getElementById("tablaPropiedadesHtml")
var selectedElement = null;
var styles = {}
var propertiesCss = [];
var propertiesHtml = [];
var ctrlC = null;
var ctrlZ = [canvas.cloneNode(true)];

var paddingImgSelectedMarcoSeleccion = null; //esto solo es para imageness
var paddingImgSelectedMarcoDrop = null; //esto solo es para imageness
let inputs = ["checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number",
    "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "week"
]

let custome = ["custome01", "custome02", "custome03", "custome04", "custome05", "custome06", "custome07"]


//esto se usa para cuando se selecciona un elemento
window.addEventListener("dblclick", () => {
    if (!perteneceAlCanvas(event.target)) { return } //verifica si el elemento donde se hizo doble click pertenece al canvas

    seleccionarElemento(event.target);

    loadPropertiesCss();
    loadPropertiesHtml();
})
//esto se usa para cuando se va a eliminar un elemento(con la tecla suprimir)
window.addEventListener('keydown', () => {
    //keyCode=codigo de la tecla
    //code=la letra en texto "Delete" en caso de la tecla suprimir, a=KeyA, b=KeyB

    if (selectedElement !== null) {
        if (event.keyCode === 46) { //esto es para eliminar

            let padre = selectedElement.parentNode;
            padre.removeChild(selectedElement);
            selectedElement = null;
        }
        if (event.ctrlKey) {
            if (event.keyCode == 67 || event.keyCode == 99) { // esto ctrl + c
                if (selectedElement !== canvas && perteneceAlCanvas(selectedElement)) {
                    ctrlC = selectedElement;
                }
            }
            if (event.keyCode == 88 || event.keyCode == 120) { // esto ctrl + X
                if (selectedElement !== canvas && perteneceAlCanvas(selectedElement)) {
                    ctrlC = selectedElement.cloneNode(true);
                    // let elementToDelete= ctrlC;
                    // selectedElement();
                    let parent = selectedElement.parentNode;
                    parent.removeChild(selectedElement);
                    seleccionarElemento(canvas)

                }
            }
            if (event.keyCode == 86 || event.keyCode == 118) { // esto ctrl + v
                console.log("You have just pressed Ctrl + v/V!");
                /* if ( selectedElement !==ctrlC && ctrlC!==null && perteneceAlCanvas(ctrlC) ) {
                    let clon = ctrlC.cloneNode(true);
                    selectedElement.appendChild(clon)
                } */
                if (ctrlC === null) { return; }

                if (selectedElement === ctrlC) {
                    let clon = ctrlC.cloneNode(true);
                    insertAfter(clon, selectedElement);
                    seleccionarElemento(clon);
                    return;
                }

                else if ((selectedElement === canvas || selectedElement === null)) {
                    let clon = ctrlC.cloneNode(true);
                    canvas.appendChild(clon)
                    seleccionarElemento(clon)
                }
                else if (selectedElement !== ctrlC && selectedElement !== null  /* && perteneceAlCanvas(ctrlC) */) {
                    let copyInto = ["div", "main", "article", "section", "nav", "footer", "form", "ol", "ul", "li"]
                    let clon = ctrlC.cloneNode(true);

                    if (copyInto.includes(selectedElement.nodeName.toLowerCase())) {
                        selectedElement.appendChild(clon)
                    }
                    else {
                        insertAfter(clon, selectedElement)
                    }
                    seleccionarElemento(clon)
                }
            }
            
            /* if (event.keyCode == 122 || event.keyCode == 90) { // esto ctrl + Z
                backEstate();
            } */

        }
        if(event.shiftKey ){
            if (event.keyCode == 68 || event.keyCode == 100) { // esto ctrl + d
                if (selectedElement === null) { return; }
                let clon = selectedElement.cloneNode(true);
                insertAfter(clon, selectedElement);
                seleccionarElemento(clon);
            }
        }
    }
}
);
window.addEventListener('keypress', () => {
    console.log(event.keyCode)
    console.log(event.code)
});

function seleccionarElemento(element) {
    // let bkgAnt = element.style.backgroundImage;

    if (selectedElement !== null) {
        // selectedElement.classList.remove("seleccionarElemento"); //elimina la saleeciona la anterior elemento
        quitarMarcoSeleccion(selectedElement)
        selectedElement !== canvas && selectedElement.classList.add("seleccionMouseOver");

    }
    selectedElement = element;
    selectedElement.classList.remove("seleccionMouseOver");
    // selectedElement.classList.add("seleccionarElemento");
    dibujarMarcoSeleccion(selectedElement)

    // selectedElement.style.backgroundImage=bkgAnt;



    //esto muestra el elemento seleccionado en pantallla
    // document.getElementById("elemento_seleccionado").innerHTML = `Seleccion: ${selectedElement.localName}(${selectedElement.nodeName}) / id: ${selectedElement.id}`;
    // document.getElementById("elemento_seleccionado").innerHTML = `Seleccion: ${pathElement(selectedElement)}`;

    let elemento_seleccionado = document.getElementById("elemento_seleccionado");
    elemento_seleccionado.innerHTML = "";
    let path = pathElement(selectedElement);
    elemento_seleccionado.appendChild(document.createTextNode(`Selection: ${path}`));

    // perteneceAlCanvas(element)?console.log("pertenece al canvas"):console.log("No pertenece al canvas");

    loadPropertiesCss()
    loadPropertiesHtml()
}
function dibujarMarcoSeleccion(element) {
    // let antBkImg = element.style.backgroundImage; //si aqui hay mas de una imagen, hay un error, el algoritmo no sirve


    let antBkImg = element.style.backgroundImage;
    let vectAntBkImage = antBkImg.split(',') //*Nuevo

    let antBkSize = element.style.backgroundSize;//*Nuevo
    let vectAntBkSize = antBkSize.split(',')//*Nuevo

    let antBkPosition = element.style.backgroundPosition;//*Nuevo
    let vectAntBkPosition = antBkPosition.split(',')//*Nuevo

    let antBkRepeat = element.style.backgroundRepeat;//*Nuevo
    let vectAntBkRepeat = antBkRepeat.split(',')//*Nuevo


    let antBk = element.style.background;

   /*  console.log("#### " + vectAntBkImage + "-" + typeof vectAntBkImage + "-" + vectAntBkImage.length + " - " + Object.values(vectAntBkImage));
    console.log("### vectAntBkImage: " + vectAntBkImage, typeof vectAntBkImage, vectAntBkImage.length)
    console.log("### antBlImg: " + antBkImg, typeof antBkImg, antBkImg.length)
    console.log("### -----------------------")
    console.log("### background         (ant): " + element.style.background)
    console.log("### backgroundClip:    (ant): " + element.style.backgroundClip)
    console.log("### backgroundImage:   (ant): " + element.style.backgroundImage)
    console.log("### backgroundPosition:(ant): " + element.style.backgroundPosition)
    console.log("### backgroundRepeat:  (ant): " + element.style.backgroundRepeat)
    console.log("### backgroundSize:    (ant):" + element.style.backgroundSize)
    console.log("### -----------------------") */


    let newImages = ['url("./assets/images/system/dashedHrojo.png")', 'url("./assets/images/system/dashedVrojo.png")', 'url("./assets/images/system/dashedHrojo.png")', 'url("./assets/images/system/dashedVrojo.png")']
    let newSize = ['6px 2px', '2px 6px', '6px 2px', '2px 6px'];
    let newRepeat = ['repeat-x', 'repeat-y', 'repeat-x', 'repeat-y']
    let newPosition = ['right top', 'right top', 'right bottom', 'left top']



    vectAntBkImage.forEach((item, index) => {

        console.log("### Iteracion: " + index)
        if (item.includes("url(")) {
            // console.log("### Imagen Encontrada: "+index)

            /* console.log("### -> " + vectAntBkSize[index], typeof vectAntBkSize[index], vectAntBkSize[index].length);
            console.log("### -> " + vectAntBkPosition[index], typeof vectAntBkPosition[index], vectAntBkPosition[index].length);
            console.log("### -> " + vectAntBkRepeat[index], typeof vectAntBkRepeat[index], vectAntBkRepeat[index].length); */
            newImages.push(item);

            let cases = ["initial", ""]

            if (cases.includes(vectAntBkSize[index])) { newSize.push('auto auto') }
            else { newSize.push(vectAntBkSize[index]) }

            if (cases.includes(vectAntBkPosition[index])) { newPosition.push('0% 0%') }
            else { newPosition.push(vectAntBkPosition[index]) }

            if (cases.includes(vectAntBkRepeat[index])) { newRepeat.push('repeat repeat') }
            else { newRepeat.push(vectAntBkRepeat[index]) }

        }
    });

    element.style.backgroundImage = newImages;
    element.style.backgroundSize = newSize;
    element.style.backgroundPosition = newPosition;
    element.style.backgroundRepeat = newRepeat;

    /* console.log("### -----------------------")
    // console.log("### background         (desp): "+element.style.background)
    console.log("### backgroundImage:   (desp): " + element.style.backgroundImage)
    console.log("### backgroundClip:    (desp): " + element.style.backgroundClip)
    console.log("### backgroundPosition:(desp): " + element.style.backgroundPosition)
    console.log("### backgroundRepeat:  (desp): " + element.style.backgroundRepeat)
    console.log("### backgroundSize:    (desp):" + element.style.backgroundSize)
    console.log("### -----------------------") */

    // console.log(element.getAttribute("style"))


    //esto es solo para etiquetas img
    if (element.nodeName === "IMG" || element.nodeName === "img") {
        element.classList.remove("seleccionMouseOverImgs");
        element.classList.add("seleccionarImgan"); //ESTO DEBE DESAPARECER CUANDO SE GENERE EL CODIGO
    }
    /* if(element.nodeName==="IMG" || element.nodeName==="img"){        
        paddingImgSelectedMarcoSeleccion=element.style.padding;
        let nuevoPadding=paddingImgSelectedMarcoSeleccion.split("px ");
        let cadpadding=""
        nuevoPadding.forEach((item,index)=>{
            nuevoPadding[index]=item+1
            cadpadding+=nuevoPadding[index]+"px "
        });
        element.style.padding=cadpadding; return; 
    } */

}
function dibujarMarcoDrop(element, posicion) {


    if (element === canvas) return;
    if (element === selectedElement) { }

    //esto es solo para etiquetas img
    /* if(element.nodeName==="IMG" || element.nodeName==="img"){
        currentOpacity=element.style.opacity;
        element.style.opacity="0.2";  } */

    let antBkImg = element.style.backgroundImage;
    let vectAntBkImage = antBkImg.split(',') //*Nuevo

    let antBkSize = element.style.backgroundSize;//*Nuevo
    let vectAntBkSize = antBkSize.split(',')//*Nuevo

    let antBkPosition = element.style.backgroundPosition;//*Nuevo
    let vectAntBkPosition = antBkPosition.split(',')//*Nuevo

    let antBkRepeat = element.style.backgroundRepeat;//*Nuevo
    let vectAntBkRepeat = antBkRepeat.split(',')//*Nuevo


    let antBk = element.style.background;



    let newImages = [
        'url("./assets/images/system/aritstaVerde.png")',
        'url("./assets/images/system/dashedHverde.png")',
        'url("./assets/images/system/dashedVverde.png")',
        'url("./assets/images/system/dashedHverde.png")',
        'url("./assets/images/system/dashedVverde.png")',
    ]
    let newSize = []
    let newRepeat = []
    let newPosition = []
    // if (posicion.posicion === "arriba") {
    if (posicion.posicion === "top") {
        // newSize = ['2px 6px', '6px 2px', '2px 6px', '6px 2px', '2px 6px'];
        newSize = [`2px ${posicion.pixelesY}px`, '6px 2px', '2px 6px', '6px 2px', '2px 6px'];
        newRepeat = ['repeat-x', 'repeat-x', 'repeat-y', 'repeat-x', 'repeat-y'];
        newPosition = ['right top', '0px 0px', '100% 0px', '0px 100%', '0px 100%'];
    }
    // if (posicion.posicion === "abajo") {
    if (posicion.posicion === "bottom") {
        // newSize = ['2px 6px', '6px 2px', '2px 6px', '6px 2px', '2px 6px']
        newSize = [`2px ${posicion.pixelesY}px`, '6px 2px', '2px 6px', '6px 2px', '2px 6px']
        newRepeat = ['repeat-x', 'repeat-x', 'repeat-y', 'repeat-x', 'repeat-y']
        newPosition = ['right bottom', '0px 0px', '100% 0px', '0px 100%', '0px 100%'];
    }
    // if (posicion.posicion === "izquierda") {
    if (posicion.posicion === "left") {
        // newSize = ['6px 2px', '6px 2px', '2px 6px', '6px 2px', '2px 6px']
        newSize = [`${posicion.pixelesX}px 2px`, '6px 2px', '2px 6px', '6px 2px', '2px 6px']
        newRepeat = ['repeat-y', 'repeat-x', 'repeat-y', 'repeat-x', 'repeat-y']
        newPosition = ['left top', '0px 0px', '100% 0px', '0px 100%', '0px 100%']
    }
    // if (posicion.posicion === "derecha") {
    if (posicion.posicion === "right") {
        // newSize = ['6px 2px', '6px 2px', '2px 6px', '6px 2px', '2px 6px']
        newSize = [`${posicion.pixelesX}px 2px`, '6px 2px', '2px 6px', '6px 2px', '2px 6px']
        newRepeat = ['repeat-y', 'repeat-x', 'repeat-y', 'repeat-x', 'repeat-y']
        newPosition = ['right top', '0px 0px', '100% 0px', '0px 100%', '0px 100%']
    }
    // if (posicion.posicion === "dentro") {
    if (posicion.posicion === "inside") {
        /* newSize = ['6px 2px', '6px 2px', '2px 6px', '6px 2px', '2px 6px']
        newRepeat = ['repeat-y repeat-x', 'repeat-x', 'repeat-y', 'repeat-x', 'repeat-y']
        newPosition = ['50% 50%', '0px 0px', '100% 0px', '0px 100%', '0px 100%'] */
        // newSize = ['60% 60%', '6px 2px', '2px 6px', '6px 2px', '2px 6px']
        newSize = [`${posicion.pixelesX}px ${posicion.pixelesY}px`, '6px 2px', '2px 6px', '6px 2px', '2px 6px']
        newRepeat = ['no-repeat', 'repeat-x', 'repeat-y', 'repeat-x', 'repeat-y']
        newPosition = ['center center', '0px 0px', '100% 0px', '0px 100%', '0px 100%']
    }


    vectAntBkImage.forEach((item, index) => {
        if (item.includes("url(")) {
            newImages.push(item);

            let cases = ["initial", ""]

            if (cases.includes(vectAntBkSize[index])) { newSize.push('auto auto') }
            else { newSize.push(vectAntBkSize[index]) }

            if (cases.includes(vectAntBkPosition[index])) { newPosition.push('0% 0%') }
            else { newPosition.push(vectAntBkPosition[index]) }

            if (cases.includes(vectAntBkRepeat[index])) { newRepeat.push('repeat repeat') }
            else { newRepeat.push(vectAntBkRepeat[index]) }

        }
    });



    element.style.backgroundImage = newImages;
    element.style.backgroundSize = newSize;
    element.style.backgroundPosition = newPosition;
    element.style.backgroundRepeat = newRepeat;


    //esto es solo para etiquetas img
    if (element.nodeName === "IMG" || element.nodeName === "img") {
        if (element.classList.contains("seleccionMouseOverImgs")) { element.classList.remove("seleccionMouseOverImgs") }
        if (element.classList.contains("seleccionarImgan")) { element.classList.remove("seleccionarImgan") }
        element.classList.add("seleccionarImganDrop"); //ESTO DEBE DESAPARECER CUANDO SE GENERE EL CODIGO
    }
    /* if(element.nodeName==="IMG" || element.nodeName==="img"){        
        paddingImgSelectedMarcoDrop=element.style.padding;
        
        let pix=10;
        let nuevoPadding=paddingImgSelectedMarcoDrop.split("px ");
        let cadpadding=""
        nuevoPadding.forEach((item,index)=>{
            nuevoPadding[index]=item+3           
            cadpadding+=nuevoPadding[index]+"px "
        });
        element.style.padding=cadpadding; return; 
    } */

}


function quitarMarcoSeleccion(element) {


    let antBkImg = element.style.backgroundImage;
    let vectAntBkImage = antBkImg.split(',') //*Nuevo

    let antBkSize = element.style.backgroundSize;//*Nuevo
    let vectAntBkSize = antBkSize.split(',')//*Nuevo

    let antBkClip = element.style.backgroundClip;//*Nuevo
    let vectAntBkClip = antBkClip.split(',')//*Nuevo

    let antBkPosition = element.style.backgroundPosition;//*Nuevo
    let vectAntBkPosition = antBkPosition.split(',')//*Nuevo

    let antBkRepeat = element.style.backgroundRepeat;//*Nuevo
    let vectAntBkRepeat = antBkRepeat.split(',')//*Nuevo
    /* 
        let images=[
            'url("./assets/images/system/dashedHrojo.png")',
            'url("./assets/images/system/dashedVrojo.png")',
            'url("./assets/images/system/dashedHrojo.png")',
            'url("./assets/images/system/dashedVrojo.png")'
        ];
     */


    console.log("==QMS _____________________________")
    console.log("==QMS vectAntBkImage(Ant): " + vectAntBkImage)
    console.log("==QMS vectAntBkSize(Ant): " + vectAntBkSize)
    console.log("==QMS vectAntBkClip(Ant): " + vectAntBkClip)
    console.log("==QMS vectAntBkPosition(Ant): " + vectAntBkPosition)
    console.log("==QMS vectAntBkRepeat(Ant): " + vectAntBkRepeat)

    let indexs = [];

    for (let i = 0; i < vectAntBkImage.length; i++) {
        if (vectAntBkImage[i].includes('./assets/images/system/dashedHrojo.png') ||
            vectAntBkImage[i].includes('./assets/images/system/dashedVrojo.png')) {
            console.log("==QMS PUSH");
            indexs.push(i)

        }

    }

    console.log("==QMS indexs a borrar: " + indexs)

    for (let j = indexs.length - 1; j >= 0; j--) {
        vectAntBkImage.splice(indexs[j], 1);
        vectAntBkSize.splice(indexs[j], 1);
        vectAntBkClip.splice(indexs[j], 1);
        vectAntBkPosition.splice(indexs[j], 1);
        vectAntBkRepeat.splice(indexs[j], 1);

    }


    console.log("==QMS _____________________________")
    console.log("==QMS vectAntBkImage: " + vectAntBkImage)
    console.log("==QMS vectAntBkSize: " + vectAntBkSize)
    console.log("==QMS vectAntBkClip: " + vectAntBkClip)
    console.log("==QMS vectAntBkPosition: " + vectAntBkPosition)
    console.log("==QMS vectAntBkRepeat: " + vectAntBkRepeat)


    element.style.backgroundImage = vectAntBkImage;
    element.style.backgroundSize = vectAntBkSize;
    element.style.backgroundClip = vectAntBkClip;
    element.style.backgroundPosition = vectAntBkPosition;
    element.style.backgroundRepeat = vectAntBkRepeat;



    //esto es solo para etiquetas img
    if (element.nodeName === "IMG" || element.nodeName === "img") {
        element.classList.remove("seleccionarImgan");
        element.classList.add("seleccionMouseOverImgs");
    }
    /* if(element.nodeName==="IMG" || element.nodeName==="img"){
        element.style.padding=paddingImgSelectedMarcoSeleccion;paddingImgSelectedMarcoSeleccion=null; return; 
    } */


}
function quitarMarcoDrop(element) {
    //esto es solo para etiquetas img
    /* if(element.nodeName==="IMG" || element.nodeName==="img"){
        element.style.opacity=currentOpacity; return; } */

    let antBkImg = element.style.backgroundImage;
    let vectAntBkImage = antBkImg.split(',') //*Nuevo

    let antBkSize = element.style.backgroundSize;//*Nuevo
    let vectAntBkSize = antBkSize.split(',')//*Nuevo

    let antBkClip = element.style.backgroundClip;//*Nuevo
    let vectAntBkClip = antBkClip.split(',')//*Nuevo

    let antBkPosition = element.style.backgroundPosition;//*Nuevo
    let vectAntBkPosition = antBkPosition.split(',')//*Nuevo

    let antBkRepeat = element.style.backgroundRepeat;//*Nuevo
    let vectAntBkRepeat = antBkRepeat.split(',')//*Nuevo


    let indexs = [];

    for (let i = 0; i < vectAntBkImage.length; i++) {
        if (vectAntBkImage[i].includes('./assets/images/system/dashedHverde.png') ||
            vectAntBkImage[i].includes('./assets/images/system/dashedVverde.png') ||
            vectAntBkImage[i].includes('./assets/images/system/aritstaVerde.png')) {
            // console.log("==QMS PUSH");
            indexs.push(i)

        }

    }

    console.log("==QMS indexs a borrar: " + indexs)

    for (let j = indexs.length - 1; j >= 0; j--) {
        vectAntBkImage.splice(indexs[j], 1);
        vectAntBkSize.splice(indexs[j], 1);
        vectAntBkClip.splice(indexs[j], 1);
        vectAntBkPosition.splice(indexs[j], 1);
        vectAntBkRepeat.splice(indexs[j], 1);

    }




    element.style.backgroundImage = vectAntBkImage;
    element.style.backgroundSize = vectAntBkSize;
    element.style.backgroundClip = vectAntBkClip;
    element.style.backgroundPosition = vectAntBkPosition;
    element.style.backgroundRepeat = vectAntBkRepeat;

    //esto es solo para etiquetas img
    if (element.nodeName === "IMG" || element.nodeName === "img") {
        element.classList.remove("seleccionarImganDrop");
        element.classList.add("seleccionMouseOverImgs");
    }
    /* if(element.nodeName==="IMG" || element.nodeName==="img"){
        element.style.padding=paddingImgSelectedMarcoDrop;paddingImgSelectedMarcoDrop=null; return; 
    } */
}


function perteneceAlCanvas(element) {
    let currentPadre = element;
    while (currentPadre.nodeName !== "BODY") {
        if (currentPadre.id === "canvas") { return true; break; }
        currentPadre = currentPadre.parentNode;
    }
    return false;
}
function pathElement(element) {
    let currentPadre = element;
    let cadenaPath = " canvas";
    let path = [];
    while (currentPadre.nodeName !== "BODY") {
        if (currentPadre.id === "canvas") { break; }
        let c = `/<${currentPadre.nodeName.toString().toLowerCase()}`;
        if (currentPadre.id.toString() !== "") { c += ` id:${currentPadre.id.toString()}` }
        c += ">";
        path.push(c);
        // if (currentPadre.id === "canvas") { break; }
        currentPadre = currentPadre.parentNode;
    }

    let reverse = path.reverse();
    for (let i = 0; i < reverse.length; i++) {
        cadenaPath += reverse[i].toString();

    }

    return cadenaPath.toString()

}
/* selectedElement.addEventListener('change',()=>{
    console.log("SE CAMBIO DE ELEMENTO");
}); */

//CARGANDO LAS PROPIEDADES EN LA SECCION DE PROPIEDADES
// var propiedades = document.getElementById("propiedades");

function loadPropertiesCss() {
    // if (selectedElement === null )return;


    propertiesCss = [];  //reseteando las propiedades

    console.log(event)

    //=================================================================
    // FORMA 1
    let elementStyle = window.getComputedStyle(selectedElement); //obtiene todos los atributos css del elemento
    let i = 0;
    for (const property in elementStyle) {
        if (i > 364) {
            propertiesCss.push({ css: property, js: stringToCamelCase(property), value: (elementStyle[property]+"") })
            // propertiesCss.push({ css: property, js: stringToCamelCase(property), value: (elementStyle.getPropertyValue(property)+"") })
        }
        i++
    }
    //=================================================================
    // FORMA 2
    /* let elementStyle2 = selectedElement.style; //obtiene todos los atributos css del elemento
    let j = 0;
    for (const property in elementStyle2) {
        // if (i > 364) {
            propertiesCss.push({ css: property, js: stringToCamelCase(property), value: elementStyle[property] })
        // }
        j++
    } */
    //=================================================================



    console.log("PropiedadesCss: " + propertiesCss.length)

    //-----------------------------------------------------

    tablaPropiedadesCss.innerHTML = ""; //Reseteando la tabla
    propertiesCss.forEach((item, index) => {


        let Nuevafila = document.createElement("tr");
        let tdTitulo = document.createElement("td");
        // tdTitulo.innerHTML = item.css;
        tdTitulo.innerHTML = cutString(item.css, 20);

        let tdValue = document.createElement("td");
        let valu = item.value ? (item.value).toString() : item.value
        tdValue.innerHTML = `<input type="text" id="${item.css}" class="inputValue" onkeypress="onInputChangeCss()"  value="${valu}" />`
        /* 
        let inputValue = document.createElement("input");
        inputValue.type = "text";
        inputValue.value = item.value
        inputValue.id = item.js;
        inputValue.addEventListener("keypress", (e)=>onInputChange);
        tdValue.appendChild(inputValue) */

        Nuevafila.appendChild(tdTitulo)
        Nuevafila.appendChild(tdValue)
        tablaPropiedadesCss.appendChild(Nuevafila);
    });
}
function loadPropertiesHtml() {
    // if (selectedElement === null )return;

    propertiesHtml = [];
    // for (const property in event.target) {
    for (const property in selectedElement) {
        // console.log(`${property}: ${event.target[property]}`);
        // propertiesHtml.push({ propertyTitle: property, value: event.target[property] });
        propertiesHtml.push({ propertyTitle: property, value: selectedElement[property]+"" });
    }
    console.log("PropiedadesHtml: " + propertiesHtml.length)

    //------------------------------------------------------



    tablaPropiedadesHtml.innerHTML = ""; //Reseteando la tabla
    propertiesHtml.forEach((item, index) => {


        let Nuevafila = document.createElement("tr");
        let tdTitulo = document.createElement("td");
        tdTitulo.innerHTML = cutString(item.propertyTitle, 20);
        // tdTitulo.innerHTML = item.propertyTitle;

        let tdValue = document.createElement("td");
        let valu = item.value ? (item.value).toString() : item.value
        tdValue.innerHTML = `<input type="text" id="${item.propertyTitle}" class="inputValue" onkeypress="onInputChangeHtml()"  value="${valu}" />`
        /* 
        let inputValue = document.createElement("input");
        inputValue.type = "text";
        inputValue.value = item.value
        inputValue.id = item.js;
        inputValue.addEventListener("keypress", (e)=>onInputChange);
        tdValue.appendChild(inputValue) */

        Nuevafila.appendChild(tdTitulo)
        Nuevafila.appendChild(tdValue)
        tablaPropiedadesHtml.appendChild(Nuevafila);
    });
}


function addElement(event) {
    // let canvas = document.getElementById("canvas");
    element = event.target.id;
    addElementDom(element, canvas, 0, 1);

}
function addElementDom(element, addTo, ofx, ofy) { //element es un string que especifica el tipo de etiqueta: "p", "h1","h2"...

    let newElement;

    if (inputs.includes(element)) {
        newElement = document.createElement("input");
        newElement.type = element;
        setStyleElement(newElement, element);
    }
    else if (custome.includes(element)) {
        newElement = elementsCustome(element)
    }
    else {
        newElement = document.createElement(element);
        setStyleElement(newElement, element);
    }




    //ESTA CLASE DEBE DESAPARACER CUANDO SE GENERE EL CODIGO

    newElement.addEventListener('dragover', dragOverElement); //ESTE EVENTO DEBE DESAPARACER CUANDO SE GENERE EL CODIGO
    newElement.draggable = true;//ESTA PROPIEDAD DEBE DESAPARACER CUANDO SE GENERE EL CODIGO
    newElement.addEventListener('dragstart', dragStartMoveElement); //ESTE EVENTO DEBE DESAPARACER CUANDO SE GENERE EL CODIGO


    //----------------------------------
    //Antes
    // addTo.appendChild(newElement);
    //----------------------------------
    //Ahora
    if (addTo === canvas) { canvas.appendChild(newElement); seleccionarElemento(newElement); return; }
    let elementopPadre = addTo.parentNode;
    let calArit = calcularArista(parseFloat(currentDrop.offsetWidth), parseFloat(currentDrop.offsetHeight), ofx, ofy);
    let res = calArit.posicion
    // if (res === "arriba" || res === "izquierda") { elementopPadre.insertBefore(newElement, addTo); }
    if (res === "top" || res === "left") { elementopPadre.insertBefore(newElement, addTo); }
    // else if (res === "abajo" || res === "derecha") { insertAfter(newElement, addTo); }
    else if (res === "bottom" || res === "right") { insertAfter(newElement, addTo); }
    // else if (res == "dentro") { currentDrop.appendChild(newElement); }
    else if (res == "inside") { currentDrop.appendChild(newElement); }
    seleccionarElemento(newElement);
    //----------------------------------
    // saveEstateCanvas()
}
function moveElementDom(elementToMove, moveTo, ofx, ofy) { //esta funcion es para mover un elemento de pocicion en  el canvas
    let elementopPadre = moveTo.parentNode;
    // elementopPadre.insertBefore(elementToMove, moveTo);
    let W = parseFloat(currentDrop.offsetWidth);
    let H = parseFloat(currentDrop.offsetHeight);
    let x = ofx;
    let y = ofy;
    //--------------------------------------------------
    if (moveTo === canvas) { canvas.appendChild(elementToMove); return; }

    // currentDrop.classList.remove("seleccionarDrop");
    quitarMarcoDrop(currentDrop);


    let calArit = calcularArista(W, H, x, y)
    let res = calArit.posicion
    // if (res === "arriba" || res === "izquierda") { elementopPadre.insertBefore(elementToMove, moveTo); }
    if (res === "top" || res === "left") { elementopPadre.insertBefore(elementToMove, moveTo); }
    // else if (res === "abajo" || res === "derecha") { insertAfter(elementToMove, moveTo); }
    else if (res === "bottom" || res === "right") { insertAfter(elementToMove, moveTo); }
    // else if (res == "dentro") { currentDrop.appendChild(elementToMove); }
    else if (res == "inside") { currentDrop.appendChild(elementToMove); }

    // saveEstateCanvas()
}
function insertAfter(elementToMove, afterOf) {
    if (afterOf.nextSibling) {
        afterOf.parentNode.insertBefore(elementToMove, afterOf.nextSibling);
    } else {
        afterOf.parentNode.appendChild(elementToMove);
    }
}
function calcularArista(W, H, x, y) {
    let porcentajey = 0.15;
    let porcentajex = 0.08;
    let r = "-";

    let factorForma = W / H;
    if (factorForma >= 1.2) {
        porcentajex = 0.08; porcentajey = 0.15;
    }
    else if (factorForma <= 0.8) {
        porcentajex = 0.1; porcentajey = 0.08;
    }
    else {
        porcentajex = 0.15; porcentajey = 0.15;
    }


    let pixelesArriba = H * porcentajey;
    if (y < pixelesArriba) {
        // elementopPadre.insertBefore(elementToMove, moveTo);
        r = "arriba"
        // r = { posicion: "arriba", pixelesY: pixelesArriba }
        r = { posicion: "top", pixelesY: pixelesArriba }
    }
    else {
        // element.style.borderTop = "";
    }
    let pixelesAbajo = H * (1 - porcentajey);
    if (y > pixelesAbajo) {
        // insertAfter(elementToMove,moveTo)
        r = "abajo"
        // r = { posicion: "abajo", pixelesY: pixelesArriba }
        r = { posicion: "bottom", pixelesY: pixelesArriba }
    }
    else {
        // element.style.borderBottom = "";
    }
    let pixelesIzquierda = W * porcentajex
    if (x < pixelesIzquierda) {
        // elementopPadre.insertBefore(elementToMove, moveTo);
        r = "izquierda"
        // r = { posicion: "izquierda", pixelesX: pixelesIzquierda }
        r = { posicion: "left", pixelesX: pixelesIzquierda }
    }
    else {
        // element.style.borderLeft = "";
    }
    let pixelesDerecha = W * (1 - porcentajex);
    if (x > pixelesDerecha) {
        // insertAfter(elementToMove,moveTo)
        r = "derecha"
        // r = { posicion: "derecha", pixelesX: pixelesIzquierda }
        r = { posicion: "right", pixelesX: pixelesIzquierda }
    }
    else {
        // element.style.borderRight = "";
    }
    let puedenPonerDentro = ["div", "article", "section", "table", "tr", "th", "td", "ol", "ul"]
    let PixelesCentroX = W - 2 * (W * porcentajex);
    let PixelesCentroY = H - 2 * (H * porcentajey);
    if (/* puedenPonerDentro.includes(currentDrop.localName.toLowerCase())&& */ y > H * porcentajey && y < H * (1 - porcentajey) && x > W * porcentajex
        && x < W * (1 - porcentajex)) {
        // currentDrop.appendChild(elementToMove);
        r = "dentro"
        // r = { posicion: "dentro", pixelesX: PixelesCentroX, pixelesY: PixelesCentroY }
        r = { posicion: "inside", pixelesX: PixelesCentroX, pixelesY: PixelesCentroY }
    }



    return r;
}



function setStyleElement(newElement, tagString) {

    newElement.style.height = "auto";
    newElement.style.width = "auto";
    newElement.style.minHeight = "10px";
    newElement.style.minWidth = "15px";

    newElement.classList.add("seleccionMouseOver"); //ESTA CLASE DEBE DESAPARECER CUANDO SE GENERE EL CODIGO

    // if(tagString==="img")  newElement.classList.add("seleccionMouseOverImgs");



    if (tagString.toLowerCase() === "img") {
        newElement.classList.add("seleccionMouseOverImgs"); //ESTA CLASE DEBE DESAPARECER CUANDO SE GENERE EL CODIGO
        newElement.src = "./assets/images/image.jpg";
        newElement.alt = "Mi imagen"

    }
    else if (tagString.toLowerCase() === "audio") {
        newElement.controls = true;
        newElement.style.width = "250px"
        newElement.style.height = "55px"
        newElement.src = "./assets/audio/audio.mp3";
    }
    else if (tagString.toLowerCase() === "video") {
        newElement.controls = true;
        newElement.style.width = "200px"
        newElement.style.height = "auto"
        newElement.src = "./assets/video/video.mp4";
    }
    else if (tagString.toLowerCase() === "progress") {
        // newElement.controls=true;
        newElement.style.width = "250px"
        newElement.style.height = "auto"
    }
    else if (tagString.toLowerCase() === "a") {
        newElement.href = "#"
    }




    //----------------------------------------------------------------------

    //etiquetas que no llevan nada de contenido texto adentro al momento de crearse
    let etiquetasConTexto = ["div", "img", "article", "section", "aside", "nav", "footer", "form", "main",
        "table", "tr", "thh", "tdd", "br", "hr", "ol", "ul", "lli", "fieldset", "iframe", "menu", "progress", "details"];
    if (!etiquetasConTexto.includes(tagString)) {
        let texto = document.createTextNode(tagString);
        newElement.appendChild(texto);
    }

    let etiquetasConPadding = ["div", "article", "section", "aside", "nav", "footer", "main", "table", "tr", "th", "td", "oll", "ull", "form", "menu", "details"];
    if (etiquetasConPadding.includes(tagString)) {
        newElement.style.padding = "2px";
        newElement.style.margin = "2px 2px";
    }

    if (tagString === "table") { newElement.style.padding = "10px" }

}



function onInputChangeCss() {
    /* styles = { ...styles, [event.target.id]: event.target.value }
    console.log(styles) */
    let property = event.target.id;
    let value = event.target.value;
    if (value.toLowerCase() === "true") { value = true }
    if (value.toLowerCase() === "false") { value = false }


    if (event.keyCode === 13) { // codigo de Enter  es 13
        selectedElement.style[property] = value;
        loadPropertiesCss();
        loadPropertiesHtml();
        // seleccionarElemento(selectedElement)
        let background = ["background", "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat"]
        if (background.includes(property)) { dibujarMarcoSeleccion(selectedElement) }

        let padding = ["padding", "paddingLeft", "paddingTop", "paddingBottom", "paddingRight"]
        if (padding.includes(property)) {
            paddingImgSelectedMarcoSeleccion = selectedElement.style.padding;
            console.log("44 paddingImSeleceted:", paddingImgSelectedMarcoSeleccion, value)
            // quitarMarcoSeleccion(event.target);
            // dibujarMarcoSeleccion(event.target)
        }
        // saveEstateCanvas()

    }

    // console.log(event.keyCode)


    // selectedElement.style[event.target.id] = event.target.value;

    // seleccionarElemento(selectedElement);
    // loadPropertiesCss();

}
function onInputChangeHtml() {
    let property = event.target.id;
    let value = event.target.value;
    if (value.toLowerCase() === "true") { value = true }
    if (value.toLowerCase() === "false") { value = false }



    if (event.keyCode === 13) { // codigo de Enter  es 13
        selectedElement[property] = value;
        loadPropertiesHtml();
        loadPropertiesCss();
        // saveEstateCanvas();
    }
    // selectedElement[event.target.id] = event.target.value;
    // seleccionarElemento(selectedElement)
    // loadPropertiesHtml()
    // al presionar supr, ctrl + x , ctrl + v**** 


}

let div = document.getElementById("element1");
console.log(div)
console.log(styles)
// div.style.marginBottom

// stringToCamelCase("Hola-mundo-JAva")
function stringToCamelCase(cadena) {
    let result = "";
    let flag = false;
    for (let i = 0; i < cadena.length; i++) {
        const element = cadena[i];
        // console.log(element)


        if (i === 0) {
            result += element.toLowerCase();
        }
        else {
            if (element === "-") {
                flag = true;
            } else {
                if (flag) {
                    result += element.toUpperCase();
                }
                else {
                    result += element.toLowerCase();
                }
                flag = false;
            }
        }
        // console.log(result)
        return result;

    }
}

function cutString(cadena, size) {
    let newString = "";

    // 
    if (cadena.length >= size) {
        for (let i = 0; i < size; i++) {
            newString += cadena[i]
        }
        newString += "...";
        return newString
    }
    else {
        return cadena
    }

}




function elementsCustome(tag) {
    let div = document.createElement("div");;
    if (tag === "custome01") {
        div.style.backgroundColor = "pink"
        let image = document.createElement("img")
        image.src = "https://independientesantafe.com/wp-content/uploads/2021/03/pasto-128x128.png"
        let p = document.createElement("p")
        p.innerHTML = "elementCustome";
        p.style.color = "white"
        div.appendChild(p);
        div.appendChild(image);
    }
    else if (tag === "custome02") {//table 

        // let estilosFilas="text-align: center; vertical-align:center;  border: 1px solid black; border-collapse: collapse "
        let estilosFilas = "padding: 8px;     background: #e8edff;     border-bottom: 1px solid #fff;  color: #669;    border-top: 1px solid transparent"
        // let estilosHeader="background-color: pink; text-align: center; vertical-align:center;  border: 1px solid black; border-collapse: collapse "
        let estilosHeader = "  padding: 8px;     background: #b9c9fe; border-top: 4px solid #aabcfe;    border-bottom: 1px solid #fff; color: #039;"

        div.style = " padding: 5px; display : inline-block;"

        div.innerHTML=`
        <table class="seleccionMouseOver" style="font-size: 12px;    margin: 10px;   text-align: left;    border-collapse: collapse">
            <tr style="${estilosHeader}" class="seleccionMouseOver">
                <th style="${estilosFilas}" class="seleccionMouseOver">Header1</th>
                <th style="${estilosFilas}" class="seleccionMouseOver">Header2</th>
                <th style="${estilosFilas}" class="seleccionMouseOver">Header3</th>
                <th style="${estilosFilas}" class="seleccionMouseOver">Header4</th>
            </tr>
            <tbody style="padding: 2px"  class="seleccionMouseOver">
                                
                <tr class="seleccionMouseOver">
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                </tr>
                <tr class="seleccionMouseOver">
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                </tr>
                <tr class="seleccionMouseOver">
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                    <td class="seleccionMouseOver" style="${estilosFilas}">Row</td>
                </tr>
            </tbody>
        </table>
        `;
    }
    else if (tag === "custome03") { //leyenda
        let tex = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores consequatur odio suscipit incidunt, minima nemo aut perferendis, soluta quasi eligendi laborum. Quos tempora esse, non quia inventore corporis dicta accusantium?`
        let img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4u4UIjNvI2uFFevqDL0czKChlwgIrxOBVU0L9XiPJ--jLrnlqf-KCIYZ1FQi6VAa_nDs&amp;usqp=CAU"
        

        div.innerHTML = `
        <div class="seleccionMouseOver" style="width: auto; height: auto; display: flex; align-items: center; justify-content: center; margin: 10px;">
            <div class="seleccionMouseOver" style="margin: 10px 40px 10px 10px;">
                <img src="${img}" class="seleccionMouseOver seleccionMouseOverImgs" style="width: 95px; margin: 2px;">
                <h5 class="seleccionMouseOver" style="margin: 2px; text-align: center;">
                    Title
                </h5>
            </div>
            <div class="seleccionMouseOver" style="display: inline-block; margin: 10px;">
                <h3 class="seleccionMouseOver" style="margin: 4px;">
                    Title
                </h3>
                <p class="seleccionMouseOver" style="text-align: justify; margin: 4px;">
                    ${tex} ${tex} ${tex}
                </p>
            </div>
        </div>
        `

    }
    else if (tag === "custome04") {//form
        
        div.style = "display: flex; width:100%; align-items: center; justify-content: center;";
        let atrib='class="seleccionMouseOver" draggable="true" ondragstart="dragStartMoveElement()"';

        let styleDivInputs="display: flex; align-items: center; justify-content: center; margin: 5px"
        let styleLabelInputs="width: 12%; margin: 0px; padding: 0px; text-align: left";
        let styleInputs ="width: 40%; margin: 0px; padding: 0px; box-sizing: border-box";

        div.innerHTML=`
            <div style="width: 60%; margin: 4px" ${atrib}>
                <h3 style="text-align: center;" ${atrib}>
                    Registration Form
                </h3>

                <div style="${styleDivInputs}" ${atrib}>
                    <label for="name" ${atrib} style="${styleLabelInputs}">Name: </label>    
                    <input type="text" name="name" id="name" ${atrib} style="${styleInputs}">
                </div>
                <div style="${styleDivInputs}" ${atrib}>
                    <label for="birthdate" ${atrib} style="${styleLabelInputs}">Birthdate: </label>    
                    <input type="date" name="birthdate" id="birthdate" ${atrib} style="${styleInputs}">
                </div>
                
                <div style="${styleDivInputs}" ${atrib}>
                    <label for="email" ${atrib} style="${styleLabelInputs}">Email: </label>    
                    <input type="email" name="email" id="email" ${atrib} style="${styleInputs}">
                </div>
                <div style="${styleDivInputs}" ${atrib}>
                    <label for="dni" ${atrib} style="${styleLabelInputs}">DNI: </label>    
                    <input type="number" name="dni" id="dni" ${atrib} style="${styleInputs}">
                </div>
                <div style="${styleDivInputs}" ${atrib}>
                    <label for="phone" ${atrib} style="${styleLabelInputs}">Phone: </label>    
                    <input type="tel" name="phone" id="phone" ${atrib} style="${styleInputs}">
                </div>
                
                <div style="${styleDivInputs}" ${atrib}>
                    <label for="company" ${atrib} style="${styleLabelInputs}">Company: </label>    
                    <select name="company" id="company" style="${styleInputs}">
                        <option value="Apple" style="${styleInputs}">Apple</option>
                        <option value="Microsoft" style="${styleInputs}">Microsoft</option>
                        <option value="Google" style="${styleInputs}">Google</option>
                    </select>
                </div>


                <div style="${styleDivInputs}" ${atrib}>
                    <label style="${styleLabelInputs}; text-align: left" ${atrib}>Languages</label> 
                    <div style="${styleInputs}">
                        
                        <div style="margin: 2px; paddin: 0px; display: inline-block; width: auto"  ${atrib}> 
                            <input type="checkbox" name="es" id="es" ${atrib} value="es"">
                            <label for="es" ${atrib} >Spanish </label>   
                        </div>

                        <div style="margin: 2px; paddin: 0px; display: inline-block; width: auto"  ${atrib}> 
                            <input type="checkbox" name="en" id="en" ${atrib} value="en">
                            <label for="en" ${atrib} >English </label>  
                        </div>
                        
                        <div style="margin: 2px; paddin: 0px; display: inline-block; width: auto"  ${atrib}> 
                            <input type="checkbox" name="al" id="al" ${atrib} value="al">
                            <label for="al" ${atrib} >German </label>    
                        </div>

                        <div style="margin: 2px; paddin: 0px; display: inline-block; width: auto"  ${atrib}> 
                            <input type="checkbox" name="fr" id="fr" ${atrib} value="fr">
                            <label for="fr" ${atrib} >French </label>    
                        </div>

                        <div style="margin: 2px; paddin: 0px; display: inline-block; width: auto"  ${atrib}> 
                            <input type="checkbox" name="pr" id="pr" ${atrib} value="pr">
                            <label for="pr" ${atrib} >Portuguese </label>    
                        </div>

                        <div style="margin: 2px; paddin: 0px; display: inline-block; width: auto"  ${atrib}> 
                            <input type="checkbox" name="ch" id="ch" ${atrib} value="ch">
                            <label for="ch" ${atrib} >Mandarin Chinese </label>    
                        </div>

                    </div>
                </div>

                
                <div style="${styleDivInputs}" ${atrib}>    
                    <label style="${styleLabelInputs}; text-align: left" ${atrib}>Gender: </label> 
                    <div style="${styleInputs}">
                        <input type="radio" name="gender" id="gender" ${atrib} value="male">
                        <label for="gender" ${atrib}>Male </label> <br>
                        <input type="radio" name="gender" id="gender" ${atrib} value="female">
                        <label for="female" ${atrib}>Female </label> 
                    </div>               
                </div>


                <div style="${styleDivInputs}" ${atrib}>
                    <label for="photo" ${atrib} style="${styleLabelInputs}">Photo: </label>    
                    <input type="file" name="photo" id="photo" ${atrib} style="${styleInputs}">
                </div>

                <div style="${styleDivInputs}" ${atrib}>
                    <label for="description" ${atrib} style="${styleLabelInputs}">Description: </label>    
                    <textarea name="description" id="description" style="${styleInputs}"></textarea>
                </div>


                <div style="${styleDivInputs}" ${atrib}>   
                    <input type="submit" style="width:52%" value="send">
                </div>

            </div>
        `;
    }
    else if (tag === "custome05") { //row
        div.style = "display:flex; align-items: center; justify-content: center; width: 100%; height: auto; box-sizing: border-box; padding: 1px"
        let stylechilds = "width: 80%; min-height: 200px; margin: 5px;";

        div.innerHTML=`
        <div style="${stylechilds}" class="seleccionMouseOver"></div>
        <div style="${stylechilds}" class="seleccionMouseOver"></div>
        <div style="${stylechilds}" class="seleccionMouseOver"></div>
        <div style="${stylechilds}" class="seleccionMouseOver"></div>
        <div style="${stylechilds}" class="seleccionMouseOver"></div>
        `;


    }

    else if (tag === "custome06") { //grid
        // div.style="display:grid; width:100%; padding:2px; height: auto; grid-template-columns:  25% 25% 25% 25%; "
        div.style = "display:grid; width:100%; padding:5px 5px; height: auto; grid-template-columns:  auto auto auto; box-sizing: border-box"
        let styleChildren = "width: auto; min-height: 100px; margin: 2px; border: #DDDDDD dashed 1px";

        div.innerHTML=`
        <div style="${styleChildren}" class="seleccionMouseOver"></div>
        <div style="${styleChildren}" class="seleccionMouseOver"></div>
        <div style="${styleChildren}" class="seleccionMouseOver"></div>
        
        <div style="${styleChildren}" class="seleccionMouseOver"></div>
        <div style="${styleChildren}" class="seleccionMouseOver"></div>
        <div style="${styleChildren}" class="seleccionMouseOver"></div>

        <div style="${styleChildren}" class="seleccionMouseOver"></div>
        <div style="${styleChildren}" class="seleccionMouseOver"></div>
        <div style="${styleChildren}" class="seleccionMouseOver"></div>

        `;
    }

    else if (tag === "custome07") {//center
        // div.style = "width:100%%; height: 100%; padding: 1px; display: block"; 
        div.style = "width: 99%; min-height: 100%; display: flex; align-items: center; justify-content: center; box-sizing: border-box"; 

        div.id = "container";
        // div.innerHTML="."
        /* div.innerHTML=`
        <div id="center" class="seleccionMouseOver" style="width: 100%; height: 100%; display:flex; align-items: center; justify-content: center;">
        </div>
        `; */
    }


    div.classList.add("seleccionMouseOver");
    return div;
}




//----------------------------------
let currentDragNewElement = null; //el nuevo elemento a agregar que se esta arrastrando
let currentDragMoveElement = null; //el elemento que se va a mover de posicion
let currentDrop = null; //el elemento donde llega el que se esta siendo arrastrando
let currentDropPosition = ""; //el elemento donde llega el que se esta siendo arrastrando

function dragStartNewElement() { //cuando
    currentDragNewElement = event.target; // console.log("Elemento arrastrando: "+currentDragNewElement)
    seleccionarElemento(canvas);
    // selectedElement=null;
}
function dragStartMoveElement() { //cuando
    currentDragMoveElement = event.target; // console.log("Elemento arrastrando: "+currentDragNewElement)
    seleccionarElemento(canvas);
    // currentDragMoveElement.classList.remove("seleccionMouseOver")
}

function dragOverElement() {
    event.preventDefault();


    if (event.target !== currentDrop && currentDrop !== null) {
        // currentDrop.classList.remove("seleccionarDrop");
        quitarMarcoDrop(currentDrop);
    }
    else if (event.target === currentDrop) {

        let Wn = parseFloat(currentDrop.offsetWidth);
        let Hn = parseFloat(currentDrop.offsetHeight);
        let calArit = calcularArista(Wn, Hn, x = event.offsetX, y = event.offsetY);
        let Pn = calArit.posicion;
        if (currentDropPosition !== Pn) {
            currentDropPosition = Pn;
            // currentDrop.classList.remove("seleccionarDrop");
            quitarMarcoDrop(currentDrop);
            // currentDrop.classList.add("seleccionarDrop");
            dibujarMarcoDrop(currentDrop, calArit);
            // console.log(`currentDragNewElement: ${currentDragNewElement}, currentDragMoveElement: ${currentDragMoveElement}, soltar en:  ${currentDrop}`);
            document.getElementById("soltar_en").innerHTML = `Drop In(${Pn}): ${currentDrop.id==="canvas"?"canvas":`< ${currentDrop.localName}${currentDrop.id?` id="${currentDrop.id}"`:""}${currentDrop.name?` name="${currentDrop.name}"`:""}>`}`;
        }
        return;
    }
    else { }
    // if(event.target === selectedElement){seleccionarElemento(canvas);}

    //hay q crear una variable globa currentDropOffsetX y currentDropOffsetY para saber se movio dentro del boton


    currentDrop = event.target;

    let pos = "";
    let W = parseFloat(currentDrop.offsetWidth);
    let H = parseFloat(currentDrop.offsetHeight);
    let calArit = calcularArista(W, H, x = event.offsetX, y = event.offsetY)
    currentDropPosition = calArit.posicion;

    // console.log(`currentDragNewElement: ${currentDragNewElement}, currentDragMoveElement: ${currentDragMoveElement}, soltar en:  ${currentDrop}`);
    document.getElementById("soltar_en").innerHTML = `Drop In(${Pn}): ${currentDrop.id==="canvas"?"canvas":`< ${currentDrop.localName}${currentDrop.id?` id="${currentDrop.id}"`:""}${currentDrop.name?` name="${currentDrop.name}"`:""}>`}`;  


    // currentDrop.classList.add("seleccionarDrop");
    dibujarMarcoDrop(currentDrop, calArit);

    // if (selectedElement == currentDrop) { }


}
function dropElement() {

    // console.log("SOLTADO EN: %%%%%%");
    // console.log(event.offsetX, event.offsetY);

    if (currentDragNewElement !== null && currentDragMoveElement === null) {
        // currentDrop.classList.remove("seleccionarDrop");
        quitarMarcoDrop(currentDrop)
        addElementDom(currentDragNewElement.id, currentDrop, event.offsetX, event.offsetY);
        currentDragNewElement = null;
        currentDrop = null;
        currentDropPosition = "";
    }
    if (currentDragMoveElement !== null && currentDragNewElement === null) {
        moveElementDom(currentDragMoveElement, currentDrop, event.offsetX, event.offsetY);

        // seleccionarElemento(currentDragMoveElement)
        // currentDragMoveElement.classList.add("seleccionMouseOver")

        currentDragMoveElement = null;
        currentDrop = null;
        currentDropPosition = "";
    }

    document.getElementById("soltar_en").innerHTML = "";
}


//--======================== GENERACION DE CODIGO ==============================
// let  stylesGenerate="<style>";
function quitarCosas(element) {

    //cosas que hay que remover
    //drgable
    element.draggable = undefined;
    element.removeEventListener('dragstart', dragStartNewElement);
    element.removeEventListener('dragstart', dragStartMoveElement);
    element.removeEventListener('dragover', dragOverElement);



    try {
        if (element.classList.contains("seleccionMouseOver")) { element.classList.remove("seleccionMouseOver") }
        if (element.classList.contains("seleccionMouseOverImgs")) { element.classList.remove("seleccionMouseOverImgs") }
        if (element.classList.contains("seleccionarImganDrop")) { element.classList.remove("seleccionarImganDrop") }

        quitarMarcoSeleccion(element)
    }
    catch (error) {
        // console.log("Error: "+error)
    }



    // newElement.addEventListener('dragover', dragOverElement); //ESTE EVENTO DEBE DESAPARACER CUANDO SE GENERE EL CODIGO
    // newElement.draggable = true;//ESTA PROPIEDAD DEBE DESAPARACER CUANDO SE GENERE EL CODIGO
    // newElement.addEventListener('dragstart', dragStartMoveElement); //ESTE EVENTO DEBE DESAPARACER CUANDO SE GENERE EL CODIGO

    // newElement.classList.add("seleccionMouseOver"); //ESTA CLASE DEBE DESAPARECER CUANDO SE GENERE EL CODIGO
    // newElement.classList.add("seleccionMouseOverImgs"); //ESTA CLASE DEBE DESAPARECER CUANDO SE GENERE EL CODIGO

    // element.classList.add("seleccionarImgan"); //ESTO DEBE DESAPARECER CUANDO SE GENERE EL CODIGO


    // element.classList.add("seleccionarImganDrop"); //ESTO DEBE DESAPARECER CUANDO SE GENERE EL CODIGO

}

function generateCode() {

    let canvasClone = canvas.cloneNode(true);

    // let nodelist = canvasClone.childNodes;
    let nodelist = canvasClone.children;

    let fifo = Array.apply(null, nodelist);


    while (fifo.length > 0) {
        let currentNode = fifo.shift();

        console.log(currentNode);
        console.log(typeof currentNode);
        quitarCosas(currentNode)

        let newChildren = Array.apply(null, currentNode.childNodes);
        fifo = [...fifo, ...newChildren]

    }

    let code = `
            <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
    `;

    code += canvasClone.outerHTML;

    code += `</body>
    </html>`;

    guardarArchivoDeTexto(code, "br4.html");


    canvasClone = null;
    code = "";

}

const guardarArchivoDeTexto = (contenido, nombre) => {
    const a = document.createElement("a");
    const archivo = new Blob([contenido], { type: 'text/html' });
    const url = URL.createObjectURL(archivo);
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
}
//--======================== CTRL Z  ==============================
let numeroDeEstados = 4;
function saveEstateCanvas() {
    let newEstate = canvas.cloneNode(true);

    if (ctrlZ.length >= numeroDeEstados) {
        ctrlZ.shift();
        ctrlZ.push(newEstate)

    } else {
        ctrlZ.push(newEstate)
    }
    console.log("*** ============ ctrlz estate");
    console.log(ctrlZ);

    //se guarda un estado cuando:
    //addElementDom
    //moveElementDom
    //onInputChangeCss
    //onInputChangeHtml
    // ctrl + x, vrtl + v
}
function backEstate() {
    let panelCanvas = document.getElementById("panelCanvas");

    ctrlZ.pop();

    panelCanvas.removeChild(canvas)
    canvas = ctrlZ[ctrlZ.length - 1];
    panelCanvas.appendChild(canvas)
    seleccionarElemento(canvas)

    // canvas.innerHTML="";
    // canvas.innerHTML=ctrlZ[ctrlZ.length-1].outerHTML;

    console.log("*** ============ ctrlz back");
    console.log(ctrlZ);
}



//============================SAND BOX=============================
/* 
let p = document.getElementById("atributoData");
console.log(p);
console.log(p.dataset.info);
 */

function clickBoton(event) {
    let element = event.target;
    console.log(event)
    console.log(`
    clientX: ${event.clientX} , clientY: ${event.clientY} ,
    layerX: ${event.layerX}   , layerY: ${event.layerY} ,
    movementX: ${event.movementX} , movementY: ${event.movementY} ,
    offsetX: ${event.offsetX} , offsetY: ${event.offsetY} ,
    pageX: ${event.pageX} , pageY: ${event.pageY} ,
    screenX: ${event.screenX} , pageY: ${event.screenY} ,
    `);

    let x = parseFloat(event.offsetX);
    let y = parseFloat(event.offsetY);

    // let W = parseFloat(event.target.width);
    let W = parseFloat(event.target.offsetWidth);
    // let H = parseFloat(event.target.height);
    let H = parseFloat(event.target.offsetHeight);

    console.log("W= " + event.target.width + " - " + event.target.style.width + " - " + event.target.offsetWidth)
    console.log(x, y, W, H)

    console.log(`y=${y} < h*0.5 = ${H * 0.5}`)
    if (y < H * 0.1) {
        // console.log("ok")
        // element.style.borderColor="green"
        element.style.borderTop = "4px solid yellow"
    }
}

function mouseMove(event) {
    console.log("moviendose...")

    let element = event.target;
    let x = parseFloat(event.offsetX);
    let y = parseFloat(event.offsetY);

    let W = parseFloat(event.target.offsetWidth);
    let H = parseFloat(event.target.offsetHeight);

    let porcentaje = 0.2;
    // console.log(`y=${y} < h*0.5 = ${H*0.5}`)
    if (y < H * porcentaje) {
        element.style.borderTop = "10px solid yellow"
    }
    else {
        element.style.borderTop = "";
    }
    if (y > H * (1 - porcentaje)) {
        element.style.borderBottom = "10px solid yellow"
    }
    else {
        element.style.borderBottom = "";
    }
    if (x < W * porcentaje) {
        element.style.borderLeft = "10px solid yellow"
    }
    else {
        element.style.borderLeft = "";
    }
    if (x > W * (1 - porcentaje)) {
        element.style.borderRight = "10px solid yellow"
    }
    else {
        element.style.borderRight = "";
    }
}

function mouseLeave(event) {
    let element = event.target;
    element.style.border = ""

}

function contenidoSeleccion() {
    /* let w = document.getElementsByClassName("frame")[0].offsetWidth
    let h = document.getElementsByClassName("frame")[0].offsetHeight
    let nw = w + 20;
    let nh = h + 20;
    console.log("actual: ", w, h)
    console.log("update: ", nw, nh)
    console.log(document.getElementsByClassName("frame")[0].width) */



    document.getElementsByClassName("frame")[0].style.visibility = "visible"
    document.getElementsByClassName("frame")[0].style.transform = "scale(1.03)"
    // let bb=parseFloat( document.getElementById("frame").offsetWidth + 20)+"px";
    // let bbh=parseFloat( document.getElementById("frame").offsetHeight + 20)+"px";
    // console.log(bb+"-"+bbh)
    // document.getElementById("frame").style.width =nw+"px";
    // document.getElementById("frame").style.height =nh+"px";
}
function contenidoDeseleccion() {
    document.getElementsByClassName("frame")[0].style.visibility = "hidden"
}
function contenidoSeleccion0(event) {
    let p = event.target;
    let marco_1 = p.childNodes[1];
    let marco = marco_1.childNodes[1];
    console.log("------------")
    console.log(p)
    console.log(marco)
    marco.style.visibility = "visible"
    marco.style.transform = "scale(1.03)"
}
function contenidoDeseleccion0(event) {
    /* let w = document.getElementsByClassName("frame")[0].offsetWidth
    let h = document.getElementsByClassName("frame")[0].offsetHeight
    let nw = w - 30;
    let nh = h - 30;
    console.log("actual: ", w, h)
    console.log("update: ", nw, nh) */



    // let bb=parseFloat( document.getElementById("frame").offsetWidth - 20)+"px";
    // let bbh=parseFloat( document.getElementById("frame").offsetHeight - 20)+"px";
    // console.log(bb+"-"+bbh)
    // document.getElementById("frame").style.width =bb;
    // document.getElementById("frame").style.height =bbh;
    // document.getElementById("frame").style.width =nw+"px";
    // document.getElementById("frame").style.height =nh+"px";
    let p = event.target;
    let marco_1 = p.childNodes[1];
    let marco = marco_1.childNodes[1];
    marco.style.visibility = "hidden"
    // document.getElementsByClassName("frame")[0].style.transform= "scale(1)"

}

function hicisteClick() {
    console.log("Click en: ");
    console.log(event);
}
function hicisteClickDeep() {
    let nieto = event.target;
    let padre = nieto.parentNode;
    let verdadero = padre.parentNode;
    console.log("Click en: ");
    console.log(verdadero);
}
const btns = document.querySelectorAll(".btns");
const display = document.querySelector("#display");
const equal = document.querySelector("#equal");
const clear = document.querySelector("#clear");
const del = document.querySelector("#del");

btns.forEach(btn =>{
    btn.addEventListener("click" , ()=>{
        addInDisplay(btn.value);
    });
});

const addInDisplay = (btnVal) => {
    display.value === "Error" ? display.value = "" : "";
    display.value += btnVal;
};

const deleteLastChar = ()=> {
    display.value === "Error" ? display.value = "" : "";
    display.value = display.value.slice(0 , -1);
};

const calculate = ()=> {

    if (!display.value) return;
    if (display.value === "Error") return display.value = "";

    const Foperators = ["+","%","*","/"];
    const Loperators = ["+","-","%","*","/"];

    let charCheckFL = Foperators.some(op => display.value.startsWith(op));
    charCheckFL = Loperators.some(op => display.value.endsWith(op));

    if (charCheckFL) return display.value = "Error";

    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = "Error";
    }
};

clear.addEventListener("click" , ()=> {
    display.value = "";
});

del.addEventListener("click" , deleteLastChar);

equal.addEventListener("click", calculate);


addEventListener("keydown" , e => {
        
    if (e.key === "Enter") calculate();
    if (e.key === "Backspace") deleteLastChar();
    if (e.key === "Delete") deleteLastChar();
    if (e.key === "Escape") display.value = "";
    
    const char = "1234567890%/*-+.";

    if (char.includes(e.key)) {
        addInDisplay(e.key);
    };
});
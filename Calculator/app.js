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

clear.addEventListener("click" , ()=> {
    display.value = "";
});

del.addEventListener("click" , ()=>{
    display.value === "Error" ? display.value = "" : "";
    display.value = display.value.slice(0 , -1);
});

equal.addEventListener("click" , ()=> {

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
});
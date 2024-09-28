function appendoperation(operation) {
    document.getElementById('resultarea').innerHTML += operation;
}

function result() {
    let container = document.getElementById('resultarea');
    let result = eval(container.innerHTML);
    container.innerHTML = result;
}

function deleteLast() {
    let container = document.getElementById('resultarea');
    if(container.innerHTML.endsWith(' ')) {
        container.innerHTML = container.innerHTML.slice(0, -3);
    }
    else {
        container.innerHTML = container.innerHTML.slice(0, -1);
    }
    
}

function ac() {
    let container = document.getElementById('resultarea');
    container.innerHTML = container.innerHTML.slice(0, -99999);
}
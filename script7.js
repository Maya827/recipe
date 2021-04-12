
const url1 = 'https://api.edamam.com/search?q='
const url2 = '&app_id=8445e172&app_key=6da6c6c5c61a91d3ba909f117c2c2bd5'


document.body.classList.add('container');
let title = createDomElement('h1', document.body, [['style', 'text-align:center; color:green']], [['textContent', ' FIND YOUR RECIPE ']])
let form = createDomElement('form', document.body, [['class', 'form-inline'], ['style', 'padding-top: 50px']], [['onsubmit', (event) => processInput(event)]]);
let ingredientGroup = createDomElement('div', form, [['class', 'form-group']]);
createDomElement('label', ingredientGroup, [['for', 'ingredient']], [['innerHTML', 'Enter your  favourite recipe here.:&nbsp;&nbsp;']]);
createDomElement('input', ingredientGroup, [['type', 'text'], ['id', 'ingredient'], ['class', 'mr-4']]);
let submit = createDomElement('button', form, [['class', "btn btn-primary"], ['type', 'submit']], [['textContent', 'Submit']]);
createDomElement('hr', document.body, [['style', 'height:2px; background:gray;']]);
let recipesDisplay = createDomElement('div', document.body);

async function processInput(event) {
    event.preventDefault();
    while (recipesDisplay.firstChild) {
        recipesDisplay.removeChild(recipesDisplay.lastChild);
    }
    try {
        let fetchUrl = url1 + form.elements[0].value + url2;
        let resp = await fetch(fetchUrl);
        let data = await resp.json();
        displayRecipes(data);

    } catch (error) {
        console.log(error);
    }
    form.reset();
}

function displayRecipes(data) {
    data.hits.forEach((val) => {
        renderRecipeCard(val.recipe);
    })
}

function renderRecipeCard(data) {
    let recipeRow = createDomElement('div', recipesDisplay, [['class', 'row bg-light'], ['style', 'border: 1px solid gray']]);
    let title = createDomElement('h4', recipeRow, [['class', 'col-12 text-success']], [['textContent', data.label]]);
    let left = createDomElement('div', recipeRow, [['class', 'col-md-4 mt-2 mb-2 pl-2']]);
    let middle = createDomElement('div', recipeRow, [['class', 'col-md-4 mt-2 mb-2']]);
    let right = createDomElement('div', recipeRow, [['class', 'col-md-4 mt-2 mb-2']]);
    let calories = createDomElement('h6', right, [['style', 'color:blue']], [['textContent', 'Calories: ' + Math.floor(data.calories)]]);
    let img = createDomElement('img', right, [['class', 'img-thumbnail'], ['src', data.image]]);
    createDomElement('p', right, [['class', 'text-info']], [['textContent', data.healthLabels.join(' ')]]);
    createDomElement('a', right, [['href', data.url]], [['textContent', 'Visit site for more...']])
    let ingreList = createDomElement('ul', left, [['class', 'list-group']]);
    createDomElement('span', ingreList, [['style', 'color:blue']], [['textContent', 'INGREDIENTS']]);
    data.ingredientLines.forEach((val) => {
        createDomElement('li', ingreList, [['class', 'list-group-item']], [['textContent', val]]);
    });
    let vitaList = createDomElement('ul', middle, [['class', 'list-group']]);
    createDomElement('span', vitaList, [['style', 'color:blue']], [['textContent', 'VITAMINS']]);
    for (let j = 11; j < 24; j++) {
        let vita = data.digest[j];
        let amount = Math.round((vita.total + Number.EPSILON) * 100) / 100;
        createDomElement('li', vitaList, [['class', 'list-group-item']], [['textContent', vita.label + ": " + amount + vita.unit]]);
    }
}

function createDomElement(elemType, parent, attributes = [], properties = []) {
    let elem = document.createElement(elemType);
    attributes.forEach((val) => {
        elem.setAttribute(val[0], val[1]);
    })
    properties.forEach((val) => {
        elem[val[0]] = val[1];
    })
    parent.append(elem);
    return elem;
}
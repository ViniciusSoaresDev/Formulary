// Variáveis de controle de desenho
let drawing = false;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const drawingArea = document.getElementById('drawing-area');
drawingArea.appendChild(canvas);

// Ajusta o tamanho do canvas para a área de desenho
canvas.width = drawingArea.offsetWidth;
canvas.height = drawingArea.offsetHeight;

// Começar a desenhar
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.moveTo(e.offsetX, e.offsetY);
    ctx.beginPath();
});

// Continuar desenhando
canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

// Parar de desenhar
canvas.addEventListener('mouseup', () => {
    drawing = false;
});

// Função para lidar com o "dragstart" nos ícones da biblioteca
document.querySelectorAll('.library-image').forEach(image => {
    image.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('image', this.src);
        event.dataTransfer.setData('imageWidth', this.width);
        event.dataTransfer.setData('imageHeight', this.height);
    });
});

// Função para verificar se a área está ocupada por outra imagem
function isAreaOccupied(left, top, gridWidth, gridHeight) {
    const allImages = drawingArea.querySelectorAll('.drawing-image');
    for (let img of allImages) {
        const imgLeft = parseInt(img.style.left);
        const imgTop = parseInt(img.style.top);
        if (left >= imgLeft && left < imgLeft + gridWidth && top >= imgTop && top < imgTop + gridHeight) {
            return true;
        }
    }
    return false;
}

// Função para alinhar os itens com a grade
function alignWithGrid(x, y, gridWidth, gridHeight) {
    const alignedX = Math.floor(x / gridWidth) * gridWidth;
    const alignedY = Math.floor(y / gridHeight) * gridHeight;
    return { alignedX, alignedY };
}

// Função para lidar com o "drop" dos itens na área de desenho
document.querySelector('.drawing-area').addEventListener('drop', function (event) {
    event.preventDefault();

    const imageSrc = event.dataTransfer.getData('image');
    const gridWidth = this.offsetWidth * 0.06;
    const gridHeight = this.offsetHeight * 0.14;
    const offsetX = event.clientX - this.getBoundingClientRect().left;
    const offsetY = event.clientY - this.getBoundingClientRect().top;

    const { alignedX, alignedY } = alignWithGrid(offsetX, offsetY, gridWidth, gridHeight);

    if (isAreaOccupied(alignedX, alignedY, gridWidth, gridHeight)) {
        return;
    }

    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    imgElement.style.width = `${gridWidth}px`;
    imgElement.style.height = `${gridHeight}px`;
    imgElement.classList.add('drawing-image');
    imgElement.style.position = 'absolute';
    imgElement.style.left = `${alignedX}px`;
    imgElement.style.top = `${alignedY}px`;

    this.appendChild(imgElement);
});

// Permitir o evento de "dragover" para que o drop funcione corretamente
document.querySelector('.drawing-area').addEventListener('dragover', function (event) {
    event.preventDefault();
});

// Variáveis para mover e deletar imagens
let selectedImage = null;
let isMoving = false;
let isMoveModeActive = false; // Controla se o modo de mover está ativo
let offsetX = 0;
let offsetY = 0;

// Selecionar uma imagem
function selectImage(img) {
    document.querySelectorAll('.drawing-image').forEach(image => {
        image.classList.remove('selected');
    });
    img.classList.add('selected');
    selectedImage = img;
}

// Ativar/desativar o modo de mover
document.querySelector('#move-button').addEventListener('click', function () {
    isMoveModeActive = !isMoveModeActive; // Alternar entre ativo e inativo
    this.classList.toggle('active'); // Adicionar/remover a classe 'active' para feedback visual
});

// Selecionar a imagem ao clicar nela
document.querySelector('.drawing-area').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('drawing-image')) {
        selectImage(event.target);
    } else {
        document.querySelectorAll('.drawing-image').forEach(image => image.classList.remove('selected'));
        selectedImage = null;
    }
});

// Iniciar movimento ao pressionar na imagem selecionada
document.querySelector('.drawing-area').addEventListener('mousedown', function (event) {
    if (isMoveModeActive && selectedImage && event.target === selectedImage) {
        isMoving = true;
        offsetX = event.clientX - selectedImage.offsetLeft;
        offsetY = event.clientY - selectedImage.offsetTop;
        selectedImage.style.zIndex = '1000'; // Elevar a imagem durante o movimento
    }
});

// Mover a imagem com o mouse
document.addEventListener('mousemove', function (event) {
    if (isMoving && selectedImage) {
        const gridWidth = drawingArea.offsetWidth * 0.06;
        const gridHeight = drawingArea.offsetHeight * 0.14;

        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;

        const { alignedX, alignedY } = alignWithGrid(newX, newY, gridWidth, gridHeight);

        // Atualiza a posição da imagem
        selectedImage.style.left = `${alignedX}px`;
        selectedImage.style.top = `${alignedY}px`;
    }
});

// Finalizar o movimento ao soltar o mouse
document.addEventListener('mouseup', function () {
    if (isMoving) {
        isMoving = false;
        if (selectedImage) {
            selectedImage.style.zIndex = 'auto'; // Resetar o z-index após o movimento
        }
    }
});

// Deletar a imagem selecionada
document.querySelector('#delete-button').addEventListener('click', function () {
    if (selectedImage) {
        selectedImage.remove();
        selectedImage = null;
    }
});

// Desativar o comportamento de arrastar padrão das imagens na área de desenho
document.querySelectorAll('.drawing-image').forEach(image => {
    image.addEventListener('dragstart', function (event) {
        event.preventDefault(); // Impede o comportamento padrão de arrastar
    });
});
// Função para salvar a tela no localStorage
document.querySelector('#save-screenshot').addEventListener('click', () => {
    html2canvas(document.querySelector('.drawing-area')).then((canvas) => {
        const imageData = canvas.toDataURL(); // Converte o canvas em um dado de imagem
        localStorage.setItem('savedDrawing', imageData); // Salva a imagem no localStorage
        console.log('Imagem salva no localStorage!');
    });
});

// Função para carregar a imagem do localStorage
document.querySelector('#load-screenshot').addEventListener('click', () => {
    const savedImage = localStorage.getItem('savedDrawing');
    if (savedImage) {
        const img = new Image();
        img.src = savedImage;
        img.onload = function () {
            drawingArea.innerHTML = ''; // Limpa a área de desenho
            drawingArea.appendChild(img); // Adiciona a imagem carregada
            console.log('Imagem carregada do localStorage!');
        };
    } else {
        console.log('Nenhuma imagem salva no localStorage.');
    }
});

// Lógica de navegação do menu e animação
const menuItems = document.querySelectorAll('.menu-item');
const categories = document.querySelectorAll('.category');

menuItems.forEach(item => {
    item.addEventListener('click', function () {
        menuItems.forEach(menuItem => menuItem.classList.remove('active'));
        item.classList.add('active');

        categories.forEach(category => category.style.display = 'none');

        const categoryId = item.getAttribute('data-category');
        const categoryToShow = document.getElementById(categoryId);
        if (categoryToShow) {
            categoryToShow.style.display = 'block';
        }
    });
});

// Exibir a categoria padrão (Equipments) ao carregar a página
document.querySelector('.menu-item[data-category="equipments"]').click();

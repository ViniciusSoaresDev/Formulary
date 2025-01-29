// storage.js

// Função para salvar a imagem no localStorage
function saveToLocalStorage(imageData) {
    try {
        localStorage.setItem('savedDrawing', imageData); // Salva a imagem no localStorage
        console.log('Imagem salva no localStorage!');
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }
}

// Função para carregar a imagem do localStorage e exibir na área de desenho
function loadFromLocalStorage() {
    const savedImage = localStorage.getItem('savedDrawing');
    
    if (savedImage) {
        // Cria uma nova imagem para exibir na área de desenho
        const img = new Image();
        img.src = savedImage;

        img.onload = function() {
            // Aqui você pode usar a imagem carregada para colocar no desenho
            const drawingArea = document.getElementById('drawing-area');
            drawingArea.innerHTML = ''; // Limpa a área de desenho
            drawingArea.appendChild(img); // Adiciona a imagem carregada
            console.log('Imagem carregada do localStorage!');
        };
    } else {
        console.log('Nenhuma imagem salva no localStorage.');
    }
}

// Exporta as funções para usá-las no script principal
export { saveToLocalStorage, loadFromLocalStorage };

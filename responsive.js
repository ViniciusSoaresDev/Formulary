// responsive.js

// Função para ajustar o layout para tela cheia
function adjustLayout() {
    const drawingArea = document.getElementById('drawing-area');
    const library = document.querySelector('.library');
    const menu = document.querySelector('.menu');
    const controls = document.querySelector('.controls');

    // Altura e largura da janela
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Ajustar a altura da área de desenho
    drawingArea.style.height = `${windowHeight * 0.8}px`; // 80% da altura da tela
    drawingArea.style.width = `${windowWidth * 0.7}px`; // 70% da largura da tela

    // Ajustar a altura da biblioteca
    library.style.height = `${windowHeight * 0.8}px`; // 80% da altura da tela
    library.style.width = `${windowWidth * 0.25}px`; // 25% da largura da tela

    // Ajustar a altura do menu
    menu.style.height = `${windowHeight * 0.1}px`; // 10% da altura da tela
    menu.style.width = `${windowWidth}px`; // 100% da largura da tela

    // Ajustar a altura dos controles
    controls.style.height = `${windowHeight * 0.1}px`; // 10% da altura da tela
    controls.style.width = `${windowWidth}px`; // 100% da largura da tela
}

// Ajustar o layout ao carregar a página
window.addEventListener('load', adjustLayout);

// Ajustar o layout ao redimensionar a janela
window.addEventListener('resize', adjustLayout);
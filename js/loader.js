// Loader funkcionalnost
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    const barFill = document.getElementById('barFill');
    const loadingText = document.getElementById('loadingText');
    
    // Blokiraj scroll dok se učitava
    document.body.style.overflow = 'hidden';
    
    let progress = 0;
    const totalTime = 2000; // 2 sekunde
    const interval = 30; // Update svakih 30ms
    const increment = (100 / (totalTime / interval));
    
    const loadingInterval = setInterval(() => {
        progress += increment;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Sakrij loader nakon završetka
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 300);
        }
        
        barFill.style.width = progress + '%';
        loadingText.textContent = `Učitavanje... ${Math.round(progress)}%`;
    }, interval);
});
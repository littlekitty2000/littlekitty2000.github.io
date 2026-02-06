function importHTML() {
    const rawCode = document.getElementById('inputCode').value;
    if (!rawCode) return;

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawCode, 'text/html');
        
        // Find the main content. Since v2/v3 saves content inside a <main> tag:
        const savedContent = doc.querySelector('main');
        
        if (savedContent) {
            // Restore background color
            canvas.style.backgroundColor = savedContent.style.backgroundColor;
            document.getElementById('bgColorPicker').value = savedContent.style.backgroundColor;
            
            // Restore the HTML content
            canvas.innerHTML = savedContent.innerHTML;
            
            // Close modal and clear input
            document.getElementById('loadModal').style.display = 'none';
            document.getElementById('inputCode').value = '';
        } else {
            alert("Could not find project content. Make sure you are pasting the full code from 'Get My Code'.");
        }
    } catch (err) {
        alert("Error loading code. Please check the format.");
    }
}

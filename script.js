const canvas = document.getElementById('canvas');
const contextMenu = document.getElementById('context-menu');
let rightClickedElement = null;

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    rightClickedElement = e.target;
    contextMenu.style.display = 'block';
    contextMenu.style.left = e.pageX + 'px';
    contextMenu.style.top = e.pageY + 'px';
});

document.addEventListener('click', () => contextMenu.style.display = 'none');

function changeBg(color) { canvas.style.backgroundColor = color; }

function updateIconSize(size) {
    const icons = canvas.querySelectorAll('.custom-icon');
    icons.forEach(img => img.style.width = size + 'px');
}

function addText() {
    const p = document.createElement('p');
    p.innerText = "New text block...";
    canvas.appendChild(p);
}

function addButton() {
    const url = prompt("Link:");
    const label = prompt("Button Name:", "Download");
    if(url && label) {
        const a = document.createElement('a');
        a.href = url;
        a.className = 'mf-btn';
        a.innerText = label;
        a.contentEditable = "false";
        canvas.appendChild(a);
    }
}

function processImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        const currentSize = document.getElementById('sizeSlider').value;
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = "custom-icon";
            img.style.width = currentSize + 'px';
            img.contentEditable = "false";
            canvas.appendChild(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function addMp3() {
    const name = prompt("Track Name:");
    const url = prompt("Direct MP3 Link:");
    if(name && url) {
        const div = document.createElement('div');
        div.className = 'audio-card';
        div.contentEditable = "false";
        div.innerHTML = `<span><b>${name}</b></span><audio controls src="${url}"></audio>`;
        canvas.appendChild(div);
    }
}

function deleteElement() {
    if (rightClickedElement && rightClickedElement !== canvas) {
        rightClickedElement.closest('.audio-card')?.remove() || rightClickedElement.remove();
    }
}

function changeLink() {
    const url = prompt("Enter new URL:");
    if (!url) return;
    if (rightClickedElement.tagName === 'A') {
        rightClickedElement.href = url;
    } else {
        const a = document.createElement('a');
        a.href = url;
        a.contentEditable = "false";
        rightClickedElement.parentNode.insertBefore(a, rightClickedElement);
        a.appendChild(rightClickedElement);
    }
}

function showCode() {
    const area = document.getElementById('outputCode');
    const finalBg = canvas.style.backgroundColor || "#ffffff";
    area.value = `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body style="background:#f0f2f5"><main style="margin:30px auto; width:85%; max-width:900px; background:${finalBg}; padding:50px; min-height:70vh; border-radius:4px; font-family:sans-serif;">${canvas.innerHTML}</main></body></html>`;
    document.getElementById('saveModal').style.display = 'block';
}

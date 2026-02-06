const canvas = document.getElementById('canvas');
const contextMenu = document.getElementById('context-menu');
let rightClickedElement = null;

// Context Menu Logic
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    rightClickedElement = e.target;
    contextMenu.style.display = 'block';
    contextMenu.style.left = e.pageX + 'px';
    contextMenu.style.top = e.pageY + 'px';
});

document.addEventListener('click', () => contextMenu.style.display = 'none');

// Add Functions
function addText() {
    const p = document.createElement('p');
    p.innerText = "Double click to edit text...";
    canvas.appendChild(p);
}

function addButton() {
    const url = prompt("MediaFire Link:");
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
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = "custom-icon";
            img.contentEditable = "false";
            canvas.appendChild(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function addMp3() {
    const name = prompt("Song Name:");
    const url = prompt("Paste Direct MP3 Link (ends in .mp3):");
    if(name && url) {
        const div = document.createElement('div');
        div.className = 'audio-card';
        div.contentEditable = "false";
        div.innerHTML = `<span>🎵 <b>${name}</b></span><audio controls src="${url}"></audio>`;
        canvas.appendChild(div);
    }
}

// Menu Actions
function deleteElement() {
    if (rightClickedElement && rightClickedElement !== canvas) {
        rightClickedElement.closest('.audio-card')?.remove() || rightClickedElement.remove();
    }
}

function changeLink() {
    const url = prompt("Enter MediaFire/Direct URL:");
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
    area.value = `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>${canvas.innerHTML}</body></html>`;
    document.getElementById('saveModal').style.display = 'block';
}

const fontUpload = document.getElementById('fontUpload');
const fontList = document.getElementById('fontList');
const previewText = document.getElementById('previewText');
const userText = document.getElementById('userText');
const sampleFa = document.getElementById('sampleFa');
const sampleEn = document.getElementById('sampleEn');
const sampleNum = document.getElementById('sampleNum');
const clearFontBtn = document.getElementById('clearFont');
const appliedFontName = document.getElementById('appliedFontName');
const copyMessage = document.getElementById('copyMessage');
let fonts = [];
let fontCounter = 1;
let selectedFont = null;

fontUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
        alert('هیچ فونتی انتخاب نشده است!');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fontName = file.name.split('.')[0];
        if (fonts.includes(fontName)) continue;

        const url = URL.createObjectURL(file);
        const newFont = new FontFace(fontName, `url(${url})`, {
            style: 'normal',
            weight: 'normal'
        });

        newFont.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
            fonts.push(fontName);
            addFontToList(fontName, fontCounter++);
            console.log(`فونت ${fontName} با موفقیت بارگذاری شد.`);
        }).catch((error) => {
            console.error(`خطا در بارگذاری فونت ${fontName}:`, error);
            alert(`فونت ${fontName} بارگذاری نشد. لطفاً فرمت فایل را بررسی کنید.`);
        });
    }
});

function addFontToList(fontName, number) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="font-number">${number}</span><span class="font-name">${fontName}</span>`;
    li.addEventListener('click', () => {
        const prevSelected = fontList.querySelector('.selected');
        if (prevSelected) prevSelected.classList.remove('selected');
        li.classList.add('selected');
        selectedFont = fontName;
        applyFont();
    });
    fontList.appendChild(li);
}

function applyFont() {
    if (selectedFont) {
        userText.textContent = previewText.value || "متن شما اینجا نمایش داده می‌شود";
        userText.style.fontFamily = selectedFont;
        sampleFa.style.fontFamily = selectedFont;
        sampleEn.style.fontFamily = selectedFont;
        sampleNum.style.fontFamily = selectedFont;
        appliedFontName.textContent = selectedFont;
    }
}

clearFontBtn.addEventListener('click', () => {
    userText.textContent = "";
    userText.style.fontFamily = '';
    sampleFa.style.fontFamily = '';
    sampleEn.style.fontFamily = '';
    sampleNum.style.fontFamily = '';
    appliedFontName.textContent = '';
    const selected = fontList.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
    selectedFont = null;
});

previewText.addEventListener('input', () => {
    if (selectedFont) {
        userText.textContent = previewText.value || "متن شما اینجا نمایش داده می‌شود";
    }
});

appliedFontName.addEventListener('click', () => {
    if (appliedFontName.textContent) {
        navigator.clipboard.writeText(appliedFontName.textContent).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        }).catch((error) => {
            console.error('خطا در کپی کردن متن:', error);
        });
    }
});
// HTML এলিমেন্টসমূহ সিলেক্ট করা
const imageInput = document.getElementById('imageInput');
const fileNameText = document.getElementById('fileNameText');
const originalPreviewContainer = document.getElementById('originalPreviewContainer');
const originalPreview = document.getElementById('originalPreview');

const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const qualityInput = document.getElementById('qualityInput');

const convertBtn = document.getElementById('convertBtn');
const convertedSection = document.getElementById('convertedSection');
const convertedPreview = document.getElementById('convertedPreview');
const downloadLink = document.getElementById('downloadLink');

const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

let loadedImage = null;

// ১. ছবি সিলেক্ট করলে যা হবে
imageInput.addEventListener('change', function (e) {
  const file = e.target.files[0];

  if (file) {
    // ফাইলের নাম দেখানো
    fileNameText.innerText = "Selected: " + file.name;

    const reader = new FileReader();
    reader.onload = function (event) {
      loadedImage = new Image();
      loadedImage.onload = function () {
        // সাইজ ইনপুট বক্সে দেওয়া
        widthInput.value = loadedImage.width;
        heightInput.value = loadedImage.height;

        // মূল ছবির ছোট প্রিভিউ দেখানো
        originalPreview.src = event.target.result;
        originalPreviewContainer.classList.remove('hidden');

        // কনভার্ট বাটন সচল করা এবং আগের কনভার্ট হওয়া প্রিভিউ লুকানো
        convertBtn.disabled = false;
        convertedSection.classList.add('hidden');
      };
      loadedImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// ২. 'Convert to JPG' বাটনে ক্লিক করলে যা হবে
convertBtn.addEventListener('click', function () {
  if (!loadedImage) return;

  // ইউজার যে সাইজ এবং কোয়ালিটি বেছে নিয়েছে তা নেওয়া
  const newWidth = parseInt(widthInput.value) || loadedImage.width;
  const newHeight = parseInt(heightInput.value) || loadedImage.height;
  const quality = parseFloat(qualityInput.value);

  // ক্যানভাস সাইজ নির্ধারণ
  canvas.width = newWidth;
  canvas.height = newHeight;

  // ব্যাকগ্রাউন্ড সাদা করা (কারণ JPG তে ব্যাকগ্রাউন্ড ট্রান্সপারেন্ট থাকে না)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, newWidth, newHeight);

  // ক্যানভাসে PNG ছবি আঁকা
  ctx.drawImage(loadedImage, 0, 0, newWidth, newHeight);

  // ক্যানভাস থেকে JPG ফরম্যাটে রূপান্তর
  const jpgDataUrl = canvas.toDataURL('image/jpeg', quality);

  // কনভার্ট করা JPG প্রিভিউ ছবি দেখানো
  convertedPreview.src = jpgDataUrl;
  downloadLink.href = jpgDataUrl;
  
  // কনভার্ট সেকশনটি দৃশ্যমান করা
  convertedSection.classList.remove('hidden');
});
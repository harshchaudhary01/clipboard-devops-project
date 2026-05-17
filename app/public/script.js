// Theme management functions
function setTheme(isDark) {
  const html = document.documentElement;
  if (isDark) {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  updateThemeButton(isDark);
}

function updateThemeButton(isDark) {
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  if (isDark) {
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Light';
  } else {
    themeIcon.textContent = '🌙';
    themeText.textContent = 'Dark';
  }
}

function getPreferredTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    return storedTheme === 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Initialize theme
function initTheme() {
  const prefersDark = getPreferredTheme();
  setTheme(prefersDark);
  
  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    }
  });
}

// Set up theme toggle
function setupThemeToggle() {
  document.getElementById('toggleTheme').addEventListener('click', () => {
    const isDark = !document.documentElement.classList.contains('dark');
    setTheme(isDark);
    
    // Force repaint to ensure transitions work
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupThemeToggle();
});

// async function sendData() {
//   const text = document.getElementById('textInput').value;
//   const files = document.getElementById('fileInput').files;
//   const maxReceivers = document.getElementById('receiverInput').value || 1;
//   const expiryMinutes = document.getElementById('expiryInput').value || 10;

//   // Validate inputs
//   if (!text.trim() && files.length === 0) {
//     showToast('Please enter text or select files', 'error');
//     return;
//   }

//   const formData = new FormData();
//   formData.append('maxReceivers', maxReceivers);
//   formData.append('expiryMinutes', expiryMinutes);

//   if (files.length > 0) {
//     for (let i = 0; i < files.length; i++) {
//       formData.append('file', files[i]);
//     }
//   }

//   if (text.trim() !== '') {
//     formData.append('text', text);
//   }

//   const sendResult = document.getElementById('sendResult');
//   const sendLoading = document.getElementById('sendLoading');
  
//   sendResult.classList.add('hidden');
//   sendLoading.classList.remove('hidden');

//   try {
//     const response = await fetch('/api/send', {
//       method: 'POST',
//       body: formData
//     });

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }

//     const data = await response.json();
//     sendResult.innerHTML = `
//       <div class="flex flex-col items-center">
//         <div class="mb-2">
//           <span class="font-bold">Your code:</span> 
//           <span class="text-xl">${data.code}</span>
//         </div>
//         <button onclick="copyToClipboard('${data.code}')" 
//           class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
//           📋 Copy Code
//         </button>
//       </div>
//     `;
//     sendResult.classList.remove('hidden');
//     showToast(`✅ Sent successfully! Code: ${data.code}`);
//   } catch (error) {
//     console.error('Error:', error);
//     sendResult.innerHTML = `<span class="text-red-500">Error: ${error.message || 'Failed to send data'}</span>`;
//     sendResult.classList.remove('hidden');
//     showToast('❌ Failed to send data', 'error');
//   } finally {
//     sendLoading.classList.add('hidden');
//   }
// }

async function sendData() {

  const text = document.getElementById('textInput').value;
  const files = document.getElementById('fileInput').files;

  const maxReceivers =
    document.getElementById('receiverInput').value || 1;

  const expiryMinutes =
    document.getElementById('expiryInput').value || 10;

  if (!text.trim() && files.length === 0) {
    showToast('Add text or files', 'error');
    return;
  }

  const formData = new FormData();

  formData.append('maxReceivers', maxReceivers);
  formData.append('expiryMinutes', expiryMinutes);

  if (text.trim()) {
    formData.append('text', text);
  }

  for (let file of files) {
    formData.append('file', file);
  }

  const sendLoading =
    document.getElementById('sendLoading');

  const sendResult =
    document.getElementById('sendResult');

  sendLoading.classList.remove('hidden');
  sendResult.classList.add('hidden');

  try {

    const response = await fetch('/api/send', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    sendLoading.classList.add('hidden');

    const mobileURL =
      `${window.location.origin}?code=${data.code}`;

    sendResult.innerHTML = `
    
      <div class="result-box mt-6 text-center">

        <div class="text-sm text-gray-400 mb-2">
          Transfer Code
        </div>

        <div class="text-5xl font-extrabold tracking-[12px] text-blue-400">
          ${data.code}
        </div>

        <div class="flex gap-3 mt-6">

          <button
            onclick="copyToClipboard('${data.code}')"
            class="mini-btn flex-1">
            Copy
          </button>

          <button
            onclick="showQR('${mobileURL}')"
            class="mini-btn flex-1">
            QR Code
          </button>

        </div>

      </div>
    
    `;

    sendResult.classList.remove('hidden');

    showToast('Transfer created');

  } catch (err) {

    sendLoading.classList.add('hidden');

    showToast('Failed to send', 'error');
  }
}


async function receiveData() {
  const code = document.getElementById('codeInput').value;
  if (!code || code.length !== 4 || !/^\d+$/.test(code)) {
    document.getElementById('receiveResult').innerText = "Please enter a valid 4-digit code";
    showToast('Please enter a 4-digit code', 'error');
    return;
  }

  const receiveResult = document.getElementById('receiveResult');
  receiveResult.innerHTML = `
    <div class="flex items-center justify-center gap-2">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
      <span>Fetching data...</span>
    </div>
  `;

  try {
    const res = await fetch(`/api/receive/${code}`);
    const data = await res.json();

    const textBlock = document.getElementById('textBlock');
    const filesBlock = document.getElementById('filesBlock');
    const fileLinks = document.getElementById('fileLinks');

    textBlock.classList.add('hidden');
    filesBlock.classList.add('hidden');
    fileLinks.innerHTML = "";

    if (data.error) {
      receiveResult.innerText = data.error === 'Code expired' ? "Code expired!" : "Error: " + data.error;
      showToast('❌ ' + data.error, 'error');
      return;
    }

    receiveResult.innerText = "";

    if (data.text) {
      document.getElementById('receivedText').innerText = data.text;
      textBlock.classList.remove('hidden');
    }

    if (data.files && data.files.length > 0) {
      fileLinks.innerHTML = data.files.map(file =>
        `<a href="${file.url}" download class="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
          <span class="text-lg">📄</span>
          <span>${file.filename}</span>
          <span class="text-xs text-gray-500 ml-auto">(Click to download)</span>
        </a>`).join('');
      filesBlock.classList.remove('hidden');
    }

    if (data.text || data.files) {
      showToast('✅ Content received successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
    receiveResult.innerText = "Error fetching data. Please try again.";
    showToast('❌ Error fetching data', 'error');
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Code copied to clipboard!');
  }).catch(err => {
    showToast('Failed to copy code', 'error');
  });
}

function showToast(message, type = 'success') {

  const toast =
    document.getElementById('toast');

  const isError =
    type === 'error';

  toast.innerHTML = `

    <div class="
      toast-inner
      ${isError
        ? 'toast-error'
        : 'toast-success'}
      toast-show
    ">

      <div class="toast-glow"></div>

      <div class="toast-icon-wrap">

        ${isError
          ? `
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 6l6 6M12 6l-6 6"/>
            </svg>
          `
          : `
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 10l3 3 7-7"/>
            </svg>
          `
        }

      </div>

      <div class="toast-content">

        <div class="toast-title">
          ${isError
            ? 'Something went wrong'
            : 'Success'}
        </div>

        <div class="toast-message">
          ${message}
        </div>

      </div>

    </div>

  `;

  toast.style.opacity = '1';

  toast.style.transform =
    'translateY(0px) scale(1)';

  clearTimeout(window.toastTimeout);

  window.toastTimeout = setTimeout(() => {

    toast.style.opacity = '0';

    toast.style.transform =
      'translateY(-10px) scale(.96)';

  }, 3200);
}


// function showToast(message, type = 'success') {

//   const toast = document.getElementById('toast');

//   toast.innerHTML = `
//     <div class="
//       px-5 py-4 rounded-2xl
//       backdrop-blur-xl
//       border border-white/10
//       bg-[#111827]
//       text-white
//       shadow-2xl
//       flex items-center gap-3
//     ">
//       <div class="
//         w-3 h-3 rounded-full
//         ${type === 'error'
//           ? 'bg-red-500'
//           : 'bg-emerald-500'}
//       "></div>

//       <span class="text-sm font-medium">
//         ${message}
//       </span>
//     </div>
//   `;

//   toast.style.opacity = '1';
//   toast.style.transform = 'translateY(0px)';

//   setTimeout(() => {
//     toast.style.opacity = '0';
//     toast.style.transform = 'translateY(20px)';
//   }, 3000);
// }


// Clear form function (optional)
function clearForm() {
  document.getElementById('textInput').value = '';
  document.getElementById('fileInput').value = '';
  document.getElementById('receiverInput').value = '';
  document.getElementById('expiryInput').value = '';
  document.getElementById('sendResult').classList.add('hidden');
}

function copyReceivedText() {
  const text = document.getElementById('receivedText').innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Text copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy text', 'error');
  });
}


function showQR(url) {

  const modal =
    document.getElementById('qrModal');

  const qr =
    document.getElementById('qrcode');

  qr.innerHTML = '';

  new QRCode(qr, {
    text: url,
    width: 220,
    height: 220,
  });

  modal.classList.remove('hidden');
}

function closeQRModal() {
  document
    .getElementById('qrModal')
    .classList.add('hidden');
}

const fileInput =
  document.getElementById('fileInput');

fileInput.addEventListener('change', () => {

  const preview =
    document.getElementById('filePreview');

  preview.innerHTML = '';

  const files = [...fileInput.files];

  if (!files.length) return;

  files.forEach(file => {

    const size =
      (file.size / 1024 / 1024).toFixed(2);

    preview.innerHTML += `

      <div class="
        flex items-center justify-between
        bg-white/5
        border border-white/10
        rounded-2xl
        px-4 py-3
      ">

        <div class="flex items-center gap-3 overflow-hidden">

          <div class="
            w-11 h-11
            rounded-xl
            bg-blue-500/20
            flex items-center justify-center
            text-blue-400
            text-lg
          ">
            📄
          </div>

          <div class="overflow-hidden">

            <div class="
              text-sm font-medium
              truncate max-w-[180px]
            ">
              ${file.name}
            </div>

            <div class="text-xs text-gray-400">
              ${size} MB
            </div>

          </div>

        </div>

      </div>

    `;
  });
});

window.addEventListener('DOMContentLoaded', () => {

  const params =
    new URLSearchParams(window.location.search);

  const code = params.get('code');

  if (code && code.length === 4) {

    const codeInput =
      document.getElementById('codeInput');

    codeInput.value = code;

    // Small delay for smooth UI rendering
    setTimeout(() => {
      receiveData();
    }, 400);
  }
});
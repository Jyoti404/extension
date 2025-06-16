document.getElementById('darkModeBtn').addEventListener('click', () => {
  const darknessLevel = document.getElementById('darkness').value;
  
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: applyDarkMode,
      args: [darknessLevel]
    });
  });
});

function applyDarkMode(darkness) {
  // Create or update style element
  let styleElement = document.getElementById('dark-mode-style');
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'dark-mode-style';
    document.head.appendChild(styleElement);
  }
  
  const darknessPercentage = darkness / 100;
  const bgColor = `rgb(${Math.floor(30 * darknessPercentage)}, 
                   ${Math.floor(30 * darknessPercentage)}, 
                   ${Math.floor(30 * darknessPercentage)})`;
  
  // Improved text color calculation based on background brightness
  const bgBrightness = (30 * darknessPercentage)/255;
  const textColor = bgBrightness > 0.5 ? '#111111' : '#eeeeee';
  
  // Additional styling for better readability
  styleElement.textContent = `
    body, div, section, article, main, header, footer {
      background-color: ${bgColor} !important;
      color: ${textColor} !important;
    }
    h1, h2, h3, h4, h5, h6 {
      color: ${textColor} !important;
    }
    a {
      color: #4CAF50 !important;
    }
    input, textarea, select, button {
      background-color: ${adjustColor(bgColor, 20)} !important;
      color: ${textColor} !important;
      border-color: ${adjustColor(bgColor, 40)} !important;
    }
  `;
  
  // Helper function to adjust colors
  function adjustColor(rgb, amount) {
  return rgb.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, (match, r, g, b) => {
    return `rgb(${Math.min(255, Math.max(0, parseInt(r) + amount))}, 
                ${Math.min(255, Math.max(0, parseInt(g) + amount))}, 
                ${Math.min(255, Math.max(0, parseInt(b) + amount))})`;
  });
}

}
// Track dark mode state
let isDarkMode = false;

document.getElementById('darkModeBtn').addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  const darknessLevel = document.getElementById('darkness').value;
  
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: isDarkMode ? applyDarkMode : removeDarkMode,
      args: isDarkMode ? [darknessLevel] : []
    });
  });
  
  // Update button text
  document.getElementById('darkModeBtn').textContent = 
    isDarkMode ? 'Disable Dark Mode' : 'Enable Dark Mode';
});

function removeDarkMode() {
  const styleElement = document.getElementById('dark-mode-style');
  if (styleElement) {
    styleElement.remove();
  }
}
console.log('OpenAI Chat Extension loaded.');
async function detectLanguage(text) {
    const apiKey = 'your-apiKey';
    const endpoint = 'https://api.cognitive.microsofttranslator.com/detect?api-version=3.0';
    const location = 'eastasia';
    const headers = {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Ocp-Apim-Subscription-Region': location,
      'Content-Type': 'application/json',
    };
  
    const body = JSON.stringify([{ Text: text }]);
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: body,
      });
  
      const data = await response.json();
  
      if (data.error) {
        console.error('Language Detection API Error:', data.error.message);
        return null;
      }
  
      return data[0].language;
    } catch (error) {
      console.error('Language Detection API Error:', error);
      return null;
    }
  }
  

async function translateText(text, targetLanguage, sourceLanguage) {
  const apiKey = 'your-apiKey';
  const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLanguage}&to=${targetLanguage}`;
  const location = 'eastasia'; 
  const headers = {
    'Ocp-Apim-Subscription-Key': apiKey,
    'Ocp-Apim-Subscription-Region': location,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify([{ Text: text }]);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    const data = await response.json();

    if (data.error) {
      console.error('Translation API Error:', data.error.message);
      return text;
    }

    return data[0].translations[0].text;
  } catch (error) {
    console.error('Translation API Error:', error);
    return text;
  }
}

function addButtonWhenReady() {
  const targetNode = document.querySelector('body');

  const observerConfig = {
    childList: true,
    subtree: true,
  };

  const observerCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const inputForm = document.querySelector('form');
        if (inputForm) {
          const textarea = inputForm.querySelector('textarea');

          // Check if the translate button is already added
          if (inputForm.querySelector('.translate-button')) return;

          // Create the "Translate" element (using a span instead of a button)
          const translateButton = document.createElement('span');
          translateButton.innerText = 'Translate';
          translateButton.className = 'translate-button';

          // Add the event listener for the "Translate" element
          translateButton.addEventListener('click', async () => {
            const originalText = textarea.value;
            console.log('Original Text:', originalText);
          
            const targetLanguage = 'en';
          
            if (originalText) {
              const sourceLanguage = await detectLanguage(originalText);
              if (sourceLanguage) {
                const translatedText = await translateText(originalText, targetLanguage, sourceLanguage);
                textarea.value = translatedText;
              }
            }
          });
          
  

          // Inject the "Translate" element into the page
          inputForm.appendChild(translateButton);

          console.log('Translate button added.');
          observer.disconnect();
        }
      }
    }
  };

  const observer = new MutationObserver(observerCallback);
  observer.observe(targetNode, observerConfig);
}

addButtonWhenReady();





interface PromptConfig {
  mode: 'default' | 'custom';
  customText: string;
}

export const checkModelStatus = async (modelName: string): Promise<'available' | 'error'> => {
  if (!modelName) {
    return 'error';
  }
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'checkStatus', modelName }),
    });
    if (!response.ok) {
        console.error(`API call to check status for ${modelName} failed with status: ${response.status}`);
        return 'error';
    }
    const data = await response.json();
    return data.status === 'available' ? 'available' : 'error';
  } catch (error) {
    console.error(`Network error checking model status for ${modelName}:`, error);
    return 'error';
  }
};


export const translateChunk = async (
  texts: string[],
  promptConfig: PromptConfig,
  modelName: string,
  namesGuide: string,
  temperature: number,
): Promise<string[]> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'translate',
        texts,
        promptConfig,
        modelName,
        namesGuide,
        temperature,
      }),
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    if (!data.translations) {
        throw new Error("Invalid response format from server.");
    }

    return data.translations;

  } catch (error) {
    console.error("Error calling translation API:", error);
    if (error instanceof Error) {
        throw new Error(`خطا در فراخوانی API ترجمه: ${error.message}`);
    }
    throw new Error("یک خطای ناشناخته در حین ترجمه رخ داد.");
  }
};

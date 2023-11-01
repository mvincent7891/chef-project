/**
 * getVoices() returns [] after first page load; this promise resolves once
 * the payload is accessible
 */
export const initializeVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise(function (resolve, _) {
    let synth = window.speechSynthesis;
    let id: any;

    id = setInterval(() => {
      if (synth.getVoices().length !== 0) {
        resolve(synth.getVoices());
        clearInterval(id);
      }
    }, 10);
  });
};

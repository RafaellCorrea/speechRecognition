const buttonStartRecord = $('#btnStartRecord');
let listening = false;
let identifiedText = '';

const recognition = createRecognition()

buttonStartRecord.on('click', function(e) {
    if (identifiedText.length) identifiedText += ' ';
    if(!recognition) return;

    listening ? recognition.stop() : recognition.start();
    buttonStartRecord.get(0).innerText = listening ? 'Aperte para falar' : 'Parar';
    buttonStartRecord.get(0).classList.toggle('bg-purple-200');
    buttonStartRecord.get(0).classList.toggle('text-red-500');
});
  
function createRecognition(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition !== undefined ? new SpeechRecognition() : null;

    if(!recognition){
        $('.no-browser-support').show();
        $('.app').hide();
        return null
    }

    recognition.lang = "pt-BR"
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => listening = true
    recognition.onspeechend = () => listening = false
    recognition.onerror = e => console.error('Nenhuma fala foi detectada. Tente novamente.', e);
    recognition.onresult = e => {
            var current = e.resultIndex;
            var transcript = e.results[current][0].transcript;
            var mobileRepeatBug = (current == 1 && transcript == e.results[0][0].transcript);
          
            if(!mobileRepeatBug) {
                identifiedText += ' ' + transcript;
                $('#text').get(0).innerText = identifiedText;
            }
    }

    return recognition
}
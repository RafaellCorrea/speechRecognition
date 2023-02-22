//const recognition = createRecognition()
function createRecognition(returnRecognition, returnExistText){
	let listening = false;
	let identifiedText = '';
	let identifiedVar = '';
	let identifiedVarIcon = '';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition !== undefined ? new SpeechRecognition() : null;

    if(!recognition){
        console.error('Navegador não possui suporte a este recurso');
        return null
    }

    recognition.lang = "pt-BR"
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => listening = true
    recognition.onspeechend = () => listening = false
	recognition.onend = () => {
        listening ? recognition.start() : recognition.stop();
	}
    recognition.onerror = e => {
		console.error('Nenhuma fala foi detectada. Tente novamente.', e);
		listening = false;
		recognition.changeIcon();
		recognition.stop();
		if(e.error != 'not-allowed')
			setTimeout(() => {
				recognition.changeIcon();
				recognition.start();
			},100);
			
		if(e.error === 'not-allowed') alert('É necessário conceder acesso ao seu microfone para continuar.');
	}
    recognition.onresult = e => {
		var current = e.resultIndex;
		var transcript = e.results[current][0].transcript;
		
		var mobileRepeatBug = (current == 1 && transcript == e.results[0][0].transcript);
	  
		if(!e.results[current].isFinal)
			if(identifiedText.substr(identifiedText.length-5) != '.....') identifiedText += ' .....';
	  
		if(e.results[current].isFinal){
			if(identifiedText.substr(identifiedText.length-5) === '.....') identifiedText = identifiedText.replace(' .....', '');
			if(!mobileRepeatBug) identifiedText += ' ' + transcript;
		}
		
		//console.log('... -> ', identifiedText);
		
		returnRecognition(identifiedVar, identifiedText);
    }
		
    recognition.text = () => identifiedText;
	recognition.init = (idReturn, idIcon) => {
		if(!recognition) return;
		if(identifiedText.length) identifiedText += ' ';
		if(!listening) identifiedText = returnExistText(idReturn) || '';
		
		listening ? recognition.stop() : recognition.start();
		identifiedVar = idReturn;
		identifiedVarIcon = idIcon
		
		recognition.changeIcon();
	};
	recognition.changeIcon = () => {
		if(!!identifiedVarIcon){
			$('#'+identifiedVarIcon).get(0).classList.toggle('fa-microphone-slash');
			$('#'+identifiedVarIcon).get(0).classList.toggle('red');
			$('#'+identifiedVarIcon).get(0).classList.toggle('fa-microphone');
			$('#'+identifiedVarIcon).get(0).title = listening ? 'Iniciar' : 'Parar';
		}
	}

    return recognition
}
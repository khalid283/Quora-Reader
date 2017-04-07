function saveChanges() {
    var voice_va = document.getElementById("voice").value;
    var rate_va = document.getElementById("rate").value;
    var pitch_va = document.getElementById("pitch").value;
    all_item = [voice_va, rate_va, pitch_va];
    chrome.storage.sync.set({'all_val': all_item}, function() {
      document.getElementById('statusMsg').innerHTML = '<center><h3>Saved</h3></center>';
    });
}

function onchangeSave(){
  document.getElementById('statusMsg').innerHTML = "";
}

function valueAll(){
  var voice_va = document.getElementById("voice").value;
  alert(voice_va);
}

function InitVoices() {
  var msg = new SpeechSynthesisUtterance();
	var voiceSelect = document.getElementById('voice');
	var voices = window.speechSynthesis.getVoices();
	voices.forEach(function (voice, i) {
    var option = document.createElement("option");
    option.text = voice.name;
    option.value = voice.name;
    voiceSelect.appendChild(option);
    document.getElementById('voice').removeEventListener('mouseover', InitVoices);
    document.getElementById('header').removeEventListener('mouseover', InitVoices);
	});

}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('check_sub').addEventListener('click', saveChanges);
    document.getElementById('pitch').addEventListener('change', onchangeSave);
    document.getElementById('voice').addEventListener('change', onchangeSave);
    document.getElementById('rate').addEventListener('change', onchangeSave);
    document.getElementById('voice').addEventListener('mouseover', InitVoices);
    document.getElementById('header').addEventListener('mouseover', InitVoices);
});

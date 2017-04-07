var current_play = [];
var voice_va;
var playControl = {};
function insertObj(play_id, ans_id){
  playControl[ans_id] = play_id;
}

function startPlay(speak_content, k, play_id){
  chrome.storage.sync.get('all_val', function (result){
    var voice_sv = result.all_val[0];
    var rate_sv = result.all_val[1];
    var pitch_sv = result.all_val[2];
    if(voice_sv == undefined || rate_sv == undefined || pitch_sv == undefined ){
       voice_sv = "native";
       rate_sv = 1;
       pitch_sv = 1;
    }
    var msg = new SpeechSynthesisUtterance();
    msg.voice = window.speechSynthesis.getVoices().filter(function(voice) {
      return voice.name == voice_sv;
     })[0];
    msg.rate = rate_sv; // 0.1 to 10
    msg.pitch = pitch_sv; //0 to 2
    msg.text = speak_content;
    msg.onend = function(event) {
      insertObj(k, play_id)
    };
    speechSynthesis.speak(msg);
  });
}

function pausePlay(){
  window.speechSynthesis.pause();
	return false;
}
function resumePlay(){
  window.speechSynthesis.resume();
	return false;
}

function insertCSS(){
  var css = ".button { overflow: hidden; margin: 10px; padding: 6px 12px; cursor: pointer;  user-select: none;  transition: all 60ms ease-in-out;  text-align: center;  white-space: nowrap;  text-decoration: none !important;  text-transform: none;  text-transform: capitalize;  color: #fff;  border: 0 none;  border-radius: 4px;  font-size: 14px;  font-weight: 500;    line-height: 1.3;  -webkit-appearance: none;  -moz-appearance: none;  appearance:     none;  justify-content: center;  align-items: center;flex: 0 0 160px;}",
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
}

var wr_res = [];
var load_res = [];

function addButton(wrap_id, id, pgtype) {
  if(pgtype == "anspage"){
    var getbtDOM = document.getElementById(wrap_id).childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1];
    var newChildPlay = '<div><span><button id="'+ wrap_id + 'p_' + id +'" class="button" ><a class="" target="_blank">Click to Play</a></button></span><span><button id="'+ wrap_id + 'c_' + id +'" class="button" ><a class="" target="_blank">Click to Stop</a></button><span></div>';
    getbtDOM.insertAdjacentHTML('afterbegin', newChildPlay);
    var el_start = document.getElementById(wrap_id + 'p_' + id);
    el_start.addEventListener("click", function(){getText(wrap_id, pgtype)}, false);
    var el_cancel = document.getElementById(wrap_id + 'c_' + id);
    el_cancel.addEventListener("click", function(){cancelPlay();}, false);
  }else{
    //console.log(wrap_id);
    var getbtDOM = document.getElementById(wrap_id).childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1];
    var newChildPlay = '<div><span><button id="'+ wrap_id + 'p_' + id +'" class="button" ><a class="" target="_blank">Click to Play</a></button></span><span><button id="'+ wrap_id + 'c_' + id +'" class="button" ><a class="" target="_blank">Click to Stop</a></button><span></div>';
    getbtDOM.insertAdjacentHTML('afterbegin', newChildPlay);
    var el_start = document.getElementById(wrap_id + 'p_' + id);
    el_start.addEventListener("click", function(){getText(id, pgtype)}, false);
    var el_cancel = document.getElementById(wrap_id + 'c_' + id);
    el_cancel.addEventListener("click", function(){cancelPlay();}, false);
  }

}

var page_check = document.getElementById("__w2_modal_container_").nextElementSibling.className;
if(page_check == ""){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      var list = document.getElementById('__w2_modal_container_');
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
        var count_new_node = mutation.addedNodes.length;
        var kha = 0;
          if (mutation.type === 'childList') {
          var modal_con_len = document.getElementById('__w2_modal_container_').childNodes.length;
            for(var i = 0; i < modal_con_len; i++){
              var id_list = "#__w2_modal_wrapper_" + i;
              if(load_res.indexOf(id_list) == -1){
                var modal_node_pre = document.getElementById(id_list);
                if(modal_node_pre != null){
                var pgtype = "home";
                 var modal_load_node = modal_node_pre.childNodes.length;
                 if(modal_load_node == 1){
                   var pre_inode = document.getElementById(id_list).childNodes[0].childNodes.length;
                   if(pre_inode == 2){
                     addButton(id_list, i, pgtype);
                     load_res.push(id_list);
                   }
                 }
                }
              }
            }
          }
        });
      });

    observer.observe(list, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
}else {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var list = document.getElementById("__w2_modal_container_").nextElementSibling.childNodes[3].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[5].childNodes[0];
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
          var count_new_node = mutation.addedNodes.length;
            if (mutation.type === 'childList') {
            var modal_con_len = list.childNodes.length-1;
              for(var i = 0; i < modal_con_len; i++){
                var id_list = list.childNodes[i].id;
                var pgtype = "anspage";
                  if(load_res.indexOf(id_list) == -1){
                      load_res.push(id_list);
                      addButton(id_list, i, pgtype);
                  }
              }
            }
          });
        });

      observer.observe(list, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });


}

function PlayByKey(id){
  if(id == ""){
    id = 0;
    var pgtype = "homepage";
    getText(id, pgtype);
  }else {
      var pgtype = "homepage";
      getText(id, pgtype);

  }
}

function CheckValidNode(id){
  var check_next_node = document.getElementById("#__w2_modal_overlay_" + id).childNodes[0].childNodes.length;
  if(check_next_node == 1){
    return true;
  }else {
    return false;
  }
}

function getValidIDFor(id){
    var node_valid_var = CheckValidNode(id);
    if(node_valid_var == true){
      ScrollByPX(390);
      return id;
    }else {
      ScrollByPX(490);
      return parseInt(id) + 1;
    }
}

function getValidIDBack(id){
    var node_valid_var = CheckValidNode(id);
    if(node_valid_var == true){
      return id;
    }else {
      return parseInt(id) - 1;
    }
}

function InsOpPlay(hlp_text_content){
  chrome.storage.sync.get('all_val', function (result){
    var voice_sv = result.all_val[0];
    var rate_sv = result.all_val[1];
    var pitch_sv = result.all_val[2];
    if(voice_sv == undefined || rate_sv == undefined || pitch_sv == undefined ){
       voice_sv = "native";
       rate_sv = 1;
       pitch_sv = 1;
    }
    var msg = new SpeechSynthesisUtterance();
    msg.voice = window.speechSynthesis.getVoices().filter(function(voice) {
      return voice.name == voice_sv;
     })[0];
    msg.rate = rate_sv; // 0.1 to 10
    msg.pitch = pitch_sv; //0 to 2
    msg.text = hlp_text_content;
    speechSynthesis.speak(msg);
  });
}

function helpIns(){
  var hlp_text = "Press N for play Next Answer";
  return hlp_text;
}

function ScrollByPX (px_length) {
  window.scrollBy (0, px_length);
}

document.onkeydown = function (e) {
  var keyCode = e.keyCode;
  switch (keyCode) {
    case 78:
      cancelPlay();
      var get_id_next = current_play;
      if(get_id_next == "" || get_id_next == 0){
        var add_id_next = 0;
      }else {
        var add_id_next = parseInt(get_id_next) - 1;
      }
      var get_valid_node_id = getValidIDBack(add_id_next);
      PlayByKey(get_valid_node_id);
    break;
    case 80:
      cancelPlay();
    break;
    case 82:
        var get_id_next = current_play;
        PlayByKey(get_id_next);
    break;
    case 77:
      cancelPlay();
      var get_id_next = current_play;
      if(get_id_next == ""){
        get_id_next = 0;
      }
      var add_id_next = parseInt(get_id_next) + 1;
      var get_valid_node_id_for = getValidIDFor(add_id_next);
      PlayByKey(get_valid_node_id_for);
    break;
    case 72:
        cancelPlay();
        InsOpPlay("Press M for play Next Answer");
        InsOpPlay("Press N for play Previous Answer");
        InsOpPlay("Press P for Pause the Answer");
        InsOpPlay("Press R for Resume the Answer");
    break;
    default:
      console.log("");
  }
};



function WordCount(str) {
  return str.split(" ").length;
}

function getText(id, pgtype){
  current_play = [];
  current_play.push(id);
  if(pgtype == "anspage"){
    //console.log(id);
    var p_string = document.getElementById(id).childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[1].innerText;
    play_id = "a_" + id;
  }else{
    var p_string = document.getElementById("#__w2_modal_overlay_" + id).childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[1].childNodes[0].innerText;
      play_id = "a_" + id;
  }
      if(playControl[play_id] == undefined){
        p_st = 0;
        get_question = document.getElementById("#__w2_modal_overlay_" + id).childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].innerText;
        //get_wr_name = document.getElementById("#__w2_modal_overlay_" + id).childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerText;
        //document.getElementById("#__w2_modal_overlay_0").childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerText
        //document.getElementById("#__w2_modal_overlay_9").childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
      //  pr_nm_qs = get_question + "written by";
        InsOpPlay("Question");
        InsOpPlay(get_question);
        InsOpPlay("Answer");
      }else{
        p_st = playControl[play_id];
      }
      //chunking by comma, full stop and new line.
      var splitted = p_string.split(/\s*[.:\n]+\s*/);
      splitted.push("..Thank you for listening");
      var split_length = splitted.length;
      var speak_content;
      for(var k = p_st; k < split_length; k++){
        var pre_speak_content = splitted[k];
        var cake_length = WordCount(pre_speak_content);
        if(cake_length > 22){
          var cake = pre_speak_content.split(" ");
          var cake_length = cake.length;
          var num_guest = parseInt((cake_length/22))+1;
          for(var sp = 0; sp < num_guest; sp++){
            var slice_pos_start = sp*22;
            var slice_pos_end = (sp+1)*22;
            sliced_cake = cake.slice(slice_pos_start, slice_pos_end);
            cake_piece = sliced_cake.join(" ");
            speak_content = cake_piece;
            startPlay(speak_content, k, play_id);
          }
        }else {
          speak_content = pre_speak_content;
          startPlay(speak_content, k, play_id);
        }
      }
}

function cancelPlay(){
  window.speechSynthesis.cancel();
	return false;
}

insertCSS();
startPlay("", -1, -1);
cancelPlay();

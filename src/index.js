import Store from './store'
const store = new Store();

var context = new AudioContext()

const createFilterNode = (context, frequency, ql, gainValue) => {
  var filter = context.createBiquadFilter(); 

  filter.type = 'lowpass'; 
  filter.frequency.value = frequency; 
  filter.gain.value = gainValue; 
  filter.Q.value = ql; 

  return filter;
}

const createPannerNode = ( context, pan) => {
  var pannerNode = context.createStereoPanner();
  pannerNode.pan.value = pan;

  return pannerNode
}

const createDelayNode = ( context, time) => {
  var delayNode = context.createDelay();
  delayNode.delayTime.value = time
  return delayNode
}

const createGainNode = ( context, val) => {
  var gainNode = context.createGain();
  gainNode.gain.value = val;
  return gainNode
}

const capture = (tab) => {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, imageUrl => {
    var option = {
      type: 'songkranizer:load',
      imageUrl: imageUrl,
      shader: store.getActiveShader(),
      action: 'eq-init',
    }
    chrome.tabs.sendMessage(tab.id, option);
  });
}

const constraints = {
  audio : true,
  video : false 
}

var filt = createFilterNode(context, 333.25, 13.5,12)
var panner = createPannerNode(context, -0.43)
var delay = createDelayNode(context, 0.125)
var feedback = createGainNode(context, 0.35)

chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabCapture.capture(constraints, (stream)  => {
    var source = context.createMediaStreamSource(stream);
    source.connect(filt)
    .connect(panner) 
    .connect(delay).connect(feedback).connect(delay)
    .connect(context.destination); 
  });
  // capture(tab);
  // chrome.tabs.executeScript(tab.id, {file: 'content.js'});
});

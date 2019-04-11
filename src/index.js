import Store from './store'
import AudioStore from './audiostore';

const store = new Store();
const audio = new AudioStore()

const constraints = {
  audio : true,
  video : false 
}

const capture = (tab) => {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, imageUrl => {
    var option = {
      type: 'songkranizer:load',
      imageUrl: imageUrl,
      shader: store.getActiveShader(),
    }
    chrome.tabs.sendMessage(tab.id, option);
  });
}

const captureCurrentTab = (tab) => {
  if( tab.length > 0 ){
    var context = new AudioContext()
    var filt = audio.createFilterNode(context, 333.25, 13.5,12)
    var panner = audio.createPannerNode(context, -0.43)
    var delay = audio.createDelayNode(context, 0.125)
    var feedback = audio.createGainNode(context, 0.35)

    chrome.tabCapture.capture(constraints, (stream)  => {
      if (!stream) {
        console.error('Couldn\'t obtain stream.');
        return
      }
      var source = context.createMediaStreamSource(stream);
      source.connect(filt)
      .connect(panner) 
      .connect(delay).connect(feedback).connect(delay)
      .connect(context.destination); 
    });
  } else {
    if( context ){
      context.close()
    }
  }
}    

chrome.browserAction.onClicked.addListener(activeTab => {

  // handle visual.
  capture(activeTab);
  chrome.tabs.executeScript(activeTab.id, {file: 'content.js'});  

  // handle sound processing.
  chrome.tabs.query({audible:true, active: true},captureCurrentTab) 
});

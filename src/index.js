import Store from './store'
import AudioStore from './audiostore';

const store = new Store();
const audio = new AudioStore()
const { context,filt,panner,delay,feedback } = audio


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

const constraints = {
  audio : true,
  video : false 
}

chrome.browserAction.onClicked.addListener(activeTab => {
  chrome.tabCapture.capture(constraints, (stream)  => {
    if (!stream) {
      console.error('Couldn\'t obtain stream.', context);
      context.close()
      return
    }
    var source = context.createMediaStreamSource(stream);
    source.connect(filt)
    .connect(panner) 
    .connect(delay).connect(feedback).connect(delay)
    .connect(context.destination); 

    // stream.stop();
  });


  // chrome.tabs.query({audible:true},(tab) => {
  //     var option = {
  //       type: 'audio enabled!',
  //       tabCapture: window.chrome.tabCapture
  //     }
  //   chrome.tabs.sendMessage(tab[0].id, option);
  //   chrome.tabs.executeScript(tab[0].id,{ file: 'audiocontent.js'});
  // })
  
  capture(activeTab);
  chrome.tabs.executeScript(activeTab.id, {file: 'content.js'});
});



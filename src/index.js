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

const captureCurrentTab = () => {
  console.log('reqeusted current tab');
  chrome.tabs.query({active : true}, function(tab) {
      console.log('got current tab');

      chrome.tabCapture.capture({
          audio : true,
          video : false
      }, handleCapture);
  });
}    

chrome.browserAction.onClicked.addListener(activeTab => {

  capture(activeTab);
  chrome.tabs.executeScript(activeTab.id, {file: 'content.js'});


  chrome.tabCapture.capture(constraints, (stream)  => {
    if (!stream) {
      console.error('Couldn\'t obtain stream.', context);
      return
    }

    var source = context.createMediaStreamSource(stream);
    source.connect(filt)
    .connect(panner) 
    .connect(delay).connect(feedback).connect(delay)
    .connect(context.destination); 
  });


  // chrome.tabs.query({audible:true},(tab) => {

  //   console.log("tab", tab)
  //   if(tab.length > 0){
  //     chrome.tabCapture.getMediaStreamId({ targetTabId:tab[0].id }, (streamId) => {
  //       console.log("streamId", streamId)
  //     })
  //   }
    //     var option = {
    //       type: 'audio enabled!',
    //       tabCapture: window.chrome.tabCapture
    //     }
    //   chrome.tabs.sendMessage(tab[0].id, option);
    //   chrome.tabs.executeScript(tab[0].id,{ file: 'audiocontent.js'});
  // })
  
});

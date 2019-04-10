import AudioStore from './audiostore';

window.chrome.runtime.onMessage.addListener(msg => {

  // var audio = new AudioStore()

  // const { context,filt,panner,delay,feedback } = audio
  // const constraints = {
  //     audio : true,
  //     video : false 
  // }
  console.log("tabCapture", msg);

  // tabCapture.capture(constraints, (stream)  => {
  //   var source = context.createMediaStreamSource(stream);
  //   source.connect(filt)
  //   .connect(panner) 
  //   .connect(delay).connect(feedback).connect(delay)
  //   .connect(context.destination); 
  // });

})
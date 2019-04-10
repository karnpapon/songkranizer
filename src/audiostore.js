export default class AudioStore {

  constructor() {
    this.context = new AudioContext()
    this.filt = this.createFilterNode(this.context, 333.25, 13.5,12)
    this.panner = this.createPannerNode(this.context, -0.43)
    this.delay = this.createDelayNode(this.context, 0.125)
    this.feedback = this.createGainNode(this.context, 0.35)
  }

  createFilterNode = (context, frequency, ql, gainValue) => {
    var filter = context.createBiquadFilter(); 
    filter.type = 'lowpass'; 
    filter.frequency.value = frequency; 
    filter.gain.value = gainValue; 
    filter.Q.value = ql; 
    return filter;
  }
    
  createPannerNode = ( context, pan) => {
    var pannerNode = context.createStereoPanner();
    pannerNode.pan.value = pan;
    return pannerNode
  }
    
  createDelayNode = ( context, time) => {
    var delayNode = context.createDelay();
    delayNode.delayTime.value = time
    return delayNode
  }
    
  createGainNode = ( context, val) => {
    var gainNode = context.createGain();
    gainNode.gain.value = val;
    return gainNode
  }

}


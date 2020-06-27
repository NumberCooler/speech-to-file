importScripts('/js/workers/libmp3lame.js');

var mp3codec,
  recLength = 0,
  recBuffers = [];

self.onmessage = function(e) {
	switch (e.data.cmd) {
	case 'init':
		if (!e.data.config) {
			e.data.config = { };
		}
		mp3codec = Lame.init();
		Lame.set_mode(mp3codec, e.data.config.mode || Lame.JOINT_STEREO);
		Lame.set_num_channels(mp3codec, e.data.config.channels || 2);
		Lame.set_out_samplerate(mp3codec, e.data.config.samplerate || 44100);
		Lame.set_bitrate(mp3codec, e.data.config.bitrate || 128);
		Lame.init_params(mp3codec);
		break;
	case 'encode':
		var mp3data = Lame.encode_buffer_ieee_float(mp3codec, e.data.L, e.data.R);
		//self.postMessage({cmd: 'data', buf: mp3data.data});
		record(mp3data.data);
		break;
	case 'finish':
		var mp3data = Lame.encode_flush(mp3codec);
		// self.postMessage({cmd: 'end', buf: mp3data.data});
		record(mp3data.data);
		Lame.close(mp3codec);
		mp3codec = null;
		
		var data = exportMP3();
		self.postMessage({cmd: 'end', buf: data});
		
		break;
	}
};

function record(inputBuffer){
  recBuffers.push(inputBuffer);
  recLength += inputBuffer.length;
}

function exportMP3(){

  var type = 'audio/mpeg';
  
  //get raw-data length:
  var totalBufferSize = recLength;
  //reset current buffers size 
  recLength = 0;
  //get & reset current buffer content
  var buffers = recBuffers.splice(0, recBuffers.length);
  
  //convert buffers into one single buffer
  var samples = mergeBuffers( buffers, totalBufferSize);
  
  var audioBlob = new Blob([samples], { type: type });
  return audioBlob;
}

function mergeBuffers(samples, totalSampleCount){
  var len = totalSampleCount, i=0, size = samples.length, tempData, offset=0, tempSize, j=0;
  
  var buffer = new ArrayBuffer(len);
  var view = new DataView(buffer);

  for(i=0; i < size; ++i){
	tempData = samples[i];
	for(j=0, tempSize = tempData.length; j < tempSize; ++j){
		view.setUint8(offset + j, tempData[j]);
	}
	offset += tempSize;
  }
  
  return view;
}
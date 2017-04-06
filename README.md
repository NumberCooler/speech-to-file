README for speech-to-file
===========================

speech-to-file is a demo application for [libmp3lame.js][0], 
based on the [speech-to-server][1] demo.

This demo records audio input from the microphone and encodes it _client-based_ to MP3 data.

In difference to [speech-to-server][1], this demo does not require a server for storing the
encoded data, that is, the audio is not sent to a server, but instead stored locally into a
blob/buffer. 

When the recording is stopped, a download link for the encoded MP3 is triggered.


The idea for replacing the dependency of a server with a 'local' buffer
is basically from the [AudioRecorder][2] demo (slightly modified, so
that it also works in Firefox).


Tested with:
 * Firefox (ver. 26)
 * Chrome (ver. 31)
 
 NOTE: Chrome needs to be allowed to load local files, e.g. 
       start with command line switch ```--allow-file-access-from-files```

Demo
----
Try out at the [demo page][3].

Setup:
 * your device needs a microphone
 * accept, when asked to allow your browser access to the microphone

Usage:
 * press `Start recording` will start recording (you may need to allow your browser access to your mircophone in this step)
 * pressing `Stop recording` will open a dialog for downloading the recorded MP3 file
 * note: recording & encoding to MP3 is done all on the client-side (i.e. within your browser); no data is sent to a server. 

**NOTE:**
If you access the demo page via `https`, most browser will make the permission for accessing your microphone from this page will be persistent; if accessed via `http` the permission only lasts until you leave the page.

License
-------

See file LICENSE for further information.


[0]: https://github.com/akrennmair/libmp3lame-js
[1]: https://github.com/akrennmair/speech-to-server
[2]: https://webaudiodemos.appspot.com/AudioRecorder/index.html
[3]: https://mmig.github.io/speech-to-file/

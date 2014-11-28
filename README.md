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

[0]: https://github.com/akrennmair/libmp3lame-js
[1]: https://github.com/akrennmair/speech-to-server
[2]: http://webaudiodemos.appspot.com/AudioRecorder/index.html

License
-------

See file LICENSE for further information.

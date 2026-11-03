#!/bin/bash
# Clean a raw phone voice recording: denoise, gentle gate + compression, trim, -16 LUFS.
# usage: scripts/clean-voice.sh in.wav out.wav   (needs ffmpeg + python3)
pre="highpass=f=80,lowpass=f=12000,afftdn=nr=20:nf=-42:tn=1,agate=threshold=-44dB:ratio=3:range=-14dB:attack=1:release=200:knee=6,acompressor=threshold=-22dB:ratio=2.5:attack=10:release=150:makeup=2,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.3,areverse"
m=$(ffmpeg -hide_banner -i "$1" -af "$pre,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
ii=$(echo "$m"|python3 -c "import json,sys;d=json.load(sys.stdin);print(':'.join(f'{k}={d[v]}' for k,v in [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')]))")
ffmpeg -loglevel error -y -i "$1" -af "$pre,loudnorm=I=-16:TP=-1.5:LRA=11:$ii:linear=true" -ar 48000 "$2"

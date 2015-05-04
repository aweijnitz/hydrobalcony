#!/bin/bash

cd /home/aw/www/hydro.weekendhack.it
BASE=/home/aw/www/hydro.weekendhack.it


#VBITRATE=1822500
VBITRATE=8000000

ls $BASE/public_html/hydropics/*.jpg > $BASE/tmp/stills.txt
mencoder -nosound -ovc lavc -lavcopts vcodec=mpeg4:aspect=16/9:vbitrate=$VBITRATE -vf scale=1296:972 -o $BASE/tmp/timelapse.avi -mf type=jpeg:fps=15 mf://@$BASE/tmp/stills.txt

# Template 
# ffmpeg [input options] -i [input filename] -codec:v [video options] -codec:a [audio options] [output file options] [output filename]
ffmpeg -y -i $BASE/tmp/timelapse.avi -profile: high -preset slow -b:v 1000k -maxrate 1000k -bufsize 1000k -vf scale=-1:720 -threads 0 $BASE/public_html/timelapse.mp4

rm $BASE/tmp/stills.txt
rm $BASE/tmp/timelapse.avi


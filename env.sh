# Run as ". ./env.sh"

[ -d ./p27 ] && . ./p27/bin/activate
[ -d ../p27 ] && . ../p27/bin/activate
envdir=$PWD
#export PYTHONPATH=$envdir:$envdir/front/:$envdir/back/:$PYTHONPATH
#export PATH=../../playit-back/queueit:$PATH
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

export QUEUEIT_PORT=11301

echo $PYTHONPATH
echo "Loaded"


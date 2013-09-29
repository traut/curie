find /home/curie/storage/emails/ -type f -printf '%T@ %p\n' | grep -v -E "(parsed|raw)" | sort -k 1nr | sed 's/^[^ ]* //'

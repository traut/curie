
# -> "inbox" -> "parsed" -> "indexed"

python watcher.py /home/curie/Maildir/ /home/curie/storage/ inbox

q-wrapper inbox parsed /home/curie/curie/back/parser.sh
q-wrapper parsed indexed ./indexer.py

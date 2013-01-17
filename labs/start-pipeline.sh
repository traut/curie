. ./env.sh

workersChain=( parser indexer )

queuesPrefix="goldfinch"

commandPrefix="processign/sequential.py"

#for var in "${workersChain[@]}"
#do
#    echo "${var}"
#    # do something on $var
#done

for index in ${!workersChain[*]}
do
    nextIndex=$((index + 1)) 
    echo q-wrapper $queuesPrefix-$index $queuesPrefix-$nextIndex "\"$commandPrefix ${workersChain[$index]}\""
done

#q-wrapper views null /var/www/users/playit/playit/front/jobs/views_logger.py &

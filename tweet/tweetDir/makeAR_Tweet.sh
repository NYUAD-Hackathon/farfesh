while ((1)); do

echo wakeup $(date)

f1=$(date +"%Y-%m-%d".ar.tweets)
f2=$(date  --date="1 days ago" +"%Y-%m-%d".ar.tweets)

cat $f1 $f2 | tr '\n' ' ' | sed 's:NEW_LINE:\n:g' | sed -e  's:^ ::' -e 's:^RT @[^:]*\: ::' -e 's:^RT @[^:]* ::' -e 's:http.*::' | sort | uniq -c  \
| sort -r -n | awk '{$1="";print $0}' | sed 's:^ ::'  > ar.tweets.$$
perl cleanTXT.pl ar.tweets.$$ ar.tweets.$$.$$
cat ar.tweets.$$.$$ | sed -e s':^ ::'  -e 's:\s+: :' | grep -v ^$ > ar.tweets

rm -fr ar.tweets.$$ ar.tweets.$$.$$

sleep 10
done


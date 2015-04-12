while ((1)); do

echo wakeup $(date)

f1=$(date +"%Y-%m-%d".en.tweets)
f2=$(date  --date="1 days ago" +"%Y-%m-%d".en.tweets)

cat $f1 $f2 | cut -d ":" -f7- | sed -e 's:"source".*::' -e 's:^\"::' -e 's:\",::' -e 's:^RT @[^:]*\: ::' -e 's:http.*::' | sort | uniq -c  \
| sort -r -n | awk '{$1="";print $0}' | sed 's:^ ::' | head -200 |  ./sentistrength.perl English > en.tweets.$$.$$.$$
mv en.tweets.$$.$$.$$ en.tweets
rm -fr en.tweets.$$ en.tweets.$$.$$


sleep 60
done


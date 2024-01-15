jq -cr 'keys[] as $k | "\($k)\n\(.[$k])"' all.json | while read -r key; do
  fname=$(jq --raw-output ".[$key].slug" all.json)
  read -r item
  printf '%s\n' "$item" > "./$fname.json"
done
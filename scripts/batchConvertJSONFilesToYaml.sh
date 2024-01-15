for file in *; do 
    if [ -f "$file" ]; then 
        yq -p json -o yaml $file > $file.md
    fi 
done
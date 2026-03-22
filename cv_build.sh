BASE_DIR="/Users/cervas/Library/CloudStorage/GoogleDrive-jcervas@andrew.cmu.edu/My Drive/GitHub/jcervas.github.io"

cd "$BASE_DIR" || exit 1

DATE=$(date +%Y-%m-%d)

pandoc "cv.md" \
  --reference-doc="$BASE_DIR/reference.docx" \
  -o "cv.docx" || exit 1

osascript <<EOF
tell application "Microsoft Word"
    open POSIX file "$BASE_DIR/cv.docx"
    save as active document file name POSIX file "$BASE_DIR/cv.pdf" file format format PDF
    close active document saving no
end tell
EOF

rm "cv.docx"

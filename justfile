default:
    @just --list

# Build the website
build:
  rm -fr dist && npm run build && cd dist && zip -r ../therapy.zip .

# Run dev website server
dev:
  npm run dev

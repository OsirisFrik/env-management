#!bin/sh
function data {
cat .env
}

data | jq -nR '
def parse: capture("(?<x>[^:]*):? (?<y>[^= ?]*)= ?(?<value>.*)");

reduce inputs as $line ({};
   ($line | parse) as $p
   | .[$p.x] = ($p.value) )
' | jq '.NODE_ENV = "production"' | jq 'del(.DEBUG)'
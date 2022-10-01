!/usr/bin/env bash

rm "./results/results.json"
touch "./results/results.json"

#Routine Benchmark
echo "Running Routine..."
CURRENT_PID
node "./codebase/routine.js" &
CURRENT_PID=$!
node "./scripts/RoutineBenchmark.js"
kill $CURRENT_PID


#Express Benchmark
echo "Running Express..."
node "./codebase/express.js" &
CURRENT_PID=$!
node "./scripts/ExpressBenchmark.js"
kill $CURRENT_PID


#Restify Benchmark
echo "Running Restify..."
node "./codebase/restify.js" &
CURRENT_PID=$!
node "./scripts/RestifyBenchmark.js"
kill $CURRENT_PID

#Hapi Benchmark
echo "Running Hapi..."
node "./codebase/hapi.js" &
CURRENT_PID=$!
node "./scripts/HapiBenchmark.js"
kill $CURRENT_PID


open http://0.0.0.0:1234/
python3 -m http.server --directory results 1234 &
sleep 2
kill $!
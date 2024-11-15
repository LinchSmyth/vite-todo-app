#!/bin/bash

# Start two processes, for dev and tests
npx vite dev &
npx vite dev --mode=test &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?

#!/bin/bash
BASE="$(cd `dirname "$0"` && pwd)"

main () {
    local cmd="$1"
    case $cmd in
        'setup')
            shift
            setup "$@"
            ;;
        'run')
            shift
            run "$@"
            ;;
        'clean')
            shift
            clean "$@"
            ;;
        * )
            echo "
Exiting without running any operations.
Possible operations include:

  setup - Install dependencies.
    Usage: ./manage.sh build

  run - Run the dev server.
    Usage: ./manage.sh run <hostname> <port>

  clean - Remove everything generated by this script.
    Usage: ./manage.sh clean
            "
            ;;
    esac
}

setup () {
    if ! [ -d "$BASE/node_modules" ]; then
        cd "$BASE/"
        mkdir "$BASE/node_modules"
        npm install "http-server@0.5.5"
    fi
}

run () {
    hostname="$1"
    port="$2"

    if [ -z $hostname ]; then
        hostname='127.0.0.1'
    fi

    if [ -z $port ]; then
        port='8080'
    fi

    "$BASE/node_modules/.bin/http-server" "$BASE/public" -a $hostname -p $port
}

clean () {
    rm -rf "$BASE/node_modules/"
    echo "node_modules/ removed"
}

main "$@"

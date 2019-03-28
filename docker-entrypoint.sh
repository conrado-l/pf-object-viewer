#!/bin/sh

if [ "$ENVIRONMENT" == "serve" ]
then
echo "------------------------------- Starting development server-------------------------------"
    yarn run serve
elif [ "$ENVIRONMENT" == "test" ]
then
echo "------------------------------- Starting unit tests-------------------------------"
    yarn run test:unit
fi

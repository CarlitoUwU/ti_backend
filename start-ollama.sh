#!/bin/sh
ollama serve &
sleep 3
ollama pull deepseek-r1:8b
fg

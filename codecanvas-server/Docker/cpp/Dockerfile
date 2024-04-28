# FROM gcc:latest
# WORKDIR /judge/

# CMD if [ -f "./code.c" ]; then \
#     gcc -o ./code ./code.c && \
#     ./code; \
#     else \
#     g++ -o ./code ./code.cpp && \
#     ./code; \
#     fi



# FROM gcc:latest
# WORKDIR /judge/
# RUN touch output.txt

# CMD if [ -f "./code.c" ]; then \
#     gcc -o ./code ./code.c && \
#     ./code < input.txt > output.txt; \
#     else \
#     g++ -o ./code ./code.cpp && \
#     ./code < input.txt > output.txt; \
#     fi




FROM gcc:latest
WORKDIR /judge/
RUN touch output.txt
RUN touch error.txt

CMD if [ -f "./code.c" ]; then \
    gcc -o ./code ./code.c 2> error.txt && \
    ./code < input.txt > output.txt; \
    else \
    g++ -o ./code ./code.cpp 2> error.txt && \
    ./code < input.txt > output.txt; \
    fi


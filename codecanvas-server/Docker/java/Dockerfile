# FROM openjdk:latest

# WORKDIR /judge/



# CMD ["sh", "-c", "javac *.java && java $(basename *.java .java)"]




# FROM openjdk:latest

# WORKDIR /judge/
# RUN touch output.txt

# CMD ["sh", "-c", "javac *.java && java $(basename *.java .java) < input.txt > output.txt"]




FROM openjdk:latest

WORKDIR /judge/
RUN touch output.txt
RUN touch error.txt

CMD ["sh", "-c", "javac *.java 2> error.txt && java code.java < input.txt > output.txt"]
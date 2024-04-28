# FROM node:latest
# WORKDIR /judge/

# CMD [ "node","code.js" ]




# FROM node:latest
# WORKDIR /judge/
# RUN touch output.txt

# CMD [ "node", "code.js", "<", "input.txt", ">", "output.txt" ]



FROM node:latest
WORKDIR /judge/
RUN touch output.txt
RUN touch error.txt

CMD [ "sh", "-c", "node code.js < input.txt > output.txt 2> error.txt" ]


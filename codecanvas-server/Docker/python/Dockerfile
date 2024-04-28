# FROM python:latest

# WORKDIR /judge/

# CMD [ "python", "code.py" ]


# FROM python:latest

# WORKDIR /judge/
# RUN touch output.txt

# CMD [ "python", "code.py", "<", "input.txt", ">", "output.txt" ]



# handling error
FROM python:latest

WORKDIR /judge/
RUN touch output.txt
RUN touch error.txt

CMD [ "sh", "-c", "python code.py < input.txt > output.txt 2> error.txt" ]


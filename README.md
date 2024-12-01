**Steps to run the project:**

1. Copy code from "model_on_colab.py" file into respective cells on Google Colab. Add 2 keys to "Secrets": "GOOGLE_API_KEY" and "NGROK_AUTH", after generating them.

Access your secret keys in Python via:

from google.colab import userdata
userdata.get('secretName')

![image](https://github.com/user-attachments/assets/6a1dd0cb-f6f5-473a-91e2-8863ad3b59eb)


Run each cell individually to install dependencies and run the code.

On receiving "Public URL: NgrokTunnel:" from the last cell, add that URL to to ".env" file as the value for the key "REACT_APP_API_URL".

2. Run the project using the command "npm install" and "npm start".

3. Upload a document to review

![image](https://github.com/user-attachments/assets/e6c1a771-4d9e-4218-a67a-af2a886a87a3)


4. Ask questions to get answers. The model can be fine tuned to increase creativity and modulate other aspects.

![image](https://github.com/user-attachments/assets/7dda006e-fd47-4e0d-b4d3-265857abbd19)

![image](https://github.com/user-attachments/assets/8f97e4e7-cb35-42d6-ae50-03ed8e2e791e)

![image](https://github.com/user-attachments/assets/e84dc952-bdd0-4ab4-94a8-a43bfaa9ffb1)

TEST ON POSTMAN:

![image](https://github.com/user-attachments/assets/87031705-67f5-4516-a77d-17b78c2dc305)

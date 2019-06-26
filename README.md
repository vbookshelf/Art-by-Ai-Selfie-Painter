## Art-by-Ai-Selfie-Painter

Live Web App: http://art.test.woza.work/


<br>

<img src="http://paint.test.woza.work/assets/selfiepainter.png" width="700"></img>

<br>




This is a prototype for an online tool that can take as input a portrait photo of a person and output an art image. In order to build this app I first had to create a dataset of 10,200 art images using a neural style transfer algorithm. The data was then used to train a U-Net cnn.

The image on the left is the style image that was used in the neural style transfer algorithm.

The process used to build and train the model is described in this Kaggle kernel:<br>
https://www.kaggle.com/vbookshelf/art-by-ai-selfie-painter-web-app

These are the two datasets that were used to train the model:

- Art by Ai - Neural Style Transfer<br>
https://www.kaggle.com/vbookshelf/art-by-ai-neural-style-transfer

- AISegment.com - Matting Human Datasets<br>
https://www.kaggle.com/laurentmih/aisegmentcom-matting-human-datasets


All javascript, html and css files used to create the web app are available in this repo.

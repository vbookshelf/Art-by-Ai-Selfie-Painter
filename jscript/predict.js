/* Notes:

In order to get a prediction image that has the same high resolution as the
input image the following is important:

1. The code (file reader) reads the input image from the img tag. Do not resize the 
input image in any way using the img tag i.e. don't set height or width. 
Let the image be loaded in its full actual size. This big image can be hidden.

2. Add the predicted mask as a 4th channel to the original big image not
to any image that has been resized. The 
predicted mask (alpha image) will need to be resized to the full size of the original big
image before it gets added as a 4th channel.
After adding this predicted mask as a 4th channel, the resulting 4 channel 
image can then be resized before displaying on the page.

*/




// =================
// Define Functions
// =================


// == Simulate a click on a hidden button. == //
function simulateClick(tabID) {
	
	document.getElementById(tabID).click();
}



// == Starts predicting immediately when an image is submitted. == //
function predictOnLoad() {
	
	// Simulate a click on the predict button
	setTimeout(simulateClick.bind(null,'predict-button'), 500);
};



// == Detects when a new image has been submitted. == //
$("#image-selector").change(function () {
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		
		// display the user submitted image on the page by changing the src attribute.
		$("#selected-image").attr("src", dataURL);
		$("#content-image").attr("src", dataURL);
		
		// Hide the style image
		//$("#style-image").attr("class", 'hide');
		
		
		// empty the prediction list.
		$("#prediction-list").empty();
	}
	
		
		let file = $("#image-selector").prop('files')[0];
		reader.readAsDataURL(file);
		
		
		// Simulate a click on the predict button
		// This introduces a 0.5 second delay before the click.
		// Without this long delay the model loads but may not automatically
		// predict.
		setTimeout(simulateClick.bind(null,'predict-button'), 500);

});



// == Loads the model and makes a prediction on the default image. == //
let model;
(async function () {
	
	model = await tf.loadModel('http://paint.test.woza.work/model_107/model.json');
	
	
	
	$("#selected-image").attr("src", "http://paint.test.woza.work/assets/girl_resized.jpg")
	
	console.log('model_107');
	
	
	// Hide the model loading spinner
	$('.progress-bar').hide();
	
	// Simulate a click on the predict button
	predictOnLoad();
	
	
})();





// == Responds to a click on the hidden predict button == //
$("#predict-button").click(async function () {
	
	
	
	let image = $('#selected-image').get(0);
	
	// ========================================================== //
	// Pre-process the image using Tensorflow.js api. This is not standard Tensorflow.
	// This is tensorflow.js code designed to be used with javascript.
	// https://js.tensorflow.org/api/0.6.1/#slice
	// ========================================================== //
	
	// This is how we print info on tensors to the console:
	// verbose can be left out e.g. tensor.print()
	const verbose = true;
	//tensor.print(verbose);
	
	
	// **Note that the image is taking the shape imposed by the img tag.
	//console.log('Orig Image shape: ', orig_image.shape); // [426,640,3]
	
	
	// The filereader has read the image. Now convert it to a tensor.
	
	// Pre-process the image
	let tensor = tf.fromPixels(image)
	.resizeNearestNeighbor([400,400]) // change the image size here
	//.toFloat()
	//.div(tf.scalar(255.0))
	.expandDims();
	
	
	console.log('Input Image shape: ', tensor.shape);
	
		
		
	// Pass the tensor to the model and call predict on it.
	// Predict returns a tensor.
	// data() loads the values of the output tensor and returns
	// a promise of a typed array when the computation is complete.
	// Notice the await and async keywords are used together.
	
	// ========================================================== //
	// Note that after predict is completed we are working with
	// a Typed Array and not a tensor.
	// ========================================================== //
		
	// make a prediction
	// model.predict returns a 'Typed Array'. This is not a tensor or js array.
	let predictions = await model.predict(tensor).data();
		
		
		
	// convert typed array to a javascript array
	var preds = Array.from(predictions); // JS Code with 1D js array [......]
		
	
	// clip the predictions so that all values are between 0 and 255
	
	
	
	/*
	var i;
	var num;
	for (i = 0; i < preds.length; i++) { 
		
		num = preds[i];
		
		if (num > 255) {
			preds[i] = 255;
			
		}
	
		if (num < 0) {
			preds[i] = 0;
			
		}	
		
	} */
		
		
	// convert 1D js array to a tensor
	pred_tensor = tf.tensor1d(preds, 'int32');
	
	// clip the values
	pred_tensor = tf.clipByValue(pred_tensor, 0, 255);
	
	
	// reshape the pred tensor
	rgb_tensor = pred_tensor.reshape([400,400,3]);
	
	
	
	// resize. This determines the size of the image that gets displayed.
	rgb_tensor = rgb_tensor.resizeNearestNeighbor([320, 240]);
	//rgb_tensor = rgb_tensor.resizeNearestNeighbor([20, 20]);
	
	
	rgb_tensor.print(verbose);
	
	
	// Convert the tensor to an image 
	
	
	// Method 1: Canvas - Display pred image using tf.toPixels
	//=====================================================
	var canvas2 = document.getElementById("myCanvas2");
	
	// toPixels: When input is int32 values are assumed to be in the range 0-255
	// toPixels: When input is float32 values are assumed to be in the range 0-1
	tf.toPixels(rgb_tensor, canvas2);
	
	
	
	// Method 2: Canvas - Display pred image using custom code shared on Github
	// https://github.com/tensorflow/tfjs/issues/865
	// This needs a 4 channel image to work.
	//======================================================
	/*
	var canvas = document.getElementById("myCanvas");
	const bytes = await rgba_tensor.data();
	const pixelData = new Uint8ClampedArray(bytes);
	if (canvas !== null){
	    const imageData = new ImageData(pixelData, 250, 250);
	    const ctx = canvas.getContext('2d');
	    ctx.putImageData(imageData, 0, 0);
	}
   */


});










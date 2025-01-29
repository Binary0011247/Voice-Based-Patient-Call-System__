import os
import tensorflow as tf
from transformers import BertTokenizer, TFAutoModelForSequenceClassification
from deep_translator import GoogleTranslator
from Urgency_classifier.keyword_identifier import keywordindentifier


class Text_classifier:

    def __init__(self):
        """Configure the execution environment."""
        # Try using CPU first for stability
        os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
        
        # Set XLA flags for CUDA if needed later
        cuda_path = "/usr/local/cuda"  # Adjust this path to your CUDA installation
        os.environ["XLA_FLAGS"] = f"--xla_gpu_cuda_data_dir={cuda_path}"
        
        # Suppress TensorFlow logging
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

    def load_model_and_tokenizer(self, model_path, use_gpu=False):  # Added self parameter
        """Load the BERT model and tokenizer."""
        if use_gpu:
            # Clear previous device settings
            os.environ.pop("CUDA_VISIBLE_DEVICES", None)
            
            # Check GPU availability and fall back to CPU if not available
            if not tf.config.list_physical_devices('GPU'):
                os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
        
        # Load tokenizer and model
        tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
        
        # Create a strategy scope
        if use_gpu and tf.config.list_physical_devices('GPU'):
            strategy = tf.distribute.OneDeviceStrategy(device="/GPU:0")
        else:
            strategy = tf.distribute.OneDeviceStrategy(device="/CPU:0")
        
        with strategy.scope():
            model = TFAutoModelForSequenceClassification.from_pretrained(model_path)
            
        return tokenizer, model

    def classifier(self, text):
        tokenizer, model = self.load_model_and_tokenizer("model", use_gpu=False)  # Changed to call with self
        """Predict severity level for given text."""
        print(text)
        translated_text = GoogleTranslator(des="en").translate(text)
        print(translated_text)  # Output: "My name is Rahul."
        # Ensure text is in list format
        if isinstance(translated_text, str):
            text = [translated_text]
            
        print(text)
        # Tokenize the input text
        inputs = tokenizer(
            text,
            padding="max_length",
            truncation=True,
            max_length=128,
            return_tensors="tf"
        )
        print("inputs completed")
        # Perform predictions
        predictions = model.predict(inputs)

        print("prediction completed")
        
        # Extract logits and convert to probabilities
        logits = predictions.logits
        probabilities = tf.nn.softmax(logits, axis=-1)
        print("logit completed")
        # Get predicted classes
        predicted_classes = tf.argmax(probabilities, axis=-1)
        print("predicted class")
        # Map classes to labels
        label_map = {0: 'Low', 1: 'Medium', 2: 'High'}
        predicted_labels = [label_map[class_id.numpy()] for class_id in predicted_classes]
        
        # # Get confidence scores
        # confidence_scores = tf.reduce_max(probabilities, axis=-1).numpy()
        # print("get confidence")

        word=keywordindentifier.indentifier(translated_text)

        return (predicted_labels, word)

# Usage
UrgencyClassifier = Text_classifier()
# result = UrgencyClassifier.predict_severity("I have fever")

# print(result)
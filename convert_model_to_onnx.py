#!/usr/bin/env python3
"""
Script to convert your trained RandomForest model to ONNX format
Run this script to convert drug_response_model_1.pkl to drug_response_model_1.onnx
"""

import pickle
import numpy as np
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import onnx

def convert_model_to_onnx():
    print("Loading the pickle model...")
    
    # Load your trained model
    with open('drug_response_model_1.pkl', 'rb') as f:
        model = pickle.load(f)
    
    print(f"Model type: {type(model)}")
    print(f"Model classes: {getattr(model, 'classes_', 'N/A')}")
    
    # Define the input shape (adjust based on your features)
    # Assuming 6 features as defined in the edge function: 
    # [gender, age, variant, disease, drug, dosage]
    initial_type = [('input', FloatTensorType([None, 6]))]
    
    print("Converting to ONNX...")
    
    # Convert the model
    onnx_model = convert_sklearn(
        model,
        initial_types=initial_type,
        target_opset=12  # Use a stable opset version
    )
    
    # Save the ONNX model
    output_path = 'drug_response_model_1.onnx'
    with open(output_path, 'wb') as f:
        f.write(onnx_model.SerializeToString())
    
    print(f"Model successfully converted to: {output_path}")
    
    # Verify the model
    onnx_model_check = onnx.load(output_path)
    onnx.checker.check_model(onnx_model_check)
    print("ONNX model validation passed!")
    
    # Test with sample data
    print("\nTesting with sample data...")
    sample_input = np.array([[1.0, 0.5, 0.3, 0.7, 0.2, 0.8]], dtype=np.float32)
    
    # Test original model
    original_pred = model.predict(sample_input)
    if hasattr(model, 'predict_proba'):
        original_proba = model.predict_proba(sample_input)
        print(f"Original model - Prediction: {original_pred[0]}, Probability: {original_proba[0]}")
    else:
        print(f"Original model - Prediction: {original_pred[0]}")
    
    print("\nTo use the ONNX model:")
    print("1. Upload 'drug_response_model_1.onnx' to your Supabase storage")
    print("2. The edge function will automatically use the ONNX model")

if __name__ == "__main__":
    try:
        convert_model_to_onnx()
    except ImportError as e:
        print("Missing required packages. Install them with:")
        print("pip install scikit-learn onnx skl2onnx")
        print(f"Error: {e}")
    except Exception as e:
        print(f"Error converting model: {e}")
        print("Make sure 'drug_response_model_1.pkl' is in the same directory")
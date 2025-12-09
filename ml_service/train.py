import os
import numpy as np
import pandas as pd
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ReduceLROnPlateau, EarlyStopping
from sklearn.utils import class_weight
import kagglehub

# Configuration
IMG_SIZE = 48
BATCH_SIZE = 64
EPOCHS = 50
DATASET_PATH = "dataset"

def download_data():
    print("Checking for dataset...")
    # If dataset folder exists locally and has content, use it. 
    # Otherwise download.
    # For now, we assume the user might have pasted it or we download it.
    # If the user pasted it, we expect it at 'dataset' or we download to a cache and copy/link.
    
    # Using kagglehub to ensure we have the path
    try:
        path = kagglehub.dataset_download("msambare/fer2013")
        print("Path to dataset files:", path)
        return path
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        return None

def build_improved_model(num_classes):
    model = Sequential()

    # Block 1
    model.add(Conv2D(64, kernel_size=(3, 3), activation='relu', padding='same', input_shape=(IMG_SIZE, IMG_SIZE, 1)))
    model.add(BatchNormalization())
    model.add(Conv2D(64, kernel_size=(3, 3), activation='relu', padding='same'))
    model.add(BatchNormalization())
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.2))

    # Block 2
    model.add(Conv2D(128, kernel_size=(3, 3), activation='relu', padding='same'))
    model.add(BatchNormalization())
    model.add(Conv2D(128, kernel_size=(3, 3), activation='relu', padding='same'))
    model.add(BatchNormalization())
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.2))

    # Block 3
    model.add(Conv2D(256, kernel_size=(3, 3), activation='relu', padding='same'))
    model.add(BatchNormalization())
    model.add(Conv2D(256, kernel_size=(3, 3), activation='relu', padding='same'))
    model.add(BatchNormalization())
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.2))

    # Block 4
    model.add(Conv2D(512, kernel_size=(3, 3), activation='relu', padding='same'))
    model.add(BatchNormalization())
    model.add(Conv2D(512, kernel_size=(3, 3), activation='relu', padding='same'))
    model.add(BatchNormalization())
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.2))

    # Flattening
    model.add(Flatten())

    # Fully Connected Layers
    model.add(Dense(512, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dropout(0.5))

    model.add(Dense(256, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dropout(0.5))

    model.add(Dense(num_classes, activation='softmax'))

    optimizer = Adam(learning_rate=0.001)
    model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])
    
    return model

def plot_history(history):
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    loss = history.history['loss']
    val_loss = history.history['val_loss']
    epochs_range = range(len(acc))

    plt.figure(figsize=(12, 6))
    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label='Training Accuracy')
    plt.plot(epochs_range, val_acc, label='Validation Accuracy')
    plt.legend(loc='lower right')
    plt.title('Training and Validation Accuracy')

    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label='Training Loss')
    plt.plot(epochs_range, val_loss, label='Validation Loss')
    plt.legend(loc='upper right')
    plt.title('Training and Validation Loss')
    plt.savefig('training_history.png')
    print("Training history saved as 'training_history.png'")

def train():
    # 1. Get Data Path
    data_path = download_data()
    if not data_path:
        print("Could not locate dataset. Please ensure it is downloaded.")
        return

    train_dir = os.path.join(data_path, 'train')
    test_dir = os.path.join(data_path, 'test')
    
    if not os.path.exists(train_dir):
        print(f"Error: Could not find 'train' directory in {data_path}")
        return

    # 2. Data Generators with Enhanced Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,      # Increased
        zoom_range=0.2,         # Increased
        width_shift_range=0.2,  # Increased
        height_shift_range=0.2, # Increased
        shear_range=0.2,        # Added
        horizontal_flip=True,
        fill_mode='nearest'
    )

    test_datagen = ImageDataGenerator(rescale=1./255)

    print("Loading data...")
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        color_mode="grayscale",
        class_mode='categorical',
        shuffle=True
    )

    validation_generator = test_datagen.flow_from_directory(
        test_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        color_mode="grayscale",
        class_mode='categorical',
        shuffle=False
    )

    # 3. Calculate Class Weights (to handle imbalance)
    class_weights = class_weight.compute_class_weight(
        class_weight='balanced',
        classes=np.unique(train_generator.classes),
        y=train_generator.classes
    )
    class_weights_dict = dict(enumerate(class_weights))
    print("Class Weights:", class_weights_dict)

    # 4. Callbacks
    checkpoint = tf.keras.callbacks.ModelCheckpoint(
        'emotion_model_best.keras', 
        monitor='val_accuracy', 
        verbose=1, 
        save_best_only=True, 
        mode='max'
    )
    
    early_stopping = EarlyStopping(
        monitor='val_accuracy',
        patience=10,
        restore_best_weights=True,
        verbose=1
    )
    
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=5,
        min_lr=1e-6,
        verbose=1
    )

    callbacks_list = [checkpoint, early_stopping, reduce_lr]

    # 5. Build and Train Model
    model = build_improved_model(num_classes=7)
    model.summary()
    
    print("Starting training with improved configuration...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.n // BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=validation_generator,
        validation_steps=validation_generator.n // BATCH_SIZE,
        class_weight=class_weights_dict,
        callbacks=callbacks_list
    )

    # 6. Save Final Model
    model.save('emotion_model.h5')
    print("Final model saved as 'emotion_model.h5'")
    
    # 7. Plot History
    plot_history(history)

if __name__ == "__main__":
    train()

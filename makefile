# Directory containing the folders to zip
SRC_DIR := ./src/lambdaFunctions
# Directory to store the zip files
OUT_DIR := ./lambdaZips

# Find all subdirectories in SRC_DIR
FOLDERS := $(shell find $(SRC_DIR) -mindepth 1 -maxdepth 1 -type d)

# Generate zip filenames corresponding to folders
ZIP_FILES := $(addsuffix .zip, $(addprefix $(OUT_DIR)/,$(notdir $(FOLDERS))))

# Default target
lambda: $(ZIP_FILES) run-command

# Create the OUT_DIR if it doesn't exist
$(OUT_DIR):
	mkdir -p $@

# Rule to zip the contents of each folder
$(OUT_DIR)/%.zip: $(SRC_DIR)/%
	mkdir -p $(OUT_DIR)
	cd $< && zip -r $(abspath $@) ./*

# Run the command on each zip file
# This updates the lambda function code, and then outputs the result to /dev/null
# This is done to avoid printing the result of the command
run-command: $(ZIP_FILES)
	$(foreach zip, $(ZIP_FILES), aws lambda update-function-code --function-name $(basename $(notdir $(zip))) --zip-file fileb://$(zip) > /dev/null;)

# Clean up generated zips
clean:
	rm -rf $(OUT_DIR)

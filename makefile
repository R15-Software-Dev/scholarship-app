# Directory containing the folders to zip
SRC_DIR := ./src/lambdaFunctions
# Directory to store the zip files
OUT_DIR := ./lambdaZips
# Command to execute on each zip file (replace 'echo' with your desired command)
ZIP_COMMAND := echo

# Find all subdirectories in SRC_DIR
FOLDERS := $(shell find $(SRC_DIR) -mindepth 1 -maxdepth 1 -type d)

# Generate zip filenames corresponding to folders
ZIP_FILES := $(addprefix $(OUT_DIR)/,$(notdir $(FOLDERS)).zip)

# Default target
all: $(ZIP_FILES) run-command

# Create the OUT_DIR if it doesn't exist
$(OUT_DIR):
	mkdir -p $@

# Rule to zip the contents of each folder
$(OUT_DIR)/%.zip: $(SRC_DIR)/%
	cd $< && zip -r $(abspath $@) ./*

# Run the command on each zip file
run-command: $(ZIP_FILES)
	@for zip in $^; do \
		$(ZIP_COMMAND) $$zip; \
	done

# Clean up generated zips
clean:
	rm -rf $(OUT_DIR)

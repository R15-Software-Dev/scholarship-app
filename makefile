# Directory containing the folders to zip
SRC_DIR := ./src/lambdaFunctions
# Directory to store the zip files
OUT_DIR := ./lambdaZips
# Placeholder role ARN for lambda functions
PLACEHOLDER_ROLE := arn:aws:iam::582555552507:role/LambdaPlaceholderRole

# Find all subdirectories in SRC_DIR
FOLDERS := $(shell find $(SRC_DIR) -mindepth 1 -maxdepth 1 -type d)

# Generate zip filenames corresponding to folders
ZIP_FILES := $(addsuffix .zip, $(addprefix $(OUT_DIR)/,$(notdir $(FOLDERS))))

define check_lambdas
  $(eval function_name = $(1))
  $(eval zip_file = $(2))
  $(info Checking if lambda function $(function_name) exists)
  $(eval exists = $(shell aws lambda get-function --function-name $(1)))
  $(if $(exists), \
  	$(shell aws lambda update-function-code --function-name $(function_name) --zip-file fileb://$(zip_file) > /dev/null), \
    $(shell aws lambda create-function --function-name $(function_name) --runtime nodejs22.x --handler index.handler --role $(PLACEHOLDER_ROLE) --zip-file fileb://$(zip_file) > /dev/null))
endef

# Default target
lambda: $(ZIP_FILES) push-lambdas

# Create the OUT_DIR if it doesn't exist
# $(OUT_DIR):
# 	mkdir -p $@

# Rule to zip the contents of each folder and check if lambda function
# already exists in AWS
$(OUT_DIR)/%.zip: $(SRC_DIR)/%
	@mkdir -p $(OUT_DIR)
	@cd $< && zip -r $(abspath $@) ./*

# Run the command on each zip file
# This updates the lambda function code, and then outputs the result to /dev/null
# This is done to avoid printing the result of the command
push-lambdas: $(ZIP_FILES)
	# $(foreach zip, $(ZIP_FILES), aws lambda update-function-code --function-name $(basename $(notdir $(zip))) --zip-file fileb://$(zip) > /dev/null;)
	# $(call check_lambdas,$(notdir $(basename $<)),$<)
	$(foreach zip, $(ZIP_FILES), $(call check_lambdas,$(notdir $(basename $(zip))),$(zip)))

# Clean up generated zips
clean:
	rm -rf $(OUT_DIR)

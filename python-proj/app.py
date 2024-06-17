import sys
import os

def append_to_file(strings):
    with open('/app/data/output.txt', 'a') as file:
        for string in strings:
            file.write(f"{string}\n")

def read_from_file():
    if not os.path.exists('/app/data/output.txt'):
        return []
    with open('/app/data/output.txt', 'r') as file:
        lines = file.readlines()
        return [line.strip() for line in lines]

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Please provide three string inputs.")
        sys.exit(1)

    append_to_file(sys.argv[1:4])
    print("Strings appended to file successfully.")

    # Read from file and print the contents as a comma-separated array
    all_strings = read_from_file()
    print("Current file contents: " + ", ".join(all_strings))

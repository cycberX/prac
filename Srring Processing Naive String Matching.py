def naive_string_match(text, pattern):
    n = len(text)
    m = len(pattern)
    indices = []
    for i in range(n - m + 1):
        match = True
        for j in range(m):
            if text[i + j] != pattern[j]:
                match = False
                break
        if match:
            indices.append(i)
    return indices


if __name__ == "__main__":
    text = str(input("Enter the text: "))
    pattern = str(input("Enter the pattern: "))
    result = naive_string_match(text, pattern)
    print("Pattern found", result)
